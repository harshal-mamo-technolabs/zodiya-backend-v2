import {
    SYNASTRY_BAND_ORDER,
    SYNASTRY_HOUSE_POINTS,
    SYNASTRY_PAIRS,
    SYNASTRY_SCORE_BASE,
    SYNASTRY_SECTION_CONTACTS,
    SYNASTRY_SECTION_ORDER,
    SYNASTRY_TOP,
    Bodies,
    SupportedLanguages,
    SynastryBands,
    SynastrySections,
    TransitTextGroups,
    type Body,
    type Language,
    type SynastrySection,
} from "../constants/index.ts"
import en from "../data/synastry/en.ts"
import type {
    SynastryContact,
    SynastryContactEntry,
    SynastryCopy,
    SynastryReading,
    SynastryResponse,
    SynastrySectionEntry,
} from "../types/index.ts"
import type { ChartService } from "./ChartService.ts"
import { strength } from "./SynastryService.ts"

const COPY: Record<Language, SynastryCopy> = {
    [SupportedLanguages.EN]: en,
}

const NUMERALS = ["I", "II", "III", "IV"]

/** Who the reading is about: enough to name them and place them on the wheel. */
export interface SynastryPersonInput {
    id: string
    firstName: string
    name: string
}

const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "")

/** A contact matched to a section pair, with who owns which planet. */
interface Match {
    key: string
    contact: SynastryContact
    x: "a" | "b"
}

/**
 * Turns the computed comparison into words: a headline, a gauge reading,
 * the strongest contacts, and four sections built from the pairs each one
 * cares about.
 */
export class SynastryReadingService {
    constructor(private chartService: ChartService) {}

    build(
        reading: SynastryReading,
        a: SynastryPersonInput,
        b: SynastryPersonInput,
        lang: Language,
    ): SynastryResponse {
        const copy = COPY[lang]
        const names = { a: a.firstName, b: b.firstName }

        const contacts = reading.contacts.map((c) => this.entry(c, names, copy))
        const sections = SYNASTRY_SECTION_ORDER.map((key, i) =>
            this.section(key, NUMERALS[i] ?? "", reading, names, copy),
        )
        const score = this.score(reading.contacts, copy)
        const by = Object.fromEntries(
            sections.map((s) => [s.key, s.score]),
        ) as Record<SynastrySection, number>

        return {
            lang,
            a: { ...reading.a, ...a },
            b: { ...reading.b, ...b },
            contacts,
            top: contacts.slice(0, SYNASTRY_TOP),
            score,
            headline: fill(copy.headline.template, {
                a: names.a,
                b: names.b,
                emotional: this.fragment(
                    copy.headline.emotional,
                    by[SynastrySections.EMOTIONAL],
                ),
                communication: this.fragment(
                    copy.headline.communication,
                    by[SynastrySections.COMMUNICATION],
                ),
                longTerm: this.fragment(
                    copy.headline.longTerm,
                    by[SynastrySections.LONG_TERM],
                ),
            }),
            sections,
            labels: copy.labels,
        }
    }

    private entry(
        c: SynastryContact,
        names: { a: string; b: string },
        copy: SynastryCopy,
    ): SynastryContactEntry {
        const aspect = copy.aspects[c.type]
        return {
            ...c,
            glyph: aspect.glyph,
            text: `${names.a}'s ${copy.bodies[c.a]} ${aspect.verb} ${names.b}'s ${copy.bodies[c.b]}`,
            orbText: `${copy.labels.orb} ${c.orb.toFixed(1)}°`,
        }
    }

    /** Low, middle or high fragment for a 1 to 5 section score. */
    private fragment(options: [string, string, string], score: number) {
        return options[score <= 2 ? 0 : score >= 4 ? 2 : 1]
    }

    /** The gauge: easy against hard contacts, counting only those that touch a personal planet. */
    private score(contacts: SynastryContact[], copy: SynastryCopy) {
        const personal = contacts.filter((c) => c.weight >= 1.5)
        const flow = personal.filter(
            (c) => c.kind === TransitTextGroups.FLOW,
        ).length
        const hard = personal.filter(
            (c) => c.kind === TransitTextGroups.TENSE,
        ).length
        const exact = personal.filter((c) => c.exact).length

        const lean = (flow - hard) / Math.max(flow + hard, 1)
        const value = Math.min(0.96, Math.max(0.04, 0.5 + 0.45 * lean))
        const band =
            SYNASTRY_BAND_ORDER[Math.min(3, Math.floor(value * 4))] ??
            SynastryBands.WORKABLE
        // the other side shows when it is at least a third of the whole
        const mixed =
            (band === SynastryBands.STRAINED || band === SynastryBands.WORKABLE
                ? flow
                : hard) >= Math.ceil((flow + hard) / 3) && flow + hard > 0
        const words = copy.score.bands[band]

        return {
            value: Math.round(value * 100) / 100,
            band,
            word: mixed ? words.mixed : words.plain,
            detail: fill(copy.score.detail, {
                flow: String(flow),
                hard: String(hard),
                exact: String(exact),
            }),
            note: copy.score.note,
        }
    }

