import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { stripe } from "../../src/services/BillingService.ts"
import { KlaviyoEvents, klaviyo } from "../../src/services/KlaviyoService.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { RefreshTokenModel } from "../../src/models/RefreshToken.ts"
import type { AccountResponse } from "../../src/types/index.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    resetDB,
    userData,
} from "../utils/index.ts"

describe("account", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let own: string
    let other: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        const first = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        own = (first.body as Record<string, string>).id ?? ""
        const second = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({
                ...profileData,
                firstName: "Tomas",
                relationship: "friend",
            })
        other = (second.body as Record<string, string>).id ?? ""
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("GET /auth/me returns the account with default preferences", async () => {
        const response = await request(app)
            .get("/auth/me")
            .set("Cookie", [cookie])
        expect(response.statusCode).toBe(200)
        const body = response.body as AccountResponse
        expect(body.email).toBe(userData.email)
        expect(body.firstName).toBe(userData.firstName)
        expect(body.notifications).toEqual({
            daily: true,
            transits: true,
            retro: false,
            deliveryTime: "07:30",
        })
        expect(body.createdAt).toMatch(/^\d{4}-/)
    })

    it("PATCH /auth/me changes the name and merges preferences", async () => {
        const response = await request(app)
            .patch("/auth/me")
            .set("Cookie", [cookie])
            .send({
                firstName: "Ana",
                notifications: { retro: true, deliveryTime: "06:15" },
            })
        expect(response.statusCode).toBe(200)
        const body = response.body as AccountResponse
        expect(body.firstName).toBe("Ana")
        expect(body.lastName).toBe(userData.lastName)
        expect(body.notifications).toEqual({
            daily: true,
            transits: true,
            retro: true,
            deliveryTime: "06:15",
        })
    })

    it("PATCH /auth/me rejects a bad delivery time and an empty name", async () => {
        for (const send of [
            { notifications: { deliveryTime: "7:30" } },
            { firstName: "  " },
        ]) {
            const response = await request(app)
                .patch("/auth/me")
                .set("Cookie", [cookie])
                .send(send)
            expect(response.statusCode).toBe(400)
        }
    })

    it("never deletes a profile: there is no DELETE /profiles/:id", async () => {
        const response = await request(app)
            .delete(`/profiles/${other}`)
            .set("Cookie", [cookie])
        expect(response.statusCode).toBe(404)
        expect(await ProfileModel.countDocuments()).toBe(2)
    })

    it("PATCH /profiles/:id/disabled hides a saved person but keeps its slot", async () => {
        const off = await request(app)
            .patch(`/profiles/${other}/disabled`)
            .set("Cookie", [cookie])
            .send({ disabled: true })
        expect(off.statusCode).toBe(200)
        expect((off.body as { disabled: boolean }).disabled).toBe(true)

        const visible = await request(app)
            .get("/profiles")
            .set("Cookie", [cookie])
        expect((visible.body as unknown[]).length).toBe(1)
        const managed = await request(app)
            .get("/profiles?include=disabled")
            .set("Cookie", [cookie])
        expect((managed.body as unknown[]).length).toBe(2)
        const chart = await request(app)
            .get(`/profiles/${other}/chart`)
            .set("Cookie", [cookie])
        expect(chart.statusCode).toBe(404)
        const status = await request(app)
            .get("/billing/status")
            .set("Cookie", [cookie])
        expect(
            (status.body as { profiles: { used: number } }).profiles.used,
        ).toBe(2)

        const on = await request(app)
            .patch(`/profiles/${other}/disabled`)
            .set("Cookie", [cookie])
            .send({ disabled: false })
        expect(on.statusCode).toBe(200)
        const back = await request(app)
            .get(`/profiles/${other}/chart`)
            .set("Cookie", [cookie])
        expect(back.statusCode).toBe(200)
    })

    it("PATCH /profiles/:id/disabled keeps the owner's own profile on", async () => {
        const response = await request(app)
            .patch(`/profiles/${own}/disabled`)
            .set("Cookie", [cookie])
            .send({ disabled: true })
        expect(response.statusCode).toBe(400)
    })

    it("PATCH /profiles/:id/disabled hides other people's profiles", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "other@example.com",
        })
        const response = await request(app)
            .patch(`/profiles/${other}/disabled`)
            .set("Cookie", [otherCookie])
            .send({ disabled: true })
        expect(response.statusCode).toBe(404)
    })

    describe("DELETE /auth/me", () => {
        const del = () =>
            request(app).delete("/auth/me").set("Cookie", [cookie])
        // the test account renews a plan and a profile pack; both cancelled
        const cancelAll = () =>
            UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.plan.cancelAtPeriodEnd": true,
                        "billing.plan.currentPeriodEnd": new Date(
                            1_900_000_000_000,
                        ),
                        "billing.profiles.cancelAtPeriodEnd": true,
                    },
                },
            )

        it("refuses while a plan or profile pack still renews", async () => {
            const response = await del()
            expect(response.statusCode).toBe(409)
            expect(response.body).toMatchObject({
                errors: [{ code: "subscriptions_active" }],
            })

            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.plan.cancelAtPeriodEnd": true } },
            )
            expect((await del()).statusCode).toBe(409)
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.deletedAt).toBeNull()
        })

        it("closes the account but keeps everything in it", async () => {
            await cancelAll()
            const track = jest.spyOn(klaviyo, "track")
            const customers = jest.spyOn(stripe.customers, "del")

            const response = await del()
            expect(response.statusCode).toBe(204)
            const cleared = (
                response.headers as unknown as { "set-cookie": string[] }
            )["set-cookie"].join(" ")
            expect(cleared).toMatch(/accessToken=;/)

            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.deletedAt).toBeInstanceOf(Date)
            expect(await ProfileModel.countDocuments()).toBe(2)
            expect(await RefreshTokenModel.countDocuments()).toBe(0)
            // nothing in Stripe is touched; the plans were cancelled already
            expect(customers).not.toHaveBeenCalled()
            const [, email, props, , eventProps] =
                track.mock.calls.find(
                    (c) => c[0] === KlaviyoEvents.ACCOUNT_DELETED,
                ) ?? []
            expect(email).toBe(userData.email)
            expect(props).toMatchObject({
                "astromeridian:is_user_deleted": true,
                "astromeridian:account_deleted_at":
                    user?.deletedAt?.toISOString(),
            })
            expect(eventProps).toEqual({
                "astromeridian:plan_status": "active",
                "astromeridian:plan_access_ends_at": new Date(
                    1_900_000_000_000,
                ).toISOString(),
            })

            // the access token still in hand no longer opens anything
            const after = await request(app)
                .get("/auth/me")
                .set("Cookie", [cookie])
            expect(after.statusCode).toBe(401)
            expect(after.body).toMatchObject({
                errors: [{ code: "account_deleted" }],
            })
            expect((await del()).statusCode).toBe(401)
        })

        it("opens the account again on the next login", async () => {
            await cancelAll()
            await del()
            const track = jest.spyOn(klaviyo, "track")

            const login = await request(app)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password })
            expect(login.statusCode).toBe(200)
            const body = login.body as {
                restored?: boolean
                deletedAt?: string
            }
            expect(body.restored).toBe(true)
            expect(typeof body.deletedAt).toBe("string")
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.deletedAt).toBeNull()
            const restored = track.mock.calls.find(
                (c) => c[0] === KlaviyoEvents.ACCOUNT_RESTORED,
            )
            expect(restored?.[2]).toMatchObject({
                "astromeridian:is_user_deleted": false,
                "astromeridian:account_deleted_at": null,
            })

            const fresh = (
                login.headers as unknown as { "set-cookie": string[] }
            )["set-cookie"]
                .find((c) => c.startsWith("accessToken="))
                ?.split(";")[0]
            const me = await request(app)
                .get("/auth/me")
                .set("Cookie", [fresh ?? ""])
            expect(me.statusCode).toBe(200)

            // only the login that reopens it says so
            const again = await request(app)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password })
            expect(again.body).not.toHaveProperty("restored")
        })
    })

    it("requires a session", async () => {
        expect((await request(app).get("/auth/me")).statusCode).toBe(401)
        expect(
            (
                await request(app)
                    .patch(`/profiles/${other}/disabled`)
                    .send({ disabled: true })
            ).statusCode,
        ).toBe(401)
    })
})
