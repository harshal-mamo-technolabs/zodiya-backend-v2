import { jest } from "@jest/globals"
import { GeoService } from "../../src/services/GeoService.ts"
import { config } from "../../src/config/index.ts"

const geocodeResponse = {
    status: "OK",
    results: [
        {
            place_id: "ChIJSdRbuoqEXjkRFmVPYRHdzk8",
            address_components: [
                { long_name: "Ahmedabad", types: ["locality"] },
                {
                    long_name: "Gujarat",
                    types: ["administrative_area_level_1"],
                },
                { long_name: "India", types: ["country"] },
            ],
            geometry: { location: { lat: 23.022505, lng: 72.5713621 } },
        },
    ],
}

const toUrl = (input: string | URL | Request) =>
    new URL(input instanceof Request ? input.url : input)

const jsonResponse = (body: unknown, status = 200) =>
    Promise.resolve(new Response(JSON.stringify(body), { status }))

describe("GeoService", () => {
    const geoService = new GeoService()
    let fetchSpy: jest.SpiedFunction<typeof fetch>

    beforeEach(() => {
        fetchSpy = jest
            .spyOn(globalThis, "fetch")
            .mockImplementation(() => jsonResponse(geocodeResponse))
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe("lookup", () => {
        it("should return lat, lon, tzone and timezoneId for the birth place", async () => {
            const geo = await geoService.lookup(
                "Ahmedabad",
                "Gujarat",
                "India",
                "1995-08-15",
                "14:30",
            )

            expect(geo).toEqual({
                lat: 23.022505,
                lon: 72.5713621,
                tzone: 5.5,
                timezoneId: "Asia/Kolkata",
            })
        })

        it("should geocode the address with the api key", async () => {
            await geoService.lookup(
                "Ahmedabad",
                "Gujarat",
                "India",
                "1995-08-15",
                "14:30",
            )

            const url = toUrl(fetchSpy.mock.calls[0]?.[0] ?? "")

            expect(url.pathname).toContain("/geocode/")
            expect(url.searchParams.get("address")).toBe(
                "Ahmedabad, Gujarat, India",
            )
            expect(url.searchParams.get("key")).toBe(config.GOOGLE_MAPS_API_KEY)
        })

        // Geocoding is the only remote call left; the zone is resolved locally.
        it("should reach google exactly once", async () => {
            await geoService.lookup(
                "Ahmedabad",
                "Gujarat",
                "India",
                "1995-08-15",
                "14:30",
            )

            expect(fetchSpy).toHaveBeenCalledTimes(1)
        })

        it("should throw 400 if the location cannot be found", async () => {
            fetchSpy.mockImplementation(() =>
                jsonResponse({ status: "ZERO_RESULTS", results: [] }),
            )

            await expect(
                geoService.lookup(
                    "Nowhere",
                    "Nope",
                    "Nada",
                    "1995-08-15",
                    "14:30",
                ),
            ).rejects.toMatchObject({ status: 400 })
        })

        it("should throw 502 if the api key is not authorized", async () => {
            fetchSpy.mockImplementation(() =>
                jsonResponse({
                    status: "REQUEST_DENIED",
                    errorMessage: "This API key is not authorized",
                }),
            )

            await expect(
                geoService.lookup(
                    "Ahmedabad",
                    "Gujarat",
                    "India",
                    "1995-08-15",
                    "14:30",
                ),
            ).rejects.toMatchObject({
                status: 502,
                message: expect.stringContaining("REQUEST_DENIED") as string,
            })
        })

        it("should throw 502 if google is unavailable", async () => {
            fetchSpy.mockImplementation(() => jsonResponse({}, 500))

            await expect(
                geoService.lookup(
                    "Ahmedabad",
                    "Gujarat",
                    "India",
                    "1995-08-15",
                    "14:30",
                ),
            ).rejects.toMatchObject({ status: 502 })
        })
    })

    /* The offset is whatever the tz database says was in force at that instant,
       so these cases pin the awkward history, not just the easy modern ones. */
    describe("time zone resolution", () => {
        const at = async (
            lat: number,
            lng: number,
            birthDate: string,
            birthTime: string,
        ) => {
            fetchSpy.mockImplementation(() =>
                jsonResponse({
                    status: "OK",
                    results: [
                        {
                            place_id: "x",
                            address_components: [],
                            geometry: { location: { lat, lng } },
                        },
                    ],
                }),
            )
            return geoService.lookup("a", "b", "c", birthDate, birthTime)
        }

        it.each([
            [
                "Amsterdam in summer",
                52.3676,
                4.9041,
                "2002-07-11",
                2,
                "Europe/Amsterdam",
            ],
            [
                "Amsterdam in winter",
                52.3676,
                4.9041,
                "2002-01-11",
                1,
                "Europe/Amsterdam",
            ],
            ["Mumbai", 19.076, 72.8777, "1995-08-15", 5.5, "Asia/Kolkata"],
            [
                "Kathmandu's 45-minute offset",
                27.7172,
                85.324,
                "1990-05-15",
                5.75,
                "Asia/Kathmandu",
            ],
            [
                "Phoenix, which keeps no DST",
                33.4484,
                -112.074,
                "2002-07-11",
                -7,
                "America/Phoenix",
            ],
            [
                "Adelaide's half-hour offset",
                -34.9285,
                138.6007,
                "2002-01-11",
                10.5,
                "Australia/Adelaide",
            ],
            [
                "London during year-round BST",
                51.5072,
                -0.1276,
                "1969-01-15",
                1,
                "Europe/London",
            ],
            [
                "Lisbon while Portugal kept CET",
                38.7223,
                -9.1393,
                "1993-01-15",
                1,
                "Europe/Lisbon",
            ],
            [
                "wartime India at +6:30",
                19.076,
                72.8777,
                "1943-01-15",
                6.5,
                "Asia/Kolkata",
            ],
        ] as [string, number, number, string, number, string][])(
            "should resolve %s",
            async (_label, lat, lng, birthDate, tzone, timezoneId) => {
                const geo = await at(lat, lng, birthDate, "12:00")

                expect(geo.tzone).toBe(tzone)
                expect(geo.timezoneId).toBe(timezoneId)
            },
        )

        // Clocks went forward 02:00 -> 03:00 on 31 March 2002 in Amsterdam.
        it("should land on the right side of a daylight-saving switch", async () => {
            const before = await at(52.3676, 4.9041, "2002-03-31", "01:30")
            const after = await at(52.3676, 4.9041, "2002-03-31", "03:30")

            expect(before.tzone).toBe(1)
            expect(after.tzone).toBe(2)
        })

        it("should throw 422 for a coordinate with no zone", async () => {
            await expect(
                at(1000, 1000, "1995-08-15", "14:30"),
            ).rejects.toMatchObject({ status: 422 })
        })
    })
})
