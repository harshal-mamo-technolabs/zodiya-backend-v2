import type { ProfileDocument } from "../models/Profile.ts"
import type { ProfileService } from "./ProfileService.ts"
import type { ReadingService } from "./ReadingService.ts"
import type { TransitService } from "./TransitService.ts"
import type { TransitReadingService } from "./TransitReadingService.ts"
import type { HoroscopeService } from "./HoroscopeService.ts"
import type { HoroscopeReadingService } from "./HoroscopeReadingService.ts"
import type { NumerologyService } from "./NumerologyService.ts"
import type { NumerologyReadingService } from "./NumerologyReadingService.ts"
import { localDate } from "../utils/index.ts"
import copy from "../data/readings/en.ts"
import {
    Bodies,
    DEFAULT_LANGUAGE,
    HoroscopePeriods,
    type Body,
    type ZodiacSign,
} from "../constants/index.ts"

// the same English names the pages print
const sign = (s: ZodiacSign) => copy.signs[s].name
const body = (b: Body) => copy.bodyNames[b]

const ordinal = (n: number) =>
    String(n) +
    (["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ??
        "th")

/**
 * Everything the voice astrologer is allowed to talk about, as plain text
 * for the agent prompt: the profile's chart, today's sky for it, and its
 * numbers. Built from the same services the pages use, so the astrologer
 * never contradicts what is on screen.
 */
export class AstrologerContextService {
    constructor(
        private profileService: ProfileService,
        private readingService: ReadingService,
        private transitService: TransitService,
        private transitReadingService: TransitReadingService,
        private horoscopeService: HoroscopeService,
        private horoscopeReadingService: HoroscopeReadingService,
        private numerologyService: NumerologyService,
        private numerologyReadingService: NumerologyReadingService,
    ) {}

    build(profile: ProfileDocument, now = new Date()): string {
        const lang = DEFAULT_LANGUAGE
        const zone = profile.timezoneId
        const natal = this.profileService.natal(profile)
        const reading = this.readingService.build(natal, lang)
        const find = (b: Body) => natal.bodies.find((x) => x.body === b)
        const sun = find(Bodies.SUN)
        const moon = find(Bodies.MOON)
        const { asc, mc } = natal.angles

        const lines = [
            `Name: ${profile.firstName} ${profile.lastName}. Born ${profile.birthDate} at ${profile.birthTime} in ${profile.city}, ${profile.country}. Today is ${localDate(zone, now.getTime())}.`,
            `Big three: Sun in ${sun ? sign(sun.sign) : "unknown"}, Moon in ${moon ? sign(moon.sign) : "unknown"}, ${sign(asc.sign)} rising. Midheaven in ${sign(mc.sign)}.`,
            "",
            "Placements:",
            ...natal.bodies.map(
                (p) =>
                    `- ${body(p.body)} in ${sign(p.sign)} ${String(p.degree)}°${String(p.minute).padStart(2, "0")}, ${ordinal(p.house)} house${p.retrograde ? ", retrograde" : ""}`,
            ),
            "",
            "House cusps: " +
                natal.houses
                    .map((h) => `${ordinal(h.house)} ${sign(h.sign)}`)
                    .join(", "),
            "",
            "Tightest aspects:",
            ...[...natal.aspects]
                .sort((a, b) => a.orb - b.orb)
                .slice(0, 10)
                .map(
                    (a) =>
                        `- ${body(a.a)} ${copy.aspectNames[a.type]} ${body(a.b)} (orb ${a.orb.toFixed(1)}°)`,
                ),
            `Dominant element ${natal.dominants.topElement}, dominant modality ${natal.dominants.topModality}.`,
            "",
            `Chart reading summary: ${reading.summary}`,
            ...reading.sections.map(
                (s) => `- ${s.title}: ${s.paragraphs[0] ?? ""}`,
            ),
            "",
            ...this.transits(profile, natal, now),
            "",
            ...this.horoscope(profile, now),
            "",
            ...this.numerology(profile, now),
        ]

        return lines.join("\n")
    }

    private transits(
        profile: ProfileDocument,
        natal: ReturnType<ProfileService["natal"]>,
        now: Date,
    ) {
        const raw = this.transitService.compute(natal, profile.timezoneId, now)
        const reading = this.transitReadingService.build(
            raw,
            natal,
            profile.city,
            DEFAULT_LANGUAGE,
        )
        const active = reading.events.filter(
            (e) => e.span[0] <= reading.today && reading.today <= e.span[1],
        )
        if (!active.length) {
            return ["Transits today: nothing major is active."]
        }
        return [
            "Transits active today (strongest first):",
            ...active
                .slice(0, 6)
                .map(
                    (e) =>
                        `- ${e.title} (${e.toneLabel}, exact ${e.exactDate}): ${e.lede} ${e.advice}`,
                ),
        ]
    }

    private horoscope(profile: ProfileDocument, now: Date) {
        const zone = profile.timezoneId
        const raw = this.horoscopeService.compute(
            profile.zodiacSign,
            HoroscopePeriods.DAILY,
            localDate(zone, now.getTime()),
            zone,
        )
        const h = this.horoscopeReadingService.build(raw, DEFAULT_LANGUAGE)
        return [
            `Daily horoscope for ${h.signName}: ${h.headline} Mood ${h.mood.label}. ${h.moonLine}`,
            ...h.categories.map((c) => `- ${c.title}: ${c.text}`),
        ]
    }

    private numerology(profile: ProfileDocument, now: Date) {
        const name =
            profile.birthName ?? `${profile.firstName} ${profile.lastName}`
        try {
            const n = this.numerologyReadingService.build(
                this.numerologyService.compute(name, profile.birthDate, now),
                DEFAULT_LANGUAGE,
            )
            return [
                `Numerology for "${name}":`,
                ...n.numbers.map(
                    (x) => `- ${x.label} ${String(x.value)}: ${x.meaning}`,
                ),
                `Personal year ${String(n.personalYear.value)}: ${n.personalYear.meaning}`,
            ]
        } catch {
            // a name numerology cannot read is not a reason to lose the chart
            return ["Numerology: not available for this name."]
        }
    }
}
