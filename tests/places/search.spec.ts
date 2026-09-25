import { jest } from "@jest/globals"
import request from "supertest"
import app from "../../src/app.ts"
import { resetDB } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import type { PlaceDetail, PlaceSuggestion } from "../../src/types/index.ts"
import { registerAndGetCookie } from "../utils/index.ts"

const suggestion: PlaceSuggestion = {
    placeId: "ChIJSdRbuoqEXjkRFmVPYRHdzk8",
    description: "Ahmedabad, Gujarat, India",
    main: "Ahmedabad",
    secondary: "Gujarat, India",
}

const detail: PlaceDetail = {
    placeId: suggestion.placeId,
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    lat: 23.022505,
    lon: 72.5713621,
}

describe("/places", () => {
    let cookie: string

    beforeEach(async () => {
        await resetDB()
        cookie = await registerAndGetCookie(app)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("should return city suggestions for a query", async () => {
        const search = jest
            .spyOn(GeoService.prototype, "searchPlaces")
            .mockResolvedValue([suggestion])

        const response = await request(app)
            .get("/places?q=ahmed")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([suggestion])
        expect(search).toHaveBeenCalledWith("ahmed")
    })

    it("should resolve a picked place into city, state and country", async () => {
        jest.spyOn(GeoService.prototype, "resolvePlace").mockResolvedValue(
            detail,
        )

        const response = await request(app)
            .get(`/places/${suggestion.placeId}`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(detail)
    })

    it("should reject a query that is too short", async () => {
        const response = await request(app)
            .get("/places?q=a")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("should require a session for search", async () => {
        const response = await request(app).get("/places?q=ahmedabad")
        expect(response.statusCode).toBe(401)
    })

    it("should require a session for details", async () => {
        const response = await request(app).get(`/places/${suggestion.placeId}`)
        expect(response.statusCode).toBe(401)
    })

    it("should surface an upstream google failure as a 502", async () => {
        jest.spyOn(GeoService.prototype, "searchPlaces").mockRejectedValue(
            Object.assign(new Error("Google Maps places autocomplete failed"), {
                status: 502,
                statusCode: 502,
            }),
        )

        const response = await request(app)
            .get("/places?q=ahmedabad")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(502)
    })
})
