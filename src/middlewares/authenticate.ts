import { expressjwt } from "express-jwt"
import type { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import type { AuthCookie, AuthRequest } from "../types/index.ts"
import { UserModel } from "../models/User.ts"
import { getAuthUserId } from "../utils/index.ts"

const jwt = expressjwt({
    secret: config.PUBLIC_KEY,
    algorithms: ["RS256"],
    getToken(req: Request) {
        const authHeader = req.headers.authorization

        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1]
            if (token) {
                return token
            }
        }

        const { accessToken } = req.cookies as AuthCookie
        return accessToken
    },
})

/** An access token outlives a deletion by up to an hour; this closes that gap. */
async function notDeleted(
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
) {
    try {
        const deleted = await UserModel.exists({
            _id: getAuthUserId(req),
            deletedAt: { $ne: null },
        })
        next(
            deleted
                ? createHttpError(401, "This account has been deleted.", {
                      code: "account_deleted",
                  })
                : undefined,
        )
    } catch (e) {
        next(e)
    }
}

export default function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    void jwt(req, res, (err?: unknown) => {
        if (err) {
            next(err)
            return
        }
        void notDeleted(req as AuthRequest, res, next)
    })
}
