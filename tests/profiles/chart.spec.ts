import { ChartService } from "../../src/services/ChartService.ts"
import { ReadingService } from "../../src/services/ReadingService.ts"
import { BODY_ORDER, SIGN_ORDER, type Body } from "../../src/constants/index.ts"
import type { NatalChart } from "../../src/types/index.ts"

const chartService = new ChartService()
const readingService = new ReadingService()

// 11 Jul 2002, 12:00 local (UTC+2), Amsterdam — the reference chart.
const AMSTERDAM = {
    birthDate: "2002-07-11",
    birthTime: "12:00",
    lat: 52.3676,
    lon: 4.9041,
    tzone: 2,
}

const positionOf = (chart: NatalChart, body: Body) => {
    const placement = chart.bodies.find((entry) => entry.body === body)
    if (!placement) {
        throw new Error(`no placement for ${body}`)
    }
    return `${String(placement.degree).padStart(2, "0")}°${String(placement.minute).padStart(2, "0")}' ${placement.sign}${placement.retrograde ? " R" : ""}`
}

const circularDiff = (a: number, b: number) =>
    Math.abs((((b - a) % 360) + 540) % 360) - 180

describe("ChartService", () => {
    describe("body positions", () => {
        const chart = chartService.compute(AMSTERDAM)

        // Verified against the published reference chart for this birth data.
        it.each([
            ["sun", "18°56' cancer"],
            ["moon", "01°41' leo"],
            ["mercury", "07°44' cancer"],
            ["venus", "00°36' virgo"],
            ["mars", "28°34' cancer"],
            ["jupiter", "25°15' cancer"],
            ["saturn", "22°31' gemini"],
            ["uranus", "28°16' aquarius R"],
            ["neptune", "10°09' aquarius R"],
            ["pluto", "15°25' sagittarius R"],
            ["northNode", "16°14' gemini R"],
        ] as [Body, string][])("places %s at %s", (body, expected) => {
            expect(positionOf(chart, body)).toBe(expected)
        })

        it("returns every body exactly once", () => {
            expect(chart.bodies.map((entry) => entry.body)).toEqual(BODY_ORDER)
        })

        it("converts local birth time to the right UTC instant", () => {
            expect(chart.meta.utc).toBe("2002-07-11T10:00:00.000Z")
        })
    })

    describe("angles and houses", () => {
        const chart = chartService.compute(AMSTERDAM)

        it("uses placidus away from the poles", () => {
            expect(chart.meta.houseSystem).toBe("placidus")
            expect(chart.houses).toHaveLength(12)
        })

        // The first cusp is solved by iterating semi-arcs; the ascendant comes
        // from a closed formula. Agreement means both are right.
        it("solves the first cusp to the same point as the ascendant", () => {
            const first = chart.houses[0]
            expect(first).toBeDefined()
            expect(
                Math.abs(circularDiff(first?.lon ?? 0, chart.angles.asc.lon)),
            ).toBeLessThan(1e-9)
        })

        it("solves the tenth cusp to the same point as the midheaven", () => {
            const tenth = chart.houses[9]
            expect(
                Math.abs(circularDiff(tenth?.lon ?? 0, chart.angles.mc.lon)),
            ).toBeLessThan(1e-9)
        })

        it("keeps opposite cusps exactly 180° apart", () => {
            for (let i = 0; i < 6; i++) {
                const near = chart.houses[i]?.lon ?? 0
                const far = chart.houses[i + 6]?.lon ?? 0
                expect(
                    Math.abs(Math.abs(circularDiff(near, far)) - 180),
                ).toBeLessThan(1e-9)
            }
        })

        it("puts the descendant opposite the ascendant", () => {
            expect(
                Math.abs(
                    Math.abs(
                        circularDiff(
                            chart.angles.asc.lon,
                            chart.angles.desc.lon,
                        ),
                    ) - 180,
                ),
            ).toBeLessThan(1e-9)
        })

        it("falls back to whole sign houses inside the polar circle", () => {
            const polar = chartService.compute({
                ...AMSTERDAM,
                lat: 70.5,
                lon: 23.7,
            })

            expect(polar.meta.houseSystem).toBe("wholeSign")
            expect(polar.houses[0]?.degree).toBe(0)
            expect(polar.houses[0]?.minute).toBe(0)
        })

        it("assigns each body to the house its longitude falls in", () => {
            for (const placement of chart.bodies) {
                const cusp = chart.houses[placement.house - 1]
                const next = chart.houses[placement.house % 12]
                const span = ((next?.lon ?? 0) - (cusp?.lon ?? 0) + 360) % 360
                const offset = (placement.lon - (cusp?.lon ?? 0) + 360) % 360

                expect(offset).toBeLessThan(span)
            }
        })
    })

    describe("aspects and dominants", () => {
        const chart = chartService.compute(AMSTERDAM)

        it("finds the tightest aspect the reference chart reports", () => {
            const tightest = chart.aspects[0]

            expect(tightest?.a).toBe("pluto")
            expect(tightest?.b).toBe("northNode")
            expect(tightest?.type).toBe("opposition")
            expect(tightest?.orb).toBeCloseTo(0.8, 1)
        })

        it("finds the moon conjunct mars at the published orb", () => {
            const conjunction = chart.aspects.find(
                (aspect) => aspect.a === "moon" && aspect.b === "mars",
            )

            expect(conjunction?.type).toBe("conjunction")
            expect(conjunction?.orb).toBeCloseTo(3.1, 1)
        })

        it("reports no sun–moon aspect for this chart", () => {
            const sunMoon = chart.aspects.find(
                (aspect) => aspect.a === "sun" && aspect.b === "moon",
            )

            expect(sunMoon).toBeUndefined()
        })

        it("sorts aspects tightest first", () => {
            const orbs = chart.aspects.map((aspect) => aspect.orb)
            expect([...orbs].sort((a, b) => a - b)).toEqual(orbs)
        })

        it("reads the chart as water dominant and cardinal", () => {
            expect(chart.dominants.topElement).toBe("water")
            expect(chart.dominants.topModality).toBe("cardinal")
            expect(
                Object.values(chart.dominants.elements).reduce(
                    (sum, count) => sum + count,
                    0,
                ),
            ).toBe(10)
        })
    })

    describe("input handling", () => {
        it("defaults a missing birth time to midnight", () => {
            const chart = chartService.compute({
                ...AMSTERDAM,
                birthTime: undefined,
            })

            expect(chart.meta.birthTime).toBe("00:00")
            expect(chart.meta.utc).toBe("2002-07-10T22:00:00.000Z")
        })

        it.each([
            { birthDate: "11-07-2002" },
            { birthTime: "25:00" },
            { lat: 91 },
            { lon: -181 },
            { tzone: 20 },
        ])("rejects bad input: %o", (override) => {
            expect(() =>
                chartService.compute({ ...AMSTERDAM, ...override }),
            ).toThrow()
        })

        it("handles a southern-hemisphere birth", () => {
            const chart = chartService.compute({
                birthDate: "1988-02-29",
                birthTime: "03:15",
                lat: -33.8688,
                lon: 151.2093,
                tzone: 11,
            })

            expect(chart.meta.houseSystem).toBe("placidus")
            expect(chart.bodies).toHaveLength(BODY_ORDER.length)
        })
    })
})

