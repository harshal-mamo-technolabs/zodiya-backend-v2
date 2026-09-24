import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { UserModel } from "../../src/models/User.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { Relationships, ZodiacSigns } from "../../src/constants/index.ts"
import { geoData, profileData, registerAndGetCookie } from "../utils/index.ts"

describe("POST /profiles", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let lookup: jest.SpiedFunction<GeoService["lookup"]>

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        lookup = jest
            .spyOn(GeoService.prototype, "lookup")
            .mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            const response = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            expect(response.statusCode).toBe(201)
        })

        it("should return the id of the created profile", async () => {
            const response = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect((response.body as Record<string, string>).id).toBe(
                profiles[0]?._id.toString(),
            )
        })

        it("should store the profile against the logged in user", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const users = await UserModel.find()
            const profiles = await ProfileModel.find()

            expect(profiles).toHaveLength(1)
            expect(profiles[0]?.user.toString()).toBe(users[0]?._id.toString())
            expect(profiles[0]?.firstName).toBe(profileData.firstName)
            expect(profiles[0]?.birthDate).toBe(profileData.birthDate)
            expect(profiles[0]?.birthTime).toBe(profileData.birthTime)
            expect(profiles[0]?.city).toBe(profileData.city)
        })

        it("should look up lat, lon and tzone from the birth place", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect(lookup).toHaveBeenCalledWith(
                profileData.city,
                profileData.state,
                profileData.country,
                profileData.birthDate,
                profileData.birthTime,
            )
            expect(profiles[0]?.lat).toBe(geoData.lat)
            expect(profiles[0]?.lon).toBe(geoData.lon)
            expect(profiles[0]?.tzone).toBe(geoData.tzone)
            expect(profiles[0]?.timezoneId).toBe(geoData.timezoneId)
        })

        it("should calculate the zodiac sign from the birth date", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect(profiles[0]?.zodiacSign).toBe(ZodiacSigns.LEO)
        })

        it("should mark the first profile as primary and the next ones not", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({
                    ...profileData,
                    firstName: "spouse",
                    relationship: Relationships.SPOUSE,
                })

            const profiles = await ProfileModel.find().sort({ createdAt: 1 })

            expect(profiles).toHaveLength(2)
            expect(profiles[0]?.isPrimary).toBe(true)
            expect(profiles[1]?.isPrimary).toBe(false)
            expect(profiles[1]?.relationship).toBe(Relationships.SPOUSE)
        })

        it("should default the relationship to self", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect(profiles[0]?.relationship).toBe(Relationships.SELF)
        })

        it("should ignore computed fields sent by the client", async () => {
            await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({
                    ...profileData,
                    isPrimary: false,
                    lat: 0,
                    lon: 0,
                    tzone: 0,
                    zodiacSign: ZodiacSigns.ARIES,
                })

            const profiles = await ProfileModel.find()

            expect(profiles[0]?.isPrimary).toBe(true)
            expect(profiles[0]?.lat).toBe(geoData.lat)
            expect(profiles[0]?.zodiacSign).toBe(ZodiacSigns.LEO)
        })
    })

    describe("Not authenticated", () => {
        it("should return 401 if the access token is missing", async () => {
            const response = await request(app)
                .post("/profiles")
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect(response.statusCode).toBe(401)
            expect(profiles).toHaveLength(0)
        })
    })

    describe("Fields are missing or invalid", () => {
        it.each([
            ["firstName", ""],
            ["lastName", ""],
            ["birthDate", ""],
            ["birthTime", ""],
            ["city", ""],
            ["state", ""],
            ["country", ""],
            ["birthDate", "15-08-1995"],
            ["birthDate", "1995-13-40"],
            ["birthTime", "2:30 pm"],
            ["birthTime", "25:00"],
            ["relationship", "cousin"],
        ])("should return 400 if %s is %p", async (field, value) => {
            const response = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({ ...profileData, [field]: value })

            const profiles = await ProfileModel.find()

            expect(response.statusCode).toBe(400)
            expect(profiles).toHaveLength(0)
        })

        it("should return 400 if the location cannot be found", async () => {
            const { default: createHttpError } = await import("http-errors")
            lookup.mockRejectedValue(
                createHttpError(400, "Could not find the location"),
            )

            const response = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)

            const profiles = await ProfileModel.find()

            expect(response.statusCode).toBe(400)
            expect(profiles).toHaveLength(0)
        })
    })
})
