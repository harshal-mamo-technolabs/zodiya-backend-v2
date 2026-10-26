import Stripe from "stripe"
import createHttpError from "http-errors"
import type { Model, Types } from "mongoose"
import { config } from "../config/index.ts"
import type { User, UserDocument } from "../models/User.ts"
import type { Profile } from "../models/Profile.ts"
import type { BillingGrant } from "../models/BillingGrant.ts"
import { LandingPageHookModel } from "../models/LandingPageHook.ts"
import {
    KlaviyoEvents,
    klaviyo,
    planProfile,
    profilePlanProfile,
} from "./KlaviyoService.ts"
import {
    BillingKinds,
    ENTITLED_STATUSES,
    type BillingKind,
} from "../constants/index.ts"
import { catalog } from "./CatalogService.ts"

/** The only Stripe client; tests spy on its resources. */
// cards are the only way we take money: plans, profiles, top-ups and saved cards alike
export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
})

export const isEntitled = (status: string | null | undefined) =>
    !!status && ENTITLED_STATUSES.includes(status)

/** What the browser needs to take a payment; null means nothing is due. */
export interface PaymentStep {
    clientSecret: string | null
    /** Cents due now. */
    amount: number
    description: string
    /** Set for minute and palm packs, so the client can ask for them to be credited. */
    paymentIntentId?: string
}

export interface MinutesLeft {
    /** Seconds left of this cycle's plan minutes. */
    plan: number
    /** Seconds bought as top-ups. */
    topup: number
    total: number
}

/** Palm readings left, counted in readings. */
export interface PalmLeft {
    /** Left of this cycle's plan readings. */
    plan: number
    /** Bought in packs; never expire. */
    topup: number
    total: number
}

/** Where a reserved palm reading came from, so a refund goes back there. */
export type PalmBucket = "plan" | "topup"

export interface BillingStatus {
    /** False when PAYMENTS_ENABLED=false: everything is free and nothing is sold. */
    paymentsEnabled: boolean
    entitled: boolean
    plan: {
        tier: string
        name: string
        status: string
        trial: boolean
        currentPeriodEnd: string | null
        cancelAtPeriodEnd: boolean
    } | null
    trialAvailable: boolean
    profiles: {
        included: number
        extra: number
        /** The profile pack being paid for, if any. */
        pack: string | null
        used: number
        status: string | null
        /** When the pack renews; a switch is prorated against it. */
        currentPeriodEnd: string | null
    }
    minutes: MinutesLeft
    palm: PalmLeft
}

export interface SavedCard {
    id: string
    brand: string
    last4: string
    expMonth: number
    expYear: number
}

/** One payment the user made, with Stripe's own receipt page for it. */
export interface ReceiptRow {
    id: string
    created: string
    /** Cents charged. */
    amount: number
    currency: string
    description: string
    refunded: boolean
    receiptUrl: string | null
}

type Billing = NonNullable<User["billing"]>

const idOf = (ref: string | { id: string } | null | undefined) =>
    typeof ref === "string" ? ref : (ref?.id ?? null)

/** A value to match in a compare-and-set, where 0 may be a missing field. */
const same = (value: number) => (value === 0 ? { $in: [0, null] } : value)

const INVOICE_SECRET = ["latest_invoice.confirmation_secret"]

const PRICE_TTL_MS = 60_000

// a price whose lookup key moved to a newer price (scripts/setupStripe.ts)
// still names its plan or pack in its metadata
type PriceRef = Partial<Pick<Stripe.Price, "lookup_key" | "metadata">>

const planOf = async (price: PriceRef | undefined) =>
    (await catalog.planByLookupKey(price?.lookup_key)) ??
    (await catalog.plan(price?.metadata?.tier))

const profilePackOf = async (price: PriceRef | undefined) =>
    (await catalog.profilePackByLookupKey(price?.lookup_key)) ??
    (await catalog.profilePacks()).find(
        (p) => p.packId === price?.metadata?.pack,
    )

// the campaign that brought the customer, on everything they buy in Stripe
const utm = (user: UserDocument) => ({
    utm_source: user.utm_source || "default",
    utm_campaign: user.utm_campaign || "default",
    utm_medium: user.utm_medium || "default",
})

export function minutesLeft(billing: Billing | null | undefined): MinutesLeft {
    const m = billing?.minutes
    const plan = Math.max(0, (m?.allowance ?? 0) - (m?.used ?? 0))
    const topup = Math.max(0, m?.topup ?? 0)
    return { plan, topup, total: plan + topup }
}

export function palmLeft(billing: Billing | null | undefined): PalmLeft {
    const p = billing?.palm
    const plan = Math.max(0, (p?.allowance ?? 0) - (p?.used ?? 0))
    const topup = Math.max(0, p?.topup ?? 0)
    return { plan, topup, total: plan + topup }
}

/**
 * Everything money: Stripe subscriptions for the plan and the extra
 * profiles, one-off minute packs, and the minute balance they feed. The user
 * document mirrors Stripe; webhooks and client-triggered syncs keep it fresh,
 * and both are idempotent.
 */
