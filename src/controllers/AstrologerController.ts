import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import type { ElevenLabsService } from "../services/ElevenLabsService.ts"
import type { AstrologerContextService } from "../services/AstrologerContextService.ts"
import { findAstrologer } from "../constants/astrologers.ts"
import { getAuthUserId } from "../utils/index.ts"

export default class AstrologerController {
    constructor(
        private profileService: ProfileService,
        private elevenLabs: ElevenLabsService,
        private contextService: AstrologerContextService,
        private logger: Logger,
    ) {}

    async preview(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const astrologer = findAstrologer(String(req.params.id))
            if (!astrologer) {
                next(createHttpError(404, "Astrologer does not exist"))
                return
            }
            res.status(200).json(await this.elevenLabs.preview(astrologer))
        } catch (e) {
            next(e)
        }
    }

    /**
     * Everything the browser needs to open a voice conversation: a signed
     * URL for the astrologer's private agent and the reader's own chart as
     * dynamic variables. The API key never leaves the server.
     */
    async session(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const userId = getAuthUserId(req)
            const body = req.body as {
                character: string
                profileId: string
                page?: string
                greet?: boolean
            }
            const astrologer = findAstrologer(body.character)
            const profile = await this.profileService.findById(
                body.profileId,
                userId,
            )
            if (!astrologer || !profile) {
                next(createHttpError(404, "Profile does not exist"))
                return
            }

            // names only: the agent needs them to switch profile or pick "person two"
            const all = await this.profileService.findAllByUser(userId)
            const others = all
                .filter((p) => String(p._id) !== String(profile._id))
                .map((p) => `${p.firstName} ${p.lastName} (${p.zodiacSign})`)

            const agent = await this.elevenLabs.agentFor(astrologer)
            const signedUrl = await this.elevenLabs.signedUrl(agent.agentId)

            this.logger.info("Astrologer session opened", {
                userId,
                astrologer: astrologer.id,
            })

            res.status(200).json({
                signedUrl,
                dynamicVariables: {
                    // whoever's profile is active is the person talking
                    user_name: profile.firstName,
                    chart_context:
                        this.contextService.build(profile) +
                        `\n\nOther saved profiles they can switch to or compare with in synastry: ${others.join(", ") || "none yet"}.`,
                    page: body.page ?? "dashboard",
                    greeting: body.greet
                        ? `Hello ${profile.firstName}, I'm ${astrologer.name}, your ${astrologer.role}. I've read your chart, so ask me anything about it.`
                        : "",
                },
            })
        } catch (e) {
            next(e)
        }
    }
}
