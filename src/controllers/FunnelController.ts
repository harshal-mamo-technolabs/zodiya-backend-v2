import { randomBytes, randomUUID } from "crypto"
import { type NextFunction, type Request, type Response } from "express"
import { matchedData, validationResult } from "express-validator"
import createHttpError, { type HttpError } from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { UserService } from "../services/UserService.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import {
    resumeTokenUser,
    tokenPayload,
    type TokenService,
} from "../services/TokenService.ts"
import { config } from "../config/index.ts"
import { ProfileModel } from "../models/Profile.ts"
import { UserModel, type GENDERS } from "../models/User.ts"
import {
    EMAIL_TOUCH,
    LandingPageHookModel,
    PER_VISIT,
    UTM_FIELDS,
} from "../models/LandingPageHook.ts"
import { Roles } from "../constants/index.ts"
import { getAuthUserId } from "../utils/index.ts"
import {
    KlaviyoEvents,
    klaviyo,
    landingProfile,
    resumeLink,
} from "../services/KlaviyoService.ts"

// a subscription that never got paid for leaves one of these behind
const UNPAID = [undefined, null, "", "incomplete", "incomplete_expired"]

// what stays the same across all of one email's visit records
const NOT_SHARED = new Set([
    "_id",
    "__v",
    "uuid",
    "createdAt",
    "updatedAt",
    "landingPageName",
    ...UTM_FIELDS,
    ...EMAIL_TOUCH,
])
const sharedFields = (hook?: object | null) =>
    Object.fromEntries(
        Object.entries(hook ?? {}).filter(([k]) => !NOT_SHARED.has(k)),
    )

const givenUtm = (fields: Record<string, unknown>) =>
    Object.fromEntries(
        PER_VISIT.filter((f) => fields[f]).map((f) => [f, fields[f]]),
    )

const latestHook = (email: string) =>
    LandingPageHookModel.findOne({ email }).sort({ _id: -1 }).lean()

/** A new campaign means a new record, a copy of their latest. */
async function recordCampaign(
    email: string,
    utm: Record<string, unknown>,
    landingPageName?: string,
) {
    const latest = await latestHook(email)
    if (latest && PER_VISIT.some((f) => utm[f] && utm[f] !== latest[f])) {
        await LandingPageHookModel.create({
            ...sharedFields(latest),
            ...Object.fromEntries(UTM_FIELDS.map((f) => [f, latest[f]])),
            ...((landingPageName ?? latest.landingPageName)
                ? { landingPageName: landingPageName ?? latest.landingPageName }
                : {}),
            ...utm,
            uuid: randomUUID(),
        })
    }
}

interface SignupBody {
    email: string
    firstName: string
    lastName: string
    gender: (typeof GENDERS)[number]
    avatar?: string
    birthDate: string
    birthTime?: string
    hookId?: string
    city: string
    state: string
    country: string
}

/**
 * The onboarding funnel (a separate site): it signs up in one step, pays with
 * a bearer token, then hands the user over to the app with a one-time token.
 */
export default class FunnelController {
    constructor(
        private userService: UserService,
        private profileService: ProfileService,
        private tokenService: TokenService,
        private logger: Logger,
    ) {}

    /** The account and its owner's chart in one go, and a token to pay with. */
    async signup(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }
        const body = req.body as SignupBody

        // someone back for another go: an account an earlier funnel visit made
        // and never paid for is thrown away, so they start over clean
        const existing = await UserModel.findOne({ email: body.email })
        if (existing) {
            const paid = !UNPAID.includes(existing.billing?.plan?.status)
            const fromFunnel = await LandingPageHookModel.exists({
                email: body.email,
                uuid: { $ne: body.hookId ?? "" },
            })
            if (!paid && fromFunnel) {
                await this.userService.remove(String(existing._id))
            }
        }

        // the account's campaign is whatever first brought this email here:
        // starting over replaces the account but must not replace that
        const visit = body.hookId
            ? await LandingPageHookModel.findOne({ uuid: body.hookId })
            : null
        const firstTouch =
            existing ??
            (await LandingPageHookModel.findOne({
                email: body.email,
                uuid: { $ne: body.hookId ?? "" },
            })
                .sort({ _id: 1 })
                .lean()) ??
            visit

