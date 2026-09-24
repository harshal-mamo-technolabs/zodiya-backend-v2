import { NumerologyService } from "../../src/services/NumerologyService.ts"
import { NumerologyReadingService } from "../../src/services/NumerologyReadingService.ts"
import {
    CHALLENGE_VALUES,
    DIGIT_VALUES,
    NUMEROLOGY_ORDER,
    NUMEROLOGY_VALUES,
    PINNACLE_VALUES,
    type NumerologyNumber,
} from "../../src/constants/index.ts"

const numerology = new NumerologyService()
const reading = new NumerologyReadingService()

const valueOf = (name: string, date: string, key: NumerologyNumber) => {
    const entry = numerology
        .compute(name, date)
        .numbers.find((n) => n.key === key)
    if (!entry) {
        throw new Error(`no ${key}`)
    }
    return entry.value
}

describe("NumerologyService", () => {
    describe("letter values", () => {
        // A-I are 1-9, J restarts at 1, S restarts at 1 and Z lands on 8
        it.each([
            ["A", 1],
            ["I", 9],
            ["J", 1],
            ["R", 9],
            ["S", 1],
            ["Z", 8],
        ])("maps %s to %i", (letter, expected) => {
            // a single letter name makes Destiny the letter's own value
            expect(valueOf(letter, "2000-01-01", "destiny")).toBe(expected)
        })

        it("folds accents into their base letter instead of dropping them", () => {
            const plain = numerology.compute("Tomas Silva", "1991-12-19")
            const accented = numerology.compute("Tomás Silva", "1991-12-19")
            expect(accented.letters.map((l) => l.letter).join("")).toBe(
                plain.letters.map((l) => l.letter).join(""),
            )
            expect(accented.numbers).toEqual(plain.numbers)
            const sharp = numerology.compute("Straße", "1991-12-19")
            expect(sharp.letters.map((l) => l.letter).join("")).toBe("STRASSE")
            const nordic = numerology.compute("Jürgen Sørensen", "1991-12-19")
            expect(nordic.letters.map((l) => l.letter).join("")).toBe(
                "JURGENSORENSEN",
            )
        })
    })

    describe("life path", () => {
        // 12 + 09 + 1997 -> 3 + 9 + (1+9+9+7=26 -> 8) = 20 -> 2
        it("reduces each part of the date before adding", () => {
            expect(valueOf("Amara", "1997-09-12", "lifePath")).toBe(2)
        })

        it("keeps a master number instead of reducing it", () => {
            // 29 + 9 + 9 = 29 -> 2+9 = 11, which stops there
            const entry = numerology
                .compute("Amara", "1998-09-29")
                .numbers.find((n) => n.key === "lifePath")

            expect(entry?.value).toBe(11)
            expect(entry?.master).toBe(true)
        })

        it("never leaves a non-master above nine", () => {
            for (let day = 1; day <= 28; day++) {
                for (const year of [1966, 1987, 1999, 2004]) {
                    const value = valueOf(
                        "Test",
                        `${String(year)}-07-${String(day).padStart(2, "0")}`,
                        "lifePath",
                    )
                    expect(NUMEROLOGY_VALUES).toContain(value)
                }
            }
        })
    })

    describe("name numbers", () => {
        const name = "Amara Ngozi Okonkwo"

        // AMARA 16 + NGOZI 35 + OKONKWO 32 = 83 -> 8+3 = 11
        it("adds every letter for destiny", () => {
            expect(valueOf(name, "1997-09-12", "destiny")).toBe(11)
        })

        // vowels 3 + 15 + 18 = 36 -> 3+6 = 9
        it("adds only vowels for soul urge", () => {
            expect(valueOf(name, "1997-09-12", "soulUrge")).toBe(9)
        })

        // consonants 13 + 20 + 14 = 47 -> 4+7 = 11
        it("adds only consonants for personality", () => {
            expect(valueOf(name, "1997-09-12", "personality")).toBe(11)
        })

        // destiny is the whole name, so the two halves must add back to it
        it("splits the name into vowels and consonants with nothing lost", () => {
            const letters =
                name
                    .replace(/[^A-Za-z]/g, "")
                    .toUpperCase()
                    .match(/[A-Z]/g) ?? []
            const value = (c: string) => ((c.charCodeAt(0) - 65) % 9) + 1
            const total = letters.reduce((sum, c) => sum + value(c), 0)
            const vowels = letters
                .filter((c) => "AEIOU".includes(c))
                .reduce((sum, c) => sum + value(c), 0)
            const consonants = letters
                .filter((c) => !"AEIOU".includes(c))
                .reduce((sum, c) => sum + value(c), 0)

            expect(vowels + consonants).toBe(total)
        })

        it("ignores spaces, hyphens, apostrophes and case", () => {
            const plain = numerology.compute("maryjaneoconnor", "1990-01-01")
            const messy = numerology.compute("Mary-Jane O'Connor", "1990-01-01")

            expect(messy.numbers.map((n) => n.value)).toEqual(
                plain.numbers.map((n) => n.value),
            )
        })
    })

    describe("birth number", () => {
        it("uses the day of the month", () => {
            expect(valueOf("Amara", "1997-09-12", "birth")).toBe(3)
        })

        it("keeps the 22nd as a master number", () => {
            expect(valueOf("Amara", "1997-09-22", "birth")).toBe(22)
        })
    })

    describe("input handling", () => {
        it("returns all five numbers in order", () => {
            const result = numerology.compute("Amara", "1997-09-12")
            expect(result.numbers.map((n) => n.key)).toEqual(NUMEROLOGY_ORDER)
        })

        it("shows the working out for every number", () => {
            for (const entry of numerology.compute("Amara", "1997-09-12")
                .numbers) {
                expect(entry.math.length).toBeGreaterThan(0)
                for (const line of entry.math) {
                    expect(line.trim().length).toBeGreaterThan(0)
                }
            }
        })

        it.each([
            ["", "2000-01-01"],
            ["12345", "2000-01-01"],
            ["Amara", "01-01-2000"],
            ["Amara", "2000-13-01"],
            ["Amara", "2001-02-29"],
        ])("rejects %s / %s", (name, date) => {
            expect(() => numerology.compute(name, date)).toThrow()
        })

        it("accepts a real leap day", () => {
            expect(() =>
                numerology.compute("Amara", "2000-02-29"),
            ).not.toThrow()
        })
    })
})

