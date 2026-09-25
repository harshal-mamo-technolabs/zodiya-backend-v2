import request from "supertest"
import app from "../../src/app.ts"
import { resetDB } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { ChartService } from "../../src/services/ChartService.ts"
import { HoroscopeService } from "../../src/services/HoroscopeService.ts"
import { HoroscopeReadingService } from "../../src/services/HoroscopeReadingService.ts"
import {
    HOROSCOPE_CATEGORY_ORDER,
    HOROSCOPE_PERIOD_ORDER,
    HoroscopePeriods,
    Lunations,
    SIGN_ORDER,
    SIGN_RELATION_ORDER,
    ZodiacSigns,
} from "../../src/constants/index.ts"
import type { HoroscopeResponse } from "../../src/types/index.ts"
import { registerAndGetCookie } from "../utils/index.ts"

const chart = new ChartService()
const service = new HoroscopeService(chart)
const reading = new HoroscopeReadingService(chart)
const ZONE = "Asia/Kolkata"

describe("HoroscopeService", () => {
    it("places every planet in a solar house and names its angle to the sign", () => {
        const r = service.compute(
            ZodiacSigns.VIRGO,
            HoroscopePeriods.DAILY,
            "2026-09-17",
            ZONE,
        )
        expect(r.sky.bodies).toHaveLength(10)
        for (const b of r.sky.bodies) {
            const expected =
                ((SIGN_ORDER.indexOf(b.sign) -
                    SIGN_ORDER.indexOf(ZodiacSigns.VIRGO) +
                    12) %
                    12) +
                1
            expect(b.house).toBe(expected)
            expect(SIGN_RELATION_ORDER).toContain(b.relation)
        }
        // the Sun is in Virgo on 17 September, so it sits in Virgo's first house
        const sun = r.sky.bodies.find((b) => b.body === "sun")
        expect(sun?.sign).toBe(ZodiacSigns.VIRGO)
        expect(sun?.house).toBe(1)
        expect(sun?.relation).toBe("conjunction")
    })

    it("reads the same sky as a different house from a different sign", () => {
        const virgo = service.compute(
            ZodiacSigns.VIRGO,
            HoroscopePeriods.DAILY,
            "2026-09-17",
            ZONE,
        )
        const leo = service.compute(
            ZodiacSigns.LEO,
            HoroscopePeriods.DAILY,
            "2026-09-17",
            ZONE,
        )
        const sunV = virgo.sky.bodies.find((b) => b.body === "sun")
        const sunL = leo.sky.bodies.find((b) => b.body === "sun")
        expect(sunV?.lon).toBe(sunL?.lon)
        expect(sunL?.house).toBe(2)
    })

    it("finds the New Moon of 11 September 2026 in Virgo", () => {
        const r = service.compute(
            ZodiacSigns.VIRGO,
            HoroscopePeriods.DAILY,
            "2026-09-11",
            ZONE,
        )
        expect(r.sky.moon.phase).toBe("newMoon")
        expect(
            r.events.some(
                (e) =>
                    e.body === Lunations.NEW &&
                    e.date === "2026-09-11" &&
                    e.sign === ZodiacSigns.VIRGO,
            ),
        ).toBe(true)
    })

    it("frames a week Monday to Sunday and lists the Moon's signs through it", () => {
        const r = service.compute(
            ZodiacSigns.ARIES,
            HoroscopePeriods.WEEKLY,
            "2026-09-17",
            ZONE,
        )
        expect(r.span).toEqual({ start: "2026-09-14", end: "2026-09-20" })
        expect(r.moonSigns.length).toBeGreaterThanOrEqual(3)
        expect(r.moonSigns.length).toBeLessThanOrEqual(4)
        for (const e of r.events) {
            expect(e.date >= r.span.start && e.date <= r.span.end).toBe(true)
        }
    })

    it("dates the year's sign changes to the day", () => {
        const r = service.compute(
            ZodiacSigns.VIRGO,
            HoroscopePeriods.YEARLY,
            "2026-06-01",
            ZONE,
        )
        expect(r.span).toEqual({ start: "2026-01-01", end: "2026-12-31" })
        const saturn = r.events.find((e) => e.body === "saturn")
        expect(saturn?.sign).toBe(ZodiacSigns.ARIES)
        expect(saturn?.date).toBe("2026-02-14")
        const jupiter = r.events.find((e) => e.body === "jupiter")
        expect(jupiter?.sign).toBe(ZodiacSigns.LEO)
        expect(jupiter?.date).toBe("2026-06-30")
    })

    it("works for any year, decades away", () => {
        const far = service.compute(
            ZodiacSigns.PISCES,
            HoroscopePeriods.DAILY,
            "2041-03-03",
            ZONE,
        )
        expect(far.sky.bodies).toHaveLength(10)
        expect(far.sky.moon.illumination).toBeGreaterThanOrEqual(0)
        expect(far.sky.moon.illumination).toBeLessThanOrEqual(1)
        const past = service.compute(
            ZodiacSigns.PISCES,
            HoroscopePeriods.WEEKLY,
            "1999-12-31",
            ZONE,
        )
        expect(past.span).toEqual({ start: "1999-12-27", end: "2000-01-02" })
    })
})

