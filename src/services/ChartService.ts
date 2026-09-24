import createHttpError from "http-errors"
import {
    coord,
    deltat,
    elliptic,
    julian,
    moonposition,
    nutation,
    planetposition,
    pluto,
    precess,
    sidereal,
    solar,
} from "astronomia"
import vsop87Bearth from "astronomia/data/vsop87Bearth"
import vsop87Bmercury from "astronomia/data/vsop87Bmercury"
import vsop87Bvenus from "astronomia/data/vsop87Bvenus"
import vsop87Bmars from "astronomia/data/vsop87Bmars"
import vsop87Bjupiter from "astronomia/data/vsop87Bjupiter"
import vsop87Bsaturn from "astronomia/data/vsop87Bsaturn"
import vsop87Buranus from "astronomia/data/vsop87Buranus"
import vsop87Bneptune from "astronomia/data/vsop87Bneptune"
import {
    ASPECT_ANGLES,
    AspectTypes,
    Bodies,
    BODY_ORDER,
    DEFAULT_BIRTH_TIME,
    Elements,
    HouseSystems,
    LUMINARY_ORB_BONUS,
    Modalities,
    SIGN_ELEMENT,
    SIGN_MODALITY,
    SIGN_ORDER,
    WEIGHTED_BODIES,
    type AspectType,
    type Body,
    type Element,
    type HouseSystem,
    type Modality,
} from "../constants/index.ts"
import type {
    Aspect,
    BirthMoment,
    ChartAngles,
    Dominants,
    HouseCusp,
    NatalChart,
    Placement,
    SignPosition,
} from "../types/index.ts"

const R2D = 180 / Math.PI
const D2R = Math.PI / 180

/** One hour, in days — the step used to differentiate longitudes. */
const SPEED_STEP = 1 / 24

/** Placidus is undefined where a cusp's parallel of declination never sets. */
const PLACIDUS_LATITUDE_LIMIT = 66

/**
 * The cusp iteration converges linearly, and gets slow — not unstable — as
 * latitude rises: ~15 passes at the equator, ~35 by 60°N.
 */
const MAX_CUSP_ITERATIONS = 100

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

const norm360 = (deg: number) => ((deg % 360) + 360) % 360

/** Shortest signed distance from `a` to `b`, in (-180, 180]. */
const deltaAngle = (a: number, b: number) => norm360(b - a + 180) - 180

/** Unsigned separation between two longitudes, in [0, 180]. */
const separation = (a: number, b: number) => Math.abs(deltaAngle(a, b))

const earth = new planetposition.Planet(vsop87Bearth)

const VSOP_PLANETS = {
    [Bodies.MERCURY]: new planetposition.Planet(vsop87Bmercury),
    [Bodies.VENUS]: new planetposition.Planet(vsop87Bvenus),
    [Bodies.MARS]: new planetposition.Planet(vsop87Bmars),
    [Bodies.JUPITER]: new planetposition.Planet(vsop87Bjupiter),
    [Bodies.SATURN]: new planetposition.Planet(vsop87Bsaturn),
    [Bodies.URANUS]: new planetposition.Planet(vsop87Buranus),
    [Bodies.NEPTUNE]: new planetposition.Planet(vsop87Bneptune),
} as const

/** Precomputed once per instant; every body position needs all of it. */
interface Instant {
    /** Julian day in UT — sidereal time is a UT quantity. */
    jd: number
    /** Julian ephemeris day (TT = UT + ΔT) — body positions are TT quantities. */
    jde: number
    /** True obliquity of the ecliptic, radians. */
    eps: number
    /** Nutation in longitude, degrees. */
    dpsi: number
}

