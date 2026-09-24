import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import type { ChartResponse } from "../../src/types/index.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

describe("GET /profiles/:id/chart", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let profileId: string

    const createProfile = async (
        data: Record<string, unknown> = profileData,
    ) => {
        const response = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(data)
        return (response.body as Record<string, string>).id ?? ""
    }

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        profileId = await createProfile()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("should return the full chart payload", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/chart`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)

        const body = response.body as ChartResponse

        expect(body.profile.id).toBe(profileId)
        expect(body.profile.name).toBe("harshal chauhan")
        expect(body.chart.bodies).toHaveLength(11)
        expect(body.chart.houses).toHaveLength(12)
        expect(body.chart.meta.houseSystem).toBe("placidus")
        expect(body.chart.meta.zodiac).toBe("tropical")
        expect(body.reading.lang).toBe("en")
        expect(body.reading.sections).toHaveLength(5)
        expect(body.reading.chips).toHaveLength(3)
    })

    it("should compute the chart from the profile's own birth data", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/chart`)
            .set("Cookie", [cookie])

        const body = response.body as ChartResponse

        // 1995-08-15 14:30 IST -> 09:00 UTC
        expect(body.chart.meta.utc).toBe("1995-08-15T09:00:00.000Z")
        expect(body.chart.meta.tzone).toBe(geoData.tzone)

        const sun = body.chart.bodies.find((entry) => entry.body === "sun")
        expect(sun?.sign).toBe("leo")
    })

    it("should default a missing birth time to midnight", async () => {
        const id = await createProfile({
            firstName: "no",
            lastName: "time",
            birthDate: profileData.birthDate,
            city: profileData.city,
            state: profileData.state,
            country: profileData.country,
        })

        const response = await request(app)
            .get(`/profiles/${id}/chart`)
            .set("Cookie", [cookie])

        const body = response.body as ChartResponse

        expect(response.statusCode).toBe(200)
        expect(body.chart.meta.birthTime).toBe("00:00")
    })

    it("should agree with the sign stored on the profile", async () => {
        const [chart, profile] = await Promise.all([
            request(app)
                .get(`/profiles/${profileId}/chart`)
                .set("Cookie", [cookie]),
            request(app).get(`/profiles/${profileId}`).set("Cookie", [cookie]),
        ])

        const sun = (chart.body as ChartResponse).chart.bodies.find(
            (entry) => entry.body === "sun",
        )

        expect((profile.body as { zodiacSign: string }).zodiacSign).toBe(
            sun?.sign,
        )
    })

    // The Sun entered Leo at ~17:30 local that day. A fixed-date table calls
    // the whole of 23 July Leo, and contradicts the chart it ships with.
    it("should read a cusp birth from the real solar ingress", async () => {
        const id = await createProfile({
            ...profileData,
            firstName: "cusp",
            lastName: "birth",
            birthDate: "1995-07-23",
            birthTime: "06:00",
        })

        const response = await request(app)
            .get(`/profiles/${id}`)
            .set("Cookie", [cookie])

        expect((response.body as { zodiacSign: string }).zodiacSign).toBe(
            "cancer",
        )
    })

    it("should accept an explicit supported language", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/chart?lang=en`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        expect((response.body as ChartResponse).reading.lang).toBe("en")
    })

    it("should return 400 for an unsupported language", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/chart?lang=klingon`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("should return 400 for a malformed profile id", async () => {
        const response = await request(app)
            .get("/profiles/not-an-id/chart")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("should return 401 without an access token", async () => {
        const response = await request(app).get(`/profiles/${profileId}/chart`)

        expect(response.statusCode).toBe(401)
    })

    it("should not expose another user's profile", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "someone.else@gmail.com",
        })

        const response = await request(app)
            .get(`/profiles/${profileId}/chart`)
            .set("Cookie", [otherCookie])

        expect(response.statusCode).toBe(404)
    })
})
