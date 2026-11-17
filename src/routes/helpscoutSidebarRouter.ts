import { createHmac, timingSafeEqual } from "crypto"
import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express"
import createHttpError, { isHttpError } from "http-errors"
import jwt from "jsonwebtoken"
import { rateLimit } from "express-rate-limit"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import { UserModel } from "../models/User.ts"
import { ProfileModel } from "../models/Profile.ts"
import { BillingGrantModel } from "../models/BillingGrant.ts"
import { BillingService } from "../services/BillingService.ts"
import { helpScout } from "../services/HelpScoutService.ts"
import {
    CANCEL_REASONS,
    STAY_OPTIONS,
    renderSidebar,
    sidebarMessage,
} from "../views/helpscoutSidebar.ts"

const router = express.Router()
const billing = new BillingService(UserModel, ProfileModel, BillingGrantModel)
const audience = "helpscout-sidebar"
interface Session {
    userId: string
    email: string
    conversationId: string
    agentId: string
    planId: string | null
    profilesId: string | null
}

router.use((_, res, next) => {
    res.set({
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
            "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors https://secure.helpscout.net; base-uri 'none'",
    })
    next()
})
router.use(
    rateLimit({
        windowMs: 60_000,
        limit: 120,
        standardHeaders: "draft-8",
        legacyHeaders: false,
    }),
)
router.use(express.urlencoded({ extended: false, limit: "12kb" }))

function secret() {
    if (
        !config.HELPSCOUT_SIDEBAR_SECRET ||
        !/^\d+$/.test(config.HELPSCOUT_INBOX_ID)
    ) {
        throw createHttpError(
            503,
            "The AstroMeridian sidebar is not configured.",
        )
    }
    return config.HELPSCOUT_SIDEBAR_SECRET
}

function issue(session: Session) {
    const { userId, email, conversationId, agentId, planId, profilesId } =
        session
    return jwt.sign(
        { userId, email, conversationId, agentId, planId, profilesId },
        secret(),
        {
            algorithm: "HS256",
            audience,
            issuer: audience,
            expiresIn: "15m",
        },
    )
}

function sessionOf(req: Request): Session {
    const body = req.body as Record<string, unknown>
    if (typeof body.token !== "string")
        throw createHttpError(
            401,
            "Reload the app from the Help Scout sidebar.",
        )
    try {
        const data = jwt.verify(body.token, secret(), {
            algorithms: ["HS256"],
            audience,
            issuer: audience,
        }) as Session
        if (!data.userId || !data.email || !/^\d+$/.test(data.conversationId))
            throw new Error("Invalid session")
        return data
    } catch {
        throw createHttpError(
            401,
            "This sidebar session expired. Reload the conversation in Help Scout.",
        )
    }
}

async function customer(conversationId: string) {
    const conversation = await helpScout.conversation(conversationId)
    if (String(conversation.mailboxId) !== config.HELPSCOUT_INBOX_ID) {
        throw createHttpError(
            403,
            "This app is available only in the zodiya inbox.",
        )
    }
    const email = conversation.primaryCustomer.email.trim().toLowerCase()
    const user = await UserModel.findOne({ email }).select("email billing")
    if (!user)
        throw createHttpError(
            404,
            "No AstroMeridian account matches this conversation's customer email.",
        )
    return user
}

async function render(
    res: Response,
    session: Session,
    message = "",
    error = "",
) {
    res.type("html").send(
        renderSidebar(
            session.email,
            issue(session),
            await billing.status(session.userId),
            message,
            error,
        ),
    )
}

router.get("/", async (req, res) => {
    try {
        const key = secret()
        const params: Record<string, string> = {}
        const query = new URL(req.originalUrl, "https://sidebar.invalid")
            .searchParams
        for (const [name, value] of query) {
            if (Object.hasOwn(params, name))
                throw createHttpError(401, "Invalid Help Scout signature.")
            params[name] = value
        }
        const signature = params["X-HelpScout-Signature"] ?? ""
        delete params["X-HelpScout-Signature"]
        const expected = createHmac("sha1", key)
            .update(JSON.stringify(params))
            .digest("base64")
        if (
            Buffer.byteLength(signature) !== Buffer.byteLength(expected) ||
            !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
        ) {
            throw createHttpError(
                401,
                "Open this app from a Help Scout conversation.",
            )
        }
        const conversationId = params["conversation-id"]
        if (!conversationId || !/^\d+$/.test(conversationId))
            throw createHttpError(
                400,
                "Open a conversation to manage its subscription.",
            )
        const user = await customer(conversationId)
        await render(res, {
            userId: String(user._id),
            email: user.email,
            conversationId,
            agentId: params["user-id"] ?? "not supplied by Help Scout",
            planId: user.billing?.plan?.subscriptionId ?? null,
            profilesId: user.billing?.profiles?.subscriptionId ?? null,
        })
    } catch (e) {
        res.status(isHttpError(e) ? e.statusCode : 500)
            .type("html")
            .send(
                sidebarMessage(
                    isHttpError(e)
                        ? e.message
                        : "Could not load subscriptions. Reload and try again.",
                ),
            )
    }
})