export class ChartService {
    compute(moment: BirthMoment): NatalChart {
        const birthTime = moment.birthTime ?? DEFAULT_BIRTH_TIME
        const { lat, lon } = this.assertCoordinates(moment)
        const jd = this.toJulianDay(moment.birthDate, birthTime, moment.tzone)

        const now = this.instant(jd)
        const { longitudes, speeds } = this.sky(jd)

        const angles = this.angles(now, lat, lon)
        const { cusps, houseSystem } = this.houses(now, lat, angles)

        const bodies: Placement[] = BODY_ORDER.map((body) => {
            const longitude = longitudes.get(body) ?? 0
            const speed = speeds.get(body) ?? 0
            return {
                body,
                lon: longitude,
                ...this.toSignPosition(longitude),
                speed,
                retrograde: speed < 0,
                house: this.houseOf(longitude, cusps),
            }
        })

        const houses: HouseCusp[] = cusps.map((cusp, index) => ({
            house: index + 1,
            lon: cusp,
            ...this.toSignPosition(cusp),
        }))

        const aspects = this.aspects(longitudes, speeds)
        const dominants = this.dominants(bodies)

        return {
            meta: {
                birthDate: moment.birthDate,
                birthTime,
                lat,
                lon,
                tzone: moment.tzone,
                utc: this.toUtcIso(moment.birthDate, birthTime, moment.tzone),
                julianDay: jd,
                zodiac: "tropical",
                houseSystem,
            },
            bodies,
            angles,
            houses,
            aspects,
            dominants,
        }
    }

    /**
     * Every body's apparent longitude and daily motion at a Julian day.
     * VSOP87 covers many centuries either side of now; the Pluto series is
     * fitted for 1885 to 2099 and drifts outside that span.
     */
    sky(
        jd: number,
        bodies: readonly Body[] = BODY_ORDER,
    ): { longitudes: Map<Body, number>; speeds: Map<Body, number> } {
        const now = this.instant(jd)
        const later = this.instant(jd + SPEED_STEP)

        const longitudes = new Map<Body, number>()
        const speeds = new Map<Body, number>()

        for (const body of bodies) {
            const here = this.longitude(body, now)
            const there = this.longitude(body, later)
            longitudes.set(body, here)
            speeds.set(body, deltaAngle(here, there) / SPEED_STEP)
        }

        return { longitudes, speeds }
    }

    /** Sign, degree and minute for a longitude; the same rounding as the chart. */
    signPosition(lon: number): SignPosition {
        return this.toSignPosition(lon)
    }

    // ---------------------------------------------------------------- time

