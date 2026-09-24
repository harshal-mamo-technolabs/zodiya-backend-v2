import createHttpError from "http-errors"
import {
    CHAPTER_LENGTH,
    DIGIT_VALUES,
    FIRST_CHAPTER_BASE,
    MASTER_NUMBERS,
    NumerologyNumbers,
    NUMEROLOGY_ORDER,
    PINNACLE_VALUES,
    type ChallengeValue,
    type DigitValue,
    type NumerologyNumber,
    type NumerologyValue,
    type PinnacleValue,
} from "../constants/index.ts"
import type {
    NumerologyChapter,
    NumerologyReading,
    NumerologyStep,
} from "../types/index.ts"

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
/** Y is counted as a consonant throughout, the common Pythagorean convention. */
const VOWELS = "AEIOU"

/** Pythagorean: A–I are 1–9, then the alphabet repeats. */
const letterValue = (letter: string) =>
    ((letter.toUpperCase().charCodeAt(0) - 65) % 9) + 1

const isMaster = (n: number): boolean =>
    (MASTER_NUMBERS as readonly number[]).includes(n)

const digits = (n: number) => String(n).split("").map(Number)

const digitSum = (n: number) =>
    digits(n).reduce((total, digit) => total + digit, 0)

export class NumerologyService {
    /** `today` is a parameter so the personal year is testable. */
    compute(
        name: string,
        birthDate: string,
        today: Date = new Date(),
    ): NumerologyReading {
        const letters = this.assertName(name)
        const { day, month, year } = this.assertDate(birthDate)

        // each part of the date is reduced before they are added together
        const dayPart = this.reduce(day)
        const monthPart = this.reduce(month)
        const yearPart = this.reduce(year)

        const values = letters.map(letterValue)
        const vowels = letters.filter((l) => VOWELS.includes(l.toUpperCase()))
        const consonants = letters.filter(
            (l) => !VOWELS.includes(l.toUpperCase()),
        )

        const sum = (list: number[]) =>
            list.reduce((total, value) => total + value, 0)

        const lifePath = this.reduce(
            dayPart.value + monthPart.value + yearPart.value,
        ).value

        return {
            input: { name: name.trim(), birthDate },
            letters: letters.map((letter) => ({
                letter: letter.toUpperCase(),
                value: letterValue(letter) as DigitValue,
                vowel: VOWELS.includes(letter.toUpperCase()),
            })),
            // pinnacles and the personal year run on fully reduced parts: a 29th
            // counts as 2 here, not as the 11 the Birth number keeps
            personalYear: this.personalYear(
                this.toDigit(month),
                this.toDigit(day),
                today,
            ),
            chapters: this.chapters(
                this.toDigit(month),
                this.toDigit(day),
                this.toDigit(year),
                lifePath,
            ),
            karmicLessons: this.karmicLessons(values),
            hiddenPassion: this.hiddenPassion(values),
            numbers: [
                this.entry(
                    NumerologyNumbers.LIFE_PATH,
                    dayPart.value + monthPart.value + yearPart.value,
                    [
                        `Day ${String(day)} = ${String(dayPart.value)}`,
                        `Month ${String(month)} = ${String(monthPart.value)}`,
                        `Year ${digits(year).join(" + ")} = ${String(digitSum(year))}${
                            yearPart.value === digitSum(year)
                                ? ""
                                : ` = ${String(yearPart.value)}`
                        }`,
                        `${String(dayPart.value)} + ${String(monthPart.value)} + ${String(yearPart.value)} = ${String(
                            dayPart.value + monthPart.value + yearPart.value,
                        )}`,
                    ],
                ),
                this.entry(NumerologyNumbers.BIRTH, day, [
                    `Born on the ${String(day)}`,
                ]),
                this.entry(NumerologyNumbers.DESTINY, sum(values), [
                    this.spell(letters, values),
                    `= ${String(sum(values))}`,
                ]),
                this.entry(
                    NumerologyNumbers.SOUL_URGE,
                    sum(vowels.map(letterValue)),
                    [
                        `Vowels only: ${this.spell(vowels, vowels.map(letterValue))}`,
                        `= ${String(sum(vowels.map(letterValue)))}`,
                    ],
                ),
                this.entry(
                    NumerologyNumbers.PERSONALITY,
                    sum(consonants.map(letterValue)),
                    [
                        `Consonants only: ${this.spell(consonants, consonants.map(letterValue))}`,
                        `= ${String(sum(consonants.map(letterValue)))}`,
                    ],
                ),
            ],
        }
    }

    // ------------------------------------------------------------- derived

    /**
     * The year you are in right now, from your birth month and day plus the
     * calendar year. Unlike the core five this always lands on 1 to 9: a
     * personal year is a position in a nine year cycle, not a character trait.
     */
    private personalYear(month: number, day: number, today: Date) {
        const year = today.getFullYear()
        const yearDigit = this.toDigit(year)
        const total = month + day + yearDigit

        return {
            year,
            value: this.toDigit(total),
            math: [
                `Month ${String(month)} + day ${String(day)} + ${String(year)} (${digits(year).join(" + ")} = ${String(yearDigit)})`,
                `${String(month)} + ${String(day)} + ${String(yearDigit)} = ${String(total)}`,
                ...(total > 9
                    ? [
                          `${String(total)} = ${digits(total).join(" + ")} = ${String(this.toDigit(total))}`,
                      ]
                    : []),
            ],
        }
    }

