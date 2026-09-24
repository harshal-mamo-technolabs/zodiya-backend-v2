import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { ChartService } from "../../src/services/ChartService.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { TransitService } from "../../src/services/TransitService.ts"
import { TransitReadingService } from "../../src/services/TransitReadingService.ts"
import {
    Bodies,
    NATAL_POINTS,
    TRANSIT_ASPECT_ANGLES,
    TRANSIT_BODIES,
    TRANSIT_MAX_EVENTS,
    TRANSIT_ORB,
    TRANSIT_QUICK_BODIES,
    TRANSIT_QUICK_SLOTS,
    TRANSIT_TODAY_INDEX,
    TRANSIT_WINDOW_DAYS,
    TransitAspects,
    type TransitAspect,
} from "../../src/constants/index.ts"
import type { TransitResponse } from "../../src/types/index.ts"
import { geoData, profileData, registerAndGetCookie } from "../utils/index.ts"

const chart = new ChartService()
const transits = new TransitService(chart)
const reading = new TransitReadingService(chart, transits)

// Amara, Lagos, 12 September 1997 09:30
const natal = chart.compute({
    birthDate: "1997-09-12",
    birthTime: "09:30",
    lat: 6.5244,
    lon: 3.3792,
    tzone: 1,
})
const NOW = new Date("2026-09-17T10:00:00Z")

