import type { Body, Language, ZodiacSign } from "../constants/index.ts"
import type { ChartResponse } from "../types/index.ts"
import {
    A4,
    CREAM,
    FONT,
    GOLD,
    INK,
    MUTED,
    RULE,
    TRACK,
    WIDTH,
    kit,
    newDoc,
} from "./pdf.ts"

// the wheel's own tints (NatalChart.jsx), pre-blended onto the ink
const SAGE = "#5F8B7A"
const HAIR = "#686B71" // cream at 35%
const SOFT_MUTED = "#AFACA7" // cream at 68%

const SIGN_GLYPH: Record<ZodiacSign, string> = {
    aries: "♈",
    taurus: "♉",
    gemini: "♊",
    cancer: "♋",
    leo: "♌",
    virgo: "♍",
    libra: "♎",
    scorpio: "♏",
    sagittarius: "♐",
    capricorn: "♑",
    aquarius: "♒",
    pisces: "♓",
}
const SIGNS = Object.keys(SIGN_GLYPH) as ZodiacSign[]

const BODY_GLYPH: Record<Body, string> = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
    northNode: "☊",
}

const ROMAN = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
]

const LABELS = {
    en: {
        natalChart: "Natal chart",
        theReading: "The reading",
        placements: "Exact placements · Tropical · {system}",
        houseSystem: { placidus: "Placidus", wholeSign: "Whole sign" },
        body: "Body",
        sign: "Sign",
        degree: "Degree",
        house: "House",
        ascendant: "Ascendant",
        midheaven: "Midheaven",
        retro: "℞ = retrograde: from Earth the planet looked like it was moving backwards when you were born, which turns its themes inward rather than outward. Positions computed server-side to arc-minute precision.",
        signs: {
            aries: "Aries",
            taurus: "Taurus",
            gemini: "Gemini",
            cancer: "Cancer",
            leo: "Leo",
            virgo: "Virgo",
            libra: "Libra",
            scorpio: "Scorpio",
            sagittarius: "Sagittarius",
            capricorn: "Capricorn",
            aquarius: "Aquarius",
            pisces: "Pisces",
        },
        bodies: {
            sun: "Sun",
            moon: "Moon",
            mercury: "Mercury",
            venus: "Venus",
            mars: "Mars",
            jupiter: "Jupiter",
            saturn: "Saturn",
            uranus: "Uranus",
            neptune: "Neptune",
            pluto: "Pluto",
            northNode: "North Node",
        },
        locale: "en-GB",
    },
    // the website's own German wording (frontend i18n/de/readings.js)
    de: {
        natalChart: "Geburtshoroskop",
        theReading: "Die Deutung",
        placements: "Exakte Positionen · Tropisch · {system}",
        houseSystem: { placidus: "Placidus", wholeSign: "Ganzzeichen" },
        body: "Planet",
        sign: "Zeichen",
        degree: "Grad",
        house: "Haus",
        ascendant: "Aszendent",
        midheaven: "Medium Coeli",
        retro: "℞ = rückläufig: Von der Erde aus schien sich der Planet bei deiner Geburt rückwärts zu bewegen, was seine Themen eher nach innen als nach außen lenkt. Positionen serverseitig auf die Bogenminute genau berechnet.",
        signs: {
            aries: "Widder",
            taurus: "Stier",
            gemini: "Zwillinge",
            cancer: "Krebs",
            leo: "Löwe",
            virgo: "Jungfrau",
            libra: "Waage",
            scorpio: "Skorpion",
            sagittarius: "Schütze",
            capricorn: "Steinbock",
            aquarius: "Wassermann",
            pisces: "Fische",
        },
        bodies: {
            sun: "Sonne",
            moon: "Mond",
            mercury: "Merkur",
            venus: "Venus",
            mars: "Mars",
            jupiter: "Jupiter",
            saturn: "Saturn",
            uranus: "Uranus",
            neptune: "Neptun",
            pluto: "Pluto",
            northNode: "Nordknoten",
        },
        locale: "de-DE",
    },
} satisfies Record<Language, unknown>

