import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { TarotService } from "../services/TarotService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import {
    DEFAULT_LANGUAGE,
    type Language,
    type TarotSpread,
} from "../constants/index.ts"

export default class TarotController {
    constructor(
        private tarotService: TarotService,
        private logger: Logger,
    ) {}

    draw(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const { spread } = req.body as { spread: TarotSpread }
            const drawn = this.tarotService.draw(
                spread,
                this.language(req.query.lang),
            )

            this.logger.debug("Tarot drawn", {
                spread,
                cards: drawn.cards.map((c) => c.id),
            })

            res.status(200).json(drawn)
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
