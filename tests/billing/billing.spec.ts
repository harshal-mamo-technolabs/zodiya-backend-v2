import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import type Stripe from "stripe"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { BillingGrantModel } from "../../src/models/BillingGrant.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { BillingService, stripe } from "../../src/services/BillingService.ts"
import { catalog, type Plan } from "../../src/services/CatalogService.ts"
import {
    geoData,
    profileData,
    planOf,
    registerAndGetCookie,
    resetDB,
    userData,
} from "../utils/index.ts"

const SECRET = "whsec_test_secret"

// the seeded catalog's plans, read again after every reset
let starter: Plan
let premium: Plan
const CUSTOMER = `cus_test_${userData.email}`

/** Signs a payload the way Stripe does and posts it to the webhook. */
function deliver(event: Record<string, unknown>) {
    const payload = JSON.stringify(event)
    return request(app)
        .post("/billing/webhook")
        .set("Content-Type", "application/json")
        .set(
            "Stripe-Signature",
            stripe.webhooks.generateTestHeaderString({
                payload,
                secret: SECRET,
            }),
        )
        .send(payload)
}

function subscription(over: Partial<Stripe.Subscription> = {}) {
    return {
        id: "sub_test_plan",
        object: "subscription",
        customer: CUSTOMER,
        status: "active",
        metadata: { kind: "plan" },
        cancel_at_period_end: false,
        cancel_at: null,
        default_payment_method: "pm_test",
        items: {
            data: [
                {
                    id: "si_1",
                    quantity: 1,
                    current_period_end: 1_900_000_000,
                    price: { lookup_key: premium.lookupKey },
                },
            ],
        },
        ...over,
    } as unknown as Stripe.Subscription
}

function paidInvoice(id: string, reason: string) {
    return {
        id: "evt_" + id,
        type: "invoice.paid",
        data: {
            object: {
                id,
                object: "invoice",
                status: "paid",
                billing_reason: reason,
                parent: {
                    subscription_details: { subscription: "sub_test_plan" },
                },
            },
        },
    }
}

const minutes = async () =>
    (await UserModel.findOne({ email: userData.email }))?.billing?.minutes

const palm = async () =>
    (await UserModel.findOne({ email: userData.email }))?.billing?.palm