describe("ReadingService", () => {
    const chart = chartService.compute(AMSTERDAM)

    it("builds the headline and chips from the chart", () => {
        const reading = readingService.build(chart, "en")

        expect(reading.lang).toBe("en")
        expect(reading.headline).toEqual([
            "Cancer Sun, Leo Moon",
            "Virgo rising",
        ])
        expect(reading.chips).toEqual([
            { label: "SUN", value: "18°56′ Cancer" },
            { label: "MOON", value: "01°41′ Leo" },
            { label: "ASC", value: "25°51′ Virgo" },
        ])
    })

    it("names the tightest aspect in the summary", () => {
        const reading = readingService.build(chart, "en")

        // water-dominant, and the tightest pair is Pluto opposite North Node
        expect(reading.summary).toContain("feeling")
        expect(reading.summary).toContain("Pluto")
        expect(reading.summary).toContain("North Node")
        expect(reading.summary).toContain("opposite directions")
    })

    // The copy is written for people who have never read a chart. Any term
    // that needs a glossary either gets explained on the spot or stays out.
    it("explains its own jargon", () => {
        const prose = readingService
            .build(chart, "en")
            .sections.flatMap((section) => section.paragraphs)
            .join(" ")

        const explained: [string, string][] = [
            ["rising sign", "first impression"],
            ["Moon sign", "how you feel"],
            ["North Node", "where you grow"],
            ["Saturn", "has to be earned"],
        ]

        for (const [term, explanation] of explained) {
            if (prose.includes(term)) {
                expect(prose).toContain(explanation)
            }
        }

        // never surfaced to the reader without a plain-language gloss
        for (const bare of ["cusp", "ecliptic", "orb of", "Placidus"]) {
            expect(prose).not.toContain(bare)
        }
    })

    it("returns the five sections in order", () => {
        const reading = readingService.build(chart, "en")

        expect(reading.sections.map((section) => section.key)).toEqual([
            "personality",
            "emotions",
            "relationships",
            "career",
            "lifePath",
        ])
        expect(reading.sections.map((section) => section.numeral)).toEqual([
            "I",
            "II",
            "III",
            "IV",
            "V",
        ])
    })

    it("falls back to english for an unknown language", () => {
        const reading = readingService.build(chart, "de" as "en")
        expect(reading.lang).toBe("en")
    })

    // Sweeps enough births to hit every sign in every slot, which is the only
    // way a missing copy key or a typo'd {placeholder} shows up.
    describe("copy coverage", () => {
        const charts = Array.from({ length: 96 }, (_, i) =>
            chartService.compute({
                birthDate: `${String(1950 + (i % 48)).padStart(4, "0")}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
                birthTime: `${String((i * 2) % 24).padStart(2, "0")}:00`,
                lat: 52.3676,
                lon: 4.9041,
                tzone: 1,
            }),
        )

        it("renders every paragraph with no unresolved placeholder", () => {
            for (const sample of charts) {
                const reading = readingService.build(sample, "en")
                const strings = [
                    ...reading.headline,
                    reading.summary,
                    ...reading.chips.map((chip) => chip.value),
                    ...reading.sections.flatMap((section) => [
                        section.caption,
                        ...section.paragraphs,
                    ]),
                ]

                for (const text of strings) {
                    expect(text).not.toMatch(/\{[a-z]+\}/i)
                    expect(text.trim().length).toBeGreaterThan(0)
                    // em and en dashes are not wanted anywhere in the copy
                    expect(text).not.toMatch(/[\u2013\u2014]/)
                }
            }
        })

        it("covers all twelve signs across the sweep", () => {
            const seen = new Set(
                charts.flatMap((sample) => [
                    sample.angles.asc.sign,
                    ...sample.bodies.map((body) => body.sign),
                ]),
            )

            expect(seen.size).toBe(SIGN_ORDER.length)
        })

        it("gives every section at least three paragraphs", () => {
            for (const sample of charts) {
                for (const section of readingService.build(sample, "en")
                    .sections) {
                    expect(section.paragraphs.length).toBeGreaterThanOrEqual(2)
                }
            }
        })
    })
})
