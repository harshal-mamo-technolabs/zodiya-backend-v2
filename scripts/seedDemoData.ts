/* eslint-disable no-console -- a CLI that reports what it did */
/**
 * 10 dummy customers for testing the reporting dashboard: demo-NN@comparo-media.com,
 * each with a landing page visit, a profile and a real Stripe test-mode
 * subscription paid through BillingService, synced to Klaviyo the normal way.
 *
 *   node --import @swc-node/register/esm-register scripts/seedDemoData.ts
 *
 * Not @example.com: Klaviyo accepts events for that domain and silently drops them.
 * Refuses a live Stripe key. It fires no EMAIL_CAPTURED event, which starts the
 * abandoned-cart flow: that would mail these made-up addresses. Stripe dates
 * every charge today; only signups and visits are spread over past days.
 */
import { randomBytes, randomUUID } from "crypto"
import { config } from "../src/config/index.ts"
import { connectDB, disconnectDB } from "../src/config/db.ts"
import { Roles, ZodiacSigns } from "../src/constants/index.ts"
import { UserModel } from "../src/models/User.ts"
import { ProfileModel } from "../src/models/Profile.ts"
import { BillingGrantModel } from "../src/models/BillingGrant.ts"
import { LandingPageHookModel } from "../src/models/LandingPageHook.ts"
import { BillingService, stripe } from "../src/services/BillingService.ts"
import { catalog } from "../src/services/CatalogService.ts"
import { klaviyo } from "../src/services/KlaviyoService.ts"
import { UserService } from "../src/services/UserService.ts"

