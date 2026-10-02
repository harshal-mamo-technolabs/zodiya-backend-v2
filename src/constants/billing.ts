/**
 * What we sell. Stripe holds a price for every recurring item, found by its
 * lookup key (scripts/setupStripe.ts creates them); amounts here are what the
 * UI shows and what one-off minute packs charge.
 */
export const CURRENCY = "eur"

export const PlanTiers = {
    STARTER: "starter",
    PREMIUM: "premium",
    GOLD: "gold",
} as const

export type PlanTier = (typeof PlanTiers)[keyof typeof PlanTiers]

export interface Plan {
    tier: PlanTier
    name: string
    lookupKey: string
    /** Cents per billing cycle. */
    amount: number
    /** Months per billing cycle. */
    months: number
    /** Astrologer minutes granted each cycle; unused ones do not carry over. */
    minutes: number
}

export const PLANS: Record<PlanTier, Plan> = {
    starter: {
        tier: "starter",
        name: "Starter",
        lookupKey: "zodiya_starter_monthly",
        amount: 1000,
        months: 1,
        minutes: 15,
    },
    premium: {
        tier: "premium",
        name: "Premium",
        lookupKey: "zodiya_premium_quarterly",
        amount: 2500,
        months: 3,
        minutes: 45,
    },
    gold: {
        tier: "gold",
        name: "Gold",
        lookupKey: "zodiya_gold_semiannual",
        amount: 5000,
        months: 6,
        minutes: 90,
    },
}

export const PLAN_TIERS = Object.keys(PLANS) as PlanTier[]

/** A paid Starter trial: charged up front, then Starter renews by itself. */
export const TRIAL = {
    tier: PlanTiers.STARTER,
    lookupKey: "zodiya_starter_trial_fee",
    amount: 300,
    days: 3,
    minutes: 3,
}

/** Profiles every plan includes: the account owner's own. */
export const INCLUDED_PROFILES = 1

export interface ProfilePack {
    id: string
    /** Profiles on top of INCLUDED_PROFILES. */
    extra: number
    /** Cents a month. */
    amount: number
    lookupKey: string
}

/** Extra profiles come in fixed monthly packs; an account holds one at most. */
export const PROFILE_PACKS: ProfilePack[] = [
    {
        id: "profiles_1",
        extra: 1,
        amount: 500,
        lookupKey: "zodiya_profiles_1_monthly",
    },
    {
        id: "profiles_3",
        extra: 3,
        amount: 1200,
        lookupKey: "zodiya_profiles_3_monthly",
    },
    {
        id: "profiles_6",
        extra: 6,
        amount: 2400,
        lookupKey: "zodiya_profiles_6_monthly",
    },
]

export const PROFILE_PACK_IDS = PROFILE_PACKS.map((p) => p.id)

export const profilePackByLookupKey = (key: string | null | undefined) =>
    PROFILE_PACKS.find((p) => p.lookupKey === key)

export interface MinutePack {
    id: string
    minutes: number
    amount: number
}

export const MINUTE_PACKS: MinutePack[] = [
    { id: "pack_10", minutes: 10, amount: 500 },
    { id: "pack_20", minutes: 20, amount: 750 },
    { id: "pack_30", minutes: 30, amount: 1000 },
]

export const MINUTE_PACK_IDS = MINUTE_PACKS.map((p) => p.id)

/** Most packs of one kind in a single payment. */
export const MAX_PACK_QUANTITY = 20

/** Tags on Stripe objects so a webhook knows what it is looking at. */
export const BillingKinds = {
    PLAN: "plan",
    PROFILES: "profiles",
    MINUTES: "minutes",
} as const

export type BillingKind = (typeof BillingKinds)[keyof typeof BillingKinds]

/** Subscription states that unlock the app. */
export const ENTITLED_STATUSES = ["active", "trialing"]

export const planByLookupKey = (key: string | null | undefined) =>
    PLAN_TIERS.map((t) => PLANS[t]).find((p) => p.lookupKey === key)
