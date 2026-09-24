import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { GeoService } from "../services/GeoService.ts"

export default class PlaceController {
    constructor(
        private geoService: GeoService,
        private logger: Logger,
    ) {}

    async search(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const query = typeof req.query.q === "string" ? req.query.q : ""
            const places = await this.geoService.searchPlaces(query)

            this.logger.debug("Place search", { query, hits: places.length })

            res.status(200).json(places)
        } catch (e) {
            next(e)
        }
    }

    async details(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const { placeId } = req.params
            const place = await this.geoService.resolvePlace(
                typeof placeId === "string" ? placeId : "",
            )

            res.status(200).json(place)
        } catch (e) {
            next(e)
        }
    }
}