async function boundSession(req: Request) {
    const session = sessionOf(req)
    // Recheck inbox and customer: conversations can be moved or reassigned after rendering.
    const user = await customer(session.conversationId)
    if (String(user._id) !== session.userId || user.email !== session.email) {
        throw createHttpError(
            409,
            "The conversation customer changed. Reload the conversation.",
        )
    }
    return { session, user }
}

router.post("/refresh", async (req, res) => {
    const { session, user } = await boundSession(req)
    session.planId = user.billing?.plan?.subscriptionId ?? null
    session.profilesId = user.billing?.profiles?.subscriptionId ?? null
    await render(res, session)
})

router.post("/cancel", async (req, res) => {
    const { session, user } = await boundSession(req)
    const body = req.body as Record<string, unknown>
    try {
        if (body.confirmed !== "yes")
            throw createHttpError(
                400,
                "Confirm the cancellation before submitting.",
            )
        const kind = body.kind
        if (kind !== "plan" && kind !== "profiles")
            throw createHttpError(400, "Choose a membership or profile add-on.")
        const currentId =
            kind === "plan"
                ? user.billing?.plan?.subscriptionId
                : user.billing?.profiles?.subscriptionId
        if (
            !currentId ||
            currentId !==
                (kind === "plan" ? session.planId : session.profilesId)
        ) {
            throw createHttpError(
                409,
                "The subscription changed. Refresh subscriptions before cancelling.",
            )
        }
        let reason = ""
        if (kind === "plan") {
            if (
                typeof body.reason !== "string" ||
                !CANCEL_REASONS.includes(body.reason)
            )
                throw createHttpError(400, "Select a cancellation reason.")
            if (
                body.other !== undefined &&
                (typeof body.other !== "string" || body.other.length > 500)
            )
                throw createHttpError(
                    400,
                    "Other details must be at most 500 characters.",
                )
            reason =
                body.reason === "Other"
                    ? (typeof body.other === "string"
                          ? body.other.trim()
                          : "") || "Other"
                    : body.reason
            const answers =
                body.stayIfOffered === undefined
                    ? []
                    : Array.isArray(body.stayIfOffered)
                      ? body.stayIfOffered
                      : [body.stayIfOffered]
            if (
                !answers.every(
                    (a): a is string =>
                        typeof a === "string" && STAY_OPTIONS.includes(a),
                )
            )
                throw createHttpError(
                    400,
                    "Choose one of the displayed survey answers.",
                )
            await billing.cancelPlan(session.userId, {
                reason,
                stayIfOffered: [...new Set(answers)],
            })
        } else {
            await billing.setProfilesCancelAtPeriodEnd(session.userId, true)
        }
        logger.info("Help Scout subscription renewal cancelled", {
            userId: session.userId,
            conversationId: session.conversationId,
            agentId: session.agentId,
            kind,
            subscriptionId: currentId,
            reason,
        })
        await render(
            res,
            session,
            kind === "plan"
                ? "Membership renewal cancelled. Access remains until the period ends."
                : "Profile add-on renewal cancelled. You can now cancel the membership if requested.",
        )
    } catch (e) {
        if (!isHttpError(e)) throw e
        res.status(e.statusCode)
        await render(res, session, "", e.message)
    }
})

router.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (!isHttpError(error))
            logger.error("Help Scout sidebar request failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            })
        res.status(isHttpError(error) ? error.statusCode : 500)
            .type("html")
            .send(
                sidebarMessage(
                    isHttpError(error)
                        ? error.message
                        : "Could not update subscriptions. Refresh and try again.",
                ),
            )
    },
)

export default router