    private assertCoordinates(moment: BirthMoment) {
        const { lat, lon, tzone } = moment

        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            throw createHttpError(422, "Latitude must be between -90 and 90")
        }
        if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
            throw createHttpError(422, "Longitude must be between -180 and 180")
        }
        if (!Number.isFinite(tzone) || tzone < -14 || tzone > 14) {
            throw createHttpError(
                422,
                "Timezone offset must be between -14 and 14 hours",
            )
        }

        return { lat, lon }
    }

    /** Local wall-clock birth time to Julian day in UT. */
    private toJulianDay(
        birthDate: string,
        birthTime: string,
        tzone: number,
    ): number {
        const date = DATE_PATTERN.exec(birthDate)
        const time = TIME_PATTERN.exec(birthTime)

        if (!date || !time) {
            throw createHttpError(
                422,
                "Birth date must be YYYY-MM-DD and birth time HH:mm",
            )
        }

        const [, year, month, day] = date.map(Number) as [
            number,
            number,
            number,
            number,
        ]
        const [, hour, minute] = time.map(Number) as [number, number, number]

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            throw createHttpError(422, "Birth date is not a real date")
        }

        const utcHours = hour + minute / 60 - tzone
        return julian.CalendarGregorianToJD(year, month, day + utcHours / 24)
    }

    private toUtcIso(
        birthDate: string,
        birthTime: string,
        tzone: number,
    ): string {
        const local = Date.parse(`${birthDate}T${birthTime}:00Z`)
        return new Date(local - tzone * 3600_000).toISOString()
    }

    private instant(jd: number): Instant {
        const decimalYear = 2000 + (jd - 2451545) / 365.25
        const jde = jd + deltat.deltaT(decimalYear) / 86400
        const [dpsi, deps] = nutation.nutation(jde)

        return {
            jd,
            jde,
            eps: nutation.meanObliquity(jde) + deps,
            dpsi: dpsi * R2D,
        }
    }

    // -------------------------------------------------------------- bodies

    /** Apparent geocentric ecliptic longitude of date, in degrees. */
    private longitude(body: Body, at: Instant): number {
        switch (body) {
            case Bodies.SUN:
                return norm360(solar.apparentVSOP87(earth, at.jde).lon * R2D)

            case Bodies.MOON:
                // moonposition omits nutation; apparent longitude needs Δψ.
                return norm360(
                    moonposition.position(at.jde).lon * R2D + at.dpsi,
                )

            case Bodies.PLUTO: {
                const astrometric = pluto.astrometric(at.jde, earth)
                const ofDate = precess.position(
                    astrometric,
                    2000,
                    2000 + (at.jde - 2451545) / 365.25,
                    0,
                    0,
                )
                return norm360(this.toEclipticLon(ofDate, at.eps) + at.dpsi)
            }

            case Bodies.NORTH_NODE:
                return this.meanLunarNode(at.jde)

            default:
                return norm360(
                    this.toEclipticLon(
                        elliptic.position(VSOP_PLANETS[body], earth, at.jde),
                        at.eps,
                    ),
                )
        }
    }

    private toEclipticLon(
        equatorial: { ra: number; dec: number },
        eps: number,
    ): number {
        return (
            new coord.Equatorial(equatorial.ra, equatorial.dec).toEcliptic(eps)
                .lon * R2D
        )
    }

    /** Mean ascending node of the Moon (Meeus 47.7), degrees. */
    private meanLunarNode(jde: number): number {
        const t = (jde - 2451545) / 36525
        return norm360(
            125.0445479 -
                1934.1362891 * t +
                0.0020754 * t * t +
                (t * t * t) / 467441 -
                (t * t * t * t) / 60616000,
        )
    }

    // -------------------------------------------------------------- angles

    private angles(at: Instant, lat: number, lon: number): ChartAngles {
        // Greenwich apparent sidereal time: seconds of time -> degrees.
        const ramc = norm360(sidereal.apparent(at.jd) / 240 + lon)
        const theta = ramc * D2R
        const phi = lat * D2R
        const eps = at.eps

        const mc = norm360(
            Math.atan2(Math.sin(theta), Math.cos(theta) * Math.cos(eps)) * R2D,
        )
        const asc = norm360(
            Math.atan2(
                Math.cos(theta),
                -(
                    Math.sin(theta) * Math.cos(eps) +
                    Math.tan(phi) * Math.sin(eps)
                ),
            ) * R2D,
        )

        return {
            asc: { lon: asc, ...this.toSignPosition(asc) },
            mc: { lon: mc, ...this.toSignPosition(mc) },
            desc: {
                lon: norm360(asc + 180),
                ...this.toSignPosition(asc + 180),
            },
            ic: { lon: norm360(mc + 180), ...this.toSignPosition(mc + 180) },
            ramc,
            obliquity: eps * R2D,
        }
    }

    // -------------------------------------------------------------- houses

    private houses(
        at: Instant,
        lat: number,
        angles: ChartAngles,
    ): { cusps: number[]; houseSystem: HouseSystem } {
        const placidus = this.placidusCusps(at, lat, angles)

        if (placidus) {
            return { cusps: placidus, houseSystem: HouseSystems.PLACIDUS }
        }

        // ponytail: whole-sign fallback wherever Placidus has no stable
        // solution. Swap in Koch/Campanus only if someone asks for it.
        const start = Math.floor(norm360(angles.asc.lon) / 30) * 30
        return {
            cusps: Array.from({ length: 12 }, (_, i) =>
                norm360(start + i * 30),
            ),
            houseSystem: HouseSystems.WHOLE_SIGN,
        }
    }

    /**
     * Placidus divides each cusp's own semi-arc into three, so the four
     * intermediate cusps have to be solved for iteratively. The ascendant and
     * midheaven are taken from their closed forms instead — the iteration for
     * those is redundant and, near the polar circle, unstable.
     *
     * Returns null when any cusp has no stable solution, which is the signal
     * to fall back to whole sign houses.
     */
    private placidusCusps(
        at: Instant,
        lat: number,
        angles: ChartAngles,
    ): number[] | null {
        if (Math.abs(lat) >= PLACIDUS_LATITUDE_LIMIT) {
            return null
        }

        const ramc = angles.ramc
        const phi = lat * D2R
        const eps = at.eps

        // Seeded at the equatorial case (semi-arc = 90°), where the offsets
        // are exactly 30/60/120/150 degrees of right ascension.
        const eleventh = this.solveCusp(ramc, eps, phi, 30, (sd) => sd / 3)
        const twelfth = this.solveCusp(ramc, eps, phi, 60, (sd) => (2 * sd) / 3)
        const second = this.solveCusp(
            ramc,
            eps,
            phi,
            120,
            (sd) => sd + (180 - sd) / 3,
        )
        const third = this.solveCusp(
            ramc,
            eps,
            phi,
            150,
            (sd) => sd + (2 * (180 - sd)) / 3,
        )

        if (
            eleventh === null ||
            twelfth === null ||
            second === null ||
            third === null
        ) {
            return null
        }

        const quadrant = [
            angles.asc.lon,
            second,
            third,
            angles.ic.lon,
            norm360(eleventh + 180),
            norm360(twelfth + 180),
        ]

        const cusps = [
            ...quadrant,
            ...quadrant.map((cusp) => norm360(cusp + 180)),
        ]

        // Cusps must run in zodiacal order; if the solver returned a set that
        // doubles back, the quadrant has degenerated and whole sign is safer.
        return this.inZodiacalOrder(cusps) ? cusps : null
    }

    /** Every cusp must sit strictly ahead of the one before it. */
    private inZodiacalOrder(cusps: number[]): boolean {
        for (let i = 0; i < cusps.length; i++) {
            const from = cusps[i]
            const to = cusps[(i + 1) % cusps.length]

            if (from === undefined || to === undefined) {
                return false
            }

            const span = norm360(to - from)

            if (span < 1e-6 || span > 180) {
                return false
            }
        }

        return true
    }

    private solveCusp(
        ramc: number,
        eps: number,
        phi: number,
        seed: number,
        arc: (semiDiurnalArc: number) => number,
    ): number | null {
        let ra = norm360(ramc + seed)

        for (let i = 0; i < MAX_CUSP_ITERATIONS; i++) {
            const lon = this.eclipticLonAtRA(ra, eps)
            const dec = Math.asin(Math.sin(eps) * Math.sin(lon * D2R))
            const cosH = -Math.tan(phi) * Math.tan(dec)

            // Circumpolar: this parallel of declination never crosses the
            // horizon, so it has no semi-arc to divide.
            if (cosH < -1 || cosH > 1) {
                return null
            }

            const next = norm360(ramc + arc(Math.acos(cosH) * R2D))

            if (Math.abs(deltaAngle(ra, next)) < 1e-9) {
                return this.eclipticLonAtRA(next, eps)
            }

            ra = next
        }

        // Did not settle — near the polar circle the iteration oscillates.
        return null
    }

    /** Ecliptic longitude of the point on the ecliptic at right ascension α. */
    private eclipticLonAtRA(raDeg: number, eps: number): number {
        const ra = raDeg * D2R
        return norm360(
            Math.atan2(Math.sin(ra) / Math.cos(eps), Math.cos(ra)) * R2D,
        )
    }

    houseOf(lon: number, cusps: number[]): number {
        for (let i = 0; i < 12; i++) {
            const start = cusps[i]
            const end = cusps[(i + 1) % 12]

            if (start === undefined || end === undefined) {
                continue
            }

            const span = norm360(end - start)
            if (norm360(lon - start) < span) {
                return i + 1
            }
        }

        return 1
    }

    // ------------------------------------------------------------- aspects

    private aspects(
        longitudes: Map<Body, number>,
        speeds: Map<Body, number>,
    ): Aspect[] {
        const found: Aspect[] = []

        for (let i = 0; i < BODY_ORDER.length; i++) {
            for (let j = i + 1; j < BODY_ORDER.length; j++) {
                const a = BODY_ORDER[i]
                const b = BODY_ORDER[j]

                if (a === undefined || b === undefined) {
                    continue
                }

                const lonA = longitudes.get(a)
                const lonB = longitudes.get(b)

                if (lonA === undefined || lonB === undefined) {
                    continue
                }

                const aspect = this.matchAspect(a, b, lonA, lonB)

                if (!aspect) {
                    continue
                }

                const target = ASPECT_ANGLES[aspect].angle
                const orb = Math.abs(separation(lonA, lonB) - target)
                const laterOrb = Math.abs(
                    separation(
                        lonA + (speeds.get(a) ?? 0) * SPEED_STEP,
                        lonB + (speeds.get(b) ?? 0) * SPEED_STEP,
                    ) - target,
                )

                found.push({
                    a,
                    b,
                    type: aspect,
                    angle: target,
                    orb: Math.round(orb * 100) / 100,
                    applying: laterOrb < orb,
                })
            }
        }

        return found.sort((x, y) => x.orb - y.orb)
    }

    private matchAspect(
        a: Body,
        b: Body,
        lonA: number,
        lonB: number,
    ): AspectType | null {
        const gap = separation(lonA, lonB)
        const luminary =
            a === Bodies.SUN ||
            a === Bodies.MOON ||
            b === Bodies.SUN ||
            b === Bodies.MOON

        for (const type of Object.values(AspectTypes)) {
            const { angle, orb } = ASPECT_ANGLES[type]
            const allowed = luminary ? orb + LUMINARY_ORB_BONUS : orb

            if (Math.abs(gap - angle) <= allowed) {
                return type
            }
        }

        return null
    }

    // ----------------------------------------------------------- dominants

    private dominants(bodies: Placement[]): Dominants {
        const elements: Record<Element, number> = {
            [Elements.FIRE]: 0,
            [Elements.EARTH]: 0,
            [Elements.AIR]: 0,
            [Elements.WATER]: 0,
        }
        const modalities: Record<Modality, number> = {
            [Modalities.CARDINAL]: 0,
            [Modalities.FIXED]: 0,
            [Modalities.MUTABLE]: 0,
        }

        for (const placement of bodies) {
            if (!WEIGHTED_BODIES.includes(placement.body)) {
                continue
            }
            elements[SIGN_ELEMENT[placement.sign]] += 1
            modalities[SIGN_MODALITY[placement.sign]] += 1
        }

        return {
            elements,
            modalities,
            topElement: this.top(elements, Elements.FIRE),
            topModality: this.top(modalities, Modalities.CARDINAL),
        }
    }

    private top<T extends string>(counts: Record<T, number>, fallback: T): T {
        let winner = fallback
        let best = -1

        for (const [key, count] of Object.entries(counts) as [T, number][]) {
            if (count > best) {
                winner = key
                best = count
            }
        }

        return winner
    }

    // ---------------------------------------------------------- formatting

    /** Rounds to whole arcminutes first, so 29°59.7′ cannot render as 30°00′. */
    private toSignPosition(lon: number): SignPosition {
        const arcminutes = Math.round(norm360(lon) * 60) % 21600
        const signIndex = Math.floor(arcminutes / 1800)
        const withinSign = arcminutes - signIndex * 1800
        const sign = SIGN_ORDER[signIndex]

        if (sign === undefined) {
            throw createHttpError(500, "Could not resolve the zodiac sign")
        }

        return {
            sign,
            signIndex,
            degree: Math.floor(withinSign / 60),
            minute: withinSign % 60,
        }
    }
}
