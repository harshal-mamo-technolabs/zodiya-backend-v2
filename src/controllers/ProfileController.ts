import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type {
    AuthRequest,
    CreateProfileRequest,
    ProfilePatch,
} from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import { isSupportedLanguage } from "../services/ReadingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

// the validator vets each of these; anything else in the body is ignored
const PATCHABLE = [
    "firstName",
    "lastName",
    "birthDate",
    "birthTime",
    "city",
    "state",
    "country",
    "relationship",
    "avatar",
    "birthName",
] as const satisfies readonly (keyof ProfilePatch)[]

export default class ProfileController {
    constructor(
        private profileService: ProfileService,
        private logger: Logger,
    ) {}

    async create(req: CreateProfileRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
            return
        }

        const {
            firstName,
            lastName,
            birthDate,
            birthTime,
            city,
            state,
            country,
            relationship,
            avatar,
        } = req.body

        try {
            const userId = getAuthUserId(req)

            this.logger.debug("New request to create a profile", {
                userId,
                city,
                state,
                country,
            })

            const profile = await this.profileService.create(userId, {
                firstName,
                lastName,
                birthDate,
                city,
                state,
                country,
                ...(birthTime !== undefined && { birthTime }),
                ...(relationship !== undefined && { relationship }),
                ...(avatar !== undefined && { avatar }),
            })

            this.logger.info("Profile has been created", {
                id: profile._id,
                userId,
            })

            res.status(201).json({
                id: profile._id,
            })
        } catch (e) {
            next(e)
        }
    }

    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = getAuthUserId(req)
            const profiles = await this.profileService.findAllByUser(userId)

            res.status(200).json(profiles)
        } catch (e) {
            next(e)
        }
    }

    async getOne(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
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

            res.status(200).json(profile)
        } catch (e) {
            next(e)
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const body = req.body as ProfilePatch
            const patch = Object.fromEntries(
                PATCHABLE.filter((key) => body[key] !== undefined).map(
                    (key) => [key, body[key]],
                ),
            ) as ProfilePatch
            const profile = await this.profileService.update(
                String(req.params.id),
                userId,
                patch,
            )

            if (!profile) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            this.logger.info("Profile updated", { id: profile._id })

            res.status(200).json(profile)
        } catch (e) {
            next(e)
        }
    }

    async remove(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const outcome = await this.profileService.remove(
                String(req.params.id),
                getAuthUserId(req),
            )
            if (outcome === null) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }
            if (outcome === "primary") {
                next(
                    createHttpError(
                        400,
                        "Your own entry cannot be removed. Delete the account instead.",
                    ),
                )
                return
            }
            this.logger.info("Profile removed", { id: String(req.params.id) })
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }

    async getChart(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const lang = this.resolveLanguage(req.query.lang)

            const chart = await this.profileService.buildChart(
                String(req.params.id),
                userId,
                lang,
            )

            if (!chart) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            this.logger.debug("Natal chart computed", {
                userId,
                profileId: req.params.id,
                lang,
            })

            res.status(200).json(chart)
        } catch (e) {
            next(e)
        }
    }

    private resolveLanguage(value: unknown): Language {
        return typeof value === "string" && isSupportedLanguage(value)
            ? value
            : DEFAULT_LANGUAGE
    }
}
