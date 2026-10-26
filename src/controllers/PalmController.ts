import { randomUUID } from "crypto"
import { klaviyo } from "../services/KlaviyoService.ts"
import { type NextFunction, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import { Types } from "mongoose"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import { config } from "../config/index.ts"
import { DEFAULT_LANGUAGE, type Language } from "../constants/index.ts"
import {
    PHOTO_PROBLEMS,
    photoProblem,
    type HandSide,
    type PalmReport,
    type PalmReportService,
} from "../services/PalmReportService.ts"
import type { PalmImageService } from "../services/PalmImageService.ts"
import type {
    BillingService,
    PalmBucket,
    PalmLeft,
} from "../services/BillingService.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import { palmPrefix, type StorageService } from "../services/StorageService.ts"
import { palmPdf, slug } from "../services/PalmPdfService.ts"
import type { PalmReading, PalmReadingModel } from "../models/PalmReading.ts"
import { getAuthUserId } from "../utils/index.ts"

const EXT: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}
const MIME = Object.fromEntries(Object.entries(EXT).map(([m, e]) => [e, m]))

/** Whole years from a YYYY-MM-DD birth date; null when it cannot be read. */
export function ageFrom(birthDate: string, now = new Date()): number | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate)
    if (!m) {
        return null
    }
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
    const before =
        now.getUTCMonth() + 1 < mo ||
        (now.getUTCMonth() + 1 === mo && now.getUTCDate() < d)
    const age = now.getUTCFullYear() - y - (before ? 1 : 0)
    return age >= 0 ? age : null
}

