import { expressjwt } from "express-jwt"
import type { Request } from "express"
import { config } from "../config/index.ts"
import type { AuthCookie } from "../types/index.ts"

export default expressjwt({
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
