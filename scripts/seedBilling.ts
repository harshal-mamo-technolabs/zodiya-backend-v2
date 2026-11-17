/* eslint-disable no-console -- a CLI that reports what it did */
/**
 * Puts the initial billing catalog (plans, trial, profile, minute and palm
 * packs, settings) into MongoDB.
 *
 *   npm run billing:seed
 *
 * Only inserts what is missing, keyed by tier / packId: a row someone has
 * edited in the database is never overwritten. The app reads the catalog
 * from the database only; these values are just the starting point.
 * To apply the repository prices and allowances to existing rows, run
 * `npm run billing:seed -- --update-pricing`. This preserves billing periods,
 * regular plan minutes and other catalog customizations. After
 * changing a recurring price run `npm run stripe:setup`. Reads MONGO_URI from
 * .env.<NODE_ENV> (development by default), like the app.
 */
import path from "path"
import { fileURLToPath } from "url"
import type { Collection } from "mongoose"
import { PlanModel } from "../src/models/Plan.ts"
import { ProfilePackModel } from "../src/models/ProfilePack.ts"
import { MinutePackModel } from "../src/models/MinutePack.ts"
import { PalmPackModel } from "../src/models/PalmPack.ts"
import { BillingSettingsModel } from "../src/models/BillingSettings.ts"

const PLANS = [
    {
        tier: "starter",
        name: "Starter",
        lookupKey: "zodiya_starter_monthly",
        amount: 3499,
        months: 1,
        minutes: 20,
        palm: 20,
        includedProfiles: 1,
        featured: false,
        order: 1,
        active: true,
        trial: {
            lookupKey: "zodiya_starter_trial_fee",
            amount: 499,
            days: 7,
            minutes: 7,
            palm: 5,
        },
    },
    {
        tier: "premium",
        name: "Premium",
        lookupKey: "zodiya_premium_quarterly",
        amount: 7999,
        months: 3,
        minutes: 60,
        palm: 60,
        includedProfiles: 1,
        featured: true,
        order: 2,
        active: true,
    },
    {
        tier: "gold",
        name: "Gold",
        lookupKey: "zodiya_gold_semiannual",
        amount: 14999,
        months: 6,
        minutes: 120,
        palm: 120,
        includedProfiles: 1,
        featured: false,
        order: 3,
        active: true,
    },
]

const PROFILE_PACKS = [
    {
        packId: "profiles_1",
        extra: 1,
        amount: 299,
        lookupKey: "zodiya_profiles_1_monthly",
    },
    {
        packId: "profiles_3",
        extra: 3,
        amount: 699,
        lookupKey: "zodiya_profiles_3_monthly",
    },
    {
        packId: "profiles_6",
        extra: 6,
        amount: 1199,
        lookupKey: "zodiya_profiles_6_monthly",
    },
].map((p, i) => ({ ...p, order: i + 1, active: true }))

const MINUTE_PACKS = [
    { packId: "pack_10", minutes: 10, amount: 699 },
    { packId: "pack_30", minutes: 30, amount: 1499 },
    { packId: "pack_60", minutes: 60, amount: 2499 },
].map((p, i) => ({ ...p, order: i + 1, active: true }))

const PALM_PACKS = [
    { packId: "palm_3", readings: 3, amount: 499 },
    { packId: "palm_7", readings: 7, amount: 999 },
    { packId: "palm_10", readings: 10, amount: 1299 },
].map((p, i) => ({ ...p, order: i + 1, active: true }))

const SETTINGS = { currency: "eur", maxPackQuantity: 20 }

// one upsert per row: $setOnInsert leaves an existing row exactly as it is
async function insertMissing(
    model: { collection: Collection },
    rows: Record<string, unknown>[],
    key?: string,
) {
    let added = 0
    for (const row of rows) {
        const result = await model.collection.updateOne(
            key ? { [key]: row[key] } : {},
            { $setOnInsert: row },
            { upsert: true },
        )
        added += result.upsertedCount
    }
    return added
}

/** Inserts each row whose key is not there yet; returns how many were added. */
export async function seedBilling() {
    return (
        (await insertMissing(PlanModel, PLANS, "tier")) +
        (await insertMissing(ProfilePackModel, PROFILE_PACKS, "packId")) +
        (await insertMissing(MinutePackModel, MINUTE_PACKS, "packId")) +
        (await insertMissing(PalmPackModel, PALM_PACKS, "packId")) +
        // the settings are a single document
        (await insertMissing(BillingSettingsModel, [SETTINGS]))
    )
}

/** Applies the requested pricing without resetting unrelated catalog fields. */
export async function updateBillingPricing() {
    for (const plan of PLANS) {
        await PlanModel.updateOne(
            { tier: plan.tier },
            {
                $set: {
                    amount: plan.amount,
                    palm: plan.palm,
                    ...(plan.trial && {
                        "trial.amount": plan.trial.amount,
                        "trial.minutes": plan.trial.minutes,
                        "trial.palm": plan.trial.palm,
                    }),
                },
            },
        )
    }
    for (const [model, packs] of [
        [ProfilePackModel, PROFILE_PACKS],
        [MinutePackModel, MINUTE_PACKS],
        [PalmPackModel, PALM_PACKS],
    ] as const) {
        for (const pack of packs) {
            await model.collection.updateOne(
                { packId: pack.packId },
                { $set: { amount: pack.amount } },
            )
        }
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    const { connectDB, disconnectDB } = await import("../src/config/db.ts")
    await connectDB()
    const added = await seedBilling()
    console.log(
        added
            ? `billing catalog: inserted ${String(added)} missing row(s)`
            : "billing catalog: already complete, nothing changed",
    )
    if (process.argv.includes("--update-pricing")) {
        await updateBillingPricing()
        console.log("billing catalog: updated prices and palm/trial allowances")
    }
    await disconnectDB()
}
