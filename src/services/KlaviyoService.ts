import type Stripe from "stripe"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import { ENTITLED_STATUSES } from "../constants/index.ts"
import { catalog, type Plan, type ProfilePack } from "./CatalogService.ts"
import { UserModel, type UserDocument } from "../models/User.ts"
import { ProfileModel } from "../models/Profile.ts"

/**
 * Mirrors every account into Klaviyo: profile fields prefixed
 * "astromeridian:" (who they are, their plans, minutes and palm readings)
 * and the ASTROMERIDIAN:* events. Nothing is sent
 * without an email, and nothing at all without KLAVIYO_PRIVATE_API_KEY.
 *
 * Calls never block a request: they go through one queue, sent one at a
 * time and spaced out, and a 429 or 5xx waits as long as Klaviyo asks and
 * tries again. Each event also carries the profile's fields, so one call
 * does both.
 */

export const KlaviyoEvents = {
    EMAIL_CAPTURED: "ASTROMERIDIAN:LANDING_PAGE_EMAIL_CAPTURED",
    PAYMENT_INITIATED: "ASTROMERIDIAN:LANDING_PAGE_PAYMENT_INITIATED",
    PAYMENT_COMPLETED: "ASTROMERIDIAN:LANDING_PAGE_PAYMENT_COMPLETED",
    PROFILE_PLAN_PURCHASED: "ASTROMERIDIAN:PROFILE_PLAN_PURCHASED",
    PROFILE_PLAN_CHANGED: "ASTROMERIDIAN:PROFILE_PLAN_CHANGED",
    PROFILE_PLAN_CANCELLED: "ASTROMERIDIAN:PROFILE_PLAN_CANCELLED",
    ASTROLOGER_CREDITS_PURCHASED: "ASTROMERIDIAN:ASTROLOGER_CREDITS_PURCHASED",
    PALM_READINGS_PURCHASED: "ASTROMERIDIAN:PALM_READINGS_PURCHASED",
} as const

export type Props = Record<string, string | number | boolean | null>

const API = "https://a.klaviyo.com/api"
const REVISION = "2025-10-15"
// Klaviyo allows 350/s burst on events and 75/s on profiles; 10/s stays far below both
const GAP_MS = 100
const MAX_TRIES = 6

