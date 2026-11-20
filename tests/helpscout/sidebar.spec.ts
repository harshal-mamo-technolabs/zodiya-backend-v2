import { createHmac } from "crypto"
import { jest } from "@jest/globals"
import request from "supertest"
import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { BillingGrantModel } from "../../src/models/BillingGrant.ts"
import { UserModel } from "../../src/models/User.ts"
import { BillingService } from "../../src/services/BillingService.ts"
import { helpScout } from "../../src/services/HelpScoutService.ts"
import { CANCEL_REASONS } from "../../src/views/helpscoutSidebar.ts"
import { registerAndGetCookie, resetDB, userData } from "../utils/index.ts"

const key = "sidebar-test-secret"
const conversationMock = jest.fn<typeof helpScout.conversation>()
function url(
    params: Record<string, string> = {
        "conversation-id": "123",
        "user-id": "456",
    },
) {
    const signature = createHmac("sha1", key)
        .update(JSON.stringify(params))
        .digest("base64")
    return `/helpscout/sidebar?${new URLSearchParams({ ...params, "X-HelpScout-Signature": signature }).toString()}`
}
function token(html: string) {
    const value = /name="token" value="([^"]+)"/.exec(html)?.[1]
    if (!value) throw new Error("Missing sidebar token")
    return value
}

