import {
    DEFAULT_LANGUAGE,
    NumerologyNumbers,
    SupportedLanguages,
    type Language,
    type NumerologyNumber,
    type NumerologyValue,
} from "../constants/index.ts"
import en from "../data/numerology/en.ts"
import type {
    NumerologyChapterEntry,
    NumerologyCopy,
    NumerologyEntry,
    NumerologyReading,
    NumerologyResponse,
} from "../types/index.ts"

/** Add a language by writing src/data/numerology/<lang>.ts and listing it here. */
const COPY: Record<Language, NumerologyCopy> = {
    [SupportedLanguages.EN]: en,
}

/** Four pinnacles, so four ordinals. Translations override via the template. */
const ORDINALS = ["First", "Second", "Third", "Fourth"]

const fill = (template: string, values: Record<string, string>): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)

/** Master numbers are single digits again before they count as lucky. */
const toDigit = (value: number): number =>
    value > 9
        ? String(value)
              .split("")
              .reduce((total, digit) => total + Number(digit), 0)
        : value

export class NumerologyReadingService {
    build(
        reading: NumerologyReading,
        lang: Language = DEFAULT_LANGUAGE,
    ): NumerologyResponse {
        const copy = isSupportedNumerologyLanguage(lang) ? COPY[lang] : en

        const numbers: NumerologyEntry[] = reading.numbers.map((entry) => ({
            ...entry,
            label: copy.labels[entry.key].label,
            sub: copy.labels[entry.key].sub,
            meaning: copy.meanings[entry.key][entry.value],
        }))

        const at = (key: NumerologyNumber) =>
            numbers.find((entry) => entry.key === key)

        const lifePath = at(NumerologyNumbers.LIFE_PATH)
        const birth = at(NumerologyNumbers.BIRTH)
        const destiny = at(NumerologyNumbers.DESTINY)

        if (!lifePath || !birth || !destiny) {
            throw new Error("Numerology reading is missing a core number")
        }

        const lucky = [
            ...new Set(
                [lifePath.value, birth.value, destiny.value]
                    .map(toDigit)
                    .filter(Boolean),
            ),
        ]

        const days = [
            ...new Set(
                [copy.days[lifePath.value], copy.days[destiny.value]].filter(
                    Boolean,
                ),
            ),
        ]

        return {
            lang: copy.lang,
            input: reading.input,
            firstName: reading.input.name.trim().split(/\s+/)[0] ?? "You",
            summary: this.summary(copy, numbers, lifePath.value, destiny.value),
            numbers,
            lucky,
            days,
            personalYear: {
                ...reading.personalYear,
                heading: fill(copy.personalYear.heading, {
                    year: String(reading.personalYear.year),
                    value: String(reading.personalYear.value),
                }),
                meaning: copy.personalYear.meanings[reading.personalYear.value],
            },
            chapters: this.chapters(copy, reading),
            name: {
                letters: reading.letters,
                karmicLessons: reading.karmicLessons.map((value) => ({
                    value,
                    meaning: copy.karmicLessons[value],
                })),
                karmicNone: copy.karmicNone,
                hiddenPassion: {
                    ...reading.hiddenPassion,
                    meaning:
                        fill(copy.templates.passion, {
                            value: String(reading.hiddenPassion.value),
                            count: String(reading.hiddenPassion.count),
                        }) +
                        " " +
                        copy.hiddenPassion[reading.hiddenPassion.value],
                },
            },
            sections: copy.sections,
            footnote: copy.footnote,
        }
    }

    private chapters(
        copy: NumerologyCopy,
        reading: NumerologyReading,
    ): NumerologyChapterEntry[] {
        const seen = new Set<number>()

        return reading.chapters.map((chapter, index) => {
            const again = seen.has(chapter.challenge)
            seen.add(chapter.challenge)

            return {
                ...chapter,
                challengeAgain: again ? copy.templates.challengeAgain : null,
                label: fill(copy.templates.chapter, {
                    ordinal: ORDINALS[index] ?? String(index + 1),
                }),
                ages: fill(
                    chapter.toAge === null
                        ? copy.templates.agesOpen
                        : copy.templates.ages,
                    {
                        from: String(chapter.fromAge),
                        to: String(chapter.toAge ?? ""),
                    },
                ),
                pinnacleMeaning: copy.pinnacles[chapter.pinnacle],
                challengeMeaning: copy.challenges[chapter.challenge],
            }
        })
    }

    private summary(
        copy: NumerologyCopy,
        numbers: NumerologyEntry[],
        lifePath: NumerologyValue,
        destiny: NumerologyValue,
    ): string {
        const masters = numbers
            .filter((entry) => entry.master)
            .map((entry) => entry.label)

        const prefix = masters.length
            ? fill(
                  masters.length === 1
                      ? copy.templates.masterOne
                      : copy.templates.masterMany,
                  { labels: this.list(masters) },
              )
            : ""

        const body = fill(
            lifePath === destiny
                ? copy.templates.agree
                : copy.templates.tension,
            {
                lifePath: String(lifePath),
                destiny: String(destiny),
                lifePathArticle: copy.articles[lifePath],
                destinyArticle: copy.articles[destiny],
            },
        )

        // the body always starts its own sentence, prefix or not
        return prefix + body.charAt(0).toUpperCase() + body.slice(1)
    }

    /** "Life Path", "Life Path and Destiny", "A, B and C" */
    private list(items: string[]): string {
        if (items.length <= 1) {
            return items[0] ?? ""
        }
        return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1] ?? ""}`
    }
}

export function isSupportedNumerologyLanguage(
    value: string,
): value is Language {
    return Object.hasOwn(COPY, value)
}
