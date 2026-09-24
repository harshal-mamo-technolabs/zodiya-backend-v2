import {
    AspectTypes,
    Bodies,
    HOROSCOPE_BENEFICS,
    HOROSCOPE_CATEGORY_ORDER,
    HOROSCOPE_HEADLINE_LEAD,
    HOROSCOPE_LEADS,
    HOROSCOPE_MALEFICS,
    HOROSCOPE_MAX_NOTES,
    HOROSCOPE_SCORE_BASE,
    HoroscopeCategories,
    HoroscopePeriods,
    Lunations,
    MoodBands,
    QUIET_RELATION,
    SIGN_COLOUR_HEX,
    SIGN_ORDER,
    SIGN_RULER,
    SupportedLanguages,
    type Body,
    type HoroscopeCategory,
    type Language,
    type Lunation,
    type MoodBand,
    type SignRelation,
} from "../constants/index.ts"
import en from "../data/horoscope/en.ts"
import type {
    HoroscopeCategoryEntry,
    HoroscopeCopy,
    HoroscopeReading,
    HoroscopeResponse,
    SkyBody,
} from "../types/index.ts"
import type { ChartService } from "./ChartService.ts"

const COPY: Record<Language, HoroscopeCopy> = {
    [SupportedLanguages.EN]: en,
}
const LOCALE: Record<Language, string> = { [SupportedLanguages.EN]: "en-GB" }
const NUMERALS = ["I", "II", "III", "IV", "V", "VI"]

const fill = (template: string, values: Record<string, string>) => {
    const text = template.replace(
        /\{(\w+)\}/g,
        (_, key: string) => values[key] ?? "",
    )
    return text.charAt(0).toUpperCase() + text.slice(1)
}

/** A small, stable hash so the same day always gets the same wording. */
const hash = (s: string) => {
    let h = 5381
    for (let i = 0; i < s.length; i++) {
        h = (h * 33 + s.charCodeAt(i)) >>> 0
    }
    return h
}

/**
 * Words for the sky: a headline, six category readings, the mood, the day's
 * number and colour, and the notes that say why. Everything is chosen from
 * the real positions, so it changes as the sky does and never runs out.
 */
export class HoroscopeReadingService {
    constructor(private chartService: ChartService) {}

    build(reading: HoroscopeReading, lang: Language): HoroscopeResponse {
        const copy = COPY[lang]
        const { sign, period, sky } = reading
        const seed = `${reading.span.start}|${sign}|${period}`

        const categories = HOROSCOPE_CATEGORY_ORDER.map((key, i) =>
            this.category(key, NUMERALS[i] ?? "", reading, seed, copy),
        )
        const scores = categories.map((c) => c.score)
        const strength = Math.round(
            scores.reduce((a, b) => a + b, 0) / scores.length,
        )

        const headLead = this.lead(HOROSCOPE_HEADLINE_LEAD[period], sky.bodies)
        const headline = fill(
            this.pick(
                copy.headlines[period][headLead.relation],
                `${seed}|headline`,
            ),
            { planet: this.name(headLead.body, copy) },
        )

        return {
            lang,
            sign,
            signName: copy.signs[sign].name,
            abbr: copy.signs[sign].abbr,
            range: copy.signs[sign].range,
            ruler: copy.bodies[SIGN_RULER[sign]],
            period,
            date: reading.date,
            span: reading.span,
            headline,
            mood: this.mood(categories, copy),
            luckyNumber: this.luckyNumber(reading),
            luckyColour: {
                name: copy.colours[sky.moon.sign],
                hex: SIGN_COLOUR_HEX[sky.moon.sign],
            },
            moonLine: this.moonLine(reading, copy),
            categories,
            strength: Math.max(1, Math.min(5, strength)),
            skyNotes: this.notes(reading, lang, copy),
            labels: copy.labels,
        }
    }

    /** The first listed planet with a real angle to the sign; failing that, the first listed. */
    private lead(order: Body[], bodies: SkyBody[]): SkyBody {
        const placed = order
            .map((b) => bodies.find((x) => x.body === b))
            .filter((b): b is SkyBody => !!b)
        const fallback = placed[0] ?? bodies[0]
        if (!fallback) {
            throw new Error("Sky has no bodies")
        }
        return placed.find((b) => b.relation !== QUIET_RELATION) ?? fallback
    }

