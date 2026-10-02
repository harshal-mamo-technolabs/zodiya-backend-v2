/* eslint-disable no-console -- a CLI that reports what it did */
/**
 * Creates the products and prices the app bills with.
 *
 *   npm run stripe:setup
 *
 * Idempotent: every price is found by its lookup key, so re-running only adds
 * what is missing. To change an amount, archive the old price in the Stripe
 * dashboard, edit src/constants/billing.ts and run this again. Reads
 * STRIPE_SECRET_KEY from .env.<NODE_ENV> (development by default).
 */
import path from "path"
import { fileURLToPath } from "url"
import { config as dotenvConfig } from "dotenv"
import Stripe from "stripe"
import {
    CURRENCY,
    PLANS,
    PLAN_TIERS,
    PROFILE_PACKS,
    TRIAL,
} from "../src/constants/billing.ts"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenvConfig({
    quiet: true,
    path: path.join(root, `.env.${process.env.NODE_ENV ?? "development"}`),
})

const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
}
const stripe = new Stripe(KEY)

interface Wanted {
    lookupKey: string
    product: string
    amount: number
    /** Omitted for a one-off charge. */
    recurring?: { interval: "month"; interval_count: number }
}

const WANTED: Wanted[] = [
    ...PLAN_TIERS.map((tier) => ({
        lookupKey: PLANS[tier].lookupKey,
        product: `AstroMeridian ${PLANS[tier].name}`,
        amount: PLANS[tier].amount,
        recurring: {
            interval: "month" as const,
            interval_count: PLANS[tier].months,
        },
    })),
    {
        lookupKey: TRIAL.lookupKey,
        product: `AstroMeridian ${String(TRIAL.days)}-day trial`,
        amount: TRIAL.amount,
    },
    ...PROFILE_PACKS.map((p) => ({
        lookupKey: p.lookupKey,
        product: `AstroMeridian ${String(p.extra)} extra ${p.extra === 1 ? "profile" : "profiles"}`,
        amount: p.amount,
        recurring: { interval: "month" as const, interval_count: 1 },
    })),
]

const existing = await stripe.prices.list({
    lookup_keys: WANTED.map((w) => w.lookupKey),
    active: true,
    limit: 100,
})

for (const want of WANTED) {
    const found = existing.data.find((p) => p.lookup_key === want.lookupKey)
    if (found) {
        console.log(`exists  ${want.lookupKey} (${found.id})`)
        continue
    }
    const price = await stripe.prices.create({
        lookup_key: want.lookupKey,
        currency: CURRENCY,
        unit_amount: want.amount,
        product_data: { name: want.product },
        ...(want.recurring && { recurring: want.recurring }),
    })
    console.log(`created ${want.lookupKey} (${price.id})`)
}
