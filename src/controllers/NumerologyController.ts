import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { NumerologyService } from "../services/NumerologyService.ts"
import type { NumerologyReadingService } from "../services/NumerologyReadingService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

export default class NumerologyController {
    constructor(
        private numerologyService: NumerologyService,
        private readingService: NumerologyReadingService,
        private logger: Logger,
    ) {}

    compute(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const { name, birthDate } = req.body as {
                name: string
                birthDate: string
            }

            const reading = this.numerologyService.compute(name, birthDate)

            this.logger.debug("Numerology computed", { birthDate })

            res.status(200).json(
                this.readingService.build(
                    reading,
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
