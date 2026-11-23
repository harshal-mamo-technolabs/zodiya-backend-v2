import { fileURLToPath } from "url"
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
import { klaviyo } from "../services/KlaviyoService.ts"
import { renderKlaviyoSidebar } from "../views/klaviyoSidebar.ts"
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
    sidebarPage,
} from "../views/helpscoutSidebar.ts"

const router = express.Router()
const billing = new BillingService(UserModel, ProfileModel, BillingGrantModel)
const audience = "helpscout-sidebar"
const contextAudience = "helpscout-context"
const profileAudience = "helpscout-klaviyo-context"
interface Session {
    userId: string
    email: string
    conversationId: string
    customerId?: string
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
            "default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors https://secure.helpscout.net; base-uri 'none'",
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
    const {
        userId,
        email,
        conversationId,
        customerId,
        agentId,
        planId,
        profilesId,
    } = session
    return jwt.sign(
        {
            userId,
            email,
            conversationId,
            customerId,
            agentId,
            planId,
            profilesId,
        },
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
        if (
            !data.userId ||
            !data.email ||
            !(
                /^\d+$/.test(data.conversationId) ||
                (data.conversationId === "" &&
                    /^\d+$/.test(data.customerId ?? ""))
            )
        )
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
            {
                token: contextToken(session.agentId),
                contextId: session.customerId
                    ? `customer:${session.customerId}`
                    : `conversation:${session.conversationId}`,
            },
        ),
    )
}

function contextToken(agentId: string, profile = false) {
    return jwt.sign({ agentId }, secret(), {
        algorithm: "HS256",
        audience: profile ? profileAudience : contextAudience,
        issuer: audience,
        expiresIn: "15m",
    })
}

router.get("/client.js", (_req, res) => {
    res.sendFile(
        fileURLToPath(
            new URL("../../dist/public/helpscout-sidebar.js", import.meta.url),
        ),
    )
})

function signedParams(req: Request, profile = false) {
    const key = profile
        ? config.HELPSCOUT_PROFILE_SIDEBAR_SECRET || secret()
        : secret()
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
    return params
}