interface Job {
    path: string
    body: unknown
    tries: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const iso = (secs?: number | null) =>
    secs ? new Date(secs * 1000).toISOString() : null

/** The visitor's landing page answers as profile fields. */
export function landingProfile(v: {
    email: string
    firstName?: string | null
    lastName?: string | null
    gender?: string | null
    birthDate?: string | null
    birthTime?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    lat?: number | null
    lon?: number | null
    utm_source?: string | null
    utm_campaign?: string | null
    utm_medium?: string | null
    createdAt?: Date | null
}): Props {
    return {
        "astromeridian:full_name": [v.firstName, v.lastName]
            .filter(Boolean)
            .join(" "),
        "astromeridian:first_name": v.firstName ?? null,
        "astromeridian:last_name": v.lastName ?? null,
        "astromeridian:gender": v.gender ?? null,
        "astromeridian:dob": v.birthDate ?? null,
        "astromeridian:birth_time": v.birthTime ?? null,
        "astromeridian:city": v.city ?? null,
        "astromeridian:state": v.state ?? null,
        "astromeridian:country": v.country ?? null,
        "astromeridian:lat": v.lat ?? null,
        "astromeridian:lon": v.lon ?? null,
        "astromeridian:utm_source": v.utm_source ?? "default",
        "astromeridian:utm_campaign": v.utm_campaign ?? "default",
        "astromeridian:utm_medium": v.utm_medium ?? "default",
        "astromeridian:email": v.email,
        "astromeridian:created_at": (v.createdAt ?? new Date()).toISOString(),
    }
}

/** A plan subscription as profile fields. */
export function planProfile(sub: Stripe.Subscription, plan: Plan): Props {
    const item = sub.items.data[0]
    const trial = sub.status === "trialing"
    // on a trial the plan itself starts when the trial ends
    const start = trial ? sub.trial_end : item?.current_period_start
    let end = iso(item?.current_period_end)
    if (trial && sub.trial_end) {
        const d = new Date(sub.trial_end * 1000)
        d.setUTCMonth(d.getUTCMonth() + plan.months)
        end = d.toISOString()
    }
    const cancelling = sub.cancel_at_period_end || !!sub.cancel_at
    const ended = ["canceled", "unpaid", "incomplete_expired"].includes(
        sub.status,
    )
    return {
        "astromeridian:current_general_plan": plan.name,
        // active, trialing, past_due, canceled...
        "astromeridian:general_plan_status": sub.status,
        "astromeridian:general_plan_cancels_at_period_end": cancelling,
        "astromeridian:general_plan_start_date": iso(start),
        "astromeridian:general_plan_end_date": end,
        "astromeridian:stripe_subscription_id": sub.id,
        "astromeridian:is_trial_active": trial,
        // kept after the trial ends, so its dates stay on the profile
        "astromeridian:general_plan_trial_start_date": iso(sub.trial_start),
        "astromeridian:general_plan_trial_end_date": iso(sub.trial_end),
        "astromeridian:general_plan_next_billing_date":
            cancelling || ended ? null : iso(item?.current_period_end),
    }
}

/** An extra-profiles subscription as profile fields. */
export function profilePlanProfile(
    sub: Stripe.Subscription,
    pack: ProfilePack | undefined,
): Props {
    const item = sub.items.data[0]
    const cancelling = sub.cancel_at_period_end || !!sub.cancel_at
    const ended = ["canceled", "unpaid", "incomplete_expired"].includes(
        sub.status,
    )
    return {
        "astromeridian:profile_plan": pack
            ? `${String(pack.extra)} extra profile${pack.extra === 1 ? "" : "s"}`
            : null,
        "astromeridian:profile_plan_extra_profiles": pack?.extra ?? 0,
        "astromeridian:profile_plan_status": sub.status,
        "astromeridian:profile_plan_stripe_subscription_id": sub.id,
        "astromeridian:profile_plan_start_date": iso(
            item?.current_period_start,
        ),
        "astromeridian:profile_plan_end_date": iso(item?.current_period_end),
        "astromeridian:profile_plan_next_billing_date":
            cancelling || ended ? null : iso(item?.current_period_end),
        "astromeridian:profile_plan_cancels_at_period_end": cancelling,
    }
}

/** Who the account is, as the portal knows it ("default" campaign for a direct sign-up). */
function accountProfile(user: UserDocument): Props {
    return {
        "astromeridian:full_name": `${user.firstName} ${user.lastName}`,
        "astromeridian:first_name": user.firstName,
        "astromeridian:last_name": user.lastName,
        "astromeridian:email": user.email,
        ...(user.gender && { "astromeridian:gender": user.gender }),
        "astromeridian:utm_source": user.utm_source || "default",
        "astromeridian:utm_campaign": user.utm_campaign || "default",
        "astromeridian:utm_medium": user.utm_medium || "default",
        "astromeridian:created_at": user.createdAt.toISOString(),
    }
}

/** Minutes, palm readings and profiles left right now. */
function balances(
    user: UserDocument,
    profilesUsed: number,
    included: number,
): Props {
    const b = user.billing
    const left = (a = 0, used = 0) => Math.max(0, a - used)
    const min = (secs: number) => Math.floor(secs / 60)
    const m = b?.minutes
    const p = b?.palm
    const extra = ENTITLED_STATUSES.includes(b?.profiles?.status ?? "")
        ? (b?.profiles?.quantity ?? 0)
        : 0
    return {
        "astromeridian:astrologer_minutes_plan_allowance": min(
            m?.allowance ?? 0,
        ),
        "astromeridian:astrologer_minutes_plan_left": min(
            left(m?.allowance, m?.used),
        ),
        "astromeridian:astrologer_minutes_purchased_left": min(m?.topup ?? 0),
        "astromeridian:astrologer_minutes_total_left": min(
            left(m?.allowance, m?.used) + (m?.topup ?? 0),
        ),
        "astromeridian:astrologer_minutes_total_purchased": min(
            m?.purchased ?? 0,
        ),
        "astromeridian:palm_readings_plan_allowance": p?.allowance ?? 0,
        "astromeridian:palm_readings_plan_left": left(p?.allowance, p?.used),
        "astromeridian:palm_readings_purchased_left": p?.topup ?? 0,
        "astromeridian:palm_readings_total_left":
            left(p?.allowance, p?.used) + (p?.topup ?? 0),
        "astromeridian:palm_readings_total_purchased": p?.purchased ?? 0,
        "astromeridian:profiles_allowed": included + extra,
        "astromeridian:profiles_used": profilesUsed,
    }
}

export class KlaviyoService {
    // ponytail: in-memory queue, a restart drops what is still waiting; move it to a Mongo outbox if that matters
    private queue: Job[] = []
    private running = false

