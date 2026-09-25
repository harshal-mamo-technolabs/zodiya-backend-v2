import { jest } from "@jest/globals"
import request from "supertest"
import app from "../../src/app.ts"
import { resetDB } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { ChartService } from "../../src/services/ChartService.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { SynastryService } from "../../src/services/SynastryService.ts"
import { SynastryReadingService } from "../../src/services/SynastryReadingService.ts"
import {
    AspectTypes,
    Bodies,
    SYNASTRY_BODIES,
    SYNASTRY_ORBS,
    SYNASTRY_PAIRS,
    SYNASTRY_SECTION_ORDER,
    SYNASTRY_TOP,
    TransitTextGroups,
} from "../../src/constants/index.ts"
import type { SynastryResponse } from "../../src/types/index.ts"
import { geoData, profileData, registerAndGetCookie } from "../utils/index.ts"

const chart = new ChartService()
const synastry = new SynastryService(chart)
const reading = new SynastryReadingService(chart)

// Amara, Lagos, 12 September 1997 09:30
const amara = chart.compute({
    birthDate: "1997-09-12",
    birthTime: "09:30",
    lat: 6.5244,
    lon: 3.3792,
    tzone: 1,
})
// Tomás, Lisbon, 19 December 1991 15:20
const tomas = chart.compute({
    birthDate: "1991-12-19",
    birthTime: "15:20",
    lat: 38.7223,
    lon: -9.1393,
    tzone: 0,
})

const separation = (a: number, b: number) => {
    const d = (((a - b) % 360) + 360) % 360
    return d > 180 ? 360 - d : d
}

describe("SynastryService", () => {
    const result = synastry.compute(amara, tomas)

    it("carries both wheels", () => {
        for (const side of [result.a, result.b]) {
            expect(side.cusps).toHaveLength(12)
            expect(Object.keys(side.bodies)).toHaveLength(
                SYNASTRY_BODIES.length,
            )
            expect(side.asc).toBeGreaterThanOrEqual(0)
        }
        expect(result.a.sun).toBe("virgo")
        expect(result.b.sun).toBe("sagittarius")
    })

    it("agrees with a direct orb calculation for every contact", () => {
        expect(result.contacts.length).toBeGreaterThan(5)
        for (const c of result.contacts) {
            const lonA = result.a.bodies[c.a] ?? 0
            const lonB = result.b.bodies[c.b] ?? 0
            const angle = {
                conjunction: 0,
                sextile: 60,
                square: 90,
                trine: 120,
                opposition: 180,
            }[c.type]
            expect(
                Math.abs(Math.abs(separation(lonA, lonB) - angle) - c.orb),
            ).toBeLessThan(0.01)
            expect(c.orb).toBeLessThanOrEqual(SYNASTRY_ORBS[c.type])
            expect(c.exact).toBe(c.orb <= 1)
        }
    })

    it("weights personal planets over outer ones and ranks the strongest first", () => {
        const weightOf = (b: string) =>
            ["sun", "moon", "mercury", "venus", "mars"].includes(b) ? 1 : 0.5
        for (const c of result.contacts) {
            expect(c.weight).toBe(weightOf(c.a) + weightOf(c.b))
        }
        const strength = (c: (typeof result.contacts)[number]) =>
            c.weight * (1 - c.orb / 8)
        for (let i = 1; i < result.contacts.length; i++) {
            const prev = result.contacts[i - 1],
                cur = result.contacts[i]
            if (prev && cur) {
                expect(strength(prev)).toBeGreaterThanOrEqual(strength(cur))
            }
        }
    })

    it("never pairs a planet with itself across the same chart", () => {
        for (const c of result.contacts) {
            expect(SYNASTRY_BODIES).toContain(c.a)
            expect(SYNASTRY_BODIES).toContain(c.b)
        }
    })

    it("places each Moon and Sun in the other person's houses", () => {
        expect(result.placements).toHaveLength(4)
        for (const p of result.placements) {
            expect(p.house).toBeGreaterThanOrEqual(1)
            expect(p.house).toBeLessThanOrEqual(12)
        }
        const moon = result.placements.find(
            (p) => p.of === "a" && p.body === Bodies.MOON,
        )
        const lon = result.a.bodies[Bodies.MOON] ?? 0
        expect(moon?.house).toBe(chart.houseOf(lon, result.b.cusps))
    })

    it("is symmetric: swapping the charts mirrors the contacts", () => {
        const swapped = synastry.compute(tomas, amara)
        expect(swapped.contacts).toHaveLength(result.contacts.length)
        for (const c of result.contacts) {
            expect(
                swapped.contacts.some(
                    (s) => s.a === c.b && s.b === c.a && s.type === c.type,
                ),
            ).toBe(true)
        }
    })
})