export class BillingService {
    private prices: { at: number; ids: Record<string, string> } | null = null

    constructor(
        private userModel: Model<User>,
        private profileModel: Model<Profile>,
        private grantModel: Model<BillingGrant>,
    ) {}

    // ------------------------------------------------------------ reads

    async status(userId: string): Promise<BillingStatus> {
        await this.initPalm(userId)
        const user = await this.user(userId)
        const b = user.billing
        const plan = b?.plan
        const current = await catalog.plan(plan?.tier)
        const extra = isEntitled(b?.profiles?.status)
            ? (b?.profiles?.quantity ?? 0)
            : 0
        return {
            paymentsEnabled: config.PAYMENTS_ENABLED,
            entitled: !config.PAYMENTS_ENABLED || isEntitled(plan?.status),
            plan:
                plan?.tier && plan.status
                    ? {
                          tier: plan.tier,
                          name: current?.name ?? plan.tier,
                          status: plan.status,
                          trial: plan.status === "trialing",
                          currentPeriodEnd:
                              plan.currentPeriodEnd?.toISOString() ?? null,
                          cancelAtPeriodEnd: plan.cancelAtPeriodEnd,
                      }
                    : null,
            trialAvailable: !b?.trialUsed,
            profiles: {
                included: await catalog.includedProfiles(plan?.tier),
                extra,
                pack: (await catalog.profilePackByExtra(extra))?.packId ?? null,
                used: await this.profileModel.countDocuments({ user: userId }),
                status: b?.profiles?.status ?? null,
                currentPeriodEnd:
                    b?.profiles?.currentPeriodEnd?.toISOString() ?? null,
            },
            minutes: minutesLeft(b),
            palm: palmLeft(b),
        }
    }

    /** How many profiles the account may hold right now. */
    async profileAllowance(userId: string) {
        const { profiles } = await this.status(userId)
        return {
            allowed: profiles.included + profiles.extra,
            used: profiles.used,
        }
    }

    async card(userId: string): Promise<SavedCard | null> {
        const customerId = (await this.user(userId)).billing?.customerId
        if (!customerId) {
            return null
        }
        const customer = await stripe.customers.retrieve(customerId, {
            expand: ["invoice_settings.default_payment_method"],
        })
        if (customer.deleted) {
            return null
        }
        let pm = customer.invoice_settings.default_payment_method
        if (!pm || typeof pm === "string") {
            const list = await stripe.paymentMethods.list({
                customer: customerId,
                type: "card",
                limit: 1,
            })
            pm = list.data[0] ?? null
        }
        if (!pm?.card) {
            return null
        }
        return {
            id: pm.id,
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year,
        }
    }

    /**
     * Every successful card payment (plans, profile packs and minute top-ups
     * alike), each with the receipt page Stripe hosts for it.
     */
    async receipts(userId: string): Promise<ReceiptRow[]> {
        const customerId = (await this.user(userId)).billing?.customerId
        if (!customerId) {
            return []
        }
        const list = await stripe.charges.list({
            customer: customerId,
            limit: 24,
        })
        return list.data
            .filter((c) => c.paid && c.status === "succeeded")
            .map((c) => ({
                id: c.id,
                created: new Date(c.created * 1000).toISOString(),
                amount: c.amount,
                currency: c.currency,
                description: c.description ?? "Payment",
                refunded: c.refunded,
                receiptUrl: c.receipt_url ?? null,
            }))
    }

    // -------------------------------------------------------- purchases

    /** Starts a plan; the first invoice is paid in the browser. */
    async subscribe(
        userId: string,
        tier: string,
        trial: boolean,
    ): Promise<PaymentStep> {
        const plan = await this.onSale(tier)
        const user = await this.user(userId)
        if (isEntitled(user.billing?.plan?.status)) {
            throw createHttpError(
                409,
                "You already have a plan. Switch plans from the billing page.",
            )
        }
        const offer = plan.trial
        if (trial && (!offer || user.billing?.trialUsed)) {
            const trialPlan = await catalog.trialPlan()
            throw createHttpError(
                400,
                trialPlan
                    ? `The trial is only for ${trialPlan.name}, once per account.`
                    : "There is no trial.",
            )
        }

        const customer = await this.customerFor(user)
        // an abandoned checkout leaves an incomplete subscription behind
        await this.dropIncomplete(user.billing?.plan)

        const prices = await this.priceIds()
        const sub = await stripe.subscriptions.create({
            customer,
            items: [{ price: prices[plan.lookupKey] ?? "" }],
            payment_behavior: "default_incomplete",
            payment_settings: {
                save_default_payment_method: "on_subscription",
                payment_method_types: ["card"],
            },
            metadata: { userId, kind: BillingKinds.PLAN, ...utm(user) },
            expand: INVOICE_SECRET,
            ...(trial &&
                offer && {
                    trial_period_days: offer.days,
                    add_invoice_items: [
                        { price: prices[offer.lookupKey] ?? "" },
                    ],
                }),
        })
        await this.applySubscription(sub)
        return this.step(
            sub.latest_invoice,
            trial && offer
                ? `${String(offer.days)}-day ${plan.name} trial`
                : `${plan.name} plan`,
        )
    }

