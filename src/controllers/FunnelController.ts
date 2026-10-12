import { randomBytes, randomUUID } from "crypto"
import { type NextFunction, type Request, type Response } from "express"
import { matchedData, validationResult } from "express-validator"
import createHttpError, { type HttpError } from "http-errors"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { UserService } from "../services/UserService.ts"
import type { ProfileService } from "../services/ProfileService.ts"
import { tokenPayload, type TokenService } from "../services/TokenService.ts"
import { UserModel, type GENDERS } from "../models/User.ts"
import { LandingPageHookModel, UTM_FIELDS } from "../models/LandingPageHook.ts"
import { getAuthUserId } from "../utils/index.ts"

// a subscription that never got paid for leaves one of these behind
const UNPAID = [undefined, null, "", "incomplete", "incomplete_expired"]

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
                await LandingPageHookModel.deleteMany({
                    email: body.email,
                    uuid: { $ne: body.hookId ?? "" },
                })
            }
        }

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
            )
        } catch (e) {
            // never sign anyone in to an existing account from here
            if ((e as HttpError).status === 400) {
                // they go to log in instead, so this visit leads nowhere
                if (body.hookId) {
                    await LandingPageHookModel.deleteOne({ uuid: body.hookId })
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
            // the campaign their visit came in on ("default" when unknown)
            const visit = body.hookId
                ? await LandingPageHookModel.findOne({ uuid: body.hookId })
                : null
            await UserModel.updateOne(
                { _id: user._id },
                {
                    $set: {
                        gender: body.gender,
                        ...Object.fromEntries(
                            UTM_FIELDS.map((f) => [f, visit?.[f] ?? "default"]),
                        ),
                    },
                },
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
                await LandingPageHookModel.updateOne(
                    { uuid: body.hookId },
                    {
                        $set: {
                            email: body.email,
                            isPaymentInitiated: false,
                            isPaymentCompleted: false,
                        },
                    },
                )
            }
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
                // a missing or empty one is stored as "default"
                ...Object.fromEntries(
                    UTM_FIELDS.map((f) => [
                        f,
                        (body[f] as string) || "default",
                    ]),
                ),
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
            await LandingPageHookModel.updateOne(
                { uuid: uuid as string },
                { $set: fields },
                // a visit whose first request was lost still gets recorded
                { upsert: true, setDefaultsOnInsert: true },
            )
            res.status(204).end()
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