const notFound = () =>
    createHttpError(404, "Palm reading not found.", {
        code: "reading_not_found",
    })

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export default class PalmController {
    constructor(
        private reports: PalmReportService,
        private images: PalmImageService,
        private storage: StorageService,
        private profiles: ProfileService,
        private readings: typeof PalmReadingModel,
        private billing: BillingService,
        private logger: Logger,
    ) {}

    private invalid(req: AuthRequest, res: Response) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            return false
        }
        res.status(400).json({ errors: result.array() })
        return true
    }

    private async find(req: AuthRequest) {
        return await this.readings.findOne({
            _id: req.params.id,
            user: getAuthUserId(req),
        })
    }

    private async sign(key: string | null | undefined) {
        return key ? await this.storage.signedUrl(key) : null
    }

    /**
     * OpenAI reads the photo and writes the report; it also turns away photos
     * with no clear palm (those are never stored). A good reading is saved with
     * its photo; if saving fails the user still gets the reading. With
     * payments on, each reading spends one palm credit, reserved before OpenAI
     * is called and given back if no reading comes of it.
     */
    async read(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }

        const started = Date.now()
        const userId = getAuthUserId(req)
        // the credit held for this reading until it is delivered
        let held: PalmBucket | null = null
        try {
            // the upload middleware has checked its type and size
            const photo = req.file
            if (!photo) {
                next(createHttpError(400, "A palm photo is required."))
                return
            }
            // fail before paying for a reading that cannot be saved
            this.storage.assertConfigured()
            const body = req.body as {
                hand: HandSide
                dominant: HandSide
                lang?: Language
                profileId?: string
                name?: string
                gender?: string
                age?: number
            }
            const lang = body.lang ?? DEFAULT_LANGUAGE

            let subject: PalmReading["subject"]
            if (body.profileId) {
                const profile = await this.profiles.findById(
                    body.profileId,
                    userId,
                )
                if (!profile) {
                    next(
                        createHttpError(404, "Profile not found.", {
                            code: "profile_not_found",
                        }),
                    )
                    return
                }
                subject = {
                    kind: "profile",
                    profile: profile._id,
                    name: `${profile.firstName} ${profile.lastName}`.trim(),
                    // profiles carry no gender today
                    gender: null,
                    age: ageFrom(profile.birthDate),
                }
            } else {
                subject = {
                    kind: "other",
                    name: body.name ?? "",
                    gender: body.gender ?? null,
                    age: body.age ?? null,
                }
            }

            // a hand is read once per person: the saved reading is opened
            // instead, and deleting it is how that hand gets read again
            const existing = await this.readings
                .findOne({
                    user: userId,
                    hand: body.hand,
                    "subject.kind": subject.kind,
                    ...(subject.kind === "profile"
                        ? { "subject.profile": subject.profile ?? null }
                        : {
                              "subject.name": new RegExp(
                                  `^${escapeRegExp(subject.name.trim())}$`,
                                  "i",
                              ),
                          }),
                })
                .select("_id")
            if (existing) {
                res.status(409).json({
                    errors: [
                        {
                            msg: "This hand has already been read. Open the saved reading, or delete it to read this hand again.",
                            code: "hand_already_read",
                            readingId: String(existing._id),
                        },
                    ],
                })
                return
            }

            if (config.PAYMENTS_ENABLED) {
                held = await this.billing.reservePalm(userId)
                if (!held) {
                    next(
                        createHttpError(
                            402,
                            "You've used all your palm readings. Get more to keep reading.",
                            { code: "palm_credits_exhausted" },
                        ),
                    )
                    return
                }
            }

            const report = await this.reports.write({
                photo,
                hand: body.hand,
                dominant: body.hand === body.dominant,
                lang,
                subject: {
                    name: subject.name,
                    gender: subject.gender ?? null,
                    age: subject.age ?? null,
                },
            })

            this.logger.info("Palm read", {
                userId,
                ok: report.ok,
                totalMs: Date.now() - started,
            })

            const problem = photoProblem(report)
            if (problem) {
                this.logger.info("Palm photo turned away", {
                    userId,
                    problem,
                    photo: report.photo,
                })
                await this.refund(userId, held)
                held = null
                next(
                    createHttpError(
                        422,
                        problem === "palm_unclear" && report.reason
                            ? report.reason
                            : PHOTO_PROBLEMS[problem],
                        { code: problem },
                    ),
                )
                return
            }

            // delivered from here on, saved or not: the credit is spent
            held = null
            void klaviyo.account(userId)
            const credits: PalmLeft | null = config.PAYMENTS_ENABLED
                ? await this.billing.palmCredits(userId)
                : null

            const reading = {
                hand: body.hand,
                dominant: body.hand === body.dominant,
                model: config.OPENAI_VISION_MODEL,
                subject: {
                    kind: subject.kind,
                    ...(subject.profile && {
                        profile: String(subject.profile),
                    }),
                    name: subject.name,
                    gender: subject.gender ?? null,
                    age: subject.age ?? null,
                },
                report,
            }

            const id = new Types.ObjectId()
            const key = `${palmPrefix(userId)}${String(id)}/${randomUUID()}-original.${EXT[photo.mimetype] ?? "jpg"}`
            try {
                await this.storage.put(key, photo.buffer, photo.mimetype)
                const doc = await this.readings.create({
                    _id: id,
                    user: userId,
                    subject,
                    hand: body.hand,
                    dominant: reading.dominant,
                    lang,
                    model: reading.model,
                    report,
                    images: { original: key, highlighted: null },
                })
                res.status(200).json({
                    id: String(id),
                    ...reading,
                    createdAt: doc.createdAt.toISOString(),
                    images: {
                        original: await this.storage.signedUrl(key),
                        highlighted: null,
                    },
                    saved: true,
                    credits,
                })
            } catch (e) {
                // the reading was paid for: hand it over even though it is not kept
                this.logger.error("Palm reading not saved", {
                    userId,
                    error: (e as Error).message,
                })
                res.status(200).json({
                    id: null,
                    ...reading,
                    createdAt: new Date().toISOString(),
                    images: { original: null, highlighted: null },
                    saved: false,
                    credits,
                })
            }
        } catch (e) {
            const { code, upstream } = e as { code?: string; upstream?: string }
            this.logger.warn("Palm read failed", {
                userId,
                code,
                upstream,
                totalMs: Date.now() - started,
            })
            await this.refund(userId, held)
            next(e)
        }
    }

    private async refund(userId: string, held: PalmBucket | null) {
        if (!held) {
            return
        }
        await this.billing.refundPalm(userId, held).catch((e: unknown) => {
            this.logger.error("Palm credit not refunded", {
                userId,
                bucket: held,
                error: (e as Error).message,
            })
        })
    }

    /** The saved photo redrawn with its lines highlighted; drawn once, then reused. */
    async highlight(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }

        const started = Date.now()
        const userId = getAuthUserId(req)
        let reading: Awaited<ReturnType<PalmController["find"]>> = null
        try {
            reading = await this.find(req)
            if (!reading) {
                next(notFound())
                return
            }
            if (reading.images?.highlighted) {
                res.status(200).json({
                    image: await this.storage.signedUrl(
                        reading.images.highlighted,
                    ),
                    model: reading.highlight?.model ?? null,
                })
                return
            }

            const originalKey = reading.images?.original ?? ""
            const original = await this.storage.get(originalKey)
            const report = reading.report as PalmReport
            const image = await this.images.highlight({
                photo: {
                    buffer: original,
                    mimetype:
                        MIME[originalKey.split(".").pop() ?? ""] ??
                        "image/jpeg",
                },
                skip: report.lines
                    .filter((l) => l.visibility === "not_visible")
                    .map((l) => l.key),
            })

            const key = `${palmPrefix(userId)}${String(reading._id)}/${randomUUID()}-highlighted.jpg`
            await this.storage.put(key, image, "image/jpeg")
            reading.set({
                "images.highlighted": key,
                highlight: { state: "done", model: config.OPENAI_IMAGE_MODEL },
            })
            await reading.save()

            this.logger.info("Palm lines drawn", {
                userId,
                totalMs: Date.now() - started,
            })
            res.status(200).json({
                image: await this.storage.signedUrl(key),
                model: config.OPENAI_IMAGE_MODEL,
            })
        } catch (e) {
            const { code, upstream } = e as { code?: string; upstream?: string }
            this.logger.warn("Palm lines failed", {
                userId,
                code,
                upstream,
                totalMs: Date.now() - started,
            })
            if (reading) {
                await this.readings
                    .updateOne(
                        { _id: reading._id },
                        { "highlight.state": "failed" },
                    )
                    .catch(() => undefined)
            }
            next(e)
        }
    }

    /** The user's readings, newest first, a page at a time. */
    async list(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }
        try {
            // Express 5's req.query is read-only, so the validator cannot convert it
            const query = req.query as { limit?: string; before?: string }
            const limit = Number(query.limit ?? 20)
            const before = query.before
            // ponytail: createdAt cursor; readings saved in the same millisecond can straddle a page break
            const docs = await this.readings
                .find({
                    user: getAuthUserId(req),
                    ...(before && { createdAt: { $lt: new Date(before) } }),
                })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select("subject hand report.title images createdAt")
            const readings = await Promise.all(
                docs.map(async (d) => ({
                    id: String(d._id),
                    subject: { name: d.subject?.name, kind: d.subject?.kind },
                    hand: d.hand,
                    title: (d.report as { title?: string } | undefined)?.title,
                    createdAt: d.createdAt.toISOString(),
                    thumb: await this.sign(
                        d.images?.highlighted ?? d.images?.original,
                    ),
                })),
            )
            res.status(200).json({
                readings,
                next:
                    docs.length === limit
                        ? (readings.at(-1)?.createdAt ?? null)
                        : null,
            })
        } catch (e) {
            next(e)
        }
    }

    async get(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }
        try {
            const d = await this.find(req)
            if (!d) {
                next(notFound())
                return
            }
            res.status(200).json({
                id: String(d._id),
                hand: d.hand,
                dominant: d.dominant,
                lang: d.lang,
                // `model` is also a Document method, so read the path itself
                model: d.get("model"),
                createdAt: d.createdAt.toISOString(),
                subject: {
                    kind: d.subject?.kind,
                    ...(d.subject?.profile && {
                        profile: String(d.subject.profile),
                    }),
                    name: d.subject?.name,
                    gender: d.subject?.gender ?? null,
                    age: d.subject?.age ?? null,
                },
                report: d.report as PalmReport,
                images: {
                    original: await this.sign(d.images?.original),
                    highlighted: await this.sign(d.images?.highlighted),
                },
                highlight: { state: d.highlight?.state ?? "none" },
            })
        } catch (e) {
            next(e)
        }
    }

    /** The saved reading as a PDF download; a photo that cannot be fetched is left out. */
    async pdf(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }
        try {
            const d = await this.find(req)
            if (!d) {
                next(notFound())
                return
            }
            const fetch = async (key: string | null | undefined) => {
                if (!key) {
                    return null
                }
                try {
                    return await this.storage.get(key)
                } catch (e) {
                    this.logger.warn("Palm PDF photo not fetched", {
                        readingId: String(d._id),
                        error: (e as Error).message,
                    })
                    return null
                }
            }
            const [original, highlighted] = await Promise.all([
                fetch(d.images?.original),
                fetch(d.images?.highlighted),
            ])
            const name = d.subject?.name ?? ""
            const pdf = await palmPdf(
                {
                    lang: d.lang,
                    hand: d.hand,
                    createdAt: d.createdAt,
                    subject: { name },
                    report: d.report as PalmReport,
                },
                { original, highlighted },
            )
            const date = d.createdAt.toISOString().slice(0, 10)
            res.status(200)
                .set({
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="astromeridian-palm-reading-${slug(name)}-${date}.pdf"`,
                    "Cache-Control": "private, no-store",
                })
                .send(pdf)
        } catch (e) {
            next(e)
        }
    }

    async remove(req: AuthRequest, res: Response, next: NextFunction) {
        if (this.invalid(req, res)) {
            return
        }
        try {
            const d = await this.find(req)
            if (!d) {
                next(notFound())
                return
            }
            await this.storage.remove(
                [d.images?.original, d.images?.highlighted].filter(
                    (k): k is string => Boolean(k),
                ),
            )
            await d.deleteOne()
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }
}
