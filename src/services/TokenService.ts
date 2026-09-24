import jwt, { type JwtPayload } from "jsonwebtoken"
import type { Model } from "mongoose"
import type { RefreshToken } from "../models/RefreshToken.ts"
import type { UserDocument } from "../models/User.ts"
import { config } from "../config/index.ts"

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
