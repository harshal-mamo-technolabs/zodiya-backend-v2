import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { RefreshTokenModel } from "../../src/models/RefreshToken.ts"
import { userData } from "../utils/index.ts"

describe("POST /auth/logout", () => {
    let mongod: MongoMemoryServer
    let cookies: string[]

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        const response = await request(app)
            .post("/auth/register")
            .send(userData)
        cookies = (response.headers as unknown as { "set-cookie": string[] })[
            "set-cookie"
        ].map((c) => c.split(";")[0] ?? "")
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("should clear both cookies and revoke the refresh token", async () => {
        expect(await RefreshTokenModel.countDocuments()).toBe(1)

        const response = await request(app)
            .post("/auth/logout")
            .set("Cookie", cookies)

        const cleared = (
            response.headers as unknown as { "set-cookie": string[] }
        )["set-cookie"].join(" ")

        expect(response.statusCode).toBe(204)
        expect(cleared).toMatch(/accessToken=;/)
        expect(cleared).toMatch(/refreshToken=;/)
        expect(await RefreshTokenModel.countDocuments()).toBe(0)
    })

    it("should still succeed with no cookies at all", async () => {
        const response = await request(app).post("/auth/logout")
        expect(response.statusCode).toBe(204)
    })

    it("should leave the tokens of other sessions alone", async () => {
        await request(app)
            .post("/auth/login")
            .send({ email: userData.email, password: userData.password })
        expect(await RefreshTokenModel.countDocuments()).toBe(2)

        await request(app).post("/auth/logout").set("Cookie", cookies)

        expect(await RefreshTokenModel.countDocuments()).toBe(1)
    })
})
