import {
    ASPECT_ANGLES,
    AspectTypes,
    Bodies,
    HOROSCOPE_ALL_BODIES,
    HOROSCOPE_MOON_ORB,
    HOROSCOPE_SKY_BODIES,
    HOROSCOPE_SKY_ORB,
    HOROSCOPE_STATION_SPEED,
    HOUSE_RELATION,
    HoroscopePeriods,
    Lunations,
    MOON_PHASE_ORDER,
    QUIET_RELATION,
    TRANSIT_ASPECT_GROUP,
    SIGN_ORDER,
    type Body,
    type HoroscopePeriod,
    type Lunation,
    type MoonPhase,
    type ZodiacSign,
} from "../constants/index.ts"
import type {
    HoroscopeReading,
    HoroscopeSky,
    SkyAspect,
    SkyBody,
    SkyEvent,
    SkyMoon,
} from "../types/index.ts"
import { localDate, noonJd, shiftDate } from "../utils/index.ts"
import type { ChartService } from "./ChartService.ts"

const DAY_MS = 86_400_000
const norm360 = (deg: number) => ((deg % 360) + 360) % 360
const separation = (a: number, b: number) => {
    const d = norm360(a - b)
    return d > 180 ? 360 - d : d
}
const signIndex = (lon: number) => Math.floor(norm360(lon) / 30)

/**
 * The sky as one sun sign sees it, for a day, a week or a year. Everything
 * is computed from the ephemeris at the moment asked for, so any date, past
 * or future, reads the real positions of that date.
 */
export class HoroscopeService {
    constructor(private chartService: ChartService) {}

    compute(
        sign: ZodiacSign,
        period: HoroscopePeriod,
        date: string,
        zone: string,
    ): HoroscopeReading {
        const span = this.span(period, date)
        const reference = this.reference(period, span)
        const sky = this.sky(sign, reference, zone)

        // sample a day either side of the span, or a month either side of the year,
        // so a change on the first morning or last evening is still caught
        const samples =
            period === HoroscopePeriods.YEARLY
                ? this.months(span.start)
                : this.days(
                      shiftDate(span.start, -1),
                      period === HoroscopePeriods.DAILY ? 3 : 9,
                  )
        const events = this.events(sign, samples, zone, period).filter(
            (e) => e.date >= span.start && e.date <= span.end,
        )
        const moonSigns =
            period === HoroscopePeriods.WEEKLY
                ? this.moonSigns(this.days(span.start, 7), zone)
                : [sky.moon.sign]

        return { sign, period, date, span, sky, events, moonSigns }
    }

    /** One moment's positions, read for the sign. */
    sky(sign: ZodiacSign, date: string, zone: string): HoroscopeSky {
        const { longitudes, speeds } = this.chartService.sky(
            noonJd(date, zone),
            HOROSCOPE_ALL_BODIES,
        )
        const s = SIGN_ORDER.indexOf(sign)
        const bodies: SkyBody[] = HOROSCOPE_ALL_BODIES.map((body) => {
            const lon = longitudes.get(body) ?? 0
            const speed = speeds.get(body) ?? 0
            const house = ((signIndex(lon) - s + 12) % 12) + 1
            return {
                body,
                lon: Math.round(lon * 100) / 100,
                speed,
                sign: SIGN_ORDER[signIndex(lon)] ?? sign,
                house,
                relation: HOUSE_RELATION[house] ?? QUIET_RELATION,
                retrograde:
                    body !== Bodies.SUN && body !== Bodies.MOON && speed < 0,
                stationary:
                    body !== Bodies.SUN &&
                    body !== Bodies.MOON &&
                    Math.abs(speed) < HOROSCOPE_STATION_SPEED,
            }
        })

        return {
            date,
            bodies,
            aspects: this.aspects(longitudes),
            moon: this.moon(longitudes, bodies),
        }
    }

