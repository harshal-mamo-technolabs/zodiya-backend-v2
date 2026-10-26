/* eslint-disable no-console -- a CLI that reports what it did */
/**
 * Creates the Stripe prices the app bills with, from the billing catalog in
 * MongoDB (seed it first: npm run billing:seed).
 *
 *   npm run stripe:setup
 *
 * Idempotent: every price is found by its lookup key. A missing one is
 * created; one whose amount or interval no longer matches the database gets a
 * new price that takes over the lookup key (transfer_lookup_key), so new
 * subscriptions use it. Existing subscribers stay on their old price until
 * they change plan; its metadata still names the plan or pack, which is how
 * the app keeps recognising it. Reads STRIPE_SECRET_KEY and MONGO_URI from
 * .env.<NODE_ENV> (development by default).
 */
import path from "path"
import { fileURLToPath } from "url"
import { config as dotenvConfig } from "dotenv"
import mongoose from "mongoose"
import Stripe from "stripe"
import { catalog } from "../src/services/CatalogService.ts"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenvConfig({
    quiet: true,
    path: path.join(root, `.env.${process.env.NODE_ENV ?? "development"}`),
})

const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
}
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set")
}
const stripe = new Stripe(KEY)
await mongoose.connect(process.env.MONGO_URI)

interface Wanted {
    lookupKey: string
    product: string
    amount: number
    /** Omitted for a one-off charge. */
    recurring?: { interval: "month"; interval_count: number }
    /** Names the plan or pack, so the price is known even without its lookup key. */
    metadata: Record<string, string>
}

const { currency } = await catalog.settings()
const plans = await catalog.plans()

const WANTED: Wanted[] = [
    ...plans.map((p) => ({
        lookupKey: p.lookupKey,
        product: `AstroMeridian ${p.name}`,
        amount: p.amount,
        recurring: { interval: "month" as const, interval_count: p.months },
        metadata: { tier: p.tier },
    })),
    ...plans.flatMap((p) =>
        p.trial
            ? [
                  {
                      lookupKey: p.trial.lookupKey,
                      product: `AstroMeridian ${String(p.trial.days)}-day trial`,
                      amount: p.trial.amount,
                      metadata: { trial: p.tier },
                  },
              ]
            : [],
    ),
    ...(await catalog.profilePacks()).map((p) => ({
        lookupKey: p.lookupKey,
        product: `AstroMeridian ${String(p.extra)} extra ${p.extra === 1 ? "profile" : "profiles"}`,
        amount: p.amount,
        recurring: { interval: "month" as const, interval_count: 1 },
        metadata: { pack: p.packId },
    })),
]

const existing = await stripe.prices.list({
    lookup_keys: WANTED.map((w) => w.lookupKey),
    active: true,
    limit: 100,
})

const matches = (price: Stripe.Price, want: Wanted) =>
    price.unit_amount === want.amount &&
    price.currency === currency &&
    price.recurring?.interval === want.recurring?.interval &&
    price.recurring?.interval_count === want.recurring?.interval_count

for (const want of WANTED) {
    const found = existing.data.find((p) => p.lookup_key === want.lookupKey)
    if (found && matches(found, want)) {
        // prices from before the metadata existed get it now
        if (
            Object.entries(want.metadata).some(
                ([k, v]) => found.metadata[k] !== v,
            )
        ) {
            await stripe.prices.update(found.id, { metadata: want.metadata })
        }
        console.log(`exists   ${want.lookupKey} (${found.id})`)
        continue
    }
    const price = await stripe.prices.create({
        lookup_key: want.lookupKey,
        currency,
        unit_amount: want.amount,
        metadata: want.metadata,
        ...(found
            ? {
                  product:
                      typeof found.product === "string"
                          ? found.product
                          : found.product.id,
                  transfer_lookup_key: true,
              }
            : { product_data: { name: want.product } }),
        ...(want.recurring && { recurring: want.recurring }),
    })
    console.log(
        `${found ? "replaced" : "created "} ${want.lookupKey} (${price.id})`,
    )
}

await mongoose.disconnect()
