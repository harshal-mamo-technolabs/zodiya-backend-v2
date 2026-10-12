import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import type { ElevenLabsService } from "../services/ElevenLabsService.ts"
import type { AstrologerContextService } from "../services/AstrologerContextService.ts"
import {
    MIN_SESSION_SECONDS,
    type AstrologerUsageService,
} from "../services/AstrologerUsageService.ts"
import { findAstrologer, type Astrologer } from "../constants/astrologers.ts"
import { getAuthUserId } from "../utils/index.ts"
import { PalmReadingModel } from "../models/PalmReading.ts"
import type { PalmReport } from "../services/PalmReportService.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"

/** What the agent is told to speak, and its spoken introduction, per language. */
const SPOKEN: Record<
    Language,
    {
        name: string
        greeting: (user: string, a: Astrologer) => string
        none: string
    }
> = {
    en: {
        name: "English",
        greeting: (user, a) =>
            `Hello ${user}, I'm ${a.name}, your ${a.role}. I've read your chart, so ask me anything about it.`,
        none: "none yet",
    },
    de: {
        name: "German",
        greeting: (user, a) =>
            `Hallo ${user}, ich bin ${a.name}, ${a.gender === "f" ? "deine Astrologin" : "dein Astrologe"} hier bei AstroMeridian. Ich habe dein Geburtshoroskop gelesen, frag mich also alles dazu.`,
        none: "noch keine",
    },
}

/**
 * The active person's two latest saved palm readings, as notes for the agent:
 * it cannot see photos, so it speaks from what the reading found.
 */
async function palmNotes(userId: string, profileId: string): Promise<string> {
    const saved = await PalmReadingModel.find({
        user: userId,
        "subject.profile": profileId,
    })
        .sort({ createdAt: -1 })
        .limit(2)
        .lean()
    if (!saved.length) {
        return "Palm readings: none saved for this person yet. They can take one on the Palm Reading page."
    }
    return [
        "Saved palm readings for this person (newest first; you cannot see the photos, only what the reading found):",
        ...saved.map((r) => {
            const report = r.report as PalmReport
            const day = r.createdAt.toISOString().slice(0, 10)
            return [
                `- ${day}, ${r.hand} hand: "${report.title}". ${report.summary}`,
                `  Hand: ${report.hand.type} (${report.hand.element}).`,
                ...report.lines.map(
                    (l) =>
                        `  ${l.name}: ${l.visibility}; ${l.quality}. ${l.interpretation}`,
                ),
                `  Advice given: ${report.advice}`,
            ].join("\n")
        }),
    ].join("\n")
}

export default class AstrologerController {
    constructor(
        private profileService: ProfileService,
        private elevenLabs: ElevenLabsService,
        private contextService: AstrologerContextService,
        private usage: AstrologerUsageService,
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
            const lang = req.query.lang === "de" ? "de" : DEFAULT_LANGUAGE
            res.status(200).json(
                await this.elevenLabs.preview(astrologer, lang),
            )
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
                lang?: Language
            }
            const lang = body.lang ?? DEFAULT_LANGUAGE
            const spoken = SPOKEN[lang]
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

            const available = await this.usage.available(userId)
            if (available < MIN_SESSION_SECONDS) {
                next(
                    createHttpError(
                        402,
                        "You have used all your astrologer minutes.",
                        { code: "minutes_exhausted" },
                    ),
                )
                return
            }

            const agent = await this.elevenLabs.agentFor(astrologer)
            const { signedUrl, conversationId } =
                await this.elevenLabs.signedUrl(agent.agentId)
            const session = await this.usage.open(
                userId,
                conversationId,
                available,
            )

            this.logger.info("Astrologer session opened", {
                userId,
                astrologer: astrologer.id,
                session: session.id,
            })

            res.status(200).json({
                signedUrl,
                // the client hangs up once maxSeconds have passed
                session: { id: session.id, maxSeconds: available },
                dynamicVariables: {
                    // whoever's profile is active is the person talking
                    user_name: profile.firstName,
                    chart_context:
                        this.contextService.build(profile, lang) +
                        `\n\n${await palmNotes(userId, String(profile._id))}` +
                        `\n\nOther saved profiles they can switch to or compare with in synastry: ${others.join(", ") || spoken.none}.`,
                    language: spoken.name,
                    page: body.page ?? "dashboard",
                    greeting: body.greet
                        ? spoken.greeting(profile.firstName, astrologer)
                        : "",
                },
            })
        } catch (e) {
            next(e)
        }
    }

    /** The conversation is over; charge it as soon as ElevenLabs has timed it. */
    async end(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            res.status(200).json(
                await this.usage.end(getAuthUserId(req), String(req.params.id)),
            )
        } catch (e) {
            next(e)
        }
    }
}