    /** The lights take an article: "the Moon squares your sign". */
    private name(body: Body, copy: HoroscopeCopy): string {
        return body === Bodies.MOON || body === Bodies.SUN
            ? `the ${copy.bodies[body]}`
            : copy.bodies[body]
    }

    private pick(options: string[], seed: string): string {
        return options[hash(seed) % Math.max(options.length, 1)] ?? ""
    }

    private category(
        key: HoroscopeCategory,
        numeral: string,
        reading: HoroscopeReading,
        seed: string,
        copy: HoroscopeCopy,
    ): HoroscopeCategoryEntry {
        const { period, sky } = reading
        const lead = this.lead(HOROSCOPE_LEADS[period][key], sky.bodies)
        const planet = this.name(lead.body, copy)
        const parts = [
            fill(
                this.pick(
                    copy.readings[period][key][lead.relation],
                    `${seed}|${key}`,
                ),
                { planet },
            ),
        ]

        if (
            period === HoroscopePeriods.DAILY &&
            key === HoroscopeCategories.EMOTIONS
        ) {
            if (lead.body !== Bodies.MOON) {
                parts.push(copy.moonHouse[sky.moon.house - 1] ?? "")
            }
            parts.push(copy.phaseNotes[sky.moon.phase])
        }
        if (lead.retrograde) {
            parts.push(fill(copy.retrograde, { planet }))
        }

        return {
            key,
            numeral,
            title: copy.categories[key],
            score: this.score(lead),
            lead: lead.body,
            relation: lead.relation,
            text: parts.filter(Boolean).join(" "),
        }
    }

    /** Easy angles lift, hard ones press, and a retrograde lead takes a little off. */
    private score(lead: SkyBody): number {
        const delta: Record<SignRelation, number> = {
            [AspectTypes.TRINE]: 2,
            [AspectTypes.SEXTILE]: 1,
            [AspectTypes.CONJUNCTION]: HOROSCOPE_BENEFICS.includes(lead.body)
                ? 1
                : 0,
            [AspectTypes.SQUARE]: -1,
            [AspectTypes.OPPOSITION]: HOROSCOPE_MALEFICS.includes(lead.body)
                ? -2
                : -1,
            [QUIET_RELATION]: 0,
        }
        const value =
            HOROSCOPE_SCORE_BASE +
            delta[lead.relation] -
            (lead.retrograde ? 1 : 0)
        return Math.max(1, Math.min(5, value))
    }

    /** The dial: the six scores averaged, with feelings counted twice. */
    private mood(
        categories: HoroscopeCategoryEntry[],
        copy: HoroscopeCopy,
    ): { value: number; band: MoodBand; label: string } {
        const weights = categories.map((c) =>
            c.key === HoroscopeCategories.EMOTIONS ? 2 : 1,
        )
        const total = categories.reduce(
            (sum, c, i) => sum + c.score * (weights[i] ?? 1),
            0,
        )
        const value =
            Math.round(
                (total / (5 * weights.reduce((a, b) => a + b, 0))) * 100,
            ) / 100
        const band =
            value < 0.45
                ? MoodBands.HEAVY
                : value < 0.6
                  ? MoodBands.LEVEL
                  : value < 0.78
                    ? MoodBands.STEADY
                    : MoodBands.BRIGHT
        return { value, band, label: copy.moods[band] }
    }

    /** A single digit from the span's date, the sign and where the Moon sits; the same every time for that day. */
    private luckyNumber(reading: HoroscopeReading): number {
        const digitSum = (text: string) =>
            text.split("").reduce((a, d) => a + Number(d), 0)
        let sum =
            digitSum(reading.span.start.replace(/\D/g, "")) +
            SIGN_ORDER.indexOf(reading.sign) +
            reading.sky.moon.house
        while (sum > 9) {
            sum = digitSum(String(sum))
        }
        return sum === 0 ? 9 : sum
    }

