import { createHmac } from "crypto"
import express from "express"
import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import authenticate from "../middlewares/authenticate.ts"
import { UserModel } from "../models/User.ts"
import type { AuthRequest } from "../types/index.ts"
import { getAuthUserId } from "../utils/index.ts"

const router = express.Router()

/**
 * Help Scout Beacon secure mode: the support page hands the Beacon this
 * signature (HMAC-SHA256 of the email with the secure mode key), so Help Scout
 * knows the chat really is this user. Any signed-in account may contact
 * support, with or without a plan.
 */
router.get("/signature", authenticate, async (req: AuthRequest, res, next) => {
    try {
        if (!config.HELPSCOUT_SECURE_MODE_KEY) {
            next(createHttpError(503, "Support chat is not configured."))
            return
        }
        const user = await UserModel.findById(getAuthUserId(req)).select(
            "firstName lastName email utm_source utm_campaign utm_medium",
        )
        if (!user) {
            next(createHttpError(401, "Unauthorized"))
            return
        }
        res.status(200).json({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            signature: createHmac("sha256", config.HELPSCOUT_SECURE_MODE_KEY)
                .update(user.email)
                .digest("hex"),
            // shown on the customer's card in Help Scout (customer properties)
            utm_source: user.utm_source,
            utm_campaign: user.utm_campaign,
            utm_medium: user.utm_medium,
        })
    } catch (e) {
        next(e)
    }
})

export default router
