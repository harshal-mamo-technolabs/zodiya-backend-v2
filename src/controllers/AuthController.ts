import { type NextFunction, type Request, type Response } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import type { JwtPayload } from "jsonwebtoken"
import type { Logger } from "winston"
import type {
    AccountPatch,
    AccountResponse,
    AuthCookie,
    AuthRequest,
    LoginUserRequest,
    RegisterUserRequest,
} from "../types/index.ts"
import type { User } from "../models/User.ts"
import type { UserService } from "../services/UserService.ts"
import type { TokenService } from "../services/TokenService.ts"
import type { CredentialService } from "../services/CredentialService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { config } from "../config/index.ts"

// browsers only clear a cookie when the options match the ones it was set with;
// over https the cookie must never travel in clear
const COOKIE_OPTIONS = {
    sameSite: "strict",
    httpOnly: true,
    secure: config.NODE_ENV === "production",
} as const

export default class AuthController {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private credentialService: CredentialService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
            return
        }

        this.logger.debug("New request to register a user", {
            firstName,
            lastName,
            email,
            password: "*",
        })
        try {
            const user = await this.userService.create(
                firstName,
                lastName,
                email,
                password,
            )

            this.logger.info("User has been registered", { id: user._id })

            await this.setAuthCookies(res, user)

            res.status(201).json({
                id: user._id,
            })
        } catch (e) {
            next(e)
        }
    }

    async login(req: LoginUserRequest, res: Response, next: NextFunction) {
        const { email, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array(),
            })
            return
        }

        this.logger.debug("New request to login a user", {
            email,
            password: "*",
        })

        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or password does not match!",
                )
                next(error)
                return
            }

            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            )

            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    "Email or password does not match!",
                )
                next(error)
                return
            }

            this.logger.info("User has been logged in", { id: user._id })

            await this.setAuthCookies(res, user)

            res.status(200).json({
                id: user._id,
            })
        } catch (e) {
            next(e)
        }
    }

    async me(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findById(getAuthUserId(req))
            if (!user) {
                next(createHttpError(404, "Account does not exist"))
                return
            }
            res.status(200).json(this.account(user))
        } catch (e) {
            next(e)
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }

        try {
            const body = req.body as AccountPatch
            const patch: AccountPatch = {}
            if (body.firstName !== undefined) {
                patch.firstName = body.firstName
            }
            if (body.lastName !== undefined) {
                patch.lastName = body.lastName
            }
            if (body.notifications) {
                patch.notifications = this.prefs(body.notifications)
            }
            const user = await this.userService.update(
                getAuthUserId(req),
                patch,
            )
            if (!user) {
                next(createHttpError(404, "Account does not exist"))
                return
            }
            this.logger.info("Account updated", { id: user._id })
            res.status(200).json(this.account(user))
        } catch (e) {
            next(e)
        }
    }

    /** Deletes the account and everything it owns, then ends the session. */
    async remove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = getAuthUserId(req)
            const gone = await this.userService.remove(id)
            if (!gone) {
                next(createHttpError(404, "Account does not exist"))
                return
            }
            this.logger.info("Account deleted", { id })
            res.clearCookie("accessToken", COOKIE_OPTIONS)
            res.clearCookie("refreshToken", COOKIE_OPTIONS)
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }

    private account(user: User): AccountResponse {
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            notifications: user.notifications,
            createdAt: user.createdAt.toISOString(),
        }
    }

    /** Only the known keys, so a stray field cannot land on the document. */
    private prefs(
        given: Partial<AccountResponse["notifications"]>,
    ): Partial<AccountResponse["notifications"]> {
        const out: Partial<AccountResponse["notifications"]> = {}
        if (given.daily !== undefined) {
            out.daily = given.daily
        }
        if (given.transits !== undefined) {
            out.transits = given.transits
        }
        if (given.retro !== undefined) {
            out.retro = given.retro
        }
        if (given.deliveryTime !== undefined) {
            out.deliveryTime = given.deliveryTime
        }
        return out
    }

    /**
     * A new access cookie from a refresh cookie, and a new refresh cookie in
     * its place. No auth guard: the access token is expired by definition.
     */
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies as AuthCookie
            const userId = refreshToken
                ? await this.tokenService.consumeRefreshToken(refreshToken)
                : null
            const user = userId ? await this.userService.findById(userId) : null
            if (!user) {
                res.clearCookie("accessToken", COOKIE_OPTIONS)
                res.clearCookie("refreshToken", COOKIE_OPTIONS)
                next(
                    createHttpError(
                        401,
                        "Session has expired. Please log in again.",
                    ),
                )
                return
            }
            await this.setAuthCookies(res, user)
            this.logger.debug("Session refreshed", { id: user._id })
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }

    // no auth guard: an expired access token must still be able to log out
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies as AuthCookie
            if (refreshToken) {
                await this.tokenService.revokeRefreshToken(refreshToken)
            }
            res.clearCookie("accessToken", COOKIE_OPTIONS)
            res.clearCookie("refreshToken", COOKIE_OPTIONS)
            res.status(204).end()
        } catch (e) {
            next(e)
        }
    }

    private async setAuthCookies(res: Response, user: User) {
        const payload: JwtPayload = {
            sub: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }

        const accessToken = this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefreshToken(
            payload,
            user,
        )

        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60,
        })

        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        })
    }
}
