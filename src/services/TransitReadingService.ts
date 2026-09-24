import {
    Bodies,
    CONJUNCTION_TONE,
    DEFAULT_LANGUAGE,
    Lunations,
    SupportedLanguages,
    TRANSIT_ASPECT_GROUP,
    TransitAspects,
    TransitTextGroups,
    TransitTones,
    type Language,
    type Lunation,
    type TransitTone,
} from "../constants/index.ts"
import en from "../data/transits/en.ts"
import type {
    NatalChart,
    TransitCopy,
    TransitEvent,
    TransitReading,
    TransitResponse,
} from "../types/index.ts"
import type { ChartService } from "./ChartService.ts"
import type { TransitService } from "./TransitService.ts"

/** Add a language by writing src/data/transits/<lang>.ts and listing it here. */
const COPY: Record<Language, TransitCopy> = {
    [SupportedLanguages.EN]: en,
}

const LUNATION_KINDS: readonly string[] = Object.values(Lunations)
const isLunation = (transit: string): transit is Lunation =>
    LUNATION_KINDS.includes(transit)

export class TransitReadingService {
    constructor(
        private chartService: ChartService,
        private transitService: TransitService,
    ) {}

    build(
        reading: TransitReading,
        natal: NatalChart,
        place: string,
        lang: Language = DEFAULT_LANGUAGE,
    ): TransitResponse {
        const copy = COPY[lang]

        return {
            lang: copy.lang,
            days: reading.days,
            today: reading.today,
            place,
            tones: copy.tones,
            labels: copy.labels,
            events: reading.events.map((event) => this.entry(event, copy)),
        }
    }

    private entry(event: TransitEvent, copy: TransitCopy) {
        const group = TRANSIT_ASPECT_GROUP[event.aspect]
        const tone = this.tone(event)
        const aspect = copy.aspects[event.aspect]
        const lunation = isLunation(event.transit) ? event.transit : null
        const planet = isLunation(event.transit) ? null : event.transit

        const transitName = lunation
            ? copy.lunations[lunation]
            : copy.points[planet ?? Bodies.SUN]
        const lede = lunation
            ? copy.lunationLedes[lunation][event.aspect]
            : copy.ledes[planet ?? Bodies.SUN][event.aspect]
        const body = lunation
            ? copy.lunationTexts[lunation][group]
            : copy.texts[planet ?? Bodies.SUN][group]
        const advice = lunation
            ? copy.lunationAdvice[lunation][group]
            : copy.advice[planet ?? Bodies.SUN][group]

        return {
            id: event.id,
            transit: event.transit,
            natal: event.natal,
            aspect: event.aspect,
            weight: event.weight,
            span: event.span,
            exact: event.exact,
            exactDate: event.exactDate,
            lunation: event.lunation,
            transitName,
            natalName: copy.points[event.natal],
            natalPos: this.position(event.natalLon),
            aspectName: aspect.name,
            glyph: aspect.glyph,
            tone,
            toneLabel: copy.tones[tone],
            title: `${transitName} ${aspect.name.toLowerCase()} ${copy.points[event.natal]}`,
            lede,
            text: `${body} ${copy.natal[event.natal]}`,
            advice,
            daily: event.daily.map((day) => ({
                orb: day.orb,
                pos:
                    this.position(day.lon) +
                    (day.speed < 0 && !lunation ? " ℞" : ""),
                motion: this.motion(event, day.speed, copy),
            })),
        }
    }

    /** Easy aspects support, hard ones demand, and a conjunction depends on the planet. */
    private tone(event: TransitEvent): TransitTone {
        if (event.aspect !== TransitAspects.CONJUNCTION) {
            return TRANSIT_ASPECT_GROUP[event.aspect] === TransitTextGroups.FLOW
                ? TransitTones.FLOW
                : TransitTones.TENSE
        }
        if (isLunation(event.transit)) {
            return TransitTones.NEUTRAL
        }
        return CONJUNCTION_TONE[event.transit]
    }

    /** "Retrograde · slow", "Direct", "Lunation" */
    private motion(
        event: TransitEvent,
        speed: number,
        copy: TransitCopy,
    ): string {
        if (isLunation(event.transit)) {
            return copy.motion.lunation
        }
        const direction =
            speed < 0 ? copy.motion.retrograde : copy.motion.direct
        const pace = this.transitService.pace(event.transit, speed)
        return pace
            ? `${direction}${copy.motion.joiner}${copy.motion[pace]}`
            : direction
    }

    /** "Virgo 19°42′" */
    private position(lon: number): string {
        const { sign, degree, minute } = this.chartService.signPosition(lon)
        const name = sign.charAt(0).toUpperCase() + sign.slice(1)
        return `${name} ${String(degree).padStart(2, "0")}°${String(minute).padStart(2, "0")}′`
    }
}
