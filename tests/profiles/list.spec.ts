import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { Relationships } from "../../src/constants/index.ts"
import type { Profile } from "../../src/models/Profile.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

describe("GET /profiles", () => {
    let mongod: MongoMemoryServer
    let cookie: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("should return 200 status code", async () => {
        const response = await request(app)
            .get("/profiles")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
    })

    it("should return the profiles of the logged in user, primary first", async () => {
        await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({ ...profileData, firstName: "me" })
        await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({
                ...profileData,
                firstName: "child",
                relationship: Relationships.CHILD,
            })

        const response = await request(app)
            .get("/profiles")
            .set("Cookie", [cookie])

        const profiles = response.body as Profile[]

        expect(profiles).toHaveLength(2)
        expect(profiles[0]?.firstName).toBe("me")
        expect(profiles[0]?.isPrimary).toBe(true)
        expect(profiles[1]?.firstName).toBe("child")
        expect(profiles[1]?.isPrimary).toBe(false)
    })

    it("should not return profiles of other users", async () => {
        await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)

        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "other@gmail.com",
        })

        const response = await request(app)
            .get("/profiles")
            .set("Cookie", [otherCookie])

        expect(response.body).toHaveLength(0)
    })

    it("should return 401 if the access token is missing", async () => {
        const response = await request(app).get("/profiles")

        expect(response.statusCode).toBe(401)
    })

    it("GET /stats counts every chart drawn, without a session", async () => {
        const response = await request(app).get("/stats")
        expect(response.statusCode).toBe(200)
        expect(typeof (response.body as { charts: number }).charts).toBe(
            "number",
        )
    })
})
