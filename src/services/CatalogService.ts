import createHttpError from "http-errors"
import { PlanModel, type Plan } from "../models/Plan.ts"
import { ProfilePackModel, type ProfilePack } from "../models/ProfilePack.ts"
import { MinutePackModel, type MinutePack } from "../models/MinutePack.ts"
import { PalmPackModel, type PalmPack } from "../models/PalmPack.ts"
import {
    BillingSettingsModel,
    type BillingSettings,
} from "../models/BillingSettings.ts"

export type { Plan, ProfilePack, MinutePack, PalmPack }

interface Loaded {
    /** Every plan and profile pack, retired ones included: their subscribers still renew. */
    plans: Plan[]
    profilePacks: ProfilePack[]
    minutePacks: MinutePack[]
    palmPacks: PalmPack[]
    settings: BillingSettings
}

const TTL_MS = 60_000

const sorted = <T extends { order: number }>(rows: T[]) =>
    rows.sort((a, b) => a.order - b.order)

/**
 * What we sell, read from MongoDB and nowhere else. Rows are seeded once by
 * `npm run billing:seed` and edited in the database after that.
 */
// ponytail: edits in the DB show within 60s; add invalidation if an admin UI writes these
export class CatalogService {
    private cache: { at: number; data: Promise<Loaded> } | null = null

    clearCache() {
        this.cache = null
    }

    /** Plans on sale, in display order. */
    async plans() {
        return (await this.load()).plans.filter((p) => p.active)
    }

    /** Any plan by tier, retired or not, for accounts already on it. */
    async plan(tier: string | null | undefined) {
        return (await this.load()).plans.find((p) => p.tier === tier)
    }

    async planByLookupKey(key: string | null | undefined) {
        return (await this.load()).plans.find((p) => p.lookupKey === key)
    }

    /** The plan on sale that has a trial in front of it, if any. */
    async trialPlan() {
        return (await this.plans()).find((p) => p.trial)
    }

    /** Profiles an account on `tier` gets before any pack; without one, the least any plan on sale includes. */
    async includedProfiles(tier?: string | null) {
        return (
            (await this.plan(tier))?.includedProfiles ??
            Math.min(...(await this.plans()).map((p) => p.includedProfiles))
        )
    }

    async profilePacks() {
        return (await this.load()).profilePacks.filter((p) => p.active)
    }

    /** A profile pack on sale. */
    async profilePack(id: string) {
        return (await this.profilePacks()).find((p) => p.packId === id)
    }

    /** Any profile pack, retired or not, for accounts already holding it. */
    async profilePackByLookupKey(key: string | null | undefined) {
        return (await this.load()).profilePacks.find((p) => p.lookupKey === key)
    }

    async profilePackByExtra(extra: number) {
        return (await this.load()).profilePacks.find((p) => p.extra === extra)
    }

    async minutePacks() {
        return (await this.load()).minutePacks.filter((p) => p.active)
    }

    async minutePack(id: string) {
        return (await this.minutePacks()).find((p) => p.packId === id)
    }

    async palmPacks() {
        return (await this.load()).palmPacks.filter((p) => p.active)
    }

    async palmPack(id: string) {
        return (await this.palmPacks()).find((p) => p.packId === id)
    }

    async settings() {
        return (await this.load()).settings
    }

    /** The public catalog the pricing pages read. */
    async catalog() {
        const { settings } = await this.load()
        const plans = await this.plans()
        const trial = await this.trialPlan()
        return {
            currency: settings.currency,
            plans: plans.map((p) => ({
                tier: p.tier,
                name: p.name,
                amount: p.amount,
                months: p.months,
                minutes: p.minutes,
                palm: p.palm,
                featured: p.featured,
            })),
            trial: trial?.trial
                ? {
                      tier: trial.tier,
                      amount: trial.trial.amount,
                      days: trial.trial.days,
                      minutes: trial.trial.minutes,
                      palm: trial.trial.palm,
                  }
                : null,
            includedProfiles: await this.includedProfiles(),
            profilePacks: (await this.profilePacks()).map((p) => ({
                id: p.packId,
                extra: p.extra,
                amount: p.amount,
            })),
            minutePacks: (await this.minutePacks()).map((p) => ({
                id: p.packId,
                minutes: p.minutes,
                amount: p.amount,
            })),
            palmPacks: (await this.palmPacks()).map((p) => ({
                id: p.packId,
                readings: p.readings,
                amount: p.amount,
            })),
            maxPackQuantity: settings.maxPackQuantity,
        }
    }

    private load() {
        if (this.cache && Date.now() - this.cache.at < TTL_MS) {
            return this.cache.data
        }
        const data = this.read()
        this.cache = { at: Date.now(), data }
        // a failed read is not kept: the next call tries again
        data.catch(() => {
            if (this.cache?.data === data) {
                this.cache = null
            }
        })
        return data
    }

    private async read(): Promise<Loaded> {
        const [plans, profilePacks, minutePacks, palmPacks, settings] =
            await Promise.all([
                PlanModel.find().lean(),
                ProfilePackModel.find().lean(),
                MinutePackModel.find().lean(),
                PalmPackModel.find().lean(),
                BillingSettingsModel.findOne().lean(),
            ])
        if (!settings || !plans.some((p) => p.active)) {
            throw createHttpError(
                503,
                "Billing catalog is not set up. Run npm run billing:seed.",
            )
        }
        return {
            plans: sorted(plans),
            profilePacks: sorted(profilePacks),
            minutePacks: sorted(minutePacks),
            palmPacks: sorted(palmPacks),
            settings,
        }
    }
}

export const catalog = new CatalogService()
