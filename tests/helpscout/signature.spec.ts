import { createHmac } from "crypto"
import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { registerAndGetCookie, userData } from "../utils/index.ts"

describe("GET /helpscout/signature", () => {
    let mongod: MongoMemoryServer
    let cookie: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.replaceProperty(config, "HELPSCOUT_SECURE_MODE_KEY", "hs-test-key")
        // support is for everyone signed in, paying or not
        cookie = await registerAndGetCookie(app, userData, false)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("signs the account's email the way Help Scout secure mode expects", async () => {
        const response = await request(app)
            .get("/helpscout/signature")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            signature: createHmac("sha256", "hs-test-key")
                .update(userData.email)
                .digest("hex"),
            utm_source: "default",
            utm_campaign: "default",
            utm_medium: "default",
        })
    })

    it("requires a session", async () => {
        expect(
            (await request(app).get("/helpscout/signature")).statusCode,
        ).toBe(401)
    })

    it("says so when the secure mode key is not set", async () => {
        jest.replaceProperty(config, "HELPSCOUT_SECURE_MODE_KEY", "")
        const response = await request(app)
            .get("/helpscout/signature")
            .set("Cookie", [cookie])
        expect(response.statusCode).toBe(503)
    })
})
