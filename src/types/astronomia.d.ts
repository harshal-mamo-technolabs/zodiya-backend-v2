// Minimal hand-written declarations for the parts of `astronomia` we use.
// The package ships no types and there is no @types/astronomia.
declare module "astronomia" {
    interface Ecliptic {
        lon: number
        lat: number
        toEquatorial(ε: number): Equatorial
    }

    interface Equatorial {
        ra: number
        dec: number
        toEcliptic(ε: number): Ecliptic
    }

    interface Spherical {
        lon: number
        lat: number
        range: number
    }

    interface VSOP87Planet {
        position(jde: number): Spherical
        position2000(jde: number): Spherical
    }

    export const coord: {
        Ecliptic: new (lon: number, lat: number) => Ecliptic
        Equatorial: new (ra: number, dec: number) => Equatorial
    }

    export const julian: {
        CalendarGregorianToJD(year: number, month: number, day: number): number
    }

    export const deltat: {
        deltaT(decimalYear: number): number
    }

    export const nutation: {
        /** @returns [Δψ, Δε] in radians */
        nutation(jde: number): [number, number]
        meanObliquity(jde: number): number
    }

    export const planetposition: {
        Planet: new (data: unknown) => VSOP87Planet
    }

    export const solar: {
        apparentVSOP87(earth: VSOP87Planet, jde: number): Spherical
    }

    export const elliptic: {
        /** Apparent geocentric equatorial coordinates of date. */
        position(
            planet: VSOP87Planet,
            earth: VSOP87Planet,
            jde: number,
        ): Equatorial
    }

    export const moonposition: {
        /** Mean equinox of date, WITHOUT nutation — add Δψ for apparent. */
        position(jde: number): Spherical
    }

    export const pluto: {
        /** J2000 astrometric equatorial coordinates. */
        astrometric(jde: number, earth: VSOP87Planet): Equatorial
    }

    export const precess: {
        position(
            eqFrom: Equatorial,
            epochFrom: number,
            epochTo: number,
            mα: number,
            mδ: number,
        ): Equatorial
    }

    export const sidereal: {
        /** Greenwich apparent sidereal time, in seconds of time. */
        apparent(jd: number): number
    }
}

declare module "astronomia/data/vsop87Bearth" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bmercury" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bvenus" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bmars" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bjupiter" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bsaturn" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Buranus" {
    const data: unknown
    export default data
}
declare module "astronomia/data/vsop87Bneptune" {
    const data: unknown
    export default data
}