describe("Help Scout agent sidebar", () => {
    let mongod: MongoMemoryServer
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })
    beforeEach(async () => {
        await resetDB()
        jest.replaceProperty(config, "HELPSCOUT_SIDEBAR_SECRET", key)
        jest.replaceProperty(config, "HELPSCOUT_INBOX_ID", "350186")
        await registerAndGetCookie(app)
        conversationMock.mockReset()
        jest.spyOn(helpScout, "conversation").mockImplementation(
            conversationMock,
        )
        conversationMock.mockResolvedValue({
            id: 123,
            mailboxId: 350186,
            primaryCustomer: { email: userData.email },
        })
    })
    afterEach(() => jest.restoreAllMocks())
    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    async function liveToken() {
        const response = await request(app).get(
            url({ "user-id": "456", "installation-ids": "app-test" }),
        )
        expect(response.status).toBe(200)
        expect(response.text).toContain("Loading the customer from Help Scout")
        expect(response.text).toContain("/helpscout/sidebar/client.js")
        const value = /data-token="([^"]+)"/.exec(response.text)?.[1]
        if (!value) throw new Error("Missing context token")
        return value
    }

    it("loads a live chat customer without requiring a conversation ID", async () => {
        const authorize = jest
            .spyOn(helpScout, "authorizeAgent")
            .mockResolvedValue()
        const emails = jest
            .spyOn(helpScout, "customerEmails")
            .mockResolvedValue([userData.email])
        const response = await request(app)
            .post("/helpscout/sidebar/context")
            .send({
                token: await liveToken(),
                customerId: "789",
                mailboxId: "350186",
                email: "untrusted@example.com",
                agentId: "attacker",
            })
        expect(response.status).toBe(200)
        expect(response.text).toContain(userData.email)
        expect(authorize).toHaveBeenCalledWith("456")
        expect(emails).toHaveBeenCalledWith("789")
        expect(conversationMock).not.toHaveBeenCalled()
    })

    it("requires a valid agent bootstrap token to resolve live context", async () => {
        const emails = jest.spyOn(helpScout, "customerEmails")
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/context")
                    .send({ customerId: "789", token: "forged" })
            ).status,
        ).toBe(401)
        const ordinary = await request(app).get(url())
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/context")
                    .send({ customerId: "789", token: token(ordinary.text) })
            ).status,
        ).toBe(401)
        expect(emails).not.toHaveBeenCalled()
    })

    it("rejects live context from another inbox", async () => {
        const authorize = jest.spyOn(helpScout, "authorizeAgent")
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/context")
                    .send({
                        token: await liveToken(),
                        customerId: "789",
                        mailboxId: "365852",
                    })
            ).status,
        ).toBe(403)
        expect(authorize).not.toHaveBeenCalled()
    })

    it("checks the signed agent's actual inbox permission before reading live customer data", async () => {
        jest.spyOn(helpScout, "authorizeAgent").mockRejectedValue(
            createHttpError(403, "No inbox access"),
        )
        const emails = jest.spyOn(helpScout, "customerEmails")
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/context")
                    .send({ token: await liveToken(), customerId: "789" })
            ).status,
        ).toBe(403)
        expect(emails).not.toHaveBeenCalled()
    })

    it("rechecks the live customer before cancelling a subscription", async () => {
        jest.spyOn(helpScout, "authorizeAgent").mockResolvedValue()
        const emails = jest
            .spyOn(helpScout, "customerEmails")
            .mockResolvedValue([userData.email])
        const response = await request(app)
            .post("/helpscout/sidebar/context")
            .send({ token: await liveToken(), customerId: "789" })
        emails.mockResolvedValue(["different@example.com"])
        const cancel = jest.spyOn(
            BillingService.prototype,
            "setProfilesCancelAtPeriodEnd",
        )
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .type("form")
                    .send({
                        token: token(response.text),
                        kind: "profiles",
                        confirmed: "yes",
                    })
            ).status,
        ).toBe(404)
        expect(cancel).not.toHaveBeenCalled()
    })

    it("refreshes a live-chat session with its customer binding intact", async () => {
        jest.spyOn(helpScout, "authorizeAgent").mockResolvedValue()
        jest.spyOn(helpScout, "customerEmails").mockResolvedValue([
            userData.email,
        ])
        const response = await request(app)
            .post("/helpscout/sidebar/context")
            .send({ token: await liveToken(), customerId: "789" })
        const refreshed = await request(app)
            .post("/helpscout/sidebar/refresh")
            .type("form")
            .send({ token: token(response.text) })
        expect(refreshed.status).toBe(200)
        expect(refreshed.text).toContain(userData.email)
        expect(jwt.decode(token(refreshed.text))).toMatchObject({
            customerId: "789",
            conversationId: "",
            agentId: "456",
        })
    })

    it("rejects unsigned or modified callbacks before looking up customer data", async () => {
        expect(
            (await request(app).get("/helpscout/sidebar?conversation-id=123"))
                .status,
        ).toBe(401)
        expect(
            (await request(app).get(url().replace("123", "124"))).status,
        ).toBe(401)
        expect(conversationMock).not.toHaveBeenCalled()
    })
    it("rejects a customer Beacon signature as agent authorization", async () => {
        const signature = createHmac("sha256", key)
            .update(userData.email)
            .digest("hex")
        expect(
            (
                await request(app).get(
                    `/helpscout/sidebar?conversation-id=123&X-HelpScout-Signature=${signature}`,
                )
            ).status,
        ).toBe(401)
    })
    it("fails closed without sidebar configuration", async () => {
        jest.replaceProperty(config, "HELPSCOUT_SIDEBAR_SECRET", "")
        expect((await request(app).get(url())).status).toBe(503)
    })
    it("restricts access to the configured inbox", async () => {
        conversationMock.mockResolvedValue({
            id: 123,
            mailboxId: 365852,
            primaryCustomer: { email: userData.email },
        })
        expect((await request(app).get(url())).status).toBe(403)
    })
    it("shows a helpful empty state for an unmatched customer", async () => {
        conversationMock.mockResolvedValue({
            id: 123,
            mailboxId: 350186,
            primaryCustomer: { email: "unmatched@example.com" },
        })
        const response = await request(app).get(url())
        expect(response.status).toBe(404)
        expect(response.text).toContain("No AstroMeridian account")
    })
    it("shows trial, add-on, dates and the same survey choices, without exposing credentials", async () => {
        await UserModel.updateOne(
            { email: userData.email },
            {
                $set: {
                    "billing.plan.status": "trialing",
                    "billing.plan.currentPeriodEnd": new Date("2026-12-01"),
                    "billing.profiles.cancelAtPeriodEnd": true,
                },
            },
        )
        const response = await request(app).get(url())
        expect(response.status).toBe(200)
        expect(response.headers["cache-control"]).toBe("no-store")
        expect(response.headers["content-security-policy"]).toContain(
            "frame-ancestors https://secure.helpscout.net",
        )
        expect(response.text).toContain("Starter trial")
        expect(response.text).toContain("1 Dec 2026")
        expect(response.text).toContain("10 extra profiles")
        for (const reason of CANCEL_REASONS)
            expect(response.text).toContain(reason.replaceAll("'", "&#39;"))
        expect(response.text).not.toContain(key)
    })
    it("prompts to cancel the add-on before revealing the membership survey", async () => {
        const response = await request(app).get(url())
        expect(response.text).toContain("Cancel the profile add-on below first")
        expect(response.text).not.toContain('id="reason"')
    })
    it("binds cancellation to the conversation customer, ignoring a submitted user ID", async () => {
        const response = await request(app).get(url())
        const cancel = jest.spyOn(
            BillingService.prototype,
            "setProfilesCancelAtPeriodEnd",
        )
        conversationMock.mockResolvedValue({
            id: 123,
            mailboxId: 350186,
            primaryCustomer: { email: "different@example.com" },
        })
        const result = await request(app)
            .post("/helpscout/sidebar/cancel")
            .type("form")
            .send({
                token: token(response.text),
                kind: "profiles",
                confirmed: "yes",
                userId: "arbitrary",
            })
        expect(result.status).toBe(404)
        expect(cancel).not.toHaveBeenCalled()
    })
    it("rejects expired tokens and unconfirmed cancellations", async () => {
        const response = await request(app).get(url())
        const signed = token(response.text)
        const claims = jwt.decode(signed) as Record<string, unknown>
        delete claims.exp
        const expired = jwt.sign(claims, key, { expiresIn: -1 })
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .type("form")
                    .send({
                        token: expired,
                        kind: "profiles",
                        confirmed: "yes",
                    })
            ).status,
        ).toBe(401)
        const cancel = jest.spyOn(
            BillingService.prototype,
            "setProfilesCancelAtPeriodEnd",
        )
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .type("form")
                    .send({ token: signed, kind: "profiles" })
            ).status,
        ).toBe(400)
        expect(cancel).not.toHaveBeenCalled()
    })
    it("cancels only the bound profile subscription", async () => {
        const response = await request(app).get(url())
        const cancel = jest
            .spyOn(BillingService.prototype, "setProfilesCancelAtPeriodEnd")
            .mockImplementation(async function (userId) {
                await UserModel.updateOne(
                    { _id: userId },
                    { $set: { "billing.profiles.cancelAtPeriodEnd": true } },
                )
                return new BillingService(
                    UserModel,
                    ProfileModel,
                    BillingGrantModel,
                ).status(userId)
            })
        const result = await request(app)
            .post("/helpscout/sidebar/cancel")
            .type("form")
            .send({
                token: token(response.text),
                kind: "profiles",
                confirmed: "yes",
            })
        expect(result.status).toBe(200)
        expect(cancel).toHaveBeenCalledWith(
            String((await UserModel.findOne({ email: userData.email }))?._id),
            true,
        )
        expect(result.text).toContain("Profile add-on renewal cancelled")
    })
    it("rejects a stale panel after a subscription is replaced", async () => {
        const response = await request(app).get(url())
        await UserModel.updateOne(
            { email: userData.email },
            { $set: { "billing.profiles.subscriptionId": "sub_replacement" } },
        )
        const cancel = jest.spyOn(
            BillingService.prototype,
            "setProfilesCancelAtPeriodEnd",
        )
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .type("form")
                    .send({
                        token: token(response.text),
                        kind: "profiles",
                        confirmed: "yes",
                    })
            ).status,
        ).toBe(409)
        expect(cancel).not.toHaveBeenCalled()
    })
    it("submits the selected reason and retention answers through the existing billing service", async () => {
        await UserModel.updateOne(
            { email: userData.email },
            { $set: { "billing.profiles.cancelAtPeriodEnd": true } },
        )
        const response = await request(app).get(url())
        const cancel = jest
            .spyOn(BillingService.prototype, "cancelPlan")
            .mockImplementation(async (userId) => {
                await UserModel.updateOne(
                    { _id: userId },
                    { $set: { "billing.plan.cancelAtPeriodEnd": true } },
                )
                return new BillingService(
                    UserModel,
                    ProfileModel,
                    BillingGrantModel,
                ).status(userId)
            })
        const result = await request(app)
            .post("/helpscout/sidebar/cancel")
            .type("form")
            .send({
                token: token(response.text),
                kind: "plan",
                confirmed: "yes",
                reason: "Other",
                other: "  Customer is taking a break  ",
                stayIfOffered: [
                    "Lower-cost subscription",
                    "Lower-cost subscription",
                ],
            })
        expect(result.status).toBe(200)
        expect(cancel).toHaveBeenCalledWith(expect.any(String), {
            reason: "Customer is taking a break",
            stayIfOffered: ["Lower-cost subscription"],
        })
        expect(result.text).toContain("Membership renewal cancelled")
    })
    it("validates cancellation reasons server-side", async () => {
        const response = await request(app).get(url())
        const cancel = jest.spyOn(BillingService.prototype, "cancelPlan")
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .type("form")
                    .send({
                        token: token(response.text),
                        kind: "plan",
                        confirmed: "yes",
                        reason: "made up",
                    })
            ).status,
        ).toBe(400)
        expect(cancel).not.toHaveBeenCalled()
    })
})