    /** Moves to another plan now; the unused part of the old one is credited. */
    async changePlan(userId: string, tier: string): Promise<PaymentStep> {
        const next = await this.onSale(tier)
        const user = await this.user(userId)
        const plan = user.billing?.plan
        if (!plan?.subscriptionId || !isEntitled(plan.status)) {
            throw createHttpError(400, "There is no active plan to change.")
        }
        if (plan.tier === tier) {
            throw createHttpError(400, `You are already on ${next.name}.`)
        }

        let sub = await stripe.subscriptions.retrieve(plan.subscriptionId)
        const item = sub.items.data[0]
        if (!item) {
            throw createHttpError(500, "The subscription has no plan item")
        }
        if (sub.cancel_at_period_end) {
            // a plan change is a decision to stay
            sub = await stripe.subscriptions.update(sub.id, {
                cancel_at_period_end: false,
            })
        }

        const prices = await this.priceIds()
        const updated = await stripe.subscriptions.update(sub.id, {
            items: [{ id: item.id, price: prices[next.lookupKey] ?? "" }],
            proration_behavior: "always_invoice",
            billing_cycle_anchor: "now",
            // the change is only applied once its invoice is paid
            payment_behavior: "pending_if_incomplete",
            ...(sub.status === "trialing" && { trial_end: "now" as const }),
            expand: INVOICE_SECRET,
        })
        return this.afterUpdate(updated, `Switch to ${next.name}`)
    }

    /** Plan and extra profiles both stop at the end of the paid period. */
    async setCancelAtPeriodEnd(userId: string, cancel: boolean) {
        const user = await this.user(userId)
        const b = user.billing
        if (!b?.plan?.subscriptionId || !isEntitled(b.plan.status)) {
            throw createHttpError(400, "There is no active plan.")
        }
        const ids = [b.plan.subscriptionId]
        if (b.profiles?.subscriptionId && isEntitled(b.profiles.status)) {
            ids.push(b.profiles.subscriptionId)
        }
        for (const id of ids) {
            await this.applySubscription(
                await stripe.subscriptions.update(id, {
                    cancel_at_period_end: cancel,
                }),
            )
        }
        return this.status(userId)
    }

    /**
     * Starts a monthly profile pack, or switches to another one. A switch is
     * charged (or credited) pro rata now and keeps the billing date.
     */
    async chooseProfilePack(
        userId: string,
        packId: string,
    ): Promise<PaymentStep> {
        const pack = await catalog.profilePack(packId)
        if (!pack) {
            throw createHttpError(400, "Unknown profile pack")
        }
        const user = await this.user(userId)
        if (!isEntitled(user.billing?.plan?.status)) {
            throw createHttpError(402, "An active plan is required.", {
                code: "plan_required",
            })
        }
        const used = await this.profileModel.countDocuments({ user: userId })
        const allowed =
            (await catalog.includedProfiles(user.billing?.plan?.tier)) +
            pack.extra
        if (used > allowed) {
            throw createHttpError(
                409,
                `You have ${String(used)} profiles, more than this pack covers. Remove ${String(used - allowed)} first.`,
            )
        }

        const customer = await this.customerFor(user)
        const prices = await this.priceIds()
        const slots = user.billing?.profiles
        const description = `${String(pack.extra)} extra ${pack.extra === 1 ? "profile" : "profiles"}`

        if (slots?.subscriptionId && isEntitled(slots.status)) {
            if (slots.quantity === pack.extra) {
                throw createHttpError(409, "You already have this pack.")
            }
            const sub = await stripe.subscriptions.retrieve(
                slots.subscriptionId,
            )
            const item = sub.items.data[0]
            if (!item) {
                throw createHttpError(500, "The subscription has no item")
            }
            const updated = await stripe.subscriptions.update(sub.id, {
                items: [
                    {
                        id: item.id,
                        price: prices[pack.lookupKey] ?? "",
                        quantity: 1,
                    },
                ],
                proration_behavior: "always_invoice",
                // the switch is only applied once its invoice is paid
                payment_behavior: "pending_if_incomplete",
                expand: INVOICE_SECRET,
            })
            return this.afterUpdate(updated, description)
        }

        await this.dropIncomplete(slots)
        const sub = await stripe.subscriptions.create({
            customer,
            items: [{ price: prices[pack.lookupKey] ?? "", quantity: 1 }],
            payment_behavior: "default_incomplete",
            payment_settings: {
                save_default_payment_method: "on_subscription",
                payment_method_types: ["card"],
            },
            metadata: { userId, kind: BillingKinds.PROFILES, ...utm(user) },
            expand: INVOICE_SECRET,
        })
        await this.applySubscription(sub)
        return this.step(sub.latest_invoice, description)
    }