describe("billing", () => {
    let mongod: MongoMemoryServer

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
        starter = await planOf("starter")
        premium = await planOf("premium")
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    describe("without a plan", () => {
        let cookie: string

        beforeEach(async () => {
            cookie = await registerAndGetCookie(app, userData, false)
        })

        it("blocks every feature with 402 plan_required", async () => {
            const calls = [
                request(app)
                    .post("/profiles")
                    .set("Cookie", [cookie])
                    .send(profileData),
                request(app)
                    .post("/tarot/draw")
                    .set("Cookie", [cookie])
                    .send({ spread: "single" }),
                request(app).get("/places?q=Lisbon").set("Cookie", [cookie]),
                request(app)
                    .post("/astrologer/session")
                    .set("Cookie", [cookie])
                    .send({}),
            ]
            for (const response of await Promise.all(calls)) {
                expect(response.statusCode).toBe(402)
                const body = response.body as {
                    errors: { code?: string }[]
                }
                expect(body.errors[0]?.code).toBe("plan_required")
            }
        })

        it("still lets the account see its status and the catalog", async () => {
            const status = await request(app)
                .get("/billing/status")
                .set("Cookie", [cookie])
            expect(status.statusCode).toBe(200)
            expect(status.body).toMatchObject({
                entitled: false,
                plan: null,
                trialAvailable: true,
                minutes: { total: 0 },
                palm: { plan: 0, topup: 0, total: 0 },
            })

            const catalog = await request(app).get("/billing/catalog")
            expect(catalog.statusCode).toBe(200)
            expect(
                (catalog.body as { plans: { tier: string }[] }).plans.map(
                    (p) => p.tier,
                ),
            ).toEqual(["starter", "premium", "gold"])
            expect(catalog.body).toMatchObject({
                plans: [{ palm: 3 }, { palm: 10 }, { palm: 25 }],
                trial: { palm: 1 },
                palmPacks: [
                    { id: "palm_3", readings: 3, amount: 499 },
                    { id: "palm_7", readings: 7, amount: 999 },
                    { id: "palm_10", readings: 10, amount: 1299 },
                ],
            })
        })

        it("rejects a status request without a session", async () => {
            const response = await request(app).get("/billing/status")
            expect(response.statusCode).toBe(401)
        })
    })

    describe("profile slots", () => {
        it("includes one profile and asks for a slot for the second", async () => {
            const cookie = await registerAndGetCookie(app)
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.profiles.quantity": 0 } },
            )
            const first = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send(profileData)
            expect(first.statusCode).toBe(201)

            const second = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({ ...profileData, firstName: "second" })
            expect(second.statusCode).toBe(402)
            expect(
                (second.body as { errors: { code?: string }[] }).errors[0]
                    ?.code,
            ).toBe("profile_slot_required")
        })

        it("leaves the pack alone when a profile is disabled", async () => {
            const cookie = await registerAndGetCookie(app)
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.profiles.quantity": 1 } },
            )
            for (const firstName of ["a", "b"]) {
                await request(app)
                    .post("/profiles")
                    .set("Cookie", [cookie])
                    .send({ ...profileData, firstName })
            }
            const other = await ProfileModel.findOne({ isPrimary: false })
            const cancel = jest.spyOn(stripe.subscriptions, "cancel")
            const update = jest.spyOn(stripe.subscriptions, "update")

            const response = await request(app)
                .patch(`/profiles/${String(other?._id)}/disabled`)
                .set("Cookie", [cookie])
                .send({ disabled: true })

            expect(response.statusCode).toBe(200)
            expect(cancel).not.toHaveBeenCalled()
            expect(update).not.toHaveBeenCalled()
            // the disabled profile still fills the one paid slot
            const third = await request(app)
                .post("/profiles")
                .set("Cookie", [cookie])
                .send({ ...profileData, firstName: "c" })
            expect(third.statusCode).toBe(402)
        })
    })

    describe("profile packs", () => {
        const pack = async (id: string) => {
            const found = await catalog.profilePack(id)
            if (!found) throw new Error(id)
            return found
        }
        const profileSub = (lookupKey: string) =>
            subscription({
                id: "sub_test_profiles",
                metadata: { kind: "profiles" },
                items: {
                    data: [
                        {
                            id: "si_1",
                            quantity: 1,
                            current_period_end: 1_900_000_000,
                            price: { lookup_key: lookupKey },
                        },
                    ],
                } as never,
            })
        let cookie: string

        beforeEach(async () => {
            cookie = await registerAndGetCookie(app)
            const plans = await catalog.plans()
            jest.spyOn(stripe.prices, "list").mockResolvedValue({
                data: [
                    ...plans.map((p) => p.lookupKey),
                    ...plans.flatMap((p) => p.trial?.lookupKey ?? []),
                    ...(await catalog.profilePacks()).map((p) => p.lookupKey),
                ].map((key) => ({ id: `price_${key}`, lookup_key: key })),
            } as never)
        })

        const choose = (id: string) =>
            request(app)
                .post("/billing/profiles")
                .set("Cookie", [cookie])
                .send({ pack: id })

        it("sells 1, 3 or 6 extra profiles at 2.99, 6.99 and 11.99 euro a month", async () => {
            const catalog = await request(app).get("/billing/catalog")
            expect(
                (catalog.body as { profilePacks: unknown }).profilePacks,
            ).toEqual([
                { id: "profiles_1", extra: 1, amount: 299 },
                { id: "profiles_3", extra: 3, amount: 699 },
                { id: "profiles_6", extra: 6, amount: 1199 },
            ])
        })

        it("starts a pack as one monthly subscription item", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                { $unset: { "billing.profiles": 1 } },
            )
            const create = jest
                .spyOn(stripe.subscriptions, "create")
                .mockResolvedValue(
                    profileSub((await pack("profiles_3")).lookupKey) as never,
                )

            const response = await choose("profiles_3")

            expect(response.statusCode).toBe(200)
            expect(create).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [
                        {
                            price: `price_${(await pack("profiles_3")).lookupKey}`,
                            quantity: 1,
                        },
                    ],
                    metadata: expect.objectContaining({
                        kind: "profiles",
                        utm_source: "default",
                        utm_campaign: "default",
                        utm_medium: "default",
                    }) as unknown,
                }),
            )
            const status = await request(app)
                .get("/billing/status")
                .set("Cookie", [cookie])
            expect(status.body).toMatchObject({
                profiles: { extra: 3, pack: "profiles_3", included: 1 },
            })
        })

        it("switches pack by swapping the price, pro rata", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.profiles.quantity": 1 } },
            )
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                profileSub((await pack("profiles_1")).lookupKey) as never,
            )
            const update = jest
                .spyOn(stripe.subscriptions, "update")
                .mockResolvedValue(
                    profileSub((await pack("profiles_6")).lookupKey) as never,
                )

            const response = await choose("profiles_6")

            expect(response.statusCode).toBe(200)
            expect(update).toHaveBeenCalledWith(
                "sub_test_profiles",
                expect.objectContaining({
                    items: [
                        {
                            id: "si_1",
                            price: `price_${(await pack("profiles_6")).lookupKey}`,
                            quantity: 1,
                        },
                    ],
                    proration_behavior: "always_invoice",
                }),
            )
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.billing?.profiles?.quantity).toBe(6)
        })

        it("refuses a pack smaller than the profiles already saved", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.profiles.quantity": 3 } },
            )
            for (const firstName of ["a", "b", "c"]) {
                await request(app)
                    .post("/profiles")
                    .set("Cookie", [cookie])
                    .send({ ...profileData, firstName })
            }
            const update = jest.spyOn(stripe.subscriptions, "update")

            const response = await choose("profiles_1")

            expect(response.statusCode).toBe(409)
            expect(update).not.toHaveBeenCalled()
        })

        it("refuses the pack already held and an unknown pack", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.profiles.quantity": 3 } },
            )
            expect((await choose("profiles_3")).statusCode).toBe(409)
            expect((await choose("profiles_99")).statusCode).toBe(400)
        })
    })

    describe("POST /billing/webhook", () => {
        beforeEach(async () => {
            await registerAndGetCookie(app)
            jest.spyOn(stripe.customers, "update").mockResolvedValue(
                {} as never,
            )
        })

        it("rejects a delivery with a bad signature", async () => {
            const response = await request(app)
                .post("/billing/webhook")
                .set("Content-Type", "application/json")
                .set("Stripe-Signature", "t=1,v1=nope")
                .send(JSON.stringify({ id: "evt_1" }))
            expect(response.statusCode).toBe(400)
        })

        it("starts a paid trial with trial minutes", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription({
                    status: "trialing",
                    items: {
                        data: [
                            {
                                id: "si_1",
                                current_period_end: 1_900_000_000,
                                price: {
                                    lookup_key: starter.lookupKey,
                                },
                            },
                        ],
                    } as never,
                }) as never,
            )

            const response = await deliver(
                paidInvoice("in_trial", "subscription_create"),
            )

            expect(response.statusCode).toBe(200)
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.billing?.trialUsed).toBe(true)
            expect(user?.billing?.plan?.status).toBe("trialing")
            expect(user?.billing?.minutes?.allowance).toBe(
                (starter.trial?.minutes ?? 0) * 60,
            )
            expect(user?.billing?.palm?.allowance).toBe(1)
        })

        it("refills plan minutes each cycle, once per invoice", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription() as never,
            )
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.minutes.used": 500,
                        "billing.palm.used": 3,
                    },
                },
            )

            await deliver(paidInvoice("in_cycle", "subscription_cycle"))
            expect(await palm()).toMatchObject({ allowance: 10, used: 0 })
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.minutes.used": 100,
                        "billing.palm.used": 2,
                    },
                },
            )
            // Stripe retries: the same invoice must not reset again
            await deliver(paidInvoice("in_cycle", "subscription_cycle"))

            expect(await minutes()).toMatchObject({
                allowance: premium.minutes * 60,
                used: 100,
            })
            expect(await palm()).toMatchObject({ allowance: 10, used: 2 })
            expect(await BillingGrantModel.countDocuments()).toBe(1)
        })

        it("keeps used minutes across a plan change", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription() as never,
            )
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.minutes.used": 600,
                        "billing.palm.used": 2,
                    },
                },
            )

            await deliver(paidInvoice("in_change", "subscription_update"))
            expect(await palm()).toMatchObject({ allowance: 10, used: 2 })

            expect(await minutes()).toMatchObject({
                allowance: premium.minutes * 60,
                used: 600,
            })
        })

        it("credits a minute pack once", async () => {
            const user = await UserModel.findOne({ email: userData.email })
            const event = {
                id: "evt_pi",
                type: "payment_intent.succeeded",
                data: {
                    object: {
                        id: "pi_123",
                        object: "payment_intent",
                        status: "succeeded",
                        customer: CUSTOMER,
                        metadata: {
                            kind: "minutes",
                            minutes: "20",
                            userId: String(user?._id),
                        },
                    },
                },
            }

            await deliver(event)
            await deliver(event)

            expect((await minutes())?.topup).toBe(20 * 60)
        })

        it("credits a palm pack once", async () => {
            const user = await UserModel.findOne({ email: userData.email })
            const event = {
                id: "evt_pi_palm",
                type: "payment_intent.succeeded",
                data: {
                    object: {
                        id: "pi_palm",
                        object: "payment_intent",
                        status: "succeeded",
                        customer: CUSTOMER,
                        metadata: {
                            kind: "palm",
                            readings: "15",
                            userId: String(user?._id),
                        },
                    },
                },
            }

            await deliver(event)
            await deliver(event)

            expect((await palm())?.topup).toBe(15)
            expect((await minutes())?.topup).toBe(0)
        })

        it("cancels extra profiles when the plan ends", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription({ status: "canceled" }) as never,
            )
            const cancel = jest
                .spyOn(stripe.subscriptions, "cancel")
                .mockResolvedValue(
                    subscription({
                        id: "sub_test_profiles",
                        status: "canceled",
                        metadata: { kind: "profiles" },
                    }) as never,
                )

            await deliver({
                id: "evt_del",
                type: "customer.subscription.deleted",
                data: { object: { id: "sub_test_plan" } },
            })

            expect(cancel).toHaveBeenCalledWith("sub_test_profiles")
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.billing?.plan?.status).toBe("canceled")
            expect(user?.billing?.profiles?.status).toBe("canceled")
        })
    })

    describe("palm packs", () => {
        let cookie: string

        beforeEach(async () => {
            cookie = await registerAndGetCookie(app)
        })

        const buy = (body: Record<string, unknown>) =>
            request(app)
                .post("/billing/palm")
                .set("Cookie", [cookie])
                .send(body)

        it("charges a one-off payment for the readings", async () => {
            const create = jest
                .spyOn(stripe.paymentIntents, "create")
                .mockResolvedValue({
                    id: "pi_palm",
                    client_secret: "pi_palm_secret",
                } as never)

            const response = await buy({ pack: "palm_7", quantity: 2 })

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                clientSecret: "pi_palm_secret",
                amount: 1998,
                description: "14 palm readings",
                paymentIntentId: "pi_palm",
            })
            expect(create).toHaveBeenCalledWith(
                expect.objectContaining({
                    amount: 1998,
                    currency: "eur",
                    customer: CUSTOMER,
                    metadata: expect.objectContaining({
                        kind: "palm",
                        readings: "14",
                        utm_source: "default",
                    }) as unknown,
                }),
            )
        })

        it("refuses an unknown pack and too many packs", async () => {
            const create = jest.spyOn(stripe.paymentIntents, "create")
            expect((await buy({ pack: "pack_10" })).statusCode).toBe(400)
            expect(
                (await buy({ pack: "palm_3", quantity: 21 })).statusCode,
            ).toBe(400)
            expect(create).not.toHaveBeenCalled()
        })

        it("shows the palm balance in the status", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.palm": { allowance: 3, used: 1, topup: 5 },
                    },
                },
            )
            const status = await request(app)
                .get("/billing/status")
                .set("Cookie", [cookie])
            expect(status.body).toMatchObject({
                palm: { plan: 2, topup: 5, total: 7 },
            })
        })

        it("gives an account from before palm credits this cycle's readings", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $unset: { "billing.palm": 1 },
                    $set: { "billing.plan.status": "trialing" },
                },
            )
            const status = await request(app)
                .get("/billing/status")
                .set("Cookie", [cookie])
            expect(status.body).toMatchObject({
                palm: {
                    plan: starter.trial?.palm,
                    topup: 0,
                    total: starter.trial?.palm,
                },
            })
            // once only: what is then used stays used
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.palm.used": 1 } },
            )
            const again = await request(app)
                .get("/billing/status")
                .set("Cookie", [cookie])
            expect(again.body).toMatchObject({ palm: { total: 0 } })
        })
    })

    describe("GET /billing/receipts", () => {
        it("lists successful payments with their Stripe receipt links", async () => {
            const cookie = await registerAndGetCookie(app)
            const list = jest.spyOn(stripe.charges, "list").mockResolvedValue({
                data: [
                    {
                        id: "ch_paid",
                        created: 1_900_000_000,
                        amount: 1200,
                        currency: "eur",
                        description: "Subscription update",
                        paid: true,
                        status: "succeeded",
                        refunded: false,
                        receipt_url: "https://pay.stripe.com/receipts/ch_paid",
                    },
                    {
                        id: "ch_failed",
                        created: 1_900_000_100,
                        amount: 500,
                        currency: "eur",
                        description: null,
                        paid: false,
                        status: "failed",
                        refunded: false,
                        receipt_url: null,
                    },
                ],
            } as never)

            const response = await request(app)
                .get("/billing/receipts")
                .set("Cookie", [cookie])

            expect(response.statusCode).toBe(200)
            expect(list).toHaveBeenCalledWith(
                expect.objectContaining({ customer: CUSTOMER }),
            )
            expect(response.body).toEqual([
                {
                    id: "ch_paid",
                    created: new Date(1_900_000_000 * 1000).toISOString(),
                    amount: 1200,
                    currency: "eur",
                    description: "Subscription update",
                    refunded: false,
                    receiptUrl: "https://pay.stripe.com/receipts/ch_paid",
                },
            ])
        })
    })

    describe("debit", () => {
        it("spends plan minutes before top-ups and stops at zero", async () => {
            await registerAndGetCookie(app)
            const user = await UserModel.findOne({ email: userData.email })
            await UserModel.updateOne(
                { email: userData.email },
                {
                    $set: {
                        "billing.minutes": {
                            allowance: 60,
                            used: 30,
                            topup: 100,
                        },
                    },
                },
            )
            const billing = new BillingService(
                UserModel,
                ProfileModel,
                BillingGrantModel,
            )

            await billing.debit(String(user?._id), 50)
            expect(await minutes()).toMatchObject({ used: 60, topup: 80 })

            await billing.debit(String(user?._id), 500)
            expect(await minutes()).toMatchObject({ used: 60, topup: 0 })
        })
    })
})
