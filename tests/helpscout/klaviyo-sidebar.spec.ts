import { createHmac } from "crypto"
import { jest } from "@jest/globals"
import request from "supertest"
import createHttpError from "http-errors"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { helpScout } from "../../src/services/HelpScoutService.ts"
import { klaviyo } from "../../src/services/KlaviyoService.ts"
import { renderKlaviyoSidebar } from "../../src/views/klaviyoSidebar.ts"

const lookup = jest.fn<typeof klaviyo.profileByEmail>()
const authorize = jest.fn<typeof helpScout.authorizeAgent>()
const emails = jest.fn<typeof helpScout.customerEmails>()
const conversation = jest.fn<typeof helpScout.conversation>()
const key = "profile-test-signing-key"
const profile = {
    id: "test-profile",
    attributes: {
        email: "customer@example.com",
        first_name: "Sample",
        properties: {
            "astromeridian:current_general_plan": "Premium",
            "astromeridian:palm_readings_total_left": 0,
            "astromeridian:is_trial_active": false,
        },
    },
}
function url(params: Record<string, string> = { "user-id": "456" }) {
    const signature = createHmac("sha1", key)
        .update(JSON.stringify(params))
        .digest("base64")
    return `/helpscout/sidebar/klaviyo?${new URLSearchParams({ ...params, "X-HelpScout-Signature": signature }).toString()}`
}
async function bootstrap() {
    const page = await request(app).get(url())
    expect(page.status).toBe(200)
    const token = /data-token="([^"]+)"/.exec(page.text)?.[1]
    if (!token) throw new Error("Missing context token")
    return token
}

describe("AstroMeridian Klaviyo sidebar", () => {
    beforeEach(() => {
        conversation.mockReset()
        jest.spyOn(helpScout, "conversation").mockImplementation(conversation)
        emails.mockReset()
        jest.spyOn(helpScout, "customerEmails").mockImplementation(emails)
        authorize.mockReset()
        jest.spyOn(helpScout, "authorizeAgent").mockImplementation(authorize)
        lookup.mockReset()
        jest.spyOn(klaviyo, "profileByEmail").mockImplementation(lookup)
        jest.replaceProperty(
            config,
            "HELPSCOUT_SIDEBAR_SECRET",
            "billing-test-key",
        )
        jest.replaceProperty(config, "HELPSCOUT_PROFILE_SIDEBAR_SECRET", key)
        jest.replaceProperty(config, "HELPSCOUT_INBOX_ID", "350186")
        authorize.mockResolvedValue()
        emails.mockResolvedValue(["customer@example.com"])
        conversation.mockResolvedValue({
            id: 123,
            mailboxId: 350186,
            primaryCustomer: { email: "customer@example.com" },
        })
        lookup.mockResolvedValue(profile)
    })
    afterEach(() => jest.restoreAllMocks())

    it("rejects unsigned, tampered, and duplicate callbacks without reading customer data", async () => {
        expect(
            (await request(app).get("/helpscout/sidebar/klaviyo")).status,
        ).toBe(401)
        expect(
            (await request(app).get(url() + "&customer-id=789")).status,
        ).toBe(401)
        expect((await request(app).get(url() + "&user-id=999")).status).toBe(
            401,
        )
        expect(lookup).not.toHaveBeenCalled()
    })
    it("boots the profile view without exposing signing or API credentials", async () => {
        const page = await request(app).get(url())
        expect(page.status).toBe(200)
        expect(page.text).toContain(
            'data-endpoint="/helpscout/sidebar/klaviyo/context"',
        )
        expect(page.text).not.toContain(key)
        expect(page.text).not.toContain("billing-test-key")
        expect(page.headers["cache-control"]).toBe("no-store")
        expect(page.headers["content-security-policy"]).toContain(
            "frame-ancestors https://secure.helpscout.net",
        )
    })
    it("uses verified customer emails and agent identity, even for customers without local accounts", async () => {
        const page = await request(app)
            .post("/helpscout/sidebar/klaviyo/context")
            .send({
                token: await bootstrap(),
                customerId: "789",
                mailboxId: "350186",
                email: "attacker@example.com",
                agentId: "999",
            })
        expect(page.status).toBe(200)
        expect(authorize).toHaveBeenCalledWith("456")
        expect(emails).toHaveBeenCalledWith("789")
        expect(lookup).toHaveBeenCalledWith("customer@example.com")
        expect(page.text).toContain("Premium")
        expect(page.text).toContain("Refresh profile")
    })
    it("does not grant cancellation access through a read-only profile token", async () => {
        const token = await bootstrap()
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/context")
                    .send({ token, customerId: "789" })
            ).status,
        ).toBe(401)
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/cancel")
                    .send({ token, kind: "plan", confirmed: "yes" })
            ).status,
        ).toBe(401)
        expect(lookup).not.toHaveBeenCalled()
    })
    it("rejects wrong inboxes, unauthorized agents, and forged context tokens before Klaviyo lookup", async () => {
        const token = await bootstrap()
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/klaviyo/context")
                    .send({ token, customerId: "789", mailboxId: "365852" })
            ).status,
        ).toBe(403)
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/klaviyo/context")
                    .send({ token: "forged", customerId: "789" })
            ).status,
        ).toBe(401)
        jest.spyOn(helpScout, "authorizeAgent").mockRejectedValue(
            createHttpError(403, "No access"),
        )
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/klaviyo/context")
                    .send({ token, customerId: "789" })
            ).status,
        ).toBe(403)
        expect(lookup).not.toHaveBeenCalled()
    })
    it("checks the conversation's actual inbox and primary customer", async () => {
        const token = await bootstrap()
        const result = await request(app)
            .post("/helpscout/sidebar/klaviyo/context")
            .send({ token, conversationId: "123", email: "forged@example.com" })
        expect(result.status).toBe(200)
        expect(lookup).toHaveBeenCalledWith("customer@example.com")
        lookup.mockClear()
        conversation.mockResolvedValue({
            id: 123,
            mailboxId: 365852,
            primaryCustomer: { email: "other@example.com" },
        })
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/klaviyo/context")
                    .send({ token, conversationId: "123" })
            ).status,
        ).toBe(403)
        expect(lookup).not.toHaveBeenCalled()
    })
    it("refuses ambiguous contacts instead of choosing an account", async () => {
        emails.mockResolvedValue(["one@example.com", "two@example.com"])
        expect(
            (
                await request(app)
                    .post("/helpscout/sidebar/klaviyo/context")
                    .send({ token: await bootstrap(), customerId: "789" })
            ).status,
        ).toBe(409)
        expect(lookup).not.toHaveBeenCalled()
    })
    it("rechecks customer identity on refresh and handles missing profiles", async () => {
        const token = await bootstrap()
        emails.mockResolvedValue(["changed@example.com"])
        lookup.mockResolvedValue(null)
        const page = await request(app)
            .post("/helpscout/sidebar/klaviyo/context")
            .send({ token, customerId: "789" })
        expect(page.status).toBe(200)
        expect(lookup).toHaveBeenCalledWith("changed@example.com")
        expect(page.text).toContain("No Klaviyo profile found")
        expect(page.text).not.toContain("customer@example.com")
    })
    it("escapes arbitrary properties while retaining false, zero, dates, and full URLs", () => {
        const html = renderKlaviyoSidebar(
            {
                id: "test",
                attributes: {
                    email: "a@example.com",
                    first_name: "<img src=x>",
                    properties: {
                        "astromeridian:unknown<key>":
                            "<script>alert(1)</script>",
                        "astromeridian:is_trial_active": false,
                        "astromeridian:palm_readings_total_left": 0,
                        "astromeridian:resume_url":
                            'https://example.com/?token="private"',
                        "astromeridian:created_at": "2026-11-20T09:40:56Z",
                    },
                },
            },
            "a@example.com",
            { token: "test", contextId: "customer:789" },
            { conversationId: "", customerId: "789" },
        )
        expect(html).not.toContain("<img src=x>")
        expect(html).not.toContain("<script>alert(1)</script>")
        expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;")
        expect(html).toContain('class="badge">No</span>')
        expect(html).toContain("<dd>0</dd>")
        expect(html).toContain("20 Nov 2026")
        expect(html).toContain("View URL")
        expect(html).toContain("token=&quot;private&quot;")
    })
})