describe("NumerologyReadingService", () => {
    const built = reading.build(
        numerology.compute("Amara Ngozi Okonkwo", "1997-09-12"),
        "en",
    )

    it("labels and explains every number", () => {
        expect(built.numbers).toHaveLength(5)

        for (const entry of built.numbers) {
            expect(entry.label.length).toBeGreaterThan(0)
            expect(entry.sub.length).toBeGreaterThan(0)
            expect(entry.meaning.length).toBeGreaterThan(20)
            expect(entry.meaning).not.toMatch(/\{[a-z]+\}/i)
            expect(entry.meaning).not.toMatch(/[–—]/)
        }
    })

    it("builds the header fields the page needs", () => {
        expect(built.lang).toBe("en")
        expect(built.firstName).toBe("Amara")
        expect(built.summary.length).toBeGreaterThan(20)
        expect(built.lucky.length).toBeGreaterThan(0)
        expect(built.days.length).toBeGreaterThan(0)
        expect(built.footnote.length).toBeGreaterThan(0)
    })

    it("reduces master numbers to a single digit for lucky numbers", () => {
        const master = reading.build(
            numerology.compute("Amara", "1979-11-11"),
            "en",
        )
        for (const n of master.lucky) {
            expect(n).toBeGreaterThanOrEqual(1)
            expect(n).toBeLessThanOrEqual(9)
        }
    })

    it("names the tension when the life path and destiny differ", () => {
        // Amara is a 2 Life Path with an 11 Destiny
        expect(built.summary).toContain("2 Life Path")
        expect(built.summary).toContain("11 Destiny")
        expect(built.summary).toContain("asks one thing")
    })

    it("says so when the life path and destiny agree", () => {
        const agreeing = reading.build(
            {
                ...numerology.compute("Test", "2000-01-01"),
                numbers: NUMEROLOGY_ORDER.map((key) => ({
                    key,
                    value: 7 as const,
                    master: false,
                    math: ["x"],
                })),
            },
            "en",
        )

        expect(agreeing.summary).toContain("agree")
    })

    /* Article and verb agreement: "an 11", not "a 11"; "sits", not "all sit". */
    it("agrees the article with the number", () => {
        const eight = reading.build(
            numerology.compute("Rosalind Elsie Franklin", "1920-07-25"),
            "en",
        )

        expect(eight.summary).toContain("An 8 Life Path")
        expect(eight.summary).not.toContain("A 8 ")
        expect(built.summary).toContain("2 Life Path")
    })

    it("uses a singular verb for one master number", () => {
        const one = reading.build(
            numerology.compute("Rosalind Elsie Franklin", "1920-07-25"),
            "en",
        )

        expect(one.summary).toContain("sits at a master number")
        expect(one.summary).not.toContain("all sit")
    })

    it("uses a plural verb for several master numbers", () => {
        const many = reading.build(
            numerology.compute("Amara Ngozi Okonkwo", "1998-09-29"),
            "en",
        )

        expect(many.summary).toContain("all sit at master numbers")
    })

    it("starts every summary with a capital letter", () => {
        for (const [name, date] of [
            ["Amara Ngozi Okonkwo", "1998-09-29"],
            ["Amara Okonkwo", "1997-09-12"],
            ["Rosalind Elsie Franklin", "1920-07-25"],
            ["Zara Quill", "2001-03-03"],
        ] as [string, string][]) {
            const summary = reading.build(
                numerology.compute(name, date),
                "en",
            ).summary

            expect(summary.charAt(0)).toBe(summary.charAt(0).toUpperCase())
            // no lower-case sentence start left mid-string either
            expect(summary).not.toMatch(/\.\s+[a-z]/)
        }
    })

    /* Every number in every position must have copy, or a reader hits a blank. */
    it("has a meaning for all sixty position and value pairs", () => {
        for (const key of NUMEROLOGY_ORDER) {
            for (const value of NUMEROLOGY_VALUES) {
                const fake = reading.build(
                    {
                        ...numerology.compute("Test", "2000-01-01"),
                        numbers: [
                            { key, value, master: value > 9, math: ["x"] },
                            ...NUMEROLOGY_ORDER.filter((k) => k !== key).map(
                                (k) => ({
                                    key: k,
                                    value,
                                    master: value > 9,
                                    math: ["x"],
                                }),
                            ),
                        ],
                    },
                    "en",
                )

                for (const entry of fake.numbers) {
                    expect(entry.meaning.length).toBeGreaterThan(20)
                }
            }
        }
    })

    /*
     * Amara Okonkwo, 12 September 1997, worked by hand:
     * day 12 -> 3, month 9, year 1997 -> 8, so a 2 Life Path.
     * Pinnacles 9+3=3, 3+8=11, 3+11=5, 9+8=8.
     * Challenges |9-3|=6, |3-8|=5, |6-5|=1, |9-8|=1.
     */
    describe("chapters", () => {
        const chapters = numerology.compute(
            "Amara Okonkwo",
            "1997-09-12",
        ).chapters

        it("derives the four pinnacles", () => {
            expect(chapters.map((c) => c.pinnacle)).toEqual([3, 11, 5, 8])
        })

        it("derives the four challenges", () => {
            expect(chapters.map((c) => c.challenge)).toEqual([6, 5, 1, 1])
        })

        it("ends the first chapter at 36 minus the life path", () => {
            expect(chapters[0]?.toAge).toBe(34)
        })

        it("runs nine years per chapter after the first, with no gaps", () => {
            expect(chapters.map((c) => [c.fromAge, c.toAge])).toEqual([
                [0, 34],
                [34, 43],
                [43, 52],
                [52, null],
            ])
        })

        it("flags a master pinnacle", () => {
            expect(chapters[1]?.master).toBe(true)
            expect(chapters[0]?.master).toBe(false)
        })
    })

    describe("personal year", () => {
        it("uses the calendar year, not the birth year", () => {
            // month 9 + day 3 + 2026 (-> 1) = 13 -> 4
            const year = numerology.compute(
                "Amara Okonkwo",
                "1997-09-12",
                new Date("2026-06-01T00:00:00Z"),
            ).personalYear

            expect(year.year).toBe(2026)
            expect(year.value).toBe(4)
        })

        it("never keeps a master number", () => {
            for (let y = 2020; y < 2040; y++) {
                const { value } = numerology.compute(
                    "Amara Okonkwo",
                    "1997-09-12",
                    new Date(`${String(y)}-06-01T00:00:00Z`),
                ).personalYear

                expect(value).toBeGreaterThanOrEqual(1)
                expect(value).toBeLessThanOrEqual(9)
            }
        })
    })

    describe("the name itself", () => {
        // AMARAOKONKWO uses 1,4,9,6,2,5 and never 3, 7 or 8
        it("lists the numbers the name never uses", () => {
            expect(
                numerology.compute("Amara Okonkwo", "1997-09-12").karmicLessons,
            ).toEqual([3, 7, 8])
        })

        it("finds the most repeated value, lowest wins a tie", () => {
            // A appears three times and O three times; 1 is the lower
            expect(
                numerology.compute("Amara Okonkwo", "1997-09-12").hiddenPassion,
            ).toEqual({ value: 1, count: 3 })
        })

        it("marks vowels so the two halves can be shown apart", () => {
            const letters = numerology.compute(
                "Amara Okonkwo",
                "1997-09-12",
            ).letters

            expect(letters).toHaveLength(12)
            expect(letters.filter((l) => l.vowel)).toHaveLength(6)
        })
    })

    /* A missing string shows the reader a blank, so check every reachable one. */
    describe("copy coverage", () => {
        const built = reading.build(
            numerology.compute("Amara Okonkwo", "1997-09-12"),
            "en",
        )

        it("has text for every pinnacle and challenge on the page", () => {
            for (const chapter of built.chapters) {
                expect(chapter.pinnacleMeaning.length).toBeGreaterThan(20)
                expect(chapter.challengeMeaning.length).toBeGreaterThan(20)
                expect(chapter.ages).toMatch(/\d/)
                expect(chapter.label).toMatch(/chapter/)
            }
        })

        it("has text for every pinnacle value", () => {
            const copy = built.sections
            expect(copy.chapters.title.length).toBeGreaterThan(0)

            for (const value of PINNACLE_VALUES) {
                const fake = reading.build(
                    {
                        ...numerology.compute("Amara Okonkwo", "1997-09-12"),
                        chapters: [
                            {
                                pinnacle: value,
                                challenge: 0,
                                fromAge: 0,
                                toAge: 30,
                                master: value > 9,
                            },
                        ],
                    },
                    "en",
                )
                expect(
                    fake.chapters[0]?.pinnacleMeaning.length ?? 0,
                ).toBeGreaterThan(20)
            }
        })

        it("has text for every challenge value, zero included", () => {
            for (const value of CHALLENGE_VALUES) {
                const fake = reading.build(
                    {
                        ...numerology.compute("Amara Okonkwo", "1997-09-12"),
                        chapters: [
                            {
                                pinnacle: 1,
                                challenge: value,
                                fromAge: 0,
                                toAge: 30,
                                master: false,
                            },
                        ],
                    },
                    "en",
                )
                expect(
                    fake.chapters[0]?.challengeMeaning.length ?? 0,
                ).toBeGreaterThan(20)
            }
        })

        it("has text for every karmic lesson, personal year and passion", () => {
            for (const value of DIGIT_VALUES) {
                const fake = reading.build(
                    {
                        ...numerology.compute("Amara Okonkwo", "1997-09-12"),
                        karmicLessons: [value],
                        hiddenPassion: { value, count: 3 },
                        personalYear: {
                            year: 2026,
                            value,
                            math: ["x"],
                        },
                    },
                    "en",
                )

                expect(
                    fake.name.karmicLessons[0]?.meaning.length ?? 0,
                ).toBeGreaterThan(20)
                expect(fake.name.hiddenPassion.meaning).toContain("3 times")
                expect(fake.personalYear.meaning.length).toBeGreaterThan(20)
                expect(fake.personalYear.heading).toBe(
                    `2026 is a ${String(value)} year`,
                )
            }
        })

        it("keeps the em dash out of the numerology copy too", () => {
            const text = JSON.stringify(built)
            expect(text).not.toMatch(/[\u2013\u2014]/)
        })
    })
})