    async buyMinutes(
        userId: string,
        packId: string,
        quantity: number,
    ): Promise<PaymentStep> {
        const pack = await catalog.minutePack(packId)
        if (!pack) {
            throw createHttpError(400, "Unknown minute pack")
        }
        const minutes = pack.minutes * quantity
        return this.sellPack(
            userId,
            pack.amount * quantity,
            `${String(minutes)} astrologer minutes`,
            {
                kind: BillingKinds.MINUTES,
                minutes: String(minutes),
                pack: pack.packId,
                quantity: String(quantity),
            },
        )
    }

    async buyPalm(
        userId: string,
        packId: string,
        quantity: number,
    ): Promise<PaymentStep> {
        const pack = await catalog.palmPack(packId)
        if (!pack) {
            throw createHttpError(400, "Unknown palm pack")
        }
        const readings = pack.readings * quantity
        return this.sellPack(
            userId,
            pack.amount * quantity,
            `${String(readings)} palm readings`,
            {
                kind: BillingKinds.PALM,
                readings: String(readings),
                pack: pack.packId,
                quantity: String(quantity),
            },
        )
    }

    /** A one-off card payment; its webhook credits what the metadata says. */
    private async sellPack(
        userId: string,
        amount: number,
        description: string,
        metadata: Record<string, string>,
    ): Promise<PaymentStep> {
        const user = await this.user(userId)
        const customer = await this.customerFor(user)
        const intent = await stripe.paymentIntents.create({
            amount,
            currency: (await catalog.settings()).currency,
            customer,
            description,
            payment_method_types: ["card"],
            metadata: { userId, ...metadata, ...utm(user) },
        })
        return {
            clientSecret: intent.client_secret,
            amount,
            description,
            paymentIntentId: intent.id,
        }
    }

    /** The unpaid invoice behind a failed renewal or a pending change. */
    async payOpen(userId: string, kind: BillingKind): Promise<PaymentStep> {
        const b = (await this.user(userId)).billing
        const id =
            kind === BillingKinds.PROFILES
                ? b?.profiles?.subscriptionId
                : b?.plan?.subscriptionId
        if (!id) {
            throw createHttpError(404, "Nothing to pay")
        }
        const sub = await stripe.subscriptions.retrieve(id, {
            expand: INVOICE_SECRET,
        })
        return this.step(sub.latest_invoice, "Outstanding invoice")
    }

    /** A SetupIntent for saving a new card without charging it. */
    async cardSetup(userId: string) {
        const customer = await this.customerFor(await this.user(userId))
        const intent = await stripe.setupIntents.create({
            customer,
            usage: "off_session",
            payment_method_types: ["card"],
        })
        return { clientSecret: intent.client_secret }
    }

    /** Makes a card saved by a SetupIntent the one every renewal uses. */
    async saveCard(userId: string, setupIntentId: string) {
        const user = await this.user(userId)
        const customer = user.billing?.customerId
        const intent = await stripe.setupIntents.retrieve(setupIntentId)
        const pm = idOf(intent.payment_method)
        if (
            !customer ||
            idOf(intent.customer) !== customer ||
            intent.status !== "succeeded" ||
            !pm
        ) {
            throw createHttpError(400, "That card was not saved.")
        }
        await stripe.customers.update(customer, {
            invoice_settings: { default_payment_method: pm },
        })
        const b = user.billing
        for (const id of [
            b?.plan?.subscriptionId,
            b?.profiles?.subscriptionId,
        ]) {
            if (id) {
                const sub = await stripe.subscriptions.retrieve(id)
                if (!["canceled", "incomplete_expired"].includes(sub.status)) {
                    await stripe.subscriptions.update(id, {
                        default_payment_method: pm,
                    })
                }
            }
        }
        return this.card(userId)
    }

    /** Account deletion: deleting the customer cancels every subscription. */
    async closeCustomer(userId: string) {
        const customerId = (await this.userModel.findById(userId))?.billing
            ?.customerId
        if (!customerId) {
            return
        }
        try {
            await stripe.customers.del(customerId)
        } catch (e) {
            // already deleted in the dashboard: nothing left to cancel
            if ((e as { code?: string }).code !== "resource_missing") {
                throw e
            }
        }
    }

    // ------------------------------------------------------------- sync

    /** Verifies a webhook delivery; throws 400 on a bad signature. */
    constructEvent(body: Buffer, signature: string | undefined) {
        if (!config.STRIPE_WEBHOOK_SECRET) {
            throw createHttpError(500, "STRIPE_WEBHOOK_SECRET is not set")
        }
        try {
            return stripe.webhooks.constructEvent(
                body,
                signature ?? "",
                config.STRIPE_WEBHOOK_SECRET,
            )
        } catch {
            throw createHttpError(400, "Invalid Stripe signature")
        }
    }

