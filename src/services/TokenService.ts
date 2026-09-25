import jwt, { type JwtPayload } from "jsonwebtoken"
import { and, eq, gt } from "drizzle-orm"
import type { Db } from "../config/db.ts"
import { refreshTokens } from "../models/RefreshToken.ts"
import type { User } from "../models/User.ts"
import { config } from "../config/index.ts"

export class TokenService {
    constructor(private db: Db) {}

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
        user: User,
    ): Promise<string> {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365

        const [row] = await this.db
            .insert(refreshTokens)
            .values({
                user: user._id,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            })
            .$returningId()

        if (!row) {
            throw new Error("Failed to store the refresh token")
        }

        const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "zodiya-backend",
            jwtid: row._id,
        })

        return refreshToken
    }

    async deleteRefreshToken(tokenId: string) {
        return await this.db
            .delete(refreshTokens)
            .where(eq(refreshTokens._id, tokenId))
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
        // a single DELETE is atomic, so two racing refreshes cannot both win
        const [result] = await this.db
            .delete(refreshTokens)
            .where(
                and(
                    eq(refreshTokens._id, jti),
                    eq(refreshTokens.user, sub),
                    gt(refreshTokens.expiresAt, new Date()),
                ),
            )
        return result.affectedRows === 1 ? sub : null
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
