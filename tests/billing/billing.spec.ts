import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import type Stripe from "stripe"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { BillingGrantModel } from "../../src/models/BillingGrant.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { BillingService, stripe } from "../../src/services/BillingService.ts"
import { PLANS, PROFILE_PACKS, TRIAL } from "../../src/constants/billing.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

const SECRET = "whsec_test_secret"
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
                    price: { lookup_key: PLANS.premium.lookupKey },
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

describe("billing", () => {
    let mongod: MongoMemoryServer

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
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
            })

            const catalog = await request(app).get("/billing/catalog")
            expect(catalog.statusCode).toBe(200)
            expect(
                (catalog.body as { plans: { tier: string }[] }).plans.map(
                    (p) => p.tier,
                ),
            ).toEqual(["starter", "premium", "gold"])
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
        const pack = (id: string) => {
            const found = PROFILE_PACKS.find((p) => p.id === id)
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
            jest.spyOn(stripe.prices, "list").mockResolvedValue({
                data: [
                    ...Object.values(PLANS).map((p) => p.lookupKey),
                    TRIAL.lookupKey,
                    ...PROFILE_PACKS.map((p) => p.lookupKey),
                ].map((key) => ({ id: `price_${key}`, lookup_key: key })),
            } as never)
        })

        const choose = (id: string) =>
            request(app)
                .post("/billing/profiles")
                .set("Cookie", [cookie])
                .send({ pack: id })

        it("sells 1, 3 or 6 extra profiles at 5, 12 and 24 euro a month", async () => {
            const catalog = await request(app).get("/billing/catalog")
            expect(
                (catalog.body as { profilePacks: unknown }).profilePacks,
            ).toEqual([
                { id: "profiles_1", extra: 1, amount: 500 },
                { id: "profiles_3", extra: 3, amount: 1200 },
                { id: "profiles_6", extra: 6, amount: 2400 },
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
                    profileSub(pack("profiles_3").lookupKey) as never,
                )

            const response = await choose("profiles_3")

            expect(response.statusCode).toBe(200)
            expect(create).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [
                        {
                            price: `price_${pack("profiles_3").lookupKey}`,
                            quantity: 1,
                        },
                    ],
                    metadata: expect.objectContaining({
                        kind: "profiles",
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
                profileSub(pack("profiles_1").lookupKey) as never,
            )
            const update = jest
                .spyOn(stripe.subscriptions, "update")
                .mockResolvedValue(
                    profileSub(pack("profiles_6").lookupKey) as never,
                )

            const response = await choose("profiles_6")

            expect(response.statusCode).toBe(200)
            expect(update).toHaveBeenCalledWith(
                "sub_test_profiles",
                expect.objectContaining({
                    items: [
                        {
                            id: "si_1",
                            price: `price_${pack("profiles_6").lookupKey}`,
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
                                    lookup_key: PLANS.starter.lookupKey,
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
            expect(user?.billing?.minutes?.allowance).toBe(TRIAL.minutes * 60)
        })

        it("refills plan minutes each cycle, once per invoice", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription() as never,
            )
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.minutes.used": 500 } },
            )

            await deliver(paidInvoice("in_cycle", "subscription_cycle"))
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.minutes.used": 100 } },
            )
            // Stripe retries: the same invoice must not reset again
            await deliver(paidInvoice("in_cycle", "subscription_cycle"))

            expect(await minutes()).toMatchObject({
                allowance: PLANS.premium.minutes * 60,
                used: 100,
            })
            expect(await BillingGrantModel.countDocuments()).toBe(1)
        })

        it("keeps used minutes across a plan change", async () => {
            jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue(
                subscription() as never,
            )
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.minutes.used": 600 } },
            )

            await deliver(paidInvoice("in_change", "subscription_update"))

            expect(await minutes()).toMatchObject({
                allowance: PLANS.premium.minutes * 60,
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