const COUNT = 10
const DAY = 86_400_000
const FLOW_ID = "YhvgVw"
const FIRST = [
    "Maya",
    "Liam",
    "Noah",
    "Emma",
    "Ivan",
    "Sara",
    "Omar",
    "Lena",
    "Theo",
    "Nora",
]
const LAST = [
    "Weber",
    "Fischer",
    "Klein",
    "Wolf",
    "Braun",
    "Vogel",
    "Lang",
    "Roth",
    "Haas",
    "Frank",
]
const CITIES = [
    { city: "Berlin", state: "Berlin", lat: 52.52, lon: 13.4 },
    { city: "Munich", state: "Bavaria", lat: 48.14, lon: 11.58 },
    { city: "Hamburg", state: "Hamburg", lat: 53.55, lon: 9.99 },
]
const TOUCHES = [
    {
        utm_source: "partnerA",
        utm_campaign: "winter_campaign",
        utm_medium: "instagram",
    },
    {
        utm_source: "partnerA",
        utm_campaign: "spring_sale",
        utm_medium: "facebook",
    },
    {
        utm_source: "partnerB",
        utm_campaign: "astro_launch",
        utm_medium: "tiktok",
    },
    { utm_source: "google", utm_campaign: "brand_search", utm_medium: "cpc" },
    { utm_source: "organic", utm_campaign: "organic", utm_medium: "organic" },
]
const STATES = [
    ...Array<string>(5).fill("active"),
    ...Array<string>(2).fill("trial"),
    ...Array<string>(1).fill("cancelling"),
    ...Array<string>(1).fill("cancelled"),
    ...Array<string>(1).fill("failed"),
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const pick = <T>(list: readonly T[], i: number) => list[i % list.length] as T

const main = async () => {
    if (!config.STRIPE_SECRET_KEY.startsWith("sk_test_")) {
        throw new Error("Refusing to seed: not a Stripe test key")
    }
    await connectDB()
    const billing = new BillingService(
        UserModel,
        ProfileModel,
        BillingGrantModel,
    )
    const users = new UserService(UserModel)
    const plans = await catalog.plans()
    const trialTier = (await catalog.trialPlan())?.tier
    if (!trialTier) throw new Error("The catalog has no trial plan")
    const signs = Object.values(ZodiacSigns)
    const minutes = (await catalog.minutePacks())[0]
    const palm = (await catalog.palmPacks())[0]
    const packs = await catalog.profilePacks()

    const pay = async (
        id: string,
        secret: string | null,
        card = "pm_card_visa",
    ) => {
        const intent = secret?.split("_secret_")[0]
        if (intent) {
            await stripe.paymentIntents.confirm(intent, {
                payment_method: card,
            })
        }
        for (let t = 0; t < 6; t++) {
            const s = await billing.sync(id, intent)
            if (
                (s as { plan?: { status?: string } }).plan?.status !==
                "incomplete"
            )
                return
            await sleep(1500)
        }
    }

    const tally: Record<string, number> = {}
    for (let i = 0; i < COUNT; i++) {
        const email = `demo-${String(i + 1).padStart(2, "0")}@comparo-media.com`
        const state = pick(STATES, i)
        const first = pick(FIRST, i)
        const last = pick(LAST, i * 3)
        const touch = pick(TOUCHES, i)
        const when = new Date(Date.now() - (1 + i * 2) * DAY)
        const trial = state === "trial"
        const tier = trial ? trialTier : pick(plans, i).tier
        // every fourth came back through an abandoned-cart email before buying
        const fromEmail = i % 4 === 1

        const user = await users.create(
            first,
            last,
            email,
            randomBytes(24).toString("base64url"),
            Roles.CUSTOMER,
            touch,
        )
        const id = user._id.toString()
        await UserModel.collection.updateOne(
            { _id: user._id },
            { $set: { createdAt: when } },
        )
        const place = pick(CITIES, i)
        await ProfileModel.create({
            user: user._id,
            firstName: first,
            lastName: last,
            birthDate: `19${String(70 + (i % 30))}-0${String(1 + (i % 9))}-1${String(i % 9)}`,
            birthTime: "12:00",
            ...place,
            country: "Germany",
            tzone: 1,
            timezoneId: "Europe/Berlin",
            zodiacSign: pick(signs, i),
            isPrimary: true,
        })
        const visit = {
            email,
            firstName: first,
            lastName: last,
            ...place,
            country: "Germany",
            landingPageName: `landing-page-${String(1 + (i % 2))}`,
            plan: tier,
            trial,
            isPaymentInitiated: true,
            isPaymentCompleted: state !== "failed",
            uuid: randomUUID(),
        }
        const hooks = [{ ...visit, ...touch }]
        if (fromEmail) {
            hooks.push({
                ...visit,
                uuid: randomUUID(),
                ...touch,
                utm_campaign: "abandoned cart recovery astromeridian",
                utm_medium: "email",
                flow_id: FLOW_ID,
                utm_email: "Klaviyo",
            } as (typeof hooks)[number])
        }
        for (const [n, hook] of hooks.entries()) {
            const doc = await LandingPageHookModel.create(hook)
            await LandingPageHookModel.collection.updateOne(
                { _id: doc._id },
                { $set: { createdAt: new Date(when.getTime() + n * DAY) } },
            )
        }

        const step = await billing.subscribe(id, tier, trial, {
            hookId: hooks.at(-1)?.uuid as string,
        })
        if (state === "failed") {
            await stripe.paymentIntents
                .confirm(step.clientSecret?.split("_secret_")[0] ?? "", {
                    payment_method: "pm_card_chargeDeclined",
                })
                .catch(() => undefined)
            await billing.sync(id)
        } else {
            await pay(id, step.clientSecret)
        }

        if (state === "cancelling") {
            await billing.cancelPlan(id, {
                reason: "Too expensive",
                stayIfOffered: ["A lower price"],
            })
        }
        if (state === "cancelled") {
            const sub = (await UserModel.findById(id))?.billing?.plan
                ?.subscriptionId
            if (sub) await stripe.subscriptions.cancel(sub)
            await billing.sync(id)
        }

        // one-off and add-on purchases, some direct (organic), some from an email
        if (state === "active") {
            if (i % 5 === 0 && minutes) {
                const buy = await billing.buyMinutes(id, minutes.packId, 1)
                await pay(id, buy.clientSecret)
            }
            if (i % 7 === 0 && palm) {
                const buy = await billing.buyPalm(id, palm.packId, 1, {
                    utm_campaign: "palm_offer",
                    utm_medium: "email",
                    flow_id: FLOW_ID,
                })
                await pay(id, buy.clientSecret)
            }
            if (i % 6 === 3 && packs.length) {
                const buy = await billing.chooseProfilePack(
                    id,
                    pick(packs, i).packId,
                )
                await pay(id, buy.clientSecret)
            }
        }
        tally[state] = (tally[state] ?? 0) + 1
        console.log(`${email} ${tier} ${state}`)
    }

    // the sync above only queued the profiles and events
    const queue = klaviyo as unknown as { queue: unknown[]; running: boolean }
    for (let t = 0; t < 240 && (queue.queue.length || queue.running); t++) {
        await sleep(500)
    }
    console.log("done", tally, "klaviyo jobs left", queue.queue.length)
    await disconnectDB()
}

main().catch((e: unknown) => {
    console.error(e)
    process.exit(1)
})
