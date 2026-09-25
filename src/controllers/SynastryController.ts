import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import type { SynastryService } from "../services/SynastryService.ts"
import type { SynastryReadingService } from "../services/SynastryReadingService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

export default class SynastryController {
    constructor(
        private profileService: ProfileService,
        private synastryService: SynastryService,
        private readingService: SynastryReadingService,
        private logger: Logger,
    ) {}

    async read(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        const id = String(req.params.id),
            otherId = String(req.params.otherId)
        if (id === otherId) {
            res.status(400).json({
                errors: [{ msg: "Choose two different profiles to compare" }],
            })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const [a, b] = await Promise.all([
                this.profileService.findById(id, userId),
                this.profileService.findById(otherId, userId),
            ])

            if (!a || !b) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            const reading = this.synastryService.compute(
                this.profileService.natal(a),
                this.profileService.natal(b),
            )

            this.logger.debug("Synastry computed", {
                a: a._id,
                b: b._id,
                contacts: reading.contacts.length,
            })

            const person = (p: typeof a) => ({
                id: p._id,
                firstName: p.firstName,
                name: `${p.firstName} ${p.lastName}`,
            })

            res.status(200).json(
                this.readingService.build(
                    reading,
                    person(a),
                    person(b),
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
