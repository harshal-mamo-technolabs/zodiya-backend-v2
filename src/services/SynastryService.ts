import {
    AspectTypes,
    ASPECT_ANGLES,
    Bodies,
    SYNASTRY_BODIES,
    SYNASTRY_EXACT_ORB,
    SYNASTRY_MAX_ORB,
    SYNASTRY_ORBS,
    SYNASTRY_PERSONAL,
    TRANSIT_ASPECT_GROUP,
    type Body,
} from "../constants/index.ts"
import type {
    NatalChart,
    SynastryChart,
    SynastryContact,
    SynastryPlacement,
    SynastryReading,
} from "../types/index.ts"
import type { ChartService } from "./ChartService.ts"

const norm360 = (deg: number) => ((deg % 360) + 360) % 360

/** Unsigned separation between two longitudes, in [0, 180]. */
const separation = (a: number, b: number) => {
    const d = norm360(a - b)
    return d > 180 ? 360 - d : d
}

/** Strongest first: a tight contact between two personal planets tops the list. */
export const strength = (c: SynastryContact) =>
    c.weight * (1 - c.orb / SYNASTRY_MAX_ORB)

/**
 * Lays one natal chart over another: every aspect from a planet in A to a
 * planet in B, and where each person's Sun and Moon fall in the other's houses.
 */
export class SynastryService {
    constructor(private chartService: ChartService) {}

    compute(natalA: NatalChart, natalB: NatalChart): SynastryReading {
        const a = this.chart(natalA)
        const b = this.chart(natalB)

        const contacts: SynastryContact[] = []
        for (const pa of SYNASTRY_BODIES) {
            for (const pb of SYNASTRY_BODIES) {
                const contact = this.contact(pa, pb, a.bodies[pa], b.bodies[pb])
                if (contact) {
                    contacts.push(contact)
                }
            }
        }
        contacts.sort((x, y) => strength(y) - strength(x))

        const placements: SynastryPlacement[] = []
        for (const body of [Bodies.MOON, Bodies.SUN]) {
            placements.push(
                this.placement("a", body, a.bodies[body], natalB),
                this.placement("b", body, b.bodies[body], natalA),
            )
        }

        return { a, b, contacts, placements }
    }

    private chart(natal: NatalChart): SynastryChart {
        const bodies: Partial<Record<Body, number>> = {}
        for (const placement of natal.bodies) {
            if (SYNASTRY_BODIES.includes(placement.body)) {
                bodies[placement.body] = placement.lon
            }
        }
        const sun = natal.bodies.find((p) => p.body === Bodies.SUN)
        if (!sun) {
            throw new Error("Natal chart has no Sun")
        }
        return {
            asc: natal.angles.asc.lon,
            cusps: natal.houses.map((h) => h.lon),
            bodies,
            sun: sun.sign,
        }
    }

    private contact(
        a: Body,
        b: Body,
        lonA: number | undefined,
        lonB: number | undefined,
    ): SynastryContact | null {
        if (lonA === undefined || lonB === undefined) {
            return null
        }
        const gap = separation(lonA, lonB)
        for (const type of Object.values(AspectTypes)) {
            const orb = Math.abs(gap - ASPECT_ANGLES[type].angle)
            if (orb <= SYNASTRY_ORBS[type]) {
                return {
                    a,
                    b,
                    type,
                    kind: TRANSIT_ASPECT_GROUP[type],
                    orb: Math.round(orb * 100) / 100,
                    weight: this.weight(a) + this.weight(b),
                    exact: orb <= SYNASTRY_EXACT_ORB,
                }
            }
        }
        return null
    }

    private weight(body: Body): number {
        return SYNASTRY_PERSONAL.includes(body) ? 1 : 0.5
    }

    private placement(
        of: "a" | "b",
        body: Body,
        lon: number | undefined,
        other: NatalChart,
    ): SynastryPlacement {
        const cusps = other.houses.map((h) => h.lon)
        return { of, body, house: this.chartService.houseOf(lon ?? 0, cusps) }
    }
}