describe("HoroscopeReadingService", () => {
    const built = reading.build(
        service.compute(
            ZodiacSigns.VIRGO,
            HoroscopePeriods.DAILY,
            "2026-09-17",
            ZONE,
        ),
        "en",
    )

    it("names the sign, its dates and its ruler", () => {
        expect(built.signName).toBe("Virgo")
        expect(built.range).toBe("23 Aug – 22 Sep")
        expect(built.ruler).toBe("Mercury")
        expect(built.abbr).toBe("Vir")
    })

    it("gives six scored readings, a headline, a mood, a number, a colour and notes", () => {
        expect(built.categories.map((c) => c.key)).toEqual(
            HOROSCOPE_CATEGORY_ORDER,
        )
        expect(built.categories.map((c) => c.numeral)).toEqual([
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
        ])
        for (const c of built.categories) {
            expect(c.score).toBeGreaterThanOrEqual(1)
            expect(c.score).toBeLessThanOrEqual(5)
            expect(c.text.length).toBeGreaterThan(80)
            expect(c.text).not.toMatch(/\{\w+\}/)
            expect(c.text).not.toMatch(/[–—]/)
            expect(c.text.charAt(0)).toBe(c.text.charAt(0).toUpperCase())
        }
        expect(built.headline.length).toBeGreaterThan(20)
        expect(built.mood.value).toBeGreaterThan(0)
        expect(built.mood.value).toBeLessThanOrEqual(1)
        expect(built.luckyNumber).toBeGreaterThanOrEqual(1)
        expect(built.luckyNumber).toBeLessThanOrEqual(9)
        expect(built.luckyColour.hex).toMatch(/^#[0-9A-F]{6}$/)
        expect(built.moonLine).toMatch(/·/)
        expect(built.skyNotes.length).toBeGreaterThanOrEqual(2)
        expect(built.skyNotes.length).toBeLessThanOrEqual(4)
        expect(built.strength).toBeGreaterThanOrEqual(1)
    })

    it("is the same every time for the same day, and different on other days", () => {
        const again = reading.build(
            service.compute(
                ZodiacSigns.VIRGO,
                HoroscopePeriods.DAILY,
                "2026-09-17",
                ZONE,
            ),
            "en",
        )
        expect(again).toEqual(built)
        const texts = new Set<string>()
        for (let d = 1; d <= 9; d++) {
            const day = reading.build(
                service.compute(
                    ZodiacSigns.VIRGO,
                    HoroscopePeriods.DAILY,
                    `2026-10-0${String(d)}`,
                    ZONE,
                ),
                "en",
            )
            texts.add(day.categories[2]?.text ?? "")
        }
        expect(texts.size).toBeGreaterThan(3)
    })

    it("mentions the New Moon on its day", () => {
        const newMoon = reading.build(
            service.compute(
                ZodiacSigns.VIRGO,
                HoroscopePeriods.DAILY,
                "2026-09-11",
                ZONE,
            ),
            "en",
        )
        expect(newMoon.skyNotes[0]).toBe("New Moon in Virgo · today")
        expect(newMoon.moonLine).toBe("New Moon · Virgo")
    })

    it("has copy for every period, category and angle", () => {
        const base = service.compute(
            ZodiacSigns.ARIES,
            HoroscopePeriods.DAILY,
            "2026-09-17",
            ZONE,
        )
        for (const period of HOROSCOPE_PERIOD_ORDER) {
            for (const relation of SIGN_RELATION_ORDER) {
                const fake = reading.build(
                    {
                        ...base,
                        period,
                        sky: {
                            ...base.sky,
                            bodies: base.sky.bodies.map((b) => ({
                                ...b,
                                relation,
                            })),
                            moon: { ...base.sky.moon, relation },
                        },
                    },
                    "en",
                )
                expect(fake.headline.length).toBeGreaterThan(20)
                for (const c of fake.categories) {
                    expect(c.relation).toBe(relation)
                    expect(c.text.length).toBeGreaterThan(80)
                }
            }
        }
    })

    it("reads a week and a year with their own framing", () => {
        const week = reading.build(
            service.compute(
                ZodiacSigns.VIRGO,
                HoroscopePeriods.WEEKLY,
                "2026-09-07",
                ZONE,
            ),
            "en",
        )
        expect(week.moonLine).toMatch(/^Moon through /)
        expect(week.skyNotes).toContain("New Moon in Virgo · Fri 11 Sep")
        expect(week.categories[0]?.text).toMatch(/week/)

        const year = reading.build(
            service.compute(
                ZodiacSigns.VIRGO,
                HoroscopePeriods.YEARLY,
                "2026-01-01",
                ZONE,
            ),
            "en",
        )
        expect(year.skyNotes[0]).toMatch(/^Jupiter in \w+ · your \w+ house$/)
        expect(year.skyNotes).toContain("Saturn enters Aries · 14 Feb")
        expect(year.categories[1]?.text).toMatch(/year/)
    })
})

describe("GET /horoscope", () => {
    let cookie: string

    beforeAll(async () => {
        await resetDB()
        cookie = await registerAndGetCookie(app)
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("returns today's reading for a sign", async () => {
        const response = await request(app)
            .get("/horoscope?sign=virgo&tz=Asia/Kolkata")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        const body = response.body as HoroscopeResponse
        expect(body.sign).toBe("virgo")
        expect(body.period).toBe("daily")
        expect(body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(body.categories).toHaveLength(6)
        expect(body.labels.periods.weekly).toBe("Weekly")
    })

    it("takes a period and a date", async () => {
        const response = await request(app)
            .get("/horoscope?sign=leo&period=yearly&date=2030-05-05")
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        const body = response.body as HoroscopeResponse
        expect(body.span).toEqual({ start: "2030-01-01", end: "2030-12-31" })
    })

    it("rejects an unknown sign, period or zone", async () => {
        for (const query of [
            "sign=ophiuchus",
            "sign=leo&period=monthly",
            "sign=leo&tz=Mars/Olympus",
            "sign=leo&date=05-05-2030",
        ]) {
            const response = await request(app)
                .get(`/horoscope?${query}`)
                .set("Cookie", [cookie])
            expect(response.statusCode).toBe(400)
        }
    })

    it("requires a session", async () => {
        const response = await request(app).get("/horoscope?sign=leo")
        expect(response.statusCode).toBe(401)
    })
})