describe("SynastryReadingService", () => {
    const computed = synastry.compute(amara, tomas)
    const built = reading.build(
        computed,
        { id: "a", firstName: "Amara", name: "Amara Okonkwo" },
        { id: "b", firstName: "Tomás", name: "Tomás Silva" },
        "en",
    )

    it("names both people and the strongest contacts", () => {
        expect(built.a.firstName).toBe("Amara")
        expect(built.b.name).toBe("Tomás Silva")
        expect(built.top).toHaveLength(SYNASTRY_TOP)
        expect(built.top[0]?.text).toMatch(/^Amara's \w+ \w+ Tomás's \w+$/)
        expect(built.top[0]?.orbText).toMatch(/^orb \d+\.\d°$/)
    })

    it("builds four sections in order, each scored 1 to 5 with words and a basis", () => {
        expect(built.sections.map((s) => s.key)).toEqual(SYNASTRY_SECTION_ORDER)
        expect(built.sections.map((s) => s.numeral)).toEqual([
            "I",
            "II",
            "III",
            "IV",
        ])
        for (const s of built.sections) {
            expect(s.score).toBeGreaterThanOrEqual(1)
            expect(s.score).toBeLessThanOrEqual(5)
            expect(s.paragraphs.length).toBeGreaterThanOrEqual(1)
            expect(s.basis.length).toBeGreaterThanOrEqual(1)
            for (const p of s.paragraphs) {
                expect(p).not.toMatch(/\{\w+\}/)
                expect(p).not.toMatch(/[–—]/)
            }
        }
    })

    it("reads the Moon's and Sun's house placements", () => {
        const emotional = built.sections[0]
        const longTerm = built.sections[3]
        expect(
            emotional?.basis.some((b) => /Moon in \w+'s \w+ house/.test(b)),
        ).toBe(true)
        expect(
            longTerm?.basis.some((b) => /Sun in \w+'s \w+ house/.test(b)),
        ).toBe(true)
    })

    it("writes a basis line the way the plate does", () => {
        const withAspect = built.sections
            .flatMap((s) => s.basis)
            .find((b) => b.includes("orb"))
        expect(withAspect).toMatch(
            /^(Amara|Tomás) \w+ \d{2}°\d{2}′ \w+ [☌⚹□△☍] (Amara|Tomás) \w+ \d{2}°\d{2}′ \w+ · orb \d+°\d{2}′$/,
        )
    })

    it("summarises the gauge from personal contacts only", () => {
        const personal = computed.contacts.filter((c) => c.weight >= 1.5)
        const flow = personal.filter(
            (c) => c.kind === TransitTextGroups.FLOW,
        ).length
        const hard = personal.filter(
            (c) => c.kind === TransitTextGroups.TENSE,
        ).length
        const exact = personal.filter((c) => c.exact).length
        expect(built.score.detail).toBe(
            `${String(flow)} flowing · ${String(hard)} hard · ${String(exact)} exact`,
        )
        expect(built.score.value).toBeGreaterThanOrEqual(0.04)
        expect(built.score.value).toBeLessThanOrEqual(0.96)
        expect(built.score.word.length).toBeGreaterThan(3)
        expect(built.headline).toMatch(/^Amara and Tomás: .+, .+, and .+\.$/)
    })

    it("has a paragraph for every pair, in every group, in every section", () => {
        const sample = computed.contacts[0]
        if (!sample) {
            throw new Error("no contacts")
        }
        for (const key of SYNASTRY_SECTION_ORDER) {
            for (const pair of SYNASTRY_PAIRS[key]) {
                const [a, b] = pair.split("-") as [
                    typeof sample.a,
                    typeof sample.b,
                ]
                for (const type of Object.values(AspectTypes)) {
                    const fake = reading.build(
                        {
                            ...computed,
                            contacts: [
                                {
                                    ...sample,
                                    a,
                                    b,
                                    type,
                                    kind:
                                        type === "conjunction"
                                            ? "conjunction"
                                            : ["trine", "sextile"].includes(
                                                    type,
                                                )
                                              ? "flow"
                                              : "tense",
                                },
                            ],
                        },
                        { id: "a", firstName: "Amara", name: "Amara" },
                        { id: "b", firstName: "Tomás", name: "Tomás" },
                        "en",
                    )
                    const section = fake.sections.find((s) => s.key === key)
                    const para = section?.paragraphs[0] ?? ""
                    expect(para.length).toBeGreaterThan(80)
                    expect(para).toMatch(/Amara|Tomás/)
                }
            }
        }
    })

    it("falls back to the section's quiet paragraph when nothing is in aspect", () => {
        const empty = reading.build(
            { ...computed, contacts: [] },
            { id: "a", firstName: "Amara", name: "Amara" },
            { id: "b", firstName: "Tomás", name: "Tomás" },
            "en",
        )
        for (const s of empty.sections) {
            expect(s.score).toBe(2)
            expect(s.paragraphs[0]?.length ?? 0).toBeGreaterThan(80)
        }
        expect(empty.score.detail).toBe("0 flowing · 0 hard · 0 exact")
    })
})

describe("GET /profiles/:id/synastry/:otherId", () => {
    let cookie: string
    let idA: string
    let idB: string

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        const first = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        idA = (first.body as Record<string, string>).id ?? ""
        const second = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({
                ...profileData,
                firstName: "Tomas",
                birthDate: "1991-12-19",
                relationship: "partner",
            })
        idB = (second.body as Record<string, string>).id ?? ""
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("returns the comparison for two of the owner's profiles", async () => {
        const response = await request(app)
            .get(`/profiles/${idA}/synastry/${idB}`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(200)
        const body = response.body as SynastryResponse
        expect(body.a.firstName).toBe(profileData.firstName)
        expect(body.b.firstName).toBe("Tomas")
        expect(body.sections).toHaveLength(4)
        expect(body.labels.compare).toBe("Compare the charts")
        expect(body.contacts.length).toBeGreaterThan(0)
    })

    it("refuses to compare a profile with itself", async () => {
        const response = await request(app)
            .get(`/profiles/${idA}/synastry/${idA}`)
            .set("Cookie", [cookie])

        expect(response.statusCode).toBe(400)
    })

    it("hides other people's profiles", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            firstName: "Other",
            lastName: "Person",
            email: "other@example.com",
            password: "supersecret123",
        })
        const response = await request(app)
            .get(`/profiles/${idA}/synastry/${idB}`)
            .set("Cookie", [otherCookie])

        expect(response.statusCode).toBe(404)
    })

    it("requires a session", async () => {
        const response = await request(app).get(
            `/profiles/${idA}/synastry/${idB}`,
        )
        expect(response.statusCode).toBe(401)
    })
})
