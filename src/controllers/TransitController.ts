import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import type { TransitService } from "../services/TransitService.ts"
import type { TransitReadingService } from "../services/TransitReadingService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

export default class TransitController {
    constructor(
        private profileService: ProfileService,
        private transitService: TransitService,
        private readingService: TransitReadingService,
        private logger: Logger,
    ) {}

    async read(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const profile = await this.profileService.findById(
                String(req.params.id),
                userId,
            )

            if (!profile) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            const natal = this.profileService.natal(profile)
            const reading = this.transitService.compute(
                natal,
                profile.timezoneId,
            )

            this.logger.debug("Transits computed", {
                profileId: profile._id,
                events: reading.events.length,
            })

            res.status(200).json(
                this.readingService.build(
                    reading,
                    natal,
                    profile.city,
                    this.language(req.query.lang),
                ),
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
