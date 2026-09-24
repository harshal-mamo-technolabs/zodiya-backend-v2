import {
    Bodies,
    DEFAULT_LANGUAGE,
    SupportedLanguages,
    type Body,
    type Language,
} from "../constants/index.ts"
import en from "../data/readings/en.ts"
import type {
    Aspect,
    NatalChart,
    Placement,
    Reading,
    ReadingCopy,
    ReadingSection,
    ReadingSectionKey,
    SignPosition,
} from "../types/index.ts"

/** Add a language by writing src/data/readings/<lang>.ts and listing it here. */
const COPY: Record<Language, ReadingCopy> = {
    [SupportedLanguages.EN]: en,
}

export function isSupportedLanguage(value: string): value is Language {
    return Object.hasOwn(COPY, value)
}

const fill = (template: string, values: Record<string, string>): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)

export class ReadingService {
    build(chart: NatalChart, lang: Language = DEFAULT_LANGUAGE): Reading {
        const copy = isSupportedLanguage(lang) ? COPY[lang] : en
        const placements = new Map(chart.bodies.map((p) => [p.body, p]))

        const at = (body: Body): Placement => {
            const placement = placements.get(body)
            if (!placement) {
                throw new Error(`Chart is missing a placement for ${body}`)
            }
            return placement
        }

        const sun = at(Bodies.SUN)
        const moon = at(Bodies.MOON)
        const { asc } = chart.angles

        const luminaries = {
            sun: copy.signs[sun.sign].name,
            moon: copy.signs[moon.sign].name,
            asc: copy.signs[asc.sign].name,
        }

        return {
            lang: copy.lang,
            headline: [
                fill(copy.templates.headlineLuminaries, luminaries),
                fill(copy.templates.headlineRising, luminaries),
            ],
            chips: [
                { label: copy.labels.sun, value: this.position(copy, sun) },
                { label: copy.labels.moon, value: this.position(copy, moon) },
                {
                    label: copy.labels.ascendant,
                    value: this.position(copy, asc),
                },
            ],
            summary: this.summary(chart, copy, luminaries),
            sections: this.sections(chart, copy, at),
        }
    }

    // ------------------------------------------------------------ page one

    private summary(
        chart: NatalChart,
        copy: ReadingCopy,
        luminaries: Record<string, string>,
    ): string {
        const values = {
            ...luminaries,
            elementSummary: copy.elements[chart.dominants.topElement].summary,
            modalitySummary:
                copy.modalities[chart.dominants.topModality].summary,
        }

        const tightest = chart.aspects[0]

        if (!tightest) {
            return fill(copy.templates.summaryNoAspect, values)
        }

        return fill(copy.templates.summary, {
            ...values,
            a: copy.bodyNames[tightest.a],
            b: copy.bodyNames[tightest.b],
            aspectShort: copy.aspectShort[tightest.type],
            orb: tightest.orb.toFixed(1),
        })
    }

    // ---------------------------------------------------------- the reading