router.get("/", async (req, res) => {
    try {
        const params = signedParams(req)
        const conversationId = params["conversation-id"]
        if (!conversationId) {
            const agentId = params["user-id"]
            if (!agentId || !/^\d+$/.test(agentId))
                throw createHttpError(
                    401,
                    "Help Scout did not supply an agent identity. Reload this sidebar.",
                )
            res.type("html").send(
                sidebarPage(
                    '<p role="status">Loading the customer from Help Scout…</p>',
                    { token: contextToken(agentId), contextId: "" },
                ),
            )
            return
        }
        if (!/^\d+$/.test(conversationId))
            throw createHttpError(400, "Invalid Help Scout conversation ID.")
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

async function liveCustomer(customerId: string, agentId: string) {
    await helpScout.authorizeAgent(agentId)
    const emails = await helpScout.customerEmails(customerId)
    const users = await UserModel.find({ email: { $in: emails } })
        .select("email billing")
        .limit(2)
    const [user] = users
    if (!user)
        throw createHttpError(
            404,
            "No AstroMeridian account matches this Help Scout customer's email.",
        )
    if (users.length !== 1)
        throw createHttpError(
            409,
            "This Help Scout contact matches multiple accounts. Use a contact with only the requested account's email.",
        )
    return user
}

function contextRequest(req: Request, profile = false) {
    const body = req.body as Record<string, unknown>
    let agentId: string
    try {
        if (typeof body.token !== "string") throw new Error("Missing token")
        const claims = jwt.verify(body.token, secret(), {
            algorithms: ["HS256"],
            audience: profile ? profileAudience : contextAudience,
            issuer: audience,
        }) as { agentId: string }
        if (!/^\d+$/.test(claims.agentId)) throw new Error("Missing agent")
        agentId = claims.agentId
    } catch {
        throw createHttpError(
            401,
            "This sidebar session expired. Reload the conversation in Help Scout.",
        )
    }
    if (
        body.mailboxId !== undefined &&
        body.mailboxId !== config.HELPSCOUT_INBOX_ID &&
        body.mailboxId !== Number(config.HELPSCOUT_INBOX_ID)
    )
        throw createHttpError(
            403,
            "This app is available only in the zodiya inbox.",
        )
    const conversationId =
        typeof body.conversationId === "string" &&
        /^\d+$/.test(body.conversationId)
            ? body.conversationId
            : ""
    const customerId =
        typeof body.customerId === "string" && /^\d+$/.test(body.customerId)
            ? body.customerId
            : ""
    if (!conversationId && !customerId)
        throw createHttpError(
            400,
            "Select a Help Scout customer to manage their subscription.",
        )
    return { conversationId, customerId, agentId }
}

router.post("/context", async (req, res) => {
    const { conversationId, customerId, agentId } = contextRequest(req)
    const user = conversationId
        ? await customer(conversationId)
        : await liveCustomer(customerId, agentId)
    await render(res, {
        userId: String(user._id),
        email: user.email,
        conversationId,
        ...(conversationId ? {} : { customerId }),
        agentId,
        planId: user.billing?.plan?.subscriptionId ?? null,
        profilesId: user.billing?.profiles?.subscriptionId ?? null,
    })
})

// The profile app uses the same signed context flow, without issuing billing tokens.
router.get("/klaviyo", (req, res) => {
    try {
        const params = signedParams(req, true)
        const agentId = params["user-id"] ?? ""
        if (!/^\d+$/.test(agentId))
            throw createHttpError(
                401,
                "Help Scout did not supply an agent identity.",
            )
        res.type("html").send(
            sidebarPage(
                '<p role="status">Loading the customer from Help Scout…</p>',
                {
                    token: contextToken(agentId, true),
                    contextId: "",
                },
                "klaviyo",
            ),
        )
    } catch (error) {
        res.status(isHttpError(error) ? error.statusCode : 500)
            .type("html")
            .send(
                sidebarPage(
                    '<p role="alert">Open Klaviyo Profile from a Help Scout conversation, or reload the sidebar.</p>',
                    undefined,
                    "klaviyo",
                ),
            )
    }
})

router.post("/klaviyo/context", async (req, res) => {
    const { conversationId, customerId, agentId } = contextRequest(req, true)
    await helpScout.authorizeAgent(agentId)
    let email: string
    if (conversationId) {
        const conversation = await helpScout.conversation(conversationId)
        if (String(conversation.mailboxId) !== config.HELPSCOUT_INBOX_ID)
            throw createHttpError(
                403,
                "This profile app is available only in the AstroMeridian inbox.",
            )
        email = conversation.primaryCustomer.email.trim().toLowerCase()
    } else {
        const emails = [...new Set(await helpScout.customerEmails(customerId))]
        if (emails.length !== 1)
            throw createHttpError(
                409,
                "This contact has multiple emails. Open a conversation with the requested account's primary email.",
            )
        email = emails[0] ?? ""
    }
    const profile = await klaviyo.profileByEmail(email)
    res.type("html").send(
        renderKlaviyoSidebar(
            profile,
            email,
            {
                token: contextToken(agentId, true),
                contextId: conversationId
                    ? `conversation:${conversationId}`
                    : `customer:${customerId}`,
            },
            { conversationId, customerId },
        ),
    )
})

async function boundSession(req: Request) {
    const session = sessionOf(req)
    // Recheck inbox and customer: conversations can be moved or reassigned after rendering.
    const user = session.customerId
        ? await liveCustomer(session.customerId, session.agentId)
        : await customer(session.conversationId)
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
            helpScoutCustomerId: session.customerId,
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
    (error: unknown, req: Request, res: Response, _next: NextFunction) => {
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
                        : req.path.startsWith("/klaviyo")
                          ? "Could not load the Klaviyo profile. Refresh and try again."
                          : "Could not update subscriptions. Refresh and try again.",
                    req.path.startsWith("/klaviyo")
                        ? "klaviyo"
                        : "subscriptions",
                ),
            )
    },
)

export default router
