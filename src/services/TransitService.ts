import {
    Bodies,
    GENERATIONAL_POINTS,
    LUNATION_ORB,
    Lunations,
    MEAN_MOTION,
    NATAL_POINTS,
    NatalAngles,
    PERSONAL_POINTS,
    TRANSIT_ASPECT_ANGLES,
    TRANSIT_BODIES,
    TRANSIT_BODY_WEIGHT,
    TRANSIT_MAX_EVENTS,
    TRANSIT_ORB,
    TRANSIT_QUICK_BODIES,
    TRANSIT_QUICK_SLOTS,
    TRANSIT_SEARCH_MARGIN,
    TRANSIT_TODAY_INDEX,
    TRANSIT_WINDOW_DAYS,
    TransitAspects,
    type Body,
    type Lunation,
    type NatalPoint,
    type TransitAspect,
    type TransitBody,
} from "../constants/index.ts"
import type {
    NatalChart,
    TransitDay,
    TransitEvent,
    TransitReading,
} from "../types/index.ts"
import type { ChartService } from "./ChartService.ts"
import { localDate, noonJd, shiftDate } from "../utils/index.ts"

const DAY_MS = 86_400_000
const norm360 = (deg: number) => ((deg % 360) + 360) % 360
const separation = (a: number, b: number) =>
    Math.abs(norm360(b - a + 180) - 180)

/** These aspects are read as lighter than the rest. */
const MINOR_ASPECTS: TransitAspect[] = [
    TransitAspects.SEXTILE,
    TransitAspects.QUINCUNX,
]

const LUNATION_WEIGHT = 3
const LUNATION_BODIES: Body[] = [Bodies.SUN, Bodies.MOON]

/** Sun and Moon positions bracketing a lunation; refined by bisection. */
const LUNATION_PRECISION_DAYS = 1 / 1440

export class TransitService {
    constructor(private chartService: ChartService) {}