    private aspects(longitudes: Map<Body, number>): SkyAspect[] {
        const out: SkyAspect[] = []
        const pairs: [Body, Body][] = []
        for (let i = 0; i < HOROSCOPE_SKY_BODIES.length; i++) {
            for (let j = i + 1; j < HOROSCOPE_SKY_BODIES.length; j++) {
                pairs.push([
                    HOROSCOPE_SKY_BODIES[i] ?? Bodies.SUN,
                    HOROSCOPE_SKY_BODIES[j] ?? Bodies.SUN,
                ])
            }
        }
        for (const body of HOROSCOPE_SKY_BODIES) {
            pairs.push([Bodies.MOON, body])
        }
        for (const [a, b] of pairs) {
            const gap = separation(
                longitudes.get(a) ?? 0,
                longitudes.get(b) ?? 0,
            )
            const allowed =
                a === Bodies.MOON ? HOROSCOPE_MOON_ORB : HOROSCOPE_SKY_ORB
            for (const type of Object.values(AspectTypes)) {
                const orb = Math.abs(gap - ASPECT_ANGLES[type].angle)
                if (orb <= allowed) {
                    out.push({
                        a,
                        b,
                        type,
                        kind: TRANSIT_ASPECT_GROUP[type],
                        orb: Math.round(orb * 100) / 100,
                        exact: orb <= HOROSCOPE_SKY_ORB,
                    })
                    break
                }
            }
        }
        // tightest first, and the planets' own aspects before the Moon's passing ones
        return out.sort(
            (x, y) =>
                Number(x.a === Bodies.MOON) - Number(y.a === Bodies.MOON) ||
                x.orb - y.orb,
        )
    }

    private moon(longitudes: Map<Body, number>, bodies: SkyBody[]): SkyMoon {
        const moonLon = longitudes.get(Bodies.MOON) ?? 0
        const elongation = norm360(moonLon - (longitudes.get(Bodies.SUN) ?? 0))
        const placed = bodies.find((b) => b.body === Bodies.MOON)
        return {
            phase: this.phase(elongation),
            illumination:
                Math.round(
                    ((1 - Math.cos((elongation * Math.PI) / 180)) / 2) * 100,
                ) / 100,
            sign: placed?.sign ?? SIGN_ORDER[0] ?? "aries",
            house: placed?.house ?? 1,
            relation: placed?.relation ?? QUIET_RELATION,
            lon: Math.round(moonLon * 100) / 100,
        }
    }

    /** Eight phases of 45° each, centred on the exact moment. */
    phase(elongation: number): MoonPhase {
        const i = Math.floor(((norm360(elongation) + 22.5) % 360) / 45)
        return MOON_PHASE_ORDER[i] ?? MOON_PHASE_ORDER[0] ?? "newMoon"
    }

