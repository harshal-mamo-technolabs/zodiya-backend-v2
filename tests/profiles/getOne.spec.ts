import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import type { Profile } from "../../src/models/Profile.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

describe("GET /profiles/:id", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let profileId: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)

        const response = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        profileId = (response.body as Record<string, string>).id ?? ""
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
            .get(`/profiles/${profileId}`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
    })

    it("should return the profile with the computed fields", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}`)
            .set("Cookie", [cookie])

        const profile = response.body as Profile & { _id: string }

        expect(profile._id).toBe(profileId)
        expect(profile.firstName).toBe(profileData.firstName)
        expect(profile.lat).toBe(geoData.lat)
        expect(profile.lon).toBe(geoData.lon)
        expect(profile.tzone).toBe(geoData.tzone)
        expect(profile.timezoneId).toBe(geoData.timezoneId)
        expect(profile.zodiacSign).toBe("leo")
        expect(profile.isPrimary).toBe(true)
    })

    it("should return 404 if the profile belongs to another user", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "other@gmail.com",
        })

        const response = await request(app)
            .get(`/profiles/${profileId}`)
            .set("Cookie", [otherCookie])

        expect(response.statusCode).toBe(404)
    })

    it("should return 404 if the profile does not exist", async () => {
        const response = await request(app)
            .get(`/profiles/${new mongoose.Types.ObjectId().toString()}`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(404)
    })

    it("should return 400 if the id is not a valid id", async () => {
        const response = await request(app)
            .get("/profiles/not-an-id")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("should return 401 if the access token is missing", async () => {
        const response = await request(app).get(`/profiles/${profileId}`)

        expect(response.statusCode).toBe(401)
    })
})
