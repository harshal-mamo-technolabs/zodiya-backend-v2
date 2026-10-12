import { Bodies, type Body } from "../constants/index.ts"
import type { NatalChart } from "../types/index.ts"

/**
 * Astrocartography for the voice astrologer: where on Earth each planet was
 * rising (AC), culminating (MC), setting (DC) or at the nadir (IC) at birth.
 * The same casting as the portal's globe (frontend src/lib/astromap.js), so
 * the astrologer and the page agree.
 */

export type Angle = "AC" | "MC" | "DC" | "IC"

export interface PlanetLine {
    body: Body
    angle: Angle
    /** [lat, lon] in degrees. */
    points: [number, number][]
}

export interface NearLine {
    body: Body
    angle: Angle
    km: number
}

const D2R = Math.PI / 180
const R2D = 180 / Math.PI
const norm = (a: number) => ((a % 360) + 360) % 360
const wrap = (a: number) => {
    const n = norm(a)
    return n > 180 ? n - 360 : n
}

/** The globe's planets; the outer three start hidden there but still count here. */
const LINE_BODIES: Body[] = [
    Bodies.SUN,
    Bodies.MOON,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
    Bodies.JUPITER,
    Bodies.SATURN,
    Bodies.URANUS,
    Bodies.NEPTUNE,
    Bodies.PLUTO,
]

export const ORB_KM = 800

/** Major cities the "best places" picks are chosen from (same list as the page). */
export const CITIES: [string, number, number][] = [
    ["London", 51.507, -0.128],
    ["Paris", 48.857, 2.352],
    ["Berlin", 52.52, 13.405],
    ["Rome", 41.903, 12.496],
    ["Madrid", 40.417, -3.704],
    ["Lisbon", 38.722, -9.139],
    ["Amsterdam", 52.368, 4.904],
    ["Vienna", 48.208, 16.374],
    ["Zurich", 47.377, 8.542],
    ["Stockholm", 59.329, 18.069],
    ["Athens", 37.984, 23.728],
    ["Istanbul", 41.008, 28.978],
    ["Dubai", 25.205, 55.271],
    ["Cairo", 30.044, 31.236],
    ["Cape Town", -33.925, 18.424],
    ["Nairobi", -1.286, 36.817],
    ["Mumbai", 19.076, 72.878],
    ["Delhi", 28.614, 77.209],
    ["Bangkok", 13.756, 100.502],
    ["Singapore", 1.352, 103.82],
    ["Bali", -8.41, 115.189],
    ["Hong Kong", 22.319, 114.169],
    ["Tokyo", 35.676, 139.65],
    ["Seoul", 37.567, 126.978],
    ["Sydney", -33.869, 151.209],
    ["Melbourne", -37.814, 144.963],
    ["Auckland", -36.849, 174.763],
    ["Honolulu", 21.307, -157.858],
    ["Los Angeles", 34.052, -118.244],
    ["San Francisco", 37.775, -122.419],
    ["Vancouver", 49.283, -123.121],
    ["Mexico City", 19.433, -99.133],
    ["New York", 40.713, -74.006],
    ["Toronto", 43.653, -79.383],
    ["Miami", 25.762, -80.192],
    ["Rio de Janeiro", -22.907, -43.173],
    ["Buenos Aires", -34.604, -58.382],
    ["Lima", -12.046, -77.043],
    ["Reykjavík", 64.147, -21.943],
    ["Marrakesh", 31.629, -7.981],
]

/** Life themes and the planet lines tradition ties to them (same as the page). */
export const THEMES: { key: string; lines: [Body, Angle][] }[] = [
    {
        key: "love",
        lines: [
            [Bodies.VENUS, "DC"],
            [Bodies.VENUS, "AC"],
            [Bodies.MOON, "DC"],
        ],
    },
    {
        key: "career",
        lines: [
            [Bodies.SUN, "MC"],
            [Bodies.JUPITER, "MC"],
            [Bodies.SATURN, "MC"],
        ],
    },
    {
        key: "luck",
        lines: [
            [Bodies.JUPITER, "AC"],
            [Bodies.JUPITER, "MC"],
            [Bodies.JUPITER, "DC"],
            [Bodies.JUPITER, "IC"],
        ],
    },
    {
        key: "home",
        lines: [
            [Bodies.MOON, "IC"],
            [Bodies.VENUS, "IC"],
            [Bodies.JUPITER, "IC"],
        ],
    },
]

/** Every planet's four lines for a natal chart. */
export function computeLines(chart: NatalChart): PlanetLine[] {
    // Greenwich sidereal time at birth: the chart's RAMC less the birth longitude
    const gast = norm(chart.angles.ramc - chart.meta.lon)
    const eps = chart.angles.obliquity * D2R
    const out: PlanetLine[] = []
    for (const p of chart.bodies) {
        if (!LINE_BODIES.includes(p.body)) {
            continue
        }
        const L = p.lon * D2R
        const dec = Math.asin(Math.sin(eps) * Math.sin(L))
        const ra = norm(
            Math.atan2(Math.sin(L) * Math.cos(eps), Math.cos(L)) * R2D,
        )
        const mc = wrap(ra - gast)
        const meridian = (lon: number): [number, number][] =>
            Array.from({ length: 681 }, (_, i) => [-85 + i * 0.25, lon])
        out.push({ body: p.body, angle: "MC", points: meridian(mc) })
        out.push({
            body: p.body,
            angle: "IC",
            points: meridian(wrap(mc + 180)),
        })
        const ac: [number, number][] = []
        const dc: [number, number][] = []
        for (let f = -89; f <= 89; f += 0.25) {
            const c = -Math.tan(f * D2R) * Math.tan(dec)
            if (Math.abs(c) > 1) {
                continue
            }
            const h = Math.acos(c) * R2D
            ac.push([f, wrap(ra - h - gast)])
            dc.push([f, wrap(ra + h - gast)])
        }
        if (ac.length > 2) {
            out.push({ body: p.body, angle: "AC", points: ac })
        }
        if (dc.length > 2) {
            out.push({ body: p.body, angle: "DC", points: dc })
        }
    }
    return out
}

export function haversine(a1: number, o1: number, a2: number, o2: number) {
    const dLat = (a2 - a1) * D2R
    const dLon = (o2 - o1) * D2R
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(a1 * D2R) * Math.cos(a2 * D2R) * Math.sin(dLon / 2) ** 2
    return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Lines within the orb of a point, nearest first. */
export function nearby(
    lines: PlanetLine[],
    lat: number,
    lon: number,
    orbKm = ORB_KM,
): NearLine[] {
    return lines
        .map((l) => {
            let km = Infinity
            for (const [pLat, pLon] of l.points) {
                km = Math.min(km, haversine(lat, lon, pLat, pLon))
            }
            return { body: l.body, angle: l.angle, km }
        })
        .filter((r) => r.km <= orbKm)
        .sort((a, b) => a.km - b.km)
}

/** For each theme, the listed city closest to one of its lines; null when none is within the orb. */
export function bestPlaces(lines: PlanetLine[]) {
    return THEMES.map((theme) => {
        const wanted = lines.filter((l) =>
            theme.lines.some(([b, a]) => b === l.body && a === l.angle),
        )
        let best: (NearLine & { city: string }) | null = null
        for (const [city, lat, lon] of CITIES) {
            const [closest] = nearby(wanted, lat, lon)
            if (closest && (!best || closest.km < best.km)) {
                best = { ...closest, city }
            }
        }
        return { theme: theme.key, best }
    })
}