    private sections(
        chart: NatalChart,
        copy: ReadingCopy,
        at: (body: Body) => Placement,
    ): ReadingSection[] {
        const sun = at(Bodies.SUN)
        const moon = at(Bodies.MOON)
        const mercury = at(Bodies.MERCURY)
        const venus = at(Bodies.VENUS)
        const mars = at(Bodies.MARS)
        const jupiter = at(Bodies.JUPITER)
        const saturn = at(Bodies.SATURN)
        const pluto = at(Bodies.PLUTO)
        const node = at(Bodies.NORTH_NODE)

        const { asc, mc, desc } = chart.angles
        const { topElement, topModality } = chart.dominants

        const sign = (key: Placement | { sign: Placement["sign"] }) =>
            copy.signs[key.sign]

        return [
            this.section(
                copy,
                "personality",
                [
                    this.captionFor(copy, sun),
                    this.captionFor(copy, mercury),
                    this.captionFor(copy, asc, copy.labels.ascendant),
                ],
                [
                    fill(copy.templates.sun, {
                        sign: sign(sun).name,
                        essence: sign(sun).essence,
                    }),
                    fill(
                        copy.templates.houseFirst,
                        this.house(copy, sun.house),
                    ),
                    fill(copy.templates.ascendant, {
                        sign: sign(asc).name,
                        line: copy.ascendant[asc.sign],
                    }),
                    fill(copy.templates.mercury, {
                        sign: sign(mercury).name,
                        line: copy.placements[Bodies.MERCURY][mercury.sign],
                    }),
                ],
            ),

            this.section(
                copy,
                "emotions",
                [this.captionFor(copy, moon)],
                [
                    fill(copy.templates.moon, {
                        sign: sign(moon).name,
                        line: copy.placements[Bodies.MOON][moon.sign],
                    }),
                    fill(
                        copy.templates.bodyHouse,
                        this.house(copy, moon.house),
                    ),
                    this.aspectLine(copy, this.tightestFor(chart, Bodies.MOON)),
                ],
            ),

            this.section(
                copy,
                "relationships",
                [this.captionFor(copy, venus), this.captionFor(copy, mars)],
                [
                    fill(copy.templates.venus, {
                        sign: sign(venus).name,
                        line: copy.placements[Bodies.VENUS][venus.sign],
                    }),
                    fill(copy.templates.mars, {
                        sign: sign(mars).name,
                        line: copy.placements[Bodies.MARS][mars.sign],
                    }),
                    fill(copy.templates.descendant, {
                        sign: sign(desc).name,
                        essence: sign(desc).essence,
                    }),
                ],
            ),

            this.section(
                copy,
                "career",
                [
                    this.captionFor(copy, saturn),
                    this.captionFor(copy, jupiter),
                    this.captionFor(copy, mc, "midheaven"),
                ],
                [
                    fill(copy.templates.midheaven, {
                        sign: sign(mc).name,
                        line: copy.midheaven[mc.sign],
                    }),
                    fill(copy.templates.saturn, {
                        sign: sign(saturn).name,
                        line: copy.placements[Bodies.SATURN][saturn.sign],
                    }),
                    [
                        fill(copy.templates.jupiter, {
                            sign: sign(jupiter).name,
                            line: copy.placements[Bodies.JUPITER][jupiter.sign],
                        }),
                        fill(
                            copy.templates.bodyHouse,
                            this.house(copy, jupiter.house),
                        ),
                    ].join(" "),
                ],
            ),

            this.section(
                copy,
                "lifePath",
                [this.captionFor(copy, node), this.captionFor(copy, pluto)],
                [
                    fill(copy.templates.node, {
                        sign: sign(node).name,
                        line: copy.placements[Bodies.NORTH_NODE][node.sign],
                    }),
                    fill(copy.templates.pluto, {
                        sign: sign(pluto).name,
                        ...this.house(copy, pluto.house),
                    }),
                    [
                        fill(copy.templates.dominants, {
                            elementLine: copy.elements[topElement].line,
                            clause: copy.modalities[topModality].clause,
                        }),
                        this.sunMoonLine(chart, copy),
                    ].join(" "),
                ],
            ),
        ]
    }

    private section(
        copy: ReadingCopy,
        key: ReadingSectionKey,
        caption: string[],
        paragraphs: (string | null)[],
    ): ReadingSection {
        const meta = copy.sections[key]

        return {
            numeral: meta.numeral,
            key,
            title: meta.title,
            subtitle: meta.subtitle,
            caption: caption.join(" · "),
            paragraphs: paragraphs.filter(
                (paragraph): paragraph is string => paragraph !== null,
            ),
        }
    }

    // -------------------------------------------------------------- helpers

    /** The uppercase placement strip under a section heading. */
    private captionFor(
        copy: ReadingCopy,
        point: SignPosition | Placement,
        label?: string,
    ): string {
        const name =
            label ?? ("body" in point ? copy.bodyNames[point.body] : "")
        const retrograde =
            "retrograde" in point && point.retrograde
                ? ` ${copy.labels.retrograde}`
                : ""

        return `${name} ${this.position(copy, point)}${retrograde}`
            .trim()
            .toUpperCase()
    }

    private position(copy: ReadingCopy, point: SignPosition): string {
        return fill(copy.templates.position, {
            degree: String(point.degree).padStart(2, "0"),
            minute: String(point.minute).padStart(2, "0"),
            sign: copy.signs[point.sign].name,
        })
    }

    private house(copy: ReadingCopy, house: number) {
        const entry = copy.houses[house - 1]
        return { ordinal: entry?.ordinal ?? "", theme: entry?.theme ?? "" }
    }

    private houseLine(copy: ReadingCopy, placement: Placement): string {
        return fill(copy.templates.bodyHouse, {
            body: copy.bodyNames[placement.body],
            ...this.house(copy, placement.house),
        })
    }

    /** Aspects are sorted tightest-first, so the first hit is the closest. */
    private tightestFor(chart: NatalChart, body: Body): Aspect | null {
        return (
            chart.aspects.find(
                (aspect) => aspect.a === body || aspect.b === body,
            ) ?? null
        )
    }

    private aspectLine(
        copy: ReadingCopy,
        aspect: Aspect | null,
    ): string | null {
        if (!aspect) {
            return null
        }

        return fill(copy.aspectLines[aspect.type], {
            a: copy.bodyNames[aspect.a],
            b: copy.bodyNames[aspect.b],
            orb: aspect.orb.toFixed(1),
        })
    }

    private sunMoonLine(chart: NatalChart, copy: ReadingCopy): string {
        const aspect = chart.aspects.find(
            (candidate) =>
                (candidate.a === Bodies.SUN && candidate.b === Bodies.MOON) ||
                (candidate.a === Bodies.MOON && candidate.b === Bodies.SUN),
        )

        if (!aspect) {
            return copy.templates.noSunMoonAspect
        }

        return fill(copy.templates.sunMoonAspect, {
            aspect: copy.aspectNames[aspect.type],
            orb: aspect.orb.toFixed(1),
        })
    }
}
