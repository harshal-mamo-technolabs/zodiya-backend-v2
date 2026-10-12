import { ChartService } from "../../src/services/ChartService.ts"
import {
    bestPlaces,
    computeLines,
    nearby,
} from "../../src/services/AstrocartographyService.ts"
import { Bodies } from "../../src/constants/index.ts"

describe("astrocartography lines", () => {
    // a planet sitting exactly on the chart's MC (or Ascendant) must have its
    // MC (or AC) line run through the birthplace
    it.each([
        [23.03, 72.58, "1995-08-15", "14:30", 5.5],
        [52.52, 13.405, "1988-02-03", "06:10", 1],
        [-33.87, 151.21, "2001-11-30", "22:45", 11],
    ])(
        "passes through the birthplace at %f, %f",
        (lat, lon, birthDate, birthTime, tzone) => {
            const chart = new ChartService().compute({
                birthDate,
                birthTime,
                lat,
                lon,
                tzone,
            })
            const placed = {
                ...chart,
                bodies: [
                    {
                        ...chart.bodies[0],
                        body: Bodies.SUN,
                        lon: chart.angles.mc.lon,
                    },
                    {
                        ...chart.bodies[1],
                        body: Bodies.MOON,
                        lon: chart.angles.asc.lon,
                    },
                ],
            } as typeof chart
            const near = nearby(computeLines(placed), lat, lon, 60)
            expect(
                near.some((l) => l.body === Bodies.SUN && l.angle === "MC"),
            ).toBe(true)
            expect(
                near.some((l) => l.body === Bodies.MOON && l.angle === "AC"),
            ).toBe(true)
        },
    )

    it("names a city per theme, or none, never one off its lines", () => {
        const chart = new ChartService().compute({
            birthDate: "1995-08-15",
            birthTime: "14:30",
            lat: 23.03,
            lon: 72.58,
            tzone: 5.5,
        })
        for (const { best } of bestPlaces(computeLines(chart))) {
            if (best) expect(best.km).toBeLessThanOrEqual(800)
        }
    })
})