describe("TransitService", () => {
    const result = transits.compute(natal, "Africa/Lagos", NOW)

    it("frames sixty days with today three weeks in", () => {
        expect(result.days).toHaveLength(TRANSIT_WINDOW_DAYS)
        expect(result.today).toBe(TRANSIT_TODAY_INDEX)
        expect(result.days[TRANSIT_TODAY_INDEX]).toBe("2026-09-17")
        expect(result.days[0]).toBe("2026-08-27")
        expect(result.days[59]).toBe("2026-10-25")
    })

    it("uses the profile's zone to decide what day it is", () => {
        // 23:30 UTC on the 17th is already the 18th in Tokyo
        const late = new Date("2026-09-17T23:30:00Z")
        expect(
            transits.compute(natal, "Asia/Tokyo", late).days[
                TRANSIT_TODAY_INDEX
            ],
        ).toBe("2026-09-18")
        expect(
            transits.compute(natal, "America/Los_Angeles", late).days[
                TRANSIT_TODAY_INDEX
            ],
        ).toBe("2026-09-17")
    })

    it("only lists aspects that come within a degree inside the window", () => {
        expect(result.events.length).toBeGreaterThan(0)
        for (const event of result.events) {
            const [from, to] = event.span
            expect(from).toBeLessThanOrEqual(to)
            expect(event.daily).toHaveLength(TRANSIT_WINDOW_DAYS)
            const orbs = event.daily.slice(from, to + 1).map((d) => d.orb)
            const limit = event.lunation ? 1.5 : TRANSIT_ORB
            expect(Math.min(...orbs)).toBeLessThanOrEqual(limit)
        }
    })

    it("caps the timeline, ranks by weight, and keeps room for quick movers", () => {
        expect(result.events.length).toBeLessThanOrEqual(TRANSIT_MAX_EVENTS)
        const weights = result.events.map((e) => e.weight)
        expect([...weights].sort((a, b) => b - a)).toEqual(weights)
        for (const w of weights) {
            expect(w).toBeGreaterThanOrEqual(1)
            expect(w).toBeLessThanOrEqual(5)
        }
        const quick = result.events.filter(
            (e) =>
                e.lunation ||
                (TRANSIT_QUICK_BODIES as string[]).includes(e.transit),
        )
        expect(quick.length).toBe(TRANSIT_QUICK_SLOTS)
        // the quick movers on the plate are the ones nearest today
        const near = Math.max(
            ...quick.map((e) => Math.abs(e.exact - TRANSIT_TODAY_INDEX)),
        )
        expect(near).toBeLessThanOrEqual(20)
    })

    /* Cross-check the engine against a direct computation for one pair. */
    it("agrees with a direct orb calculation", () => {
        const event = result.events.find((e) => !e.lunation)
        if (!event) {
            throw new Error("no planetary event")
        }
        const angle = TRANSIT_ASPECT_ANGLES[event.aspect]
        for (const [i, day] of event.daily.entries()) {
            const sep = Math.abs(((day.lon - event.natalLon + 540) % 360) - 180)
            expect(Math.abs(Math.abs(sep - angle) - day.orb)).toBeLessThan(
                0.011,
            )
            expect(result.days[i]).toBeDefined()
        }
    })

    it("keeps the exact marker inside the window even when exact is not", () => {
        const first = result.days[0] ?? "",
            last = result.days.at(-1) ?? ""
        for (const event of result.events) {
            expect(event.exact).toBeGreaterThanOrEqual(0)
            expect(event.exact).toBeLessThan(TRANSIT_WINDOW_DAYS)
            expect(event.exactDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            if (event.exactDate >= first && event.exactDate <= last) {
                expect(result.days[event.exact]).toBe(event.exactDate)
            } else {
                expect([0, TRANSIT_WINDOW_DAYS - 1]).toContain(event.exact)
            }
        }
        // Pluto square the Ascendant is exact mid October and active the whole plate
        const pluto = result.events.find((e) => e.id === "pluto-square-asc")
        expect(pluto?.exact).toBe(49)
        expect(pluto?.exactDate).toBe("2026-10-15")
        expect(pluto?.span).toEqual([0, TRANSIT_WINDOW_DAYS - 1])
    })

    it("finds the exact day at the orb's minimum", () => {
        // a quick mover whose exact date sits inside the plate samples cleanly
        const quick = result.events.find(
            (e) =>
                !e.lunation &&
                (TRANSIT_QUICK_BODIES as string[]).includes(e.transit) &&
                e.exact > 0 &&
                e.exact < TRANSIT_WINDOW_DAYS - 1,
        )
        if (!quick) {
            throw new Error("expected a quick mover exact on the plate")
        }
        const orbs = quick.daily.map((d) => d.orb)
        expect(orbs.indexOf(Math.min(...orbs))).toBe(quick.exact)
        expect(result.days[quick.exact]).toBe(quick.exactDate)
    })

    it("marks retrograde motion from a negative speed", () => {
        const neptune = result.events.find((e) => e.transit === "neptune")
        expect(neptune?.daily[0]?.speed).toBeLessThan(0)
    })

    it("scores slow planets to personal points highest and generational lowest", () => {
        const ids = result.events.map((e) => e.id)
        expect(ids).not.toContain("uranus-trine-uranus")
        expect(ids).not.toContain("pluto-sextile-pluto")
        expect(result.events[0]?.weight).toBe(5)
    })

    it("calls a body fast or slow against its own mean motion", () => {
        expect(transits.pace("mars", 0.7)).toBe("fast")
        expect(transits.pace("mars", 0.2)).toBe("slow")
        expect(transits.pace("mars", 0.5)).toBeNull()
        expect(transits.pace("saturn", -0.03)).toBeNull()
    })

    it("finds a lunation when the window holds one", () => {
        // 26 Sep 2026 is a Full Moon; scan a year of fortnights for any hit
        let found = 0
        for (let week = 0; week < 26; week++) {
            const at = new Date(NOW.getTime() + week * 14 * 86_400_000)
            const r = transits.compute(natal, "Africa/Lagos", at)
            found += r.events.filter((e) => e.lunation).length
        }
        expect(found).toBeGreaterThan(0)
    })
})

describe("TransitReadingService", () => {
    const built = reading.build(
        transits.compute(natal, "Africa/Lagos", NOW),
        natal,
        "Lagos",
        "en",
    )

    it("names both ends of every transit and gives a glyph", () => {
        for (const event of built.events) {
            expect(event.title).toMatch(
                /^[A-Z][A-Za-z ]+ (conjunction|sextile|square|trine|quincunx|opposition) [A-Z][A-Za-z ]+$/,
            )
            expect(event.glyph.length).toBeGreaterThan(0)
            expect(event.natalPos).toMatch(/^[A-Z][a-z]+ \d{2}°\d{2}′$/)
            expect(event.daily[0]?.pos).toMatch(
                /^[A-Z][a-z]+ \d{2}°\d{2}′( ℞)?$/,
            )
        }
    })

    it("reads a retrograde planet as such", () => {
        const neptune = built.events.find((e) => e.transit === "neptune")
        expect(neptune?.daily[0]?.pos).toMatch(/℞$/)
        expect(neptune?.daily[0]?.motion).toMatch(/^Retrograde/)
    })

    it("labels tone from the aspect, and from the planet for a conjunction", () => {
        const byAspect = (aspect: TransitAspect) =>
            built.events.find((e) => e.aspect === aspect && !e.lunation)
        const square = byAspect(TransitAspects.SQUARE)
        const trine = byAspect(TransitAspects.TRINE)
        expect(square?.toneLabel).toBe("Demanding")
        expect(trine?.toneLabel).toBe("Supportive")
        // a conjunction takes its tone from the planet, so fake one of each
        const base = transits.compute(natal, "Africa/Lagos", NOW)
        const sample = base.events.find((e) => !e.lunation)
        if (!sample) {
            throw new Error("no planetary event")
        }
        const conj = (transit: (typeof TRANSIT_BODIES)[number]) =>
            reading.build(
                {
                    ...base,
                    events: [
                        {
                            ...sample,
                            transit,
                            aspect: TransitAspects.CONJUNCTION,
                        },
                    ],
                },
                natal,
                "Lagos",
                "en",
            ).events[0]?.toneLabel
        expect(conj(Bodies.VENUS)).toBe("Supportive")
        expect(conj(Bodies.SATURN)).toBe("Demanding")
    })

    it("closes every reading on the natal point it touches", () => {
        for (const event of built.events) {
            expect(event.lede.length).toBeGreaterThan(8)
            expect(event.text).toContain(
                `Your ${event.natalName} is where this lands`,
            )
            expect(event.text).not.toMatch(/[–—]/)
            expect(event.advice.length).toBeGreaterThan(20)
            expect(event.advice).not.toMatch(/[–—]/)
        }
    })

    /* Every body, aspect and point can appear, so every combination needs text. */
    it("has copy for every transiting body, aspect and natal point", () => {
        const base = transits.compute(natal, "Africa/Lagos", NOW)
        const sample = base.events.find((e) => !e.lunation)
        if (!sample) {
            throw new Error("no planetary event")
        }
        for (const transit of TRANSIT_BODIES) {
            for (const aspect of Object.keys(
                TRANSIT_ASPECT_ANGLES,
            ) as TransitAspect[]) {
                for (const point of NATAL_POINTS) {
                    const fake = reading.build(
                        {
                            ...base,
                            events: [
                                { ...sample, transit, aspect, natal: point },
                            ],
                        },
                        natal,
                        "Lagos",
                        "en",
                    )
                    const e = fake.events[0]
                    expect(e?.lede.length ?? 0).toBeGreaterThan(8)
                    expect(e?.text.length ?? 0).toBeGreaterThan(120)
                    expect(e?.advice.length ?? 0).toBeGreaterThan(20)
                }
            }
        }
    })
})

describe("GET /profiles/:id/transits", () => {
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
        await mongod.stop()
    })

    it("returns the plate for the owner's profile", async () => {
        const response = await request(app)
            .get(`/profiles/${profileId}/transits`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        const body = response.body as TransitResponse
        expect(body.days).toHaveLength(TRANSIT_WINDOW_DAYS)
        expect(body.today).toBe(TRANSIT_TODAY_INDEX)
        expect(body.place).toBe(profileData.city)
        expect(body.labels.headlineToday).toBe(
            "What the sky is doing to your chart today.",
        )
        expect(body.tones.tense).toBe("Demanding")
        expect(Array.isArray(body.events)).toBe(true)
    })

    it("requires a session", async () => {
        const response = await request(app).get(
            `/profiles/${profileId}/transits`,
        )
        expect(response.statusCode).toBe(401)
    })

    it("hides other people's profiles", async () => {
        const other = await registerAndGetCookie(app, {
            firstName: "Other",
            lastName: "Person",
            email: "other@example.com",
            password: "supersecret123",
        })
        const response = await request(app)
            .get(`/profiles/${profileId}/transits`)
            .set("Cookie", [other])
        expect(response.statusCode).toBe(404)
    })
})
