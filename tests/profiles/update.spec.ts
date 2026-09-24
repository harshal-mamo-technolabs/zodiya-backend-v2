import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import type { Profile } from "../../src/models/Profile.ts"
import { geoData, profileData, registerAndGetCookie } from "../utils/index.ts"

describe("PATCH /profiles/:id", () => {
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
            .send({ ...profileData, avatar: "avatar-03" })
        profileId = (response.body as Record<string, string>).id ?? ""
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("should store the avatar chosen on create", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}`)
            .set("Cookie", [cookie])

        expect((response.body as Profile).avatar).toBe("avatar-03")
    })

    it("should change the avatar and keep the rest", async () => {
        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({ avatar: "avatar-11" })

        const profile = response.body as Profile
        expect(response.statusCode).toBe(200)
        expect(profile.avatar).toBe("avatar-11")
        expect(profile.firstName).toBe(profileData.firstName)
    })

    it("should save a birth name without touching the avatar", async () => {
        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({ birthName: "Ana Maria Rodrigues" })

        const profile = response.body as Profile
        expect(profile.birthName).toBe("Ana Maria Rodrigues")
        expect(profile.avatar).toBe("avatar-03")
    })

    it("should re-derive the sign and place when birth data changes", async () => {
        const lisbon = {
            lat: 38.7223,
            lon: -9.1393,
            tzone: 1,
            timezoneId: "Europe/Lisbon",
        }
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(lisbon)

        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({
                birthDate: "1997-09-12",
                city: "Lisbon",
                state: "Lisbon",
                country: "Portugal",
            })

        const profile = response.body as Profile
        expect(response.statusCode).toBe(200)
        expect(profile.zodiacSign).toBe("virgo")
        expect(profile.timezoneId).toBe("Europe/Lisbon")
        expect(profile.lat).toBe(lisbon.lat)
        expect(profile.birthTime).toBe(profileData.birthTime)
        expect(profile.avatar).toBe("avatar-03")
    })

    it("should leave the place alone when only the name changes", async () => {
        const lookup = jest.spyOn(GeoService.prototype, "lookup")
        lookup.mockClear()

        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({ firstName: "Ana" })

        const profile = response.body as Profile
        expect(profile.firstName).toBe("Ana")
        expect(profile.zodiacSign).toBe("leo")
        expect(lookup).not.toHaveBeenCalled()
    })

    it("should reject a malformed birth date", async () => {
        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({ birthDate: "12/09/1997" })

        expect(response.statusCode).toBe(400)
    })

    it("should reject an avatar that is not in the set", async () => {
        const response = await request(app)
            .patch(`/profiles/${profileId}`)
            .set("Cookie", [cookie])
            .send({ avatar: "avatar-99" })

        expect(response.statusCode).toBe(400)
    })

    it("should reject an unknown avatar on create", async () => {
        const response = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({ ...profileData, avatar: "me.png" })

        expect(response.statusCode).toBe(400)
    })
})