    /**
     * The account's current state onto its Klaviyo profile, plus `extra`
     * fields; with `event`, as that event (one call either way). Never throws.
     */
    async account(
        userId: unknown,
        extra: Props = {},
        event?: { metric: string; properties?: Props; uniqueId?: string },
    ) {
        try {
            const user = await UserModel.findById(userId)
            if (!user) {
                return
            }
            const props = {
                ...accountProfile(user),
                ...balances(
                    user,
                    await ProfileModel.countDocuments({ user: user._id }),
                    await catalog.includedProfiles(user.billing?.plan?.tier),
                ),
                ...extra,
            }
            if (event) {
                this.track(
                    event.metric,
                    user.email,
                    props,
                    event.uniqueId,
                    event.properties,
                )
            } else {
                this.identify(user.email, props)
            }
        } catch (e) {
            logger.warn("Klaviyo sync skipped", { error: (e as Error).message })
        }
    }

    /**
     * An event on the profile's timeline; the profile gets `properties` too,
     * the event alone gets `eventProperties` (what was bought, for how much).
     */
    track(
        metric: string,
        email: string,
        properties: Props,
        uniqueId?: string,
        eventProperties: Props = {},
    ) {
        const fields = stamp(properties)
        this.enqueue("/events", {
            data: {
                type: "event",
                attributes: {
                    metric: {
                        data: { type: "metric", attributes: { name: metric } },
                    },
                    profile: {
                        data: {
                            type: "profile",
                            attributes: {
                                email,
                                ...standard(fields),
                                properties: fields,
                            },
                        },
                    },
                    properties: { ...fields, ...eventProperties },
                    time: new Date().toISOString(),
                    // Klaviyo drops a second event with the same id
                    ...(uniqueId && { unique_id: uniqueId }),
                },
            },
        })
    }

    /** Profile fields only, no event. */
    identify(email: string, properties: Props) {
        this.enqueue("/profile-import", {
            data: {
                type: "profile",
                attributes: {
                    email,
                    ...standard(properties),
                    properties: stamp(properties),
                },
            },
        })
    }

    enqueue(path: string, body: unknown) {
        if (!config.KLAVIYO_PRIVATE_API_KEY) {
            return
        }
        this.queue.push({ path, body, tries: 0 })
        void this.drain()
    }

    private async drain() {
        if (this.running) {
            return
        }
        this.running = true
        try {
            let job
            while ((job = this.queue.shift())) {
                const retryIn = await this.send(job)
                if (retryIn !== null && ++job.tries < MAX_TRIES) {
                    this.queue.unshift(job)
                    await sleep(retryIn)
                } else {
                    await sleep(GAP_MS)
                }
            }
        } finally {
            this.running = false
        }
    }

    /** Null when done (sent, or not worth retrying); otherwise ms to wait. */
    private async send(job: Job): Promise<number | null> {
        const backoff = 1000 * 2 ** job.tries
        try {
            const res = await fetch(API + job.path, {
                method: "POST",
                headers: {
                    Authorization: `Klaviyo-API-Key ${config.KLAVIYO_PRIVATE_API_KEY}`,
                    revision: REVISION,
                    "Content-Type": "application/vnd.api+json",
                    Accept: "application/vnd.api+json",
                },
                body: JSON.stringify(job.body),
            })
            if (res.ok) {
                return null
            }
            if (res.status === 429 || res.status >= 500) {
                const after = Number(res.headers.get("Retry-After"))
                return after > 0 ? after * 1000 : backoff
            }
            logger.error("Klaviyo rejected a call", {
                path: job.path,
                status: res.status,
                body: (await res.text()).slice(0, 500),
            })
            return null
        } catch (e) {
            logger.warn("Klaviyo unreachable", { error: (e as Error).message })
            return backoff
        }
    }
}

/** Every write marks the profile as ours and says when it last changed. */
const stamp = (p: Props): Props => ({
    astromeridian: true,
    ...p,
    "astromeridian:updated_at": new Date().toISOString(),
})

/**
 * Klaviyo's own profile attributes, which its lists show (the Profile column
 * is first and last name, Location is the city): copied from our fields.
 */
function standard(p: Props) {
    const v = (k: string) => p[`astromeridian:${k}`] ?? undefined
    const location = {
        city: v("city"),
        region: v("state"),
        country: v("country"),
        latitude: v("lat"),
        longitude: v("lon"),
    }
    return {
        first_name: v("first_name"),
        last_name: v("last_name"),
        ...(Object.values(location).some((x) => x !== undefined) && {
            location,
        }),
    }
}

export const klaviyo = new KlaviyoService()
