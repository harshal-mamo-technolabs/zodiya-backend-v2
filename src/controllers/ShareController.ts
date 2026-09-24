import { type NextFunction, type Response, type Request } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

const language = (value: unknown): Language =>
    typeof value === "string" && isSupportedLanguage(value)
        ? value
        : DEFAULT_LANGUAGE

export default class ShareController {
    constructor(
        private profileService: ProfileService,
        private logger: Logger,
    ) {}

    /** Creates the public link, or returns the existing one. */
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const token = await this.profileService.share(
                String(req.params.id),
                userId,
            )

            if (!token) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            this.logger.info("Share link issued", {
                userId,
                profileId: req.params.id,
            })

            res.status(200).json({ token })
        } catch (e) {
            next(e)
        }
    }

    async revoke(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const revoked = await this.profileService.unshare(
                String(req.params.id),
                userId,
            )

            if (!revoked) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            this.logger.info("Share link revoked", {
                userId,
                profileId: req.params.id,
            })

            res.status(204).send()
        } catch (e) {
            next(e)
        }
    }

    /** Public: no session, the token is the only credential. */
    async read(req: Request, res: Response, next: NextFunction) {
        try {
            const chart = await this.profileService.buildSharedChart(
                String(req.params.token),
                language(req.query.lang),
            )

            if (!chart) {
                next(
                    createHttpError(
                        404,
                        "This chart link is not valid, or has been revoked",
                    ),
                )
                return
            }

            res.status(200).json(chart)
        } catch (e) {
            next(e)
        }
    }
}
