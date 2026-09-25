import { jest } from "@jest/globals"
import request from "supertest"
import app from "../../src/app.ts"
import { resetDB } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import type { SharedChartResponse } from "../../src/types/index.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

describe("share links", () => {
    let cookie: string
    let profileId: string

    const tokenFor = async (id = profileId, jar = cookie) => {
        const response = await request(app)
            .post(`/profiles/${id}/share`)
            .set("Cookie", [jar])
        return (response.body as { token?: string }).token ?? ""
    }

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)

        const created = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        profileId = (created.body as Record<string, string>).id ?? ""
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("should issue a token the owner can share", async () => {
        const response = await request(app)
            .post(`/profiles/${profileId}/share`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        expect((response.body as { token: string }).token).toMatch(
            /^[A-Za-z0-9_-]{20,}$/,
        )
    })

    it("should return the same token when asked twice", async () => {
        expect(await tokenFor()).toBe(await tokenFor())
    })

    it("should serve the chart to a stranger with no session", async () => {
        const response = await request(app).get(`/shared/${await tokenFor()}`)

        expect(response.statusCode).toBe(200)

        const body = response.body as SharedChartResponse

        expect(body.profile.name).toBe("harshal chauhan")
        expect(body.chart.bodies).toHaveLength(11)
        expect(body.chart.houses).toHaveLength(12)
        expect(body.reading.sections).toHaveLength(5)
    })

    // The link is public, so it must not carry the exact birthplace.
    it("should not expose coordinates, offset or the profile id", async () => {
        const response = await request(app).get(`/shared/${await tokenFor()}`)
        const body = response.body as SharedChartResponse

        expect(body.chart.meta).not.toHaveProperty("lat")
        expect(body.chart.meta).not.toHaveProperty("lon")
        expect(body.chart.meta).not.toHaveProperty("tzone")
        expect(body.chart.meta).not.toHaveProperty("utc")
        expect(body.chart.meta).not.toHaveProperty("julianDay")
        expect(body.profile).not.toHaveProperty("id")
        expect(body.profile).not.toHaveProperty("state")
        expect(JSON.stringify(body)).not.toContain(String(geoData.lat))
    })

    it("should stop working once revoked", async () => {
        const token = await tokenFor()

        expect((await request(app).get(`/shared/${token}`)).statusCode).toBe(
            200,
        )

        const revoked = await request(app)
            .delete(`/profiles/${profileId}/share`)
            .set("Cookie", [cookie])

        expect(revoked.statusCode).toBe(204)
        expect((await request(app).get(`/shared/${token}`)).statusCode).toBe(
            404,
        )
    })

    it("should issue a fresh token after a revoke", async () => {
        const first = await tokenFor()
        await request(app)
            .delete(`/profiles/${profileId}/share`)
            .set("Cookie", [cookie])

        expect(await tokenFor()).not.toBe(first)
    })

    it("should 404 an unknown token", async () => {
        const response = await request(app).get("/shared/not-a-real-token")
        expect(response.statusCode).toBe(404)
    })

    it("should require a session to create a link", async () => {
        const response = await request(app).post(`/profiles/${profileId}/share`)
        expect(response.statusCode).toBe(401)
    })

    it("should not let another user share or revoke your profile", async () => {
        const other = await registerAndGetCookie(app, {
            ...userData,
            email: "intruder@gmail.com",
        })

        expect(
            (
                await request(app)
                    .post(`/profiles/${profileId}/share`)
                    .set("Cookie", [other])
            ).statusCode,
        ).toBe(404)

        const token = await tokenFor()

        expect(
            (
                await request(app)
                    .delete(`/profiles/${profileId}/share`)
                    .set("Cookie", [other])
            ).statusCode,
        ).toBe(404)

        // the owner's link is untouched by the failed attempt
        expect((await request(app).get(`/shared/${token}`)).statusCode).toBe(
            200,
        )
    })
})
