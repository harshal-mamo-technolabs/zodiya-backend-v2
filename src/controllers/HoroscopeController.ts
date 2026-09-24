import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { HoroscopeService } from "../services/HoroscopeService.ts"
import type { HoroscopeReadingService } from "../services/HoroscopeReadingService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { localDate } from "../utils/index.ts"
import {
    DEFAULT_LANGUAGE,
    HoroscopePeriods,
    type HoroscopePeriod,
    type Language,
    type ZodiacSign,
} from "../constants/index.ts"

const DEFAULT_ZONE = "UTC"

export default class HoroscopeController {
    constructor(
        private horoscopeService: HoroscopeService,
        private readingService: HoroscopeReadingService,
        private logger: Logger,
    ) {}

    read(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const query = req.query as Record<string, string | undefined>
            const sign = query.sign as ZodiacSign
            const period = (query.period ??
                HoroscopePeriods.DAILY) as HoroscopePeriod
            const zone = query.tz ?? DEFAULT_ZONE
            // "today" is today where the reader is, not on the server
            const date = query.date ?? localDate(zone, Date.now())

            const reading = this.horoscopeService.compute(
                sign,
                period,
                date,
                zone,
            )

            this.logger.debug("Horoscope computed", { sign, period, date })

            res.status(200).json(
                this.readingService.build(reading, this.language(query.lang)),
            )
        } catch (e) {
            next(e)
        }
    }

    private language(value: unknown): Language {
        return typeof value === "string" && isSupportedLanguage(value)
            ? value
            : DEFAULT_LANGUAGE
    }
}
