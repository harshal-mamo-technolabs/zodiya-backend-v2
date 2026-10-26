import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    resetDB,
    userData,
} from "../utils/index.ts"

describe("GET /profiles/:id/chart/pdf", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let profileId: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        const response = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        profileId = (response.body as { id: string }).id
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    const pdf = (url: string, c = cookie) =>
        request(app)
            .get(url)
            .set("Cookie", [c])
            .buffer(true)
            .parse((res, done) => {
                const chunks: Buffer[] = []
                res.on("data", (d: Buffer) => chunks.push(d))
                res.on("end", () => {
                    done(null, Buffer.concat(chunks))
                })
            })

    it("should download the chart as a PDF", async () => {
        const response = await pdf(`/profiles/${profileId}/chart/pdf`)

        expect(response.statusCode).toBe(200)
        expect(response.headers["content-type"]).toBe("application/pdf")
        expect(response.headers["content-disposition"]).toBe(
            'attachment; filename="astromeridian-natal-chart-harshal-chauhan-1995-08-15.pdf"',
        )
        expect(response.headers["cache-control"]).toBe("private, no-store")
        const body = response.body as Buffer
        expect(body.subarray(0, 4).toString()).toBe("%PDF")
        expect(body.length).toBeGreaterThan(10_000)
    })

    it("should render the German variant", async () => {
        const response = await pdf(`/profiles/${profileId}/chart/pdf?lang=de`)

        expect(response.statusCode).toBe(200)
        expect((response.body as Buffer).subarray(0, 4).toString()).toBe("%PDF")
    })

    it("should return 400 for an unsupported language", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/chart/pdf?lang=klingon`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("should return 401 without an access token", async () => {
        const response = await request(app).get(
            `/profiles/${profileId}/chart/pdf`,
        )

        expect(response.statusCode).toBe(401)
    })

    it("should not expose another user's profile", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "someone.else@gmail.com",
        })

        const response = await request(app)
            .get(`/profiles/${profileId}/chart/pdf`)
            .set("Cookie", [otherCookie])

        expect(response.statusCode).toBe(404)
    })
})