    private moonLine(reading: HoroscopeReading, copy: HoroscopeCopy): string {
        const { sky, period } = reading
        if (period === HoroscopePeriods.WEEKLY) {
            return fill(copy.notes.moonRun, {
                signs: reading.moonSigns
                    .map((s) => copy.signs[s].name)
                    .join(", "),
            })
        }
        return `${copy.phases[sky.moon.phase]} · ${copy.signs[sky.moon.sign].name}`
    }

    /** What in the sky the reading came from, most telling first. */
    private notes(
        reading: HoroscopeReading,
        lang: Language,
        copy: HoroscopeCopy,
    ): string[] {
        const { sky, period } = reading
        const out: string[] = []
        const name = (b: Body | Lunation) =>
            b === Lunations.NEW || b === Lunations.FULL ? "" : copy.bodies[b]
        const when = (date: string) =>
            new Intl.DateTimeFormat(LOCALE[lang], {
                weekday:
                    period === HoroscopePeriods.YEARLY ? undefined : "short",
                day: "numeric",
                month: "short",
                timeZone: "UTC",
            })
                .format(new Date(`${date}T00:00:00Z`))
                .replace("Sept", "Sep")

        if (period === HoroscopePeriods.YEARLY) {
            for (const body of [Bodies.JUPITER, Bodies.SATURN]) {
                const placed = sky.bodies.find((b) => b.body === body)
                if (placed) {
                    out.push(
                        fill(copy.notes.house, {
                            planet: copy.bodies[body],
                            sign: copy.signs[placed.sign].name,
                            ordinal: copy.ordinals[placed.house - 1] ?? "",
                        }),
                    )
                }
            }
        }

        for (const e of reading.events) {
            if (e.body === Lunations.NEW || e.body === Lunations.FULL) {
                out.push(
                    fill(copy.notes.lunation[e.body], {
                        sign: copy.signs[e.sign].name,
                        date:
                            period === HoroscopePeriods.DAILY
                                ? "today"
                                : when(e.date),
                    }),
                )
            } else {
                out.push(
                    fill(copy.notes.ingress, {
                        planet: name(e.body),
                        sign: copy.signs[e.sign].name,
                        date: when(e.date),
                    }),
                )
            }
        }

        if (period !== HoroscopePeriods.YEARLY) {
            for (const a of sky.aspects.filter(
                (x) => x.exact && x.a !== Bodies.MOON,
            )) {
                out.push(
                    fill(copy.notes.aspect, {
                        a: copy.bodies[a.a],
                        aspect: copy.aspects[a.type],
                        b: copy.bodies[a.b],
                        orb: this.orb(a.orb),
                    }),
                )
            }
            if (period === HoroscopePeriods.DAILY) {
                out.push(
                    fill(copy.notes.moon, {
                        pos: this.position(sky.moon.lon, copy),
                    }),
                )
            }
            for (const b of sky.bodies.filter((x) => x.stationary)) {
                out.push(
                    fill(copy.notes.stationary, {
                        planet: copy.bodies[b.body],
                    }),
                )
            }
            const mercury = sky.bodies.find((b) => b.body === Bodies.MERCURY)
            if (mercury) {
                out.push(
                    fill(
                        mercury.retrograde
                            ? copy.notes.retrograde
                            : copy.notes.direct,
                        {
                            planet: copy.bodies[Bodies.MERCURY],
                            pos: this.position(mercury.lon, copy),
                        },
                    ),
                )
            }
        }

        return out.slice(0, HOROSCOPE_MAX_NOTES)
    }

    /** "04°38′ Leo" */
    private position(lon: number, copy: HoroscopeCopy): string {
        const { sign, degree, minute } = this.chartService.signPosition(lon)
        return `${String(degree).padStart(2, "0")}°${String(minute).padStart(2, "0")}′ ${copy.signs[sign].name}`
    }

    /** "0°12′" */
    private orb(orb: number): string {
        const d = Math.floor(orb)
        return `${String(d)}°${String(Math.round((orb - d) * 60)).padStart(2, "0")}′`
    }
}
