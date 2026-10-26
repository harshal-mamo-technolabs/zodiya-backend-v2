import logger from "../config/logger.ts"
import type { Language } from "../constants/index.ts"
import { LINE_COLORS } from "./PalmImageService.ts"
import {
    LINE_KEYS,
    type HandSide,
    type PalmReport,
} from "./PalmReportService.ts"
import {
    BODY,
    CREAM,
    FONT,
    GOLD,
    GOLD_BRIGHT,
    MUTED,
    RULE,
    TRACK,
    WIDTH,
    kit,
    newDoc,
    type TextStyle,
} from "./pdf.ts"

export { slug } from "./pdf.ts"

/** "red #E5484D" -> "#E5484D" */
const LINE_HEX = Object.fromEntries(
    Object.entries(LINE_COLORS).map(([k, v]) => [k, v.split(" ").pop()]),
) as Record<keyof typeof LINE_COLORS, string>

const LABELS = {
    en: {
        palmReading: "Palm reading",
        hand: { left: "Left hand", right: "Right hand" },
        highlighted: "Lines highlighted",
        photo: "Your photo",
        handShape: "Hand shape",
        element: {
            Earth: "Earth",
            Air: "Air",
            Fire: "Fire",
            Water: "Water",
            Unknown: "",
        },
        theLines: "The lines",
        lines: {
            heart: "Heart line",
            head: "Head line",
            life: "Life line",
            fate: "Fate line",
        },
        visibility: {
            clear: "Clear",
            partial: "Partly visible",
            faint: "Faint",
            not_visible: "Not visible",
        },
        confidence: {
            high: "high confidence",
            medium: "medium confidence",
            low: "low confidence",
            not_visible: "",
        },
        theMounts: "The mounts",
        mounts: {
            Venus: "Mount of Venus",
            Jupiter: "Mount of Jupiter",
            Saturn: "Mount of Saturn",
            Apollo: "Mount of Apollo",
            Mercury: "Mount of Mercury",
            Luna: "Mount of Luna",
        },
        prominence: {
            high: "High",
            even: "Even",
            low: "Low",
            not_visible: "Not visible",
        },
        overall: "Overall reading",
        personality: "Personality",
        relationships: "Relationships",
        career: "Career",
        lifeThemes: "Life themes",
        carry: "Carry this",
        footer: "For reflection, not diagnosis. Lines change as hands do.",
        locale: "en-GB",
    },
    // the website's own German wording (frontend i18n/de/palm.js)
    de: {
        palmReading: "Handlesen",
        hand: { left: "Linke Hand", right: "Rechte Hand" },
        highlighted: "Linien hervorgehoben",
        photo: "Dein Foto",
        handShape: "Handform",
        element: {
            Earth: "Erde",
            Air: "Luft",
            Fire: "Feuer",
            Water: "Wasser",
            Unknown: "",
        },
        theLines: "Die Linien",
        lines: {
            heart: "Herzlinie",
            head: "Kopflinie",
            life: "Lebenslinie",
            fate: "Schicksalslinie",
        },
        visibility: {
            clear: "Deutlich",
            partial: "Teilweise sichtbar",
            faint: "Schwach",
            not_visible: "Nicht sichtbar",
        },
        confidence: {
            high: "hohe Sicherheit",
            medium: "mittlere Sicherheit",
            low: "geringe Sicherheit",
            not_visible: "",
        },
        theMounts: "Die Berge",
        mounts: {
            Venus: "Venusberg",
            Jupiter: "Jupiterberg",
            Saturn: "Saturnberg",
            Apollo: "Apolloberg (Sonnenberg)",
            Mercury: "Merkurberg",
            Luna: "Mondberg",
        },
        prominence: {
            high: "Ausgeprägt",
            even: "Ausgeglichen",
            low: "Flach",
            not_visible: "Nicht sichtbar",
        },
        overall: "Gesamtdeutung",
        personality: "Persönlichkeit",
        relationships: "Beziehungen",
        career: "Beruf",
        lifeThemes: "Lebensthemen",
        carry: "Nimm das mit",
        footer: "Zum Nachdenken, nicht zur Diagnose. Linien verändern sich, so wie Hände es tun.",
        locale: "de-DE",
    },
} satisfies Record<Language, unknown>

export interface PalmPdfReading {
    lang: string
    hand: HandSide
    createdAt: Date
    subject: { name: string }
    report: PalmReport
}

export interface PalmPdfImages {
    original: Buffer | null
    highlighted: Buffer | null
}

const serifNote: TextStyle = {
    font: FONT.serifItalic,
    size: 12.5,
    color: MUTED,
}

