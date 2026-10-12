import jwt, { type JwtPayload } from "jsonwebtoken"
import type { Model } from "mongoose"
import type { RefreshToken } from "../models/RefreshToken.ts"
import type { UserDocument } from "../models/User.ts"
import { config } from "../config/index.ts"

/** What every token says about its user. */
export const tokenPayload = (user: UserDocument): JwtPayload => ({
    sub: user._id.toString(),
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
})

/** How long a funnel-to-app sign-in token lives; it rides in a URL, so briefly. */
const HANDOFF_MS = 2 * 60 * 1000

export class TokenService {
    constructor(private refreshTokenModel: Model<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload): string {
        const accessToken = jwt.sign(payload, config.PRIVATE_KEY, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "zodiya-backend",
        })

        return accessToken
    }

    async generateRefreshToken(
        payload: JwtPayload,
        user: UserDocument,
    ): Promise<string> {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365

        const newRefreshToken = await this.refreshTokenModel.create({
            user: user._id,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        })

        const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "zodiya-backend",
            jwtid: newRefreshToken._id.toString(),
        })

        return refreshToken
    }

    /**
     * A one-time pass from the onboarding funnel into the app. It travels in a
     * URL, so it lives two minutes and works once: its row is deleted when it
     * is redeemed (consumeHandoffToken), the same way refresh tokens rotate.
     */
    async generateHandoffToken(user: UserDocument): Promise<string> {
        const row = await this.refreshTokenModel.create({
            user: user._id,
            expiresAt: new Date(Date.now() + HANDOFF_MS),
        })
        return jwt.sign(
            { sub: user._id.toString(), purpose: "handoff" },
            config.PRIVATE_KEY,
            {
                algorithm: "RS256",
                expiresIn: HANDOFF_MS / 1000,
                issuer: "zodiya-backend",
                jwtid: row._id.toString(),
            },
        )
    }

    /** The user a handoff token names, if it is genuine, fresh and unused. */
    async consumeHandoffToken(token: string): Promise<string | null> {
        let payload: JwtPayload
        try {
            payload = jwt.verify(token, config.PUBLIC_KEY, {
                algorithms: ["RS256"],
                issuer: "zodiya-backend",
            }) as JwtPayload
        } catch {
            return null
        }
        if (payload.purpose !== "handoff" || !payload.jti || !payload.sub) {
            return null
        }
        const row = await this.refreshTokenModel.findOneAndDelete({
            _id: payload.jti,
            user: payload.sub,
            expiresAt: { $gt: new Date() },
        })
        return row ? payload.sub : null
    }

    async deleteRefreshToken(tokenId: string) {
        return await this.refreshTokenModel.deleteOne({ _id: tokenId })
    }

    /**
     * The user behind a refresh cookie, if the cookie is genuine and its row
     * still exists. The row is deleted on the way out so the cookie can be
     * used once; the caller issues a new one.
     */
    async consumeRefreshToken(token: string): Promise<string | null> {
        let payload: JwtPayload
        try {
            payload = jwt.verify(
                token,
                config.REFRESH_TOKEN_SECRET,
            ) as JwtPayload
        } catch {
            return null
        }
        const jti = payload.jti
        const sub = payload.sub
        if (!jti || !sub) {
            return null
        }
        const row = await this.refreshTokenModel.findOneAndDelete({
            _id: jti,
            user: sub,
            expiresAt: { $gt: new Date() },
        })
        return row ? sub : null
    }

    /** Drops the row behind a refresh cookie; an expired or tampered token has nothing to drop. */
    async revokeRefreshToken(token: string) {
        try {
            const { jti } = jwt.verify(
                token,
                config.REFRESH_TOKEN_SECRET,
            ) as JwtPayload
            if (jti) {
                await this.deleteRefreshToken(jti)
            }
        } catch {
            // nothing to revoke
        }
    }
}
