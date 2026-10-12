import type { NextFunction, Response } from "express"
import createHttpError from "http-errors"
import type { AuthRequest } from "../types/index.ts"
import { UserModel } from "../models/User.ts"
import { ProfileModel } from "../models/Profile.ts"
import { INCLUDED_PROFILES } from "../constants/billing.ts"
import { isEntitled } from "../services/BillingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { config } from "../config/index.ts"

/** Runs after authenticate: nothing in the app works without a live plan. */
export default async function requirePlan(
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
) {
    if (!config.PAYMENTS_ENABLED) {
        next()
        return
    }
    const user = await UserModel.findById(getAuthUserId(req)).select(
        "billing.plan.status",
    )
    if (!user) {
        next(createHttpError(401, "Unauthorized"))
        return
    }
    if (!isEntitled(user.billing?.plan?.status)) {
        next(
            createHttpError(402, "Choose a plan to continue.", {
                code: "plan_required",
            }),
        )
        return
    }
    next()
}

/** Before a profile is created: the owner's own is included, the rest are paid slots. */
export async function requireProfileSlot(
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
) {
    if (!config.PAYMENTS_ENABLED) {
        next()
        return
    }
    const userId = getAuthUserId(req)
    const [user, used] = await Promise.all([
        UserModel.findById(userId).select("billing.profiles"),
        ProfileModel.countDocuments({ user: userId }),
    ])
    const slots = user?.billing?.profiles
    const allowed =
        INCLUDED_PROFILES +
        (isEntitled(slots?.status) ? (slots?.quantity ?? 0) : 0)
    if (used >= allowed) {
        next(
            createHttpError(
                402,
                "Every profile slot is in use. Choose a bigger profile pack to add more.",
                { code: "profile_slot_required" },
            ),
        )
        return
    }
    next()
}

/** Anything that takes money is refused while payments are switched off. */
export function requirePayments(
    _req: AuthRequest,
    _res: Response,
    next: NextFunction,
) {
    next(
        config.PAYMENTS_ENABLED
            ? undefined
            : createHttpError(403, "Payments are switched off.", {
                  code: "payments_disabled",
              }),
    )
}