    private section(
        key: SynastrySection,
        numeral: string,
        reading: SynastryReading,
        names: { a: string; b: string },
        copy: SynastryCopy,
    ): SynastrySectionEntry {
        const sectionCopy = copy.sections[key]
        const matches = this.matches(key, reading.contacts).slice(
            0,
            SYNASTRY_SECTION_CONTACTS,
        )
        const basis: string[] = []
        const paragraphs: string[] = []
        let score = SYNASTRY_SCORE_BASE

        for (const m of matches) {
            const x = m.x,
                y = m.x === "a" ? "b" : "a"
            const pairs = sectionCopy.pairs as Record<
                string,
                Record<string, string>
            >
            paragraphs.push(
                fill(pairs[m.key]?.[m.contact.kind] ?? "", {
                    x: names[x],
                    y: names[y],
                }),
            )
            basis.push(this.basis(m, reading, names, copy))
            score += this.delta(m.contact)
        }

        // the Moon's and Sun's house placements read alongside the aspects
        const point =
            key === SynastrySections.EMOTIONAL ||
            key === SynastrySections.LONG_TERM
                ? SYNASTRY_HOUSE_POINTS[key]
                : null
        if (point) {
            for (const p of reading.placements.filter(
                (p) => p.body === point,
            )) {
                const x = p.of,
                    y = p.of === "a" ? "b" : "a"
                const values = {
                    x: names[x],
                    y: names[y],
                    body: copy.bodies[p.body],
                    ordinal: copy.ordinals[p.house - 1] ?? "",
                    meaning: copy.houses[p.house - 1] ?? "",
                }
                basis.push(fill(copy.houseBasis, values))
                if (paragraphs.length < SYNASTRY_SECTION_CONTACTS) {
                    paragraphs.push(fill(copy.housePlacement, values))
                }
            }
        }

        if (!matches.length) {
            paragraphs.unshift(fill(sectionCopy.none, names))
            score = SYNASTRY_SCORE_BASE - 1
        }

        return {
            key,
            numeral,
            title: sectionCopy.title,
            score: Math.max(1, Math.min(5, Math.round(score))),
            basis,
            paragraphs,
        }
    }

    /** Contacts that fit one of the section's pairs, in the section's own order of importance. */
    private matches(
        key: SynastrySection,
        contacts: SynastryContact[],
    ): Match[] {
        const out: Match[] = []
        for (const pair of SYNASTRY_PAIRS[key]) {
            const [first, second] = pair.split("-") as [Body, Body]
            const found = contacts
                .filter(
                    (c) =>
                        (c.a === first && c.b === second) ||
                        (c.a === second && c.b === first),
                )
                .sort((p, q) => strength(q) - strength(p))
            for (const contact of found) {
                // {x} owns the first planet of the pair; for a same-planet pair that is person one
                out.push({
                    key: pair,
                    contact,
                    x: contact.a === first ? "a" : "b",
                })
            }
        }
        return out
    }

    /** Easy contacts lift a section, hard ones lower it, and a tight orb doubles the effect. */
    private delta(c: SynastryContact): number {
        const tight = c.orb <= 2 ? 2 : 1
        if (c.kind === TransitTextGroups.FLOW) {
            return tight
        }
        if (c.kind === TransitTextGroups.TENSE) {
            return -tight
        }
        const benefic = [Bodies.VENUS, Bodies.JUPITER] as Body[]
        return benefic.includes(c.a) || benefic.includes(c.b) ? 1 : 0
    }

    /** "Ana Moon 12°18′ Taurus △ Daniel Sun 13°54′ Virgo · orb 1°36′" */
    private basis(
        m: Match,
        reading: SynastryReading,
        names: { a: string; b: string },
        copy: SynastryCopy,
    ): string {
        const c = m.contact
        const left = `${names.a} ${copy.bodies[c.a]} ${this.position(reading.a.bodies[c.a] ?? 0, copy)}`
        const right = `${names.b} ${copy.bodies[c.b]} ${this.position(reading.b.bodies[c.b] ?? 0, copy)}`
        return `${left} ${copy.aspects[c.type].glyph} ${right} · ${copy.labels.orb} ${this.orb(c.orb)}`
    }

    /** "12°18′ Taurus" */
    private position(lon: number, copy: SynastryCopy): string {
        const { sign, degree, minute } = this.chartService.signPosition(lon)
        return `${String(degree).padStart(2, "0")}°${String(minute).padStart(2, "0")}′ ${copy.signs[sign]}`
    }

    /** "1°36′" */
    private orb(orb: number): string {
        const d = Math.floor(orb)
        return `${String(d)}°${String(Math.round((orb - d) * 60)).padStart(2, "0")}′`
    }
}