    async handleEvent(event: Stripe.Event) {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                // events can arrive out of order; Stripe's current state cannot
                await this.applySubscription(
                    await stripe.subscriptions.retrieve(event.data.object.id),
                )
                break
            case "invoice.paid":
                await this.applyInvoice(event.data.object)
                break
            case "invoice.payment_failed": {
                const subId = idOf(
                    event.data.object.parent?.subscription_details
                        ?.subscription,
                )
                if (subId) {
                    await this.applySubscription(
                        await stripe.subscriptions.retrieve(subId),
                    )
                }
                break
            }
            case "payment_intent.succeeded":
                await this.applyPaymentIntent(event.data.object)
                break
            default:
                break
        }
    }

    /**
     * Pulls the account's state straight from Stripe, so the page that just
     * took a payment does not wait on the webhook. Same effects, same keys.
     */
    async sync(userId: string, paymentIntentId?: string) {
        const user = await this.user(userId)
        const customer = user.billing?.customerId
        if (customer) {
            const subs = await stripe.subscriptions.list({
                customer,
                status: "all",
                limit: 20,
                expand: ["data.latest_invoice"],
            })
            // oldest first, so the newest subscription of a kind wins
            for (const sub of [...subs.data].reverse()) {
                await this.applySubscription(sub)
                const invoice = sub.latest_invoice
                if (invoice && typeof invoice !== "string") {
                    await this.applyInvoice(invoice, sub)
                }
            }
        }
        if (paymentIntentId) {
            const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
            if (intent.metadata.userId === userId) {
                await this.applyPaymentIntent(intent)
            }
        }
        return this.status(userId)
    }

    // ---------------------------------------------------------- minutes

    /** Spends plan minutes first, then top-ups; never below zero. */
    async debit(userId: string | Types.ObjectId, seconds: number) {
        // payments off: talking is free, there is no balance to draw down
        if (!config.PAYMENTS_ENABLED) {
            return
        }
        for (let attempt = 0; attempt < 8; attempt++) {
            const user = await this.userModel
                .findById(userId)
                .select("billing.minutes")
            if (!user) {
                return
            }
            const m = user.billing?.minutes
            const used = m?.used ?? 0
            const topup = m?.topup ?? 0
            const left = minutesLeft(user.billing)
            const fromPlan = Math.min(left.plan, seconds)
            const fromTopup = Math.min(left.topup, seconds - fromPlan)
            if (fromPlan + fromTopup === 0) {
                return
            }
            // compare-and-set: a concurrent grant or debit makes us re-read
            const result = await this.userModel.updateOne(
                {
                    _id: userId,
                    "billing.minutes.used": same(used),
                    "billing.minutes.topup": same(topup),
                },
                {
                    $inc: {
                        "billing.minutes.used": fromPlan,
                        "billing.minutes.topup": -fromTopup,
                    },
                },
            )
            if (result.modifiedCount === 1) {
                return
            }
        }
        throw createHttpError(409, "Could not record minutes used")
    }

    // ------------------------------------------------------------- palm

    /**
     * Takes one palm reading before it is made: plan readings first, then
     * bought ones. Each step is one conditional update, so two readings at
     * once cannot spend the same credit. Null when there is none left.
     */
    async reservePalm(
        userId: string | Types.ObjectId,
    ): Promise<PalmBucket | null> {
        await this.initPalm(userId)
        const plan = await this.userModel.updateOne(
            {
                _id: userId,
                $expr: {
                    $gte: [
                        {
                            $subtract: [
                                { $ifNull: ["$billing.palm.allowance", 0] },
                                { $ifNull: ["$billing.palm.used", 0] },
                            ],
                        },
                        1,
                    ],
                },
            },
            { $inc: { "billing.palm.used": 1 } },
        )
        if (plan.modifiedCount === 1) {
            return "plan"
        }
        const topup = await this.userModel.updateOne(
            { _id: userId, "billing.palm.topup": { $gte: 1 } },
            { $inc: { "billing.palm.topup": -1 } },
        )
        return topup.modifiedCount === 1 ? "topup" : null
    }

    /** Gives back a reserved reading that was not delivered. */
    async refundPalm(userId: string | Types.ObjectId, bucket: PalmBucket) {
        await (bucket === "plan"
            ? // a new cycle may have reset `used` meanwhile; never go below zero
              this.userModel.updateOne(
                  { _id: userId, "billing.palm.used": { $gte: 1 } },
                  { $inc: { "billing.palm.used": -1 } },
              )
            : this.userModel.updateOne(
                  { _id: userId },
                  { $inc: { "billing.palm.topup": 1 } },
              ))
    }

    async palmCredits(userId: string): Promise<PalmLeft> {
        return palmLeft((await this.user(userId)).billing)
    }

    /**
     * Accounts from before palm credits have no `billing.palm` until their
     * next invoice; a live plan gets this cycle's readings once, now.
     */
    // ponytail: one extra read per call; drop once every account has billing.palm
    private async initPalm(userId: string | Types.ObjectId) {
        // lean: a hydrated document would fill in the 0 defaults
        const user = await this.userModel
            .findById(userId)
            .select("billing.plan billing.palm")
            .lean()
        const plan = user?.billing?.plan
        if (
            user?.billing?.palm?.allowance !== undefined ||
            !plan?.tier ||
            !isEntitled(plan.status)
        ) {
            return
        }
        const current = await catalog.plan(plan.tier)
        if (!current) {
            return
        }
        await this.userModel.updateOne(
            { _id: userId, "billing.palm.allowance": { $exists: false } },
            {
                $set: {
                    "billing.palm.allowance":
                        plan.status === "trialing"
                            ? (current.trial?.palm ?? 0)
                            : current.palm,
                    "billing.palm.used": 0,
                },
            },
        )
    }

    // --------------------------------------------------------- internals

    private async user(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId)
        if (!user) {
            throw createHttpError(404, "Account does not exist")
        }
        return user
    }

    private async customerFor(user: UserDocument): Promise<string> {
        const existing = user.billing?.customerId
        if (existing) {
            return existing
        }
        const customer = await stripe.customers.create(
            {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                metadata: { userId: user.id, ...utm(user) },
            },
            // two tabs checking out at once still make one customer
            { idempotencyKey: `customer-${user.id}` },
        )
        await this.userModel.updateOne(
            { _id: user._id },
            { $set: { "billing.customerId": customer.id } },
        )
        return customer.id
    }

    /** A plan that is on sale; anything else is a 400. */
    private async onSale(tier: string) {
        const plan = (await catalog.plans()).find((p) => p.tier === tier)
        if (!plan) {
            throw createHttpError(400, "Unknown plan")
        }
        return plan
    }

    private async priceIds(): Promise<Record<string, string>> {
        const plans = await catalog.plans()
        const keys = [
            ...plans.map((p) => p.lookupKey),
            ...plans.flatMap((p) => (p.trial ? [p.trial.lookupKey] : [])),
            ...(await catalog.profilePacks()).map((p) => p.lookupKey),
        ]
        // re-read now and then: setupStripe may move a lookup key to a new price
        const cached = this.prices
        if (
            cached &&
            Date.now() - cached.at < PRICE_TTL_MS &&
            keys.every((k) => cached.ids[k])
        ) {
            return cached.ids
        }
        const list = await stripe.prices.list({
            lookup_keys: keys,
            active: true,
            limit: 100,
        })
        const found = Object.fromEntries(
            list.data.map((p) => [p.lookup_key ?? "", p.id]),
        )
        if (keys.some((k) => !found[k])) {
            throw createHttpError(
                503,
                "Billing is not set up yet. Run npm run stripe:setup.",
            )
        }
        this.prices = { at: Date.now(), ids: found }
        return found
    }

    private async dropIncomplete(
        mirror:
            | { subscriptionId?: string | null; status?: string | null }
            | null
            | undefined,
    ) {
        if (mirror?.subscriptionId && mirror.status === "incomplete") {
            try {
                await stripe.subscriptions.cancel(mirror.subscriptionId)
            } catch {
                // already expired or gone; either way it no longer blocks
            }
        }
    }

    private step(
        invoice: string | Stripe.Invoice | null,
        description: string,
    ): PaymentStep {
        if (
            !invoice ||
            typeof invoice === "string" ||
            invoice.status !== "open" ||
            invoice.amount_remaining === 0
        ) {
            return { clientSecret: null, amount: 0, description }
        }
        return {
            clientSecret: invoice.confirmation_secret?.client_secret ?? null,
            amount: invoice.amount_remaining,
            description,
        }
    }

    /** A pending update waits on its invoice; otherwise it is already paid. */
    private async afterUpdate(sub: Stripe.Subscription, description: string) {
        await this.applySubscription(sub)
        const invoice = sub.latest_invoice
        if (sub.pending_update) {
            return this.step(invoice, description)
        }
        if (invoice && typeof invoice !== "string") {
            await this.applyInvoice(invoice, sub)
        }
        return { clientSecret: null, amount: 0, description }
    }

    /** Mirrors one subscription onto its owner. */
    private async applySubscription(sub: Stripe.Subscription) {
        const kind = sub.metadata.kind
        if (kind !== BillingKinds.PLAN && kind !== BillingKinds.PROFILES) {
            return
        }
        const user = await this.userModel.findOne({
            "billing.customerId": idOf(sub.customer),
        })
        if (!user) {
            return
        }
        const path = kind === BillingKinds.PLAN ? "plan" : "profiles"
        const current = user.billing?.[path]
        // a stale or abandoned subscription must not replace a live one
        const takeOver =
            !current?.subscriptionId ||
            current.subscriptionId === sub.id ||
            !isEntitled(current.status) ||
            isEntitled(sub.status)
        if (!takeOver) {
            return
        }

        const item = sub.items.data[0]
        const periodEnd = item ? new Date(item.current_period_end * 1000) : null
        const set: Record<string, unknown> = {
            [`billing.${path}.subscriptionId`]: sub.id,
            [`billing.${path}.status`]: sub.status,
            [`billing.${path}.currentPeriodEnd`]: periodEnd,
        }
        if (kind === BillingKinds.PLAN) {
            set["billing.plan.tier"] = (await planOf(item?.price))?.tier
            set["billing.plan.cancelAtPeriodEnd"] =
                sub.cancel_at_period_end || sub.cancel_at !== null
            if (sub.status === "trialing") {
                set["billing.trialUsed"] = true
            }
        } else {
            // the mirror counts extra profiles, which the pack's price decides
            set["billing.profiles.quantity"] =
                (await profilePackOf(item?.price))?.extra ?? 0
        }
        await this.userModel.updateOne({ _id: user._id }, { $set: set })
        await this.subscriptionToKlaviyo(user, sub, set)

        // no plan, no paid profiles: stop billing for them straight away
        const ended = ["canceled", "incomplete_expired", "unpaid"]
        const slots = user.billing?.profiles
        if (
            kind === BillingKinds.PLAN &&
            ended.includes(sub.status) &&
            slots?.subscriptionId &&
            isEntitled(slots.status)
        ) {
            await this.applySubscription(
                await stripe.subscriptions.cancel(slots.subscriptionId),
            )
        }
    }

    /**
     * A plan or profile pack changed (renewed, trial over, switched,
     * cancelled, ended): the new state goes to Klaviyo. Only real changes are
     * sent, since syncs replay the same subscription often. A plan's first
     * payment is left to applyInvoice.
     */
    private async subscriptionToKlaviyo(
        user: UserDocument,
        sub: Stripe.Subscription,
        set: Record<string, unknown>,
    ) {
        const plan = sub.metadata.kind === BillingKinds.PLAN
        const path = plan ? "plan" : "profiles"
        const was = user.billing?.[path]
        const neverPaid = [undefined, null, "incomplete", "incomplete_expired"]
        const end = (
            set[`billing.${path}.currentPeriodEnd`] as Date | null
        )?.getTime()
        const changed =
            was?.subscriptionId !== sub.id ||
            was.status !== sub.status ||
            was.currentPeriodEnd?.getTime() !== end ||
            (plan
                ? user.billing?.plan?.cancelAtPeriodEnd !==
                  set["billing.plan.cancelAtPeriodEnd"]
                : user.billing?.profiles?.quantity !==
                  set["billing.profiles.quantity"])
        if (!changed || neverPaid.includes(sub.status)) {
            return
        }

        if (plan) {
            const current = await catalog.plan(
                set["billing.plan.tier"] as string | undefined,
            )
            if (current && !neverPaid.includes(was?.status)) {
                await klaviyo.account(user._id, planProfile(sub, current))
            }
            return
        }

        const pack = await profilePackOf(sub.items.data[0]?.price)
        const fields = profilePlanProfile(sub, pack)
        const { currency } = await catalog.settings()
        const bought = {
            "astromeridian:profile_pack": pack?.packId ?? null,
            "astromeridian:extra_profiles": pack?.extra ?? 0,
            "astromeridian:amount": (pack?.amount ?? 0) / 100,
            "astromeridian:currency": currency.toUpperCase(),
        }
        const wasLive = isEntitled(was?.status)
        const live = isEntitled(sub.status)
        const event =
            !wasLive && live && neverPaid.includes(was?.status)
                ? {
                      metric: KlaviyoEvents.PROFILE_PLAN_PURCHASED,
                      properties: bought,
                      uniqueId: `profile_plan_purchased:${sub.id}`,
                  }
                : wasLive && !live && sub.status !== "past_due"
                  ? {
                        metric: KlaviyoEvents.PROFILE_PLAN_CANCELLED,
                        properties: bought,
                        uniqueId: `profile_plan_cancelled:${sub.id}`,
                    }
                  : wasLive &&
                      live &&
                      was?.subscriptionId === sub.id &&
                      user.billing?.profiles?.quantity !==
                          set["billing.profiles.quantity"]
                    ? {
                          metric: KlaviyoEvents.PROFILE_PLAN_CHANGED,
                          properties: {
                              ...bought,
                              "astromeridian:previous_extra_profiles":
                                  user.billing?.profiles?.quantity ?? 0,
                          },
                      }
                    : undefined
        await klaviyo.account(user._id, fields, event)
    }

    /** A paid plan invoice sets this cycle's minutes and palm readings. */
    private async applyInvoice(
        invoice: Stripe.Invoice,
        known?: Stripe.Subscription,
    ) {
        if (invoice.status !== "paid" || !invoice.id) {
            return
        }
        const subId = idOf(invoice.parent?.subscription_details?.subscription)
        if (!subId) {
            return
        }
        const sub =
            known?.id === subId
                ? known
                : await stripe.subscriptions.retrieve(subId)
        if (!known) {
            await this.applySubscription(sub)
        }
        if (sub.metadata.kind !== BillingKinds.PLAN) {
            return
        }
        const reason = invoice.billing_reason
        const plan = await planOf(sub.items.data[0]?.price)
        const user = await this.userModel.findOne({
            "billing.customerId": idOf(sub.customer),
        })
        if (
            !plan ||
            !user ||
            !reason ||
            ![
                "subscription_create",
                "subscription_cycle",
                "subscription_update",
            ].includes(reason)
        ) {
            return
        }

        // a trialing subscription is granted its plan's trial allowance
        const grants =
            sub.status === "trialing" && plan.trial ? plan.trial : plan
        const allowances = {
            "billing.minutes.allowance": grants.minutes * 60,
            "billing.palm.allowance": grants.palm,
        }
        // a new cycle starts from zero; a plan change keeps what was used,
        // so switching back and forth cannot refill the balance
        const set =
            reason === "subscription_update"
                ? allowances
                : {
                      ...allowances,
                      "billing.minutes.used": 0,
                      "billing.palm.used": 0,
                  }
        const granted = await this.grant(`invoice:${invoice.id}`, user._id, {
            $set: set,
        })

        // the first payment: an event for a funnel sign-up, fields for anyone
        // else; a renewal or change refills the balances
        if (granted && reason === "subscription_create") {
            const fields = planProfile(sub, plan)
            const funnel = await LandingPageHookModel.exists({
                email: user.email,
            })
            await klaviyo.account(
                user._id,
                funnel
                    ? {
                          ...fields,
                          "astromeridian:landing_page_payment_completed": true,
                      }
                    : fields,
                funnel
                    ? {
                          metric: KlaviyoEvents.PAYMENT_COMPLETED,
                          uniqueId: `payment_completed:${invoice.id}`,
                      }
                    : undefined,
            )
        } else if (granted) {
            await klaviyo.account(user._id)
        }

        // the card that paid is the one renewals and top-ups will offer
        const pm = idOf(sub.default_payment_method)
        if (granted && pm) {
            await stripe.customers.update(idOf(sub.customer) ?? "", {
                invoice_settings: { default_payment_method: pm },
            })
        }
    }

    private async applyPaymentIntent(intent: Stripe.PaymentIntent) {
        const { kind } = intent.metadata
        const palm = kind === BillingKinds.PALM
        if (
            intent.status !== "succeeded" ||
            (kind !== BillingKinds.MINUTES && !palm)
        ) {
            return
        }
        const user = await this.userModel.findOne({
            _id: intent.metadata.userId,
            "billing.customerId": idOf(intent.customer),
        })
        const count = Number(
            palm ? intent.metadata.readings : intent.metadata.minutes,
        )
        if (!user || !Number.isInteger(count) || count <= 0) {
            return
        }
        const granted = await this.grant(
            `payment_intent:${intent.id}`,
            user._id,
            {
                $inc: palm
                    ? {
                          "billing.palm.topup": count,
                          "billing.palm.purchased": count,
                      }
                    : {
                          "billing.minutes.topup": count * 60,
                          "billing.minutes.purchased": count * 60,
                      },
            },
        )
        if (granted) {
            const now = new Date().toISOString()
            await klaviyo.account(
                user._id,
                palm
                    ? { "astromeridian:palm_readings_last_purchase_date": now }
                    : { "astromeridian:astrologer_last_purchase_date": now },
                {
                    metric: palm
                        ? KlaviyoEvents.PALM_READINGS_PURCHASED
                        : KlaviyoEvents.ASTROLOGER_CREDITS_PURCHASED,
                    uniqueId: `purchase:${intent.id}`,
                    properties: {
                        "astromeridian:pack": intent.metadata.pack ?? null,
                        "astromeridian:quantity": Number(
                            intent.metadata.quantity ?? 1,
                        ),
                        [palm
                            ? "astromeridian:readings"
                            : "astromeridian:minutes"]: count,
                        "astromeridian:amount": intent.amount / 100,
                        "astromeridian:currency": (
                            await catalog.settings()
                        ).currency.toUpperCase(),
                        "astromeridian:stripe_payment_intent_id": intent.id,
                    },
                },
            )
        }
    }

    /** Applies an update once per Stripe payment, however often it is seen. */
    private async grant(
        key: string,
        userId: Types.ObjectId,
        update: Record<string, unknown>,
    ) {
        // an upsert finds a replay without the index; the unique index
        // catches two deliveries racing each other
        try {
            const claimed = await this.grantModel.updateOne(
                { key },
                { $setOnInsert: { key, user: userId } },
                { upsert: true },
            )
            if (claimed.upsertedCount !== 1) {
                return false
            }
        } catch (e) {
            if ((e as { code?: number }).code === 11000) {
                return false
            }
            throw e
        }
        try {
            await this.userModel.updateOne({ _id: userId }, update)
        } catch (e) {
            await this.grantModel.deleteOne({ key })
            throw e
        }
        return true
    }
}
