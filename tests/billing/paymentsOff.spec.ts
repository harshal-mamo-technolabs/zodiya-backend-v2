import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { BillingService } from "../../src/services/BillingService.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { BillingGrantModel } from "../../src/models/BillingGrant.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    resetDB,
    userData,
} from "../utils/index.ts"

describe("PAYMENTS_ENABLED=false", () => {
    let mongod: MongoMemoryServer
    let cookie: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        jest.replaceProperty(config, "PAYMENTS_ENABLED", false)
        // no plan at all: everything must still work
        cookie = await registerAndGetCookie(app, userData, false)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("opens the app and any number of profiles without a plan", async () => {
        for (const firstName of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
            const response = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({ ...profileData, firstName })
            expect(response.statusCode).toBe(201)
        }
        const tarot = await request(app)
            .post("/tarot/draw")
            .set("Cookie", [cookie])
            .send({ spread: "single" })
        expect(tarot.statusCode).not.toBe(402)
    })

    it("tells the app payments are off and the account is entitled", async () => {
        const status = await request(app)
            .get("/billing/status")
            .set("Cookie", [cookie])
        expect(status.body).toMatchObject({
            paymentsEnabled: false,
            entitled: true,
        })
        const catalog = await request(app).get("/billing/catalog")
        expect(catalog.body).toMatchObject({ paymentsEnabled: false })
    })

    it("refuses anything that would take money", async () => {
        const calls = [
            request(app)
                .post("/billing/subscribe")
                .set("Cookie", [cookie])
                .send({ plan: "starter" }),
            request(app)
                .post("/billing/profiles")
                .set("Cookie", [cookie])
                .send({ pack: "profiles_1" }),
            request(app)
                .post("/billing/minutes")
                .set("Cookie", [cookie])
                .send({ pack: "pack_10" }),
            request(app)
                .post("/billing/palm")
                .set("Cookie", [cookie])
                .send({ pack: "palm_3" }),
            request(app).post("/billing/card").set("Cookie", [cookie]),
        ]
        for (const response of await Promise.all(calls)) {
            expect(response.statusCode).toBe(403)
            expect(
                (response.body as { errors: { code?: string }[] }).errors[0]
                    ?.code,
            ).toBe("payments_disabled")
        }
    })

    it("does not draw down astrologer minutes", async () => {
        const user = await UserModel.findOne({ email: userData.email })
        const billing = new BillingService(
            UserModel,
            ProfileModel,
            BillingGrantModel,
        )
        await billing.debit(String(user?._id), 600)
        const after = await UserModel.findOne({ email: userData.email })
        expect(after?.billing?.minutes?.used ?? 0).toBe(0)
    })
})