describe("Klaviyo profile read", () => {
    afterEach(() => jest.restoreAllMocks())
    it("uses the server key, a bounded email filter, and validates the returned email", async () => {
        jest.replaceProperty(
            config,
            "KLAVIYO_PRIVATE_API_KEY",
            "private-test-key",
        )
        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ data: [profile] }), {
                status: 200,
            }),
        )
        expect(await klaviyo.profileByEmail("customer@example.com")).toEqual(
            profile,
        )
        const [url, options] = fetchMock.mock.calls[0] ?? []
        expect(
            new URL(
                typeof url === "string"
                    ? url
                    : url instanceof URL
                      ? url.href
                      : "https://invalid.test",
            ).searchParams.get("filter"),
        ).toBe('equals(email,"customer@example.com")')
        expect(options?.headers).toMatchObject({
            Authorization: "Klaviyo-API-Key private-test-key",
        })
        fetchMock.mockResolvedValue(
            new Response(JSON.stringify({ data: [profile] }), { status: 200 }),
        )
        await expect(
            klaviyo.profileByEmail("different@example.com"),
        ).rejects.toThrow("mismatched")
    })
    it("handles missing configuration and upstream failures without leaking upstream bodies", async () => {
        jest.replaceProperty(config, "KLAVIYO_PRIVATE_API_KEY", "")
        await expect(klaviyo.profileByEmail("a@example.com")).rejects.toThrow(
            "not configured",
        )
        jest.replaceProperty(
            config,
            "KLAVIYO_PRIVATE_API_KEY",
            "private-test-key",
        )
        jest.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response("sensitive upstream diagnostics", { status: 429 }),
        )
        await expect(klaviyo.profileByEmail("a@example.com")).rejects.toThrow(
            "Klaviyo is busy",
        )
    })
})