    /**
     * Every transiting body against every natal point over a fourteen day
     * window, four days behind today and nine ahead. `now` is injectable so
     * the window is testable; the profile's zone decides what "today" is.
     */
    compute(
        natal: NatalChart,
        timezoneId: string,
        now: Date = new Date(),
    ): TransitReading {
        const today = localDate(timezoneId, now.getTime())
        const dateAt = (index: number) =>
            shiftDate(today, index - TRANSIT_TODAY_INDEX)
        const days = Array.from({ length: TRANSIT_WINDOW_DAYS }, (_, i) =>
            dateAt(i),
        )

        // one ephemeris pass per day across the window and its search margin
        // ponytail: ~0.5s of VSOP87 per request; the answer only changes once a
        // day, so cache by (profile, today) if this page gets busy
        const first = -TRANSIT_SEARCH_MARGIN
        const last = TRANSIT_WINDOW_DAYS + TRANSIT_SEARCH_MARGIN
        const sky = new Map<number, ReturnType<ChartService["sky"]>>()
        for (let i = first; i < last; i++) {
            sky.set(
                i,
                this.chartService.sky(
                    noonJd(dateAt(i), timezoneId),
                    TRANSIT_BODIES,
                ),
            )
        }

        const natalLon = this.natalLongitudes(natal)
        const events: TransitEvent[] = []

        for (const transit of TRANSIT_BODIES) {
            for (const point of NATAL_POINTS) {
                const target = natalLon.get(point)
                if (target === undefined) {
                    continue
                }
                for (const [aspect, angle] of Object.entries(
                    TRANSIT_ASPECT_ANGLES,
                ) as [TransitAspect, number][]) {
                    const orbAt = (i: number) => {
                        const day = sky.get(i)
                        const lon = day?.longitudes.get(transit) ?? 0
                        return Math.abs(separation(lon, target) - angle)
                    }

                    const active = days
                        .map((_, i) => i)
                        .filter((i) => orbAt(i) <= TRANSIT_ORB)
                    if (active.length === 0) {
                        continue
                    }

                    const span: [number, number] = [
                        active[0] ?? 0,
                        active[active.length - 1] ?? 0,
                    ]
                    const exactIndex = this.descend(
                        orbAt,
                        this.argmin(active, orbAt),
                        first,
                        last - 1,
                    )

                    events.push({
                        id: `${transit}-${aspect}-${point}`,
                        transit,
                        natal: point,
                        aspect,
                        natalLon: target,
                        weight: this.weight(
                            TRANSIT_BODY_WEIGHT[transit],
                            point,
                            aspect,
                        ),
                        span,
                        exact: Math.min(
                            Math.max(exactIndex, 0),
                            TRANSIT_WINDOW_DAYS - 1,
                        ),
                        exactDate: dateAt(exactIndex),
                        daily: days.map((_, i): TransitDay => {
                            const day = sky.get(i)
                            return {
                                orb: this.round(orbAt(i)),
                                lon: day?.longitudes.get(transit) ?? 0,
                                speed: day?.speeds.get(transit) ?? 0,
                            }
                        }),
                        lunation: false,
                    })
                }
            }
        }

        events.push(...this.lunations(days, timezoneId, natalLon))

        // significance first; among equals, whatever peaks nearest today
        const nearest = (e: TransitEvent) =>
            Math.abs(e.exact - TRANSIT_TODAY_INDEX)
        const tightest = (e: TransitEvent) =>
            Math.min(...e.daily.map((d) => d.orb))
        const quick = (e: TransitEvent) =>
            e.lunation || (TRANSIT_QUICK_BODIES as string[]).includes(e.transit)

        // slow movers by significance; quick movers by closeness to today
        const slow = events
            .filter((e) => !quick(e))
            .sort(
                (a, b) =>
                    b.weight - a.weight ||
                    nearest(a) - nearest(b) ||
                    tightest(a) - tightest(b),
            )
        const fast = events
            .filter(quick)
            .sort(
                (a, b) =>
                    nearest(a) - nearest(b) ||
                    b.weight - a.weight ||
                    tightest(a) - tightest(b),
            )
        const quickSlots = Math.min(TRANSIT_QUICK_SLOTS, fast.length)
        const chosen = [
            ...slow.slice(0, TRANSIT_MAX_EVENTS - quickSlots),
            ...fast.slice(0, quickSlots),
        ]
        // the plate still reads by significance, then by nearness to today
        chosen.sort(
            (a, b) =>
                b.weight - a.weight ||
                nearest(a) - nearest(b) ||
                tightest(a) - tightest(b),
        )

        return {
            days,
            today: TRANSIT_TODAY_INDEX,
            timezoneId,
            events: chosen,
        }
    }

    /** Is the body moving unusually fast or slowly for itself right now? */
    pace(transit: TransitBody, speed: number): "fast" | "slow" | null {
        const ratio = Math.abs(speed) / MEAN_MOTION[transit]
        if (ratio > 1.2) {
            return "fast"
        }
        if (ratio < 0.6) {
            return "slow"
        }
        return null
    }

    // ---------------------------------------------------------- lunations