        let user
        try {
            // the funnel asks for no password: the account gets a random one
            // nobody knows, and the user signs in through the handoff. A reset
            // link (to come) is how they set their own.
            user = await this.userService.create(
                body.firstName,
                body.lastName,
                body.email,
                randomBytes(24).toString("base64url"),
                Roles.CUSTOMER,
                Object.fromEntries(
                    UTM_FIELDS.map((f) => [f, firstTouch?.[f] ?? "organic"]),
                ),
            )
        } catch (e) {
            // never sign anyone in to an existing account from here
            if ((e as HttpError).status === 400) {
                // they go to log in instead. A visit from someone we have
                // records of still counts for its campaign, but nobody here
                // proved they own this email, so it takes the answers on file
                // and changes none of them.
                if (body.hookId) {
                    const earlier = await LandingPageHookModel.findOne({
                        email: body.email,
                        uuid: { $ne: body.hookId },
                    })
                        .sort({ _id: -1 })
                        .lean()
                    await (earlier
                        ? LandingPageHookModel.updateOne(
                              { uuid: body.hookId },
                              {
                                  $set: {
                                      ...sharedFields(earlier),
                                      utm_source: earlier.utm_source,
                                  },
                              },
                          )
                        : LandingPageHookModel.deleteOne({
                              uuid: body.hookId,
                          }))
                }
                next(
                    createHttpError(
                        409,
                        "You already have an account with this email. Log in instead.",
                        { code: "account_exists" },
                    ),
                )
                return
            }
            next(e)
            return
        }