    /**
     * Four pinnacles with the challenge that runs alongside each. The first
     * chapter ends at 36 minus the Life Path; every later one lasts nine years.
     */
    private chapters(
        month: number,
        day: number,
        year: number,
        lifePath: number,
    ): NumerologyChapter[] {
        const pinnacles = [
            this.reduce(month + day).value,
            this.reduce(day + year).value,
            0,
            this.reduce(month + year).value,
        ]
        pinnacles[2] = this.reduce(
            (pinnacles[0] ?? 0) + (pinnacles[1] ?? 0),
        ).value

        const challenges = [
            Math.abs(month - day),
            Math.abs(day - year),
            0,
            Math.abs(month - year),
        ]
        challenges[2] = Math.abs((challenges[0] ?? 0) - (challenges[1] ?? 0))

        const firstEnd = FIRST_CHAPTER_BASE - this.toDigit(lifePath)

        return pinnacles.map((pinnacle, index) => {
            const fromAge =
                index === 0 ? 0 : firstEnd + (index - 1) * CHAPTER_LENGTH

            return {
                pinnacle: this.asPinnacle(pinnacle),
                challenge: this.asChallenge(challenges[index] ?? 0),
                fromAge,
                toAge:
                    index === 3
                        ? null
                        : fromAge + (index === 0 ? firstEnd : CHAPTER_LENGTH),
                master: isMaster(pinnacle),
            }
        })
    }

    /** The values from 1 to 9 that no letter of the name supplies. */
    private karmicLessons(values: number[]): DigitValue[] {
        const present = new Set(values)
        return DIGIT_VALUES.filter((value) => !present.has(value))
    }

    /** The value the name repeats most; ties go to the lower number. */
    private hiddenPassion(values: number[]) {
        const counts = new Map<number, number>()
        for (const value of values) {
            counts.set(value, (counts.get(value) ?? 0) + 1)
        }

        let best = 1
        let bestCount = 0
        for (const value of DIGIT_VALUES) {
            const count = counts.get(value) ?? 0
            if (count > bestCount) {
                best = value
                bestCount = count
            }
        }

        return { value: best as DigitValue, count: bestCount }
    }

    // --------------------------------------------------------------- input

    private assertName(name: string): string[] {
        // "Tomás" counts as TOMAS and "Straße" as STRASSE: accents fold into
        // their base letter, the few letters with no base get their usual spelling
        const folded = name
            .replace(/ß/g, "ss")
            .replace(/æ/gi, "ae")
            .replace(/œ/gi, "oe")
            .replace(/ø/gi, "o")
            .replace(/đ/gi, "d")
            .replace(/ł/gi, "l")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        const letters = folded.replace(/[^A-Za-z]/g, "").split("")

        if (letters.length === 0) {
            throw createHttpError(
                422,
                "Name must contain at least one letter A to Z",
            )
        }

        return letters
    }

    private assertDate(birthDate: string) {
        const match = DATE_PATTERN.exec(birthDate)

        if (!match) {
            throw createHttpError(422, "Birth date must be YYYY-MM-DD")
        }

        const [year, month, day] = match.slice(1).map(Number) as [
            number,
            number,
            number,
        ]

        // rejects 31 February as well as month 13
        const asDate = new Date(Date.UTC(year, month - 1, day))
        const real =
            asDate.getUTCFullYear() === year &&
            asDate.getUTCMonth() === month - 1 &&
            asDate.getUTCDate() === day

        if (!real || year < 1000) {
            throw createHttpError(422, "Birth date is not a real date")
        }

        return { day, month, year }
    }

    // ----------------------------------------------------------- reduction

    /** Collapses to a single digit, stopping at a master number. */
    private reduce(start: number): { value: number; steps: string[] } {
        const steps: string[] = []
        let value = start

        while (value > 9 && !isMaster(value)) {
            const next = digitSum(value)
            steps.push(
                `${String(value)} = ${digits(value).join(" + ")} = ${String(next)}`,
            )
            value = next
        }

        return { value, steps }
    }

    /** Collapses all the way to 1 to 9, master numbers included. */
    private toDigit(start: number): DigitValue {
        let value = start
        while (value > 9) {
            value = digitSum(value)
        }
        return value as DigitValue
    }

    private asPinnacle(value: number): PinnacleValue {
        if (!(PINNACLE_VALUES as readonly number[]).includes(value)) {
            throw new Error(`Pinnacle out of range: ${String(value)}`)
        }
        return value as PinnacleValue
    }

    private asChallenge(value: number): ChallengeValue {
        if (value < 0 || value > 8) {
            throw new Error(`Challenge out of range: ${String(value)}`)
        }
        return value as ChallengeValue
    }

    private entry(
        key: NumerologyNumber,
        raw: number,
        workingOut: string[],
    ): NumerologyStep {
        const { value, steps } = this.reduce(raw)

        return {
            key,
            value: value as NumerologyValue,
            master: isMaster(value),
            math: [...workingOut, ...steps],
        }
    }

    /** "A1 M4 A1 R9 A1" — the letter values, shown rather than asserted. */
    private spell(letters: string[], values: number[]): string {
        return letters
            .map(
                (letter, index) =>
                    `${letter.toUpperCase()}${String(values[index] ?? 0)}`,
            )
            .join(" ")
    }
}

export { NUMEROLOGY_ORDER }