    /**
     * New and Full Moons falling inside the window, read against the natal
     * points with a slightly wider orb: a lunation is a moment, not a span.
     */
    private lunations(
        days: string[],
        timezoneId: string,
        natalLon: Map<NatalPoint, number>,
    ): TransitEvent[] {
        const phase = (jd: number) => {
            const { longitudes } = this.chartService.sky(jd, LUNATION_BODIES)
            return norm360(
                (longitudes.get(Bodies.MOON) ?? 0) -
                    (longitudes.get(Bodies.SUN) ?? 0),
            )
        }

        const events: TransitEvent[] = []
        const firstNoon = noonJd(days[0] ?? "", timezoneId)

        // sample noon to noon; a crossing between two samples is bisected down to the minute
        for (let i = 0; i < days.length; i++) {
            const a = firstNoon + i
            const b = a + 1
            for (const [kind, angle] of [
                [Lunations.FULL, 180],
                [Lunations.NEW, 0],
            ] as [Lunation, number][]) {
                const gap = (jd: number) =>
                    norm360(phase(jd) - angle + 180) - 180
                const ga = gap(a)
                const gb = gap(b)
                if (!(ga < 0 && gb >= 0)) {
                    continue
                }

                let lo = a
                let hi = b
                while (hi - lo > LUNATION_PRECISION_DAYS) {
                    const mid = (lo + hi) / 2
                    if (gap(mid) < 0) {
                        lo = mid
                    } else {
                        hi = mid
                    }
                }

                const at = (lo + hi) / 2
                const { longitudes, speeds } = this.chartService.sky(
                    at,
                    LUNATION_BODIES,
                )
                const moon = longitudes.get(Bodies.MOON) ?? 0
                const speed = speeds.get(Bodies.MOON) ?? 0
                const date = localDate(timezoneId, (at - 2_440_587.5) * DAY_MS)
                const index = days.indexOf(date)
                if (index < 0) {
                    continue
                }

                for (const point of NATAL_POINTS) {
                    const target = natalLon.get(point)
                    if (target === undefined) {
                        continue
                    }
                    for (const [aspect, aspectAngle] of Object.entries(
                        TRANSIT_ASPECT_ANGLES,
                    ) as [TransitAspect, number][]) {
                        const orb = Math.abs(
                            separation(moon, target) - aspectAngle,
                        )
                        if (orb > LUNATION_ORB) {
                            continue
                        }
                        events.push({
                            id: `${kind}-${aspect}-${point}-${date}`,
                            transit: kind,
                            natal: point,
                            aspect,
                            natalLon: target,
                            weight: this.weight(LUNATION_WEIGHT, point, aspect),
                            span: [index, index],
                            exact: index,
                            exactDate: date,
                            daily: days.map(() => ({
                                orb: this.round(orb),
                                lon: moon,
                                speed,
                            })),
                            lunation: true,
                        })
                    }
                }
            }
        }

        return events
    }

    // ------------------------------------------------------------ helpers

    private natalLongitudes(natal: NatalChart): Map<NatalPoint, number> {
        const map = new Map<NatalPoint, number>()
        for (const placement of natal.bodies) {
            map.set(placement.body, placement.lon)
        }
        map.set(NatalAngles.ASC, natal.angles.asc.lon)
        map.set(NatalAngles.MC, natal.angles.mc.lon)
        return map
    }

    private weight(
        base: number,
        point: NatalPoint,
        aspect: TransitAspect,
    ): number {
        const personal = PERSONAL_POINTS.includes(point) ? 1 : 0
        const generational = GENERATIONAL_POINTS.includes(point) ? 2 : 0
        const minor = MINOR_ASPECTS.includes(aspect) ? 1 : 0
        return Math.min(5, Math.max(1, base + personal - generational - minor))
    }

    private argmin(indexes: number[], f: (i: number) => number): number {
        return indexes.reduce(
            (best, i) => (f(i) < f(best) ? i : best),
            indexes[0] ?? 0,
        )
    }

    /**
     * From a day inside the window, walk outward while the orb keeps
     * shrinking. That lands on this pass's own exact date rather than on a
     * different pass months away, which a global minimum could pick.
     */
    private descend(
        f: (i: number) => number,
        start: number,
        lo: number,
        hi: number,
    ): number {
        let i = start
        while (i - 1 >= lo && f(i - 1) < f(i)) {
            i--
        }
        while (i + 1 <= hi && f(i + 1) < f(i)) {
            i++
        }
        return i
    }

    /** Julian day of local noon on a calendar date in a zone. */
    private round(deg: number): number {
        return Math.round(deg * 100) / 100
    }
}