const pad = (n: number) => String(n).padStart(2, "0")
const degText = (p: { degree: number; minute: number }) =>
    `${pad(p.degree)}°${pad(p.minute)}′`
const norm = (a: number) => ((a % 360) + 360) % 360

/** A run of text drawn in one font; ℞ needs a different one from the mono. */
interface Run {
    text: string
    font: string
}

/** "15° ℞" as runs: everything in `font`, the ℞ in Noto Sans. */
const runs = (text: string, font: string): Run[] =>
    text
        .split(/(℞)/)
        .filter(Boolean)
        .map((t) => ({ text: t, font: t === "℞" ? FONT.noto : font }))

/** The chart as a dark A4 PDF: the wheel plate, the reading, the placements. */
export function natalPdf(data: ChartResponse, lang: Language): Promise<Buffer> {
    const L = lang === "de" ? LABELS.de : LABELS.en
    const { profile, chart, reading } = data
    const { doc, done } = newDoc(`${profile.name} · ${L.natalChart}`)
    const {
        left,
        height,
        write,
        rule,
        keep,
        atTop,
        label,
        body,
        header,
        footers,
    } = kit(doc)

    /** Measures and draws runs on one line; returns the width. */
    const drawRuns = (
        rs: Run[],
        x: number,
        y: number,
        size: number,
        color: string,
        measureOnly = false,
    ) => {
        let w = 0
        for (const r of rs) {
            doc.font(r.font).fontSize(size)
            if (!measureOnly) {
                doc.fillColor(color).text(r.text, x + w, y, {
                    lineBreak: false,
                })
            }
            w += doc.widthOfString(r.text)
        }
        return w
    }
    /** Text whose visual middle sits on (x, y), like SVG's central baseline. */
    const centered = (
        rs: Run[],
        x: number,
        y: number,
        size: number,
        color: string,
        knockout = false,
    ) => {
        const w = drawRuns(rs, 0, 0, size, color, true)
        // planets sit on the house lines; a patch of sky keeps them legible
        if (knockout) {
            doc.rect(x - w / 2 - 1, y - size * 0.55, w + 2, size * 1.1).fill(
                INK,
            )
        }
        // pdfkit places the line box's top at y; the ascent sits above the baseline
        doc.font(rs[0]?.font ?? FONT.mono).fontSize(size)
        const f = (
            doc as unknown as {
                _font: { ascender: number; capHeight: number }
            }
        )._font
        const top = y - ((f.ascender - f.capHeight / 2) / 1000) * size
        drawRuns(rs, x - w / 2, top, size, color)
    }

    header(L.natalChart)

    // ── the wheel: NatalChart.jsx's 600-unit geometry, scaled onto the page
    const S = 0.7
    const CX = A4.width / 2
    const CY = 76 + 300 * S
    const asc = chart.angles.asc.lon
    const cusps = chart.houses.map((h) => h.lon)
    const P = (lon: number, r: number): [number, number] => {
        const a = ((180 + lon - asc) * Math.PI) / 180
        return [CX + r * S * Math.cos(a), CY - r * S * Math.sin(a)]
    }
    const line = (
        a: [number, number],
        b: [number, number],
        color: string,
        w: number,
    ) => {
        doc.moveTo(a[0], a[1])
            .lineTo(b[0], b[1])
            .lineWidth(w * S)
            .strokeColor(color)
            .stroke()
    }

    for (const [r, w] of [
        [282, 0.9],
        [258, 0.55],
        [234, 0.8],
        [120, 0.6],
    ] as const) {
        doc.circle(CX, CY, r * S)
            .lineWidth(w * S)
            .strokeColor(CREAM)
            .stroke()
    }
    for (let d = 0; d < 360; d++) {
        const major = d % 30 === 0
        const ten = d % 10 === 0
        const len = major ? 24 : ten ? 12 : d % 5 === 0 ? 8 : 4
        line(P(d, 282), P(d, 282 - len), CREAM, major ? 0.9 : ten ? 0.7 : 0.45)
    }
    SIGNS.forEach((sign, m) => {
        line(P(m * 30, 234), P(m * 30, 258), HAIR, 0.6)
        const [x, y] = P(m * 30 + 15, 246)
        centered(
            [{ text: SIGN_GLYPH[sign], font: FONT.symbols }],
            x,
            y,
            15 * S,
            CREAM,
        )
    })
    cusps.forEach((cu, k) => {
        const angle = k % 3 === 0
        line(
            P(cu, 120),
            P(cu, angle ? 282 : 234),
            angle ? CREAM : HAIR,
            angle ? 1 : 0.5,
        )
        const span = norm((cusps[(k + 1) % 12] ?? cu) - cu)
        const [x, y] = P(norm(cu + span / 2), 135)
        centered(
            [{ text: ROMAN[k] ?? "", font: FONT.mono }],
            x,
            y,
            10.5 * S,
            SOFT_MUTED,
        )
    })
    for (const [k, text, color] of [
        [0, "AC", CREAM],
        [9, "MC", CREAM],
        [6, "DC", SOFT_MUTED],
        [3, "IC", SOFT_MUTED],
    ] as const) {
        const [x, y] = P(cusps[k] ?? 0, 296)
        centered([{ text, font: FONT.mono }], x, y, 10 * S, color)
    }

    // bodies closer than 9° are fanned out, with a leader back to the true spot
    const placed = chart.bodies
        .map((b) => ({ ...b, D: b.lon }))
        .sort((a, b) => a.lon - b.lon)
    let prev = -99
    for (const p of placed) {
        if (p.D - prev < 9) {
            p.D = prev + 9
        }
        prev = p.D
    }
    for (const p of placed) {
        line(P(p.lon, 234), P(p.lon, 226), CREAM, 0.9)
        if (p.D !== p.lon) {
            line(P(p.lon, 226), P(p.D, 214), HAIR, 0.5)
        }
        const [gx, gy] = P(p.D, 200)
        centered(
            [
                {
                    text: BODY_GLYPH[p.body],
                    font: p.body === "sun" ? FONT.symbols2 : FONT.symbols,
                },
            ],
            gx,
            gy,
            18 * S,
            CREAM,
            true,
        )
        const [dx, dy] = P(p.D, 176)
        centered(
            runs(`${pad(p.degree)}°${p.retrograde ? " ℞" : ""}`, FONT.mono),
            dx,
            dy,
            10 * S,
            SOFT_MUTED,
            true,
        )
    }
    const lonOf = Object.fromEntries(chart.bodies.map((b) => [b.body, b.lon]))
    for (const a of chart.aspects) {
        line(
            P(lonOf[a.a] ?? 0, 118),
            P(lonOf[a.b] ?? 0, 118),
            a.type === "trine" || a.type === "sextile" ? GOLD : SAGE,
            a.angle % 90 === 0 ? 0.75 : 0.55,
        )
    }
    doc.circle(CX, CY, 1.6 * S).fill(CREAM)

    // ── meta line, headline, chips, summary
    const dob = new Intl.DateTimeFormat(L.locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${profile.birthDate.slice(0, 10)}T00:00:00Z`))
    const metaLine = [
        profile.name,
        dob,
        profile.birthTime,
        [profile.city, profile.country].filter(Boolean).join(", "),
    ]
        .filter(Boolean)
        .join(" · ")

    let y = CY + 300 * S + 22
    y += write(
        metaLine.toUpperCase(),
        left,
        y,
        label({ size: 7.5, color: SAGE, align: "center", spacing: 1.6 }),
    )
    y += 12
    y += write(reading.headline.join(",\n"), left, y, {
        font: FONT.serifMedium,
        size: 28,
        align: "center",
        lineGap: -2,
    })
    y += 14

    // chips: centred rows that wrap like the page's flex row
    const chipLabel = label({ size: 6.5, spacing: 1.2 })
    const chipValue = label({ size: 8.5, color: CREAM, spacing: 0.3 })
    const chipPad = 8
    const chipGap = 6
    const chips = reading.chips.map((c) => {
        const lw = doc
            .font(chipLabel.font)
            .fontSize(chipLabel.size)
            .widthOfString(c.label.toUpperCase(), {
                characterSpacing: chipLabel.spacing,
            })
        const vw = doc
            .font(chipValue.font)
            .fontSize(chipValue.size)
            .widthOfString(c.value, { characterSpacing: chipValue.spacing })
        return { ...c, lw, vw, w: chipPad * 2 + lw + 6 + vw }
    })
    const chipRows: (typeof chips)[] = [[]]
    for (const c of chips) {
        const row = chipRows[chipRows.length - 1] ?? []
        const used = row.reduce((s, r) => s + r.w + chipGap, 0)
        if (row.length && used + c.w > WIDTH) {
            chipRows.push([c])
        } else {
            row.push(c)
        }
    }
    const chipH = 20
    for (const row of chipRows) {
        const total =
            row.reduce((s, r) => s + r.w, 0) + chipGap * (row.length - 1)
        let x = left + (WIDTH - total) / 2
        for (const c of row) {
            doc.rect(x, y, c.w, chipH).fill(TRACK)
            doc.rect(x, y, c.w, chipH).lineWidth(0.5).strokeColor(HAIR).stroke()
            write(c.label.toUpperCase(), x + chipPad, y + 7.5, {
                ...chipLabel,
                width: c.lw + 4,
            })
            write(c.value, x + chipPad + c.lw + 6, y + 5.5, {
                ...chipValue,
                width: c.vw + 4,
            })
            x += c.w + chipGap
        }
        y += chipH + chipGap
    }
    y += 10
    write(reading.summary, left + 50, y, {
        font: FONT.sans,
        size: 10.5,
        color: SOFT_MUTED,
        lineGap: 3,
        align: "center",
        width: WIDTH - 100,
    })

    // ── the reading, from page two
    doc.addPage()
    y = doc.y
    y += write(L.theReading, left, y, { font: FONT.serifMedium, size: 24 })
    rule(y + 8, CREAM, left, WIDTH, 0.75)
    doc.y = y + 8

    const para = body({ size: 10, color: CREAM, lineGap: 3.5 })
    const captionStyle = label({
        size: 7,
        color: GOLD,
        spacing: 1,
        width: WIDTH - 12,
        lineGap: 2,
    })
    const titleStyle = {
        font: FONT.serifMedium,
        size: 20,
        width: WIDTH - 176,
    }
    for (const s of reading.sections) {
        const caption = s.caption.toUpperCase()
        const head = 18 + Math.max(height(s.title, titleStyle), 20) + 10
        const cap = height(caption, captionStyle) + 12
        const first = height(s.paragraphs[0] ?? "", para)
        // the heading never sits alone at the foot of a page
        keep(head + cap + first)
        let sy = doc.y + (atTop() ? 0 : 18)
        write(s.numeral, left, sy + 6, label({ size: 7.5, color: SAGE }))
        write(s.title, left + 26, sy, titleStyle)
        write(
            s.subtitle.toUpperCase(),
            left,
            sy + 7,
            label({ size: 7, align: "right" }),
        )
        sy += Math.max(height(s.title, titleStyle), 20) + 10
        // the placement strip, behind a gold rule
        const ch = height(caption, captionStyle)
        doc.moveTo(left, sy - 1)
            .lineTo(left, sy + ch - 1)
            .lineWidth(0.75)
            .strokeColor(GOLD)
            .stroke()
        write(caption, left + 10, sy, captionStyle)
        sy += ch + 12
        doc.y = sy
        s.paragraphs.forEach((p, i) => {
            const h = height(p, para)
            keep(h + (i ? 10 : 0))
            const py = doc.y + (i && !atTop() ? 10 : 0)
            doc.y = py + write(p, left, py, para)
        })
        doc.y += 18
        // the last one runs into the table's own box instead
        if (s !== reading.sections.at(-1)) {
            rule(doc.y, RULE)
        }
    }

    // ── exact placements
    const rows = chart.bodies.map((b) => ({
        body: runs(L.bodies[b.body] + (b.retrograde ? " ℞" : ""), FONT.mono),
        sign: L.signs[b.sign],
        deg: degText(b),
        house: pad(b.house),
    }))
    for (const [name, point, house] of [
        [L.ascendant, chart.angles.asc, "01"],
        [L.midheaven, chart.angles.mc, "10"],
    ] as const) {
        rows.push({
            body: runs(name, FONT.mono),
            sign: L.signs[point.sign],
            deg: degText(point),
            house,
        })
    }
    const rowH = 19
    const title = L.placements
        .replace("{system}", L.houseSystem[chart.meta.houseSystem])
        .toUpperCase()
    const note = label({
        size: 6.5,
        spacing: 0.6,
        lineGap: 2,
        width: WIDTH - 32,
    })
    const noteH = height(L.retro.replace("℞", "R").toUpperCase(), note)
    const tableH = 40 + rowH * (rows.length + 1) + noteH + 26
    keep(tableH + 28)
    const ty = atTop() ? doc.y : doc.y + 28
    doc.rect(left, ty, WIDTH, tableH).fill(TRACK)
    doc.rect(left, ty, WIDTH, tableH).lineWidth(0.5).strokeColor(HAIR).stroke()
    write(
        title,
        left + 16,
        ty + 15,
        label({ size: 7, color: CREAM, spacing: 2 }),
    )
    let ry = ty + 40
    rule(ry, HAIR, left, WIDTH)
    const cols = { body: left + 16, sign: left + 190, right: left + WIDTH - 16 }
    const degX = left + WIDTH - 110
    const head = label({ size: 6.5, spacing: 1.4 })
    write(L.body.toUpperCase(), cols.body, ry + 7, head)
    write(L.sign.toUpperCase(), cols.sign, ry + 7, head)
    write(L.degree.toUpperCase(), degX - 100, ry + 7, {
        ...head,
        width: 100,
        align: "right",
    })
    write(L.house.toUpperCase(), cols.right - 60, ry + 7, {
        ...head,
        width: 60,
        align: "right",
    })
    ry += rowH
    const cell = label({ size: 8.5, color: CREAM, spacing: 0.2 })
    for (const r of rows) {
        rule(ry, RULE, left + 16, WIDTH - 32)
        drawRuns(r.body, cols.body, ry + 5.5, cell.size, CREAM)
        write(r.sign, cols.sign, ry + 5.5, cell)
        write(r.deg, degX - 100, ry + 5.5, {
            ...cell,
            width: 100,
            align: "right",
        })
        write(r.house, cols.right - 60, ry + 5.5, {
            ...cell,
            color: SOFT_MUTED,
            width: 60,
            align: "right",
        })
        ry += rowH
    }
    rule(ry, HAIR, left, WIDTH)
    // the note opens with ℞, which the mono face does not carry
    const [, rest = ""] = L.retro.split(/^℞/)
    doc.font(FONT.noto)
        .fontSize(note.size)
        .fillColor(MUTED)
        .text("℞", left + 16, ry + 12, {
            continued: true,
            width: note.width,
            lineGap: note.lineGap,
        })
        .font(FONT.mono)
        .text(rest.toUpperCase(), {
            characterSpacing: note.spacing,
            width: note.width,
            lineGap: note.lineGap,
        })
    doc.y = ty + tableH

    footers(metaLine.toUpperCase())
    doc.end()
    return done
}