/** The saved reading as a dark, multi-page A4 PDF in the website's look. */
export function palmPdf(
    reading: PalmPdfReading,
    images: PalmPdfImages,
): Promise<Buffer> {
    const L = reading.lang === "de" ? LABELS.de : LABELS.en
    const r = reading.report
    const { doc, done } = newDoc(r.title)
    const {
        left,
        height,
        write,
        rule,
        keep,
        atTop,
        label,
        body,
        note,
        header,
        footers,
    } = kit(doc)

    /** A hairline, a serif heading and a short gold rule. */
    const section = (title: string, next: number) => {
        keep(36 + 40 + next)
        let y = doc.y
        if (!atTop()) {
            rule(y + 18)
            y += 36
        }
        y += write(title, left, y, {
            font: FONT.serifMedium,
            size: 22,
        })
        rule(y + 6, GOLD, left, 28, 0.75)
        doc.y = y + 18
    }

    header(L.palmReading)

    const date = new Intl.DateTimeFormat(L.locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(reading.createdAt)
    let y = 74
    y += write(
        [reading.subject.name, L.hand[reading.hand], date]
            .filter(Boolean)
            .join("  ·  ")
            .toUpperCase(),
        left,
        y,
        label({ size: 7.5 }),
    )
    y += 10
    y += write(r.title, left, y, { font: FONT.serifMedium, size: 30 })
    y += 6
    y += write(r.summary, left, y, {
        font: FONT.serifItalic,
        size: 15,
        color: BODY,
        lineGap: 1,
    })
    y += 22

    // photos: the drawn lines first when there are some
    const photos = [
        { buffer: images.highlighted, caption: L.highlighted },
        { buffer: images.original, caption: L.photo },
    ].flatMap((p) => {
        if (!p.buffer) {
            return []
        }
        try {
            // pdfkit reads JPEG and PNG only; its typings leave openImage out
            ;(doc as unknown as { openImage(b: Buffer): unknown }).openImage(
                p.buffer,
            )
            return [{ image: p.buffer, caption: p.caption }]
        } catch (e) {
            logger.warn("Palm PDF image skipped", {
                error: (e as Error).message,
            })
            return []
        }
    })
    if (photos.length) {
        const gap = 20
        const w = (WIDTH - gap) / 2
        const h = w * 1.25
        let x = left + (photos.length === 1 ? (WIDTH - w) / 2 : 0)
        for (const p of photos) {
            doc.save()
            doc.rect(x, y, w, h).clip()
            doc.image(p.image, x, y, {
                cover: [w, h],
                align: "center",
                valign: "center",
            })
            doc.restore()
            doc.rect(x, y, w, h).lineWidth(0.5).strokeColor(RULE).stroke()
            write(p.caption.toUpperCase(), x, y + h + 8, label({ width: w }))
            x += w + gap
        }
        y += h + 30
    }
    // the colours of the drawn lines
    if (photos[0]?.caption === L.highlighted) {
        const cell = WIDTH / LINE_KEYS.length
        LINE_KEYS.forEach((k, i) => {
            const lx = left + i * cell
            doc.moveTo(lx, y + 5)
                .lineTo(lx + 16, y + 5)
                .lineWidth(2)
                .lineCap("round")
                .strokeColor(LINE_HEX[k])
                .stroke()
                .lineCap("butt")
            write(L.lines[k], lx + 24, y, body({ size: 9, color: BODY }))
        })
        y += 14
    }
    doc.y = y

    // hand shape
    const element = L.element[r.hand.element]
    const handType = body({ font: FONT.sansMedium, color: CREAM, size: 10.5 })
    section(
        element ? `${L.handShape} · ${element}` : L.handShape,
        height(r.hand.type, handType) +
            height(r.hand.observation, note()) +
            height(r.hand.interpretation, body()) +
            12,
    )
    doc.y += write(r.hand.type, left, doc.y, handType)
    doc.y += 6
    doc.y += write(r.hand.observation, left, doc.y, note())
    doc.y += 6
    doc.y += write(r.hand.interpretation, left, doc.y, body())

    // the lines
    section(L.theLines, 90)
    r.lines.forEach((line, i) => {
        const visible = line.visibility !== "not_visible"
        const tag = [
            L.visibility[line.visibility],
            visible ? L.confidence[line.confidence] : "",
        ]
            .filter(Boolean)
            .join(" · ")
            .toUpperCase()
        const head = 22
        const quality = visible ? height(line.quality, serifNote) + 4 : 0
        const bar = visible ? 16 : 0
        const obs = height(line.observation, note()) + 6
        const text = height(line.interpretation, body())
        const total = head + quality + bar + obs + text + (i ? 22 : 0)
        keep(total)

        let ly = doc.y
        if (i && !atTop()) {
            ly += 10
            rule(ly)
            ly += 12
        }
        doc.circle(left + 4, ly + 8, 3.5).fill(LINE_HEX[line.key])
        write(L.lines[line.key], left + 16, ly, {
            font: FONT.serifMedium,
            size: 16,
        })
        write(tag, left, ly + 5, label({ align: "right" }))
        ly += head
        if (visible) {
            ly += write(line.quality, left + 16, ly, serifNote) + 4
            // strength: a thin gold bar on a faint track
            const track = 150
            const pct = Math.max(0, Math.min(100, line.strength))
            doc.rect(left + 16, ly + 3, track, 2.5).fill(TRACK)
            if (pct) {
                doc.rect(left + 16, ly + 3, (track * pct) / 100, 2.5).fill(GOLD)
            }
            write(`${String(pct)}%`, left + track + 26, ly, label())
            ly += bar
        }
        ly += write(
            line.observation,
            left + 16,
            ly,
            note({ width: WIDTH - 16 }),
        )
        ly += 6
        ly += write(
            line.interpretation,
            left + 16,
            ly,
            body({ width: WIDTH - 16 }),
        )
        doc.y = ly
    })

    // the mounts, two to a row
    const colGap = 28
    const colW = (WIDTH - colGap) / 2
    const mountHeight = (m: PalmReport["mounts"][number]) =>
        22 + 14 + height(m.interpretation, body({ width: colW }))
    const rows: PalmReport["mounts"][] = []
    for (let i = 0; i < r.mounts.length; i += 2) {
        rows.push(r.mounts.slice(i, i + 2))
    }
    section(L.theMounts, rows[0] ? Math.max(...rows[0].map(mountHeight)) : 0)
    rows.forEach((row, i) => {
        const h = Math.max(...row.map(mountHeight)) + (i ? 20 : 0)
        keep(h)
        let ry = doc.y
        if (i && !atTop()) {
            ry += 8
            rule(ry)
            ry += 12
        }
        row.forEach((m, j) => {
            const x = left + j * (colW + colGap)
            write(L.mounts[m.name], x, ry, {
                font: FONT.serifMedium,
                size: 15,
                width: colW,
            })
            write(
                L.prominence[m.prominence].toUpperCase(),
                x,
                ry + 22,
                label({
                    color: m.prominence === "not_visible" ? MUTED : GOLD,
                    width: colW,
                }),
            )
            write(m.interpretation, x, ry + 36, body({ width: colW }))
        })
        doc.y = ry + Math.max(...row.map(mountHeight))
    })
    if (r.mountsText) {
        const s = { ...serifNote, size: 14, color: BODY }
        keep(height(r.mountsText, s) + 18)
        doc.y += 18
        doc.y += write(r.mountsText, left, doc.y, s)
    }

    // overall reading
    const overall = [
        [L.personality, r.overall.personality],
        [L.relationships, r.overall.relationships],
        [L.career, r.overall.career],
        [L.lifeThemes, r.overall.lifeThemes],
    ] as const
    const partHeight = (text: string) => 24 + height(text, body())
    section(L.overall, partHeight(overall[0][1]))
    overall.forEach(([title, text], i) => {
        keep(partHeight(text) + (i ? 14 : 0))
        if (i && !atTop()) {
            doc.y += 14
        }
        doc.y += write(title, left, doc.y, {
            font: FONT.serifMedium,
            size: 15,
            color: GOLD_BRIGHT,
        })
        doc.y += 5
        doc.y += write(text, left, doc.y, body())
    })

    // carry this: the advice in a gold-ruled box
    if (r.advice) {
        const pad = 22
        const s: TextStyle = {
            font: FONT.serifItalic,
            size: 17,
            lineGap: 2,
            align: "center",
            width: WIDTH - pad * 2,
        }
        const h = pad + 14 + height(r.advice, s) + pad
        keep(h + 30)
        const by = atTop() ? doc.y : doc.y + 30
        doc.rect(left, by, WIDTH, h).lineWidth(0.75).strokeColor(GOLD).stroke()
        write(
            L.carry.toUpperCase(),
            left,
            by + pad - 4,
            label({ color: GOLD, align: "center", spacing: 2.4 }),
        )
        write(r.advice, left + pad, by + pad + 14, s)
        doc.y = by + h
    }

    footers(L.footer)

    doc.end()
    return done
}