    /** Sign changes and lunations between consecutive samples, bisected to the day they happen. */
    private events(
        sign: ZodiacSign,
        samples: string[],
        zone: string,
        period: HoroscopePeriod,
    ): SkyEvent[] {
        const out: SkyEvent[] = []
        const watched =
            period === HoroscopePeriods.YEARLY
                ? [
                      Bodies.JUPITER,
                      Bodies.SATURN,
                      Bodies.URANUS,
                      Bodies.NEPTUNE,
                      Bodies.PLUTO,
                  ]
                : HOROSCOPE_SKY_BODIES
        const lonAt = (jd: number, body: Body) =>
            this.chartService.sky(jd, [body]).longitudes.get(body) ?? 0
        const phaseAt = (jd: number) => {
            const { longitudes } = this.chartService.sky(jd, [
                Bodies.SUN,
                Bodies.MOON,
            ])
            return norm360(
                (longitudes.get(Bodies.MOON) ?? 0) -
                    (longitudes.get(Bodies.SUN) ?? 0),
            )
        }
        let prevJd = noonJd(samples[0] ?? "", zone)
        let prev = this.chartService.sky(prevJd, HOROSCOPE_ALL_BODIES)
        for (let i = 1; i < samples.length; i++) {
            const nextJd = noonJd(samples[i] ?? "", zone)
            const next = this.chartService.sky(nextJd, HOROSCOPE_ALL_BODIES)

            for (const body of watched) {
                const before = signIndex(prev.longitudes.get(body) ?? 0)
                const after = signIndex(next.longitudes.get(body) ?? 0)
                if (before !== after) {
                    const at = this.bisect(
                        prevJd,
                        nextJd,
                        (jd) => signIndex(lonAt(jd, body)) === after,
                    )
                    const date = localDate(zone, (at - 2_440_587.5) * DAY_MS)
                    out.push({ date, body, sign: SIGN_ORDER[after] ?? sign })
                }
            }

            if (period !== HoroscopePeriods.YEARLY) {
                const gapA = phaseAt(prevJd)
                const gapB = phaseAt(nextJd)
                for (const [kind, angle] of [
                    [Lunations.NEW, 0],
                    [Lunations.FULL, 180],
                ] as [Lunation, number][]) {
                    const signed = (gap: number) =>
                        norm360(gap - angle + 180) - 180
                    if (signed(gapA) < 0 && signed(gapB) >= 0) {
                        const at = this.bisect(
                            prevJd,
                            nextJd,
                            (jd) => signed(phaseAt(jd)) >= 0,
                        )
                        const date = localDate(
                            zone,
                            (at - 2_440_587.5) * DAY_MS,
                        )
                        const lit =
                            kind === Lunations.NEW ? Bodies.SUN : Bodies.MOON
                        out.push({
                            date,
                            body: kind,
                            sign: SIGN_ORDER[signIndex(lonAt(at, lit))] ?? sign,
                        })
                    }
                }
            }
            prevJd = nextJd
            prev = next
        }
        return out.sort((a, b) => a.date.localeCompare(b.date))
    }

    /** The first moment between two samples where `after` holds, to within a minute. */
    private bisect(
        lo: number,
        hi: number,
        after: (jd: number) => boolean,
    ): number {
        let a = lo,
            b = hi
        while (b - a > 1 / 1440) {
            const mid = (a + b) / 2
            if (after(mid)) {
                b = mid
            } else {
                a = mid
            }
        }
        return b
    }

    private moonSigns(days: string[], zone: string): ZodiacSign[] {
        const seen: ZodiacSign[] = []
        for (const day of days) {
            const { longitudes } = this.chartService.sky(noonJd(day, zone), [
                Bodies.MOON,
            ])
            const sign = SIGN_ORDER[signIndex(longitudes.get(Bodies.MOON) ?? 0)]
            if (sign && seen[seen.length - 1] !== sign) {
                seen.push(sign)
            }
        }
        return seen
    }

    /** The calendar span each period covers; weeks run Monday to Sunday. */
    span(
        period: HoroscopePeriod,
        date: string,
    ): { start: string; end: string } {
        if (period === HoroscopePeriods.DAILY) {
            return { start: date, end: date }
        }
        if (period === HoroscopePeriods.WEEKLY) {
            const weekday = new Date(`${date}T00:00:00Z`).getUTCDay()
            const start = shiftDate(date, -((weekday + 6) % 7))
            return { start, end: shiftDate(start, 6) }
        }
        const year = date.slice(0, 4)
        return { start: `${year}-01-01`, end: `${year}-12-31` }
    }

    /** Noon of the day, of the week's Thursday, or of the first of July. */
    private reference(
        period: HoroscopePeriod,
        span: { start: string; end: string },
    ): string {
        if (period === HoroscopePeriods.DAILY) {
            return span.start
        }
        if (period === HoroscopePeriods.WEEKLY) {
            return shiftDate(span.start, 3)
        }
        return `${span.start.slice(0, 4)}-07-01`
    }

    private days(start: string, count: number): string[] {
        return Array.from({ length: count }, (_, i) => shiftDate(start, i))
    }

    /** The first of each month, from the December before to the January after. */
    private months(start: string): string[] {
        const year = Number(start.slice(0, 4))
        const out = [`${String(year - 1)}-12-01`]
        for (let m = 1; m <= 12; m++) {
            out.push(`${String(year)}-${String(m).padStart(2, "0")}-01`)
        }
        out.push(`${String(year + 1)}-01-01`)
        return out
    }
}