        try {
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { gender: body.gender } },
            )
            const profile = await this.profileService.create(String(user._id), {
                firstName: body.firstName,
                lastName: body.lastName,
                birthDate: body.birthDate,
                city: body.city,
                state: body.state,
                country: body.country,
                ...(body.birthTime && { birthTime: body.birthTime }),
                ...(body.avatar && { avatar: body.avatar }),
            })
            if (body.hookId) {
                // now the email is known: this visit joins any earlier ones
                const earlier = await LandingPageHookModel.findOne({
                    email: body.email,
                    uuid: { $ne: body.hookId },
                })
                    .sort({ _id: -1 })
                    .lean()
                await LandingPageHookModel.updateMany(
                    { $or: [{ uuid: body.hookId }, { email: body.email }] },
                    {
                        $set: {
                            ...sharedFields(earlier),
                            ...sharedFields(visit?.toObject()),
                            email: body.email,
                            utm_source: user.utm_source,
                            // a new account starts its payment afresh, so an
                            // email link must not reopen an older plan choice
                            plan: null,
                            trial: null,
                            isPaymentInitiated: false,
                            isPaymentCompleted: false,
                        },
                    },
                )
            }
            klaviyo.track(
                KlaviyoEvents.EMAIL_CAPTURED,
                body.email,
                {
                    ...landingProfile({
                        ...body,
                        birthTime: body.birthTime ?? null,
                        lat: visit?.lat ?? null,
                        lon: visit?.lon ?? null,
                        utm_source: user.utm_source,
                        utm_campaign: user.utm_campaign,
                        utm_medium: user.utm_medium,
                        landingPageName: visit?.landingPageName ?? null,
                        createdAt: visit?.createdAt ?? user.createdAt,
                    }),
                    ...resumeLink(String(user._id)),
                },
                `email_captured:${String(user._id)}`,
            )
            this.logger.info("Signed up through the funnel", { id: user._id })
            res.status(201).json({
                accessToken: this.tokenService.generateAccessToken(
                    tokenPayload(user),
                ),
                sunSign: profile.zodiacSign,
            })
        } catch (e) {
            // half an account would block this email for good: undo it
            await this.userService.remove(String(user._id))
            next(e)
        }
    }

    /** A visitor has just landed: their visit, and the campaign that sent them. */
    async createHook(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }
        const body = req.body as Record<string, unknown>
        try {
            const hook = await LandingPageHookModel.create({
                uuid: randomUUID(),
                ...(body.landingPageName
                    ? { landingPageName: body.landingPageName as string }
                    : {}),
                // a missing or empty one is stored as "organic"
                ...Object.fromEntries(
                    UTM_FIELDS.map((f) => [
                        f,
                        (body[f] as string) || "organic",
                    ]),
                ),
                ...givenUtm(body),
            })
            res.status(201).json({ uuid: hook.uuid })
        } catch (e) {
            next(e)
        }
    }

    /** Whatever the visitor has just answered, added to their visit. */
    async updateHook(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }
        const { uuid, ...fields } = matchedData(req)
        try {
            const utm = givenUtm(fields)
            const answers = sharedFields(fields)
            const source = fields.utm_source as string | undefined
            const page = fields.landingPageName as string | undefined
            const known = await LandingPageHookModel.findOne({
                uuid: uuid as string,
            }).lean()

            if (known?.email) {
                await recordCampaign(known.email, utm, page)
                await LandingPageHookModel.updateMany(
                    { email: known.email },
                    { $set: answers },
                )
            }

            const hook = await LandingPageHookModel.findOneAndUpdate(
                { uuid: uuid as string },
                // no email yet: nothing to link, so this record just takes the
                // campaign. With one, the block above has written everything.
                // The source only ever goes in with a brand new record.
                {
                    $set: {
                        ...(known?.email ? {} : { ...answers, ...utm }),
                        ...(page ? { landingPageName: page } : {}),
                    },
                    ...(source ? { $setOnInsert: { utm_source: source } } : {}),
                },
                // a visit whose first request was lost still gets recorded
                {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    returnDocument: "after",
                },
            )
            // choosing a plan is what starts the payment
            if (fields.plan && hook.email) {
                const trial = !!hook.trial
                klaviyo.track(
                    KlaviyoEvents.PAYMENT_INITIATED,
                    hook.email,
                    {
                        "astromeridian:landing_page_selected_plan":
                            hook.plan ?? null,
                        "astromeridian:landing_page_is_trial_plan": trial,
                        "astromeridian:landing_page_payment_initiated": true,
                        "astromeridian:landing_page_payment_completed": false,
                        ...(hook.landingPageName
                            ? {
                                  "astromeridian:landing_page_name":
                                      hook.landingPageName,
                              }
                            : {}),
                    },
                    `payment_initiated:${hook.uuid}:${String(hook.plan)}:${String(trial)}`,
                )
            }
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }

    /**
     * An email link: the person is signed in and back where they left off, the
     * plans or the checkout of the plan they chose (a link needs an email, so
     * everything before those is behind them). Only for an account still to
     * pay, the link being reusable and forwardable. Anyone
     * with a plan logs in, so a forwarded email never opens a paying account.
     */
    async resume(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }
        const { token, ...fields } = matchedData(req)
        try {
            const userId = resumeTokenUser(token as string)
            const user = userId ? await UserModel.findById(userId) : null
            if (!user || user.deletedAt) {
                next(createHttpError(401, "This link has expired."))
                return
            }
            await recordCampaign(
                user.email,
                givenUtm(fields),
                fields.landingPageName as string | undefined,
            )

            const paid = !UNPAID.includes(user.billing?.plan?.status)
            if (paid || !config.PAYMENTS_ENABLED) {
                res.status(200).json({ stage: "login" })
                return
            }
            const profile = await ProfileModel.findOne({
                user: user._id,
                isPrimary: true,
            }).lean()
            const latest = await latestHook(user.email)
            res.status(200).json({
                stage: latest?.plan ? "pay" : "plans",
                accessToken: this.tokenService.generateAccessToken(
                    tokenPayload(user),
                ),
                hookId: latest?.uuid,
                plan: latest?.plan,
                trial: latest?.trial,
                firstName: user.firstName,
                sunSign: profile?.zodiacSign,
            })
        } catch (e) {
            next(e)
        }
    }

    /** A one-time, two-minute token the app turns into a normal session. */
    async handoff(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(getAuthUserId(req))
            if (!user) {
                next(createHttpError(401, "Unauthorized"))
                return
            }
            res.status(200).json({
                token: await this.tokenService.generateHandoffToken(user),
            })
        } catch (e) {
            next(e)
        }
    }
}
