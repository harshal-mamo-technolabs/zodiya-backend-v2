/* What every AstroMeridian PDF shares: the fonts, the website's palette, an
   A4 page painted as the night sky, small text helpers and the footer. */
import path from "path"
import { fileURLToPath } from "url"
import PDFDocument from "pdfkit"

// src/services in dev and tests, dist/services in the image: both two levels below the root
const FONTS = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../assets/fonts",
)
export const FONT = {
    serif: path.join(FONTS, "CormorantGaramond-Regular.ttf"),
    serifMedium: path.join(FONTS, "CormorantGaramond-Medium.ttf"),
    serifItalic: path.join(FONTS, "CormorantGaramond-Italic.ttf"),
    sans: path.join(FONTS, "InstrumentSans-Regular.ttf"),
    sansMedium: path.join(FONTS, "InstrumentSans-Medium.ttf"),
    mono: path.join(FONTS, "IBMPlexMono-Regular.ttf"),
    // zodiac and planet glyphs; ☉ lives in Symbols 2, ℞ only in Noto Sans
    symbols: path.join(FONTS, "NotoSansSymbols-Regular.ttf"),
    symbols2: path.join(FONTS, "NotoSansSymbols2-Regular.ttf"),
    noto: path.join(FONTS, "NotoSans-Regular.ttf"),
}

// the website's palette; the cream tints are pre-blended onto the ink so no
// opacity state has to survive a page break
export const INK = "#1C2538"
export const CREAM = "#F4ECDC"
export const BODY = "#CDC8BE" // cream at 82%
export const MUTED = "#939292" // cream at 55%
export const RULE = "#3C4351" // cream at 15%
export const TRACK = "#323948" // cream at 10%
export const GOLD = "#B4933F"
export const GOLD_BRIGHT = "#E3B64B"

export const A4 = { width: 595.28, height: 841.89 }
export const MARGIN = { top: 56, bottom: 76, left: 48, right: 48 }
export const WIDTH = A4.width - MARGIN.left - MARGIN.right

/** Small deterministic PRNG (mulberry32), so the sky is the same every time. */
function seeded(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const STARS = (() => {
    const rand = seeded(1729)
    return Array.from({ length: 320 }, () => ({
        x: rand() * A4.width,
        y: rand() * A4.height,
        r: (0.3 + rand() * 0.8) / 2,
        o: 0.15 + rand() * 0.45,
    }))
})()

/** "Jürgen Weiß" -> "jurgen-weiss", for the download's file name. */
export function slug(name: string, fallback = "reading"): string {
    return (
        name
            .replace(/ß/g, "ss")
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || fallback
    )
}

export interface TextStyle {
    font: string
    size: number
    color?: string
    spacing?: number
    lineGap?: number
    align?: "left" | "center" | "right"
    width?: number
}

/**
 * A buffered A4 document whose every page, automatic breaks included, starts
 * as the night sky. `done` resolves with the bytes after `doc.end()`.
 */
export function newDoc(title: string) {
    const doc = new PDFDocument({
        size: "A4",
        margins: MARGIN,
        autoFirstPage: false,
        bufferPages: true,
        font: FONT.sans,
        info: { Title: title, Author: "AstroMeridian" },
    })
    const chunks: Buffer[] = []
    doc.on("data", (c: Buffer) => chunks.push(c))
    const done = new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => {
            resolve(Buffer.concat(chunks))
        })
        doc.on("error", reject)
    })

    doc.on("pageAdded", () => {
        doc.save()
        doc.rect(0, 0, A4.width, A4.height).fill(INK)
        for (const s of STARS) {
            doc.circle(s.x, s.y, s.r).fillOpacity(s.o).fill(CREAM)
        }
        doc.restore()
        doc.fillColor(CREAM).fillOpacity(1)
    })
    doc.addPage()
    return { doc, done }
}

/** Text and rule helpers bound to one document. */
export function kit(doc: PDFKit.PDFDocument) {
    const left = MARGIN.left
    const bottom = A4.height - MARGIN.bottom

    const style = (s: TextStyle) =>
        doc
            .font(s.font)
            .fontSize(s.size)
            .fillColor(s.color ?? CREAM)
    const opts = (s: TextStyle) => ({
        width: s.width ?? WIDTH,
        lineGap: s.lineGap ?? 0,
        characterSpacing: s.spacing ?? 0,
        align: s.align ?? "left",
    })
    const height = (text: string, s: TextStyle) =>
        text ? style(s).heightOfString(text, opts(s)) : 0
    /** Writes at (x, y) and returns the height used. */
    const write = (text: string, x: number, y: number, s: TextStyle) => {
        if (!text) {
            return 0
        }
        const h = height(text, s)
        style(s).text(text, x, y, opts(s))
        return h
    }
    const rule = (y: number, color = RULE, x = left, w = WIDTH, lw = 0.5) =>
        doc
            .moveTo(x, y)
            .lineTo(x + w, y)
            .lineWidth(lw)
            .strokeColor(color)
            .stroke()
    /** A new page when `h` will not fit below the cursor. */
    const keep = (h: number) => {
        if (doc.y + h > bottom) {
            doc.addPage()
        }
    }
    // no separator rule or gap is needed right under the top margin
    const atTop = () => doc.y <= MARGIN.top

    const label = (s: Partial<TextStyle> = {}): TextStyle => ({
        font: FONT.mono,
        size: 7,
        color: MUTED,
        spacing: 1.4,
        ...s,
    })
    const body = (s: Partial<TextStyle> = {}): TextStyle => ({
        font: FONT.sans,
        size: 9.5,
        color: BODY,
        lineGap: 2.5,
        ...s,
    })
    const note = (s: Partial<TextStyle> = {}): TextStyle => ({
        font: FONT.sans,
        size: 8.5,
        color: MUTED,
        lineGap: 2,
        ...s,
    })

    /** The ASTROMERIDIAN wordmark, the document's name and a hairline. */
    const header = (title: string) => {
        write(
            "ASTROMERIDIAN",
            left,
            40,
            label({ color: GOLD, size: 8, spacing: 3 }),
        )
        write(title, left, 36, {
            font: FONT.serifItalic,
            size: 13,
            color: BODY,
            align: "right",
        })
        rule(58)
    }

    /** Footers, once the page count is known. */
    const footers = (text: string) => {
        const range = doc.bufferedPageRange()
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i)
            // writing below the bottom margin would otherwise break to a new page
            doc.page.margins.bottom = 0
            const fy = A4.height - 44
            rule(fy - 10)
            write(
                text,
                left,
                fy,
                label({ size: 6.5, spacing: 0.6, width: WIDTH - 60 }),
            )
            write(
                `${String(i + 1)} / ${String(range.count)}`,
                left,
                fy,
                label({ size: 6.5, align: "right" }),
            )
        }
    }

    return {
        left,
        bottom,
        style,
        opts,
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
    }
}
