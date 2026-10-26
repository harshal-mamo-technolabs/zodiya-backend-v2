import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import type Stripe from "stripe"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { stripe } from "../../src/services/BillingService.ts"
import { KlaviyoEvents, klaviyo } from "../../src/services/KlaviyoService.ts"
import {
    geoData,
    profileData,
    planOf,
    resetDB,
    userData,
} from "../utils/index.ts"

const signupBody = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    gender: "female",
    birthDate: profileData.birthDate,
    birthTime: profileData.birthTime,
    city: profileData.city,
    state: profileData.state,
    country: profileData.country,
}

const visit = async () =>
    (
        (
            await request(app)
                .post("/funnel/hook")
                .send({ utm_source: "fb", utm_campaign: "launch" })
        ).body as { uuid: string }
    ).uuid

const patch = (uuid: string, body: object) =>
    request(app).patch(`/funnel/hook/${uuid}`).send(body)

function deliver(event: Record<string, unknown>) {
    const payload = JSON.stringify(event)
    return request(app)
        .post("/billing/webhook")
        .set("Content-Type", "application/json")
        .set(
            "Stripe-Signature",
            stripe.webhooks.generateTestHeaderString({
                payload,
                secret: "whsec_test_secret",
            }),
        )
        .send(payload)
}

describe("klaviyo sync", () => {
    let mongod: MongoMemoryServer
    let track: jest.SpiedFunction<typeof klaviyo.track>

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        track = jest.spyOn(klaviyo, "track")
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("sends the landing page answers once the email is known", async () => {
        const uuid = await visit()
        await patch(uuid, { lat: 23.02, lon: 72.57 })
        expect(track).not.toHaveBeenCalled()

        await request(app)
            .post("/funnel/signup")
            .send({ ...signupBody, hookId: uuid })

        expect(track).toHaveBeenCalledTimes(1)
        const [event, email, props] = track.mock.calls[0] ?? []
        expect(event).toBe(KlaviyoEvents.EMAIL_CAPTURED)
        expect(email).toBe(userData.email)
        expect(props).toMatchObject({
            "astromeridian:full_name": "harshal chauhan",
            "astromeridian:gender": "female",
            "astromeridian:dob": "1995-08-15",
            "astromeridian:birth_time": "14:30",
            "astromeridian:city": "Ahmedabad",
            "astromeridian:lat": 23.02,
            "astromeridian:lon": 72.57,
            "astromeridian:utm_source": "fb",
            "astromeridian:utm_campaign": "launch",
            "astromeridian:utm_medium": "default",
            "astromeridian:email": userData.email,
        })
        expect(props?.["astromeridian:created_at"]).toEqual(expect.any(String))
    })

    it("marks the payment initiated when a plan is chosen", async () => {
        const uuid = await visit()
        await patch(uuid, { plan: "starter", trial: true })
        // no email yet: nothing to send
        expect(track).not.toHaveBeenCalled()

        await request(app)
            .post("/funnel/signup")
            .send({ ...signupBody, hookId: uuid })
        await patch(uuid, { plan: "premium", trial: false })

        const [event, email, props] = track.mock.calls[1] ?? []
        expect(event).toBe(KlaviyoEvents.PAYMENT_INITIATED)
        expect(email).toBe(userData.email)
        expect(props).toEqual({
            "astromeridian:landing_page_selected_plan": "premium",
            "astromeridian:landing_page_is_trial_plan": false,
            "astromeridian:landing_page_payment_initiated": true,
            "astromeridian:landing_page_payment_completed": false,
        })
    })

    it("sends the trial's dates when the first payment goes through", async () => {
        const starter = await planOf("starter")
        await request(app)
            .post("/funnel/signup")
            .send({ ...signupBody, hookId: await visit() })
        await UserModel.updateOne(
            { email: userData.email },
            { $set: { "billing.customerId": "cus_k" } },
        )
        jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue({
            id: "sub_k",
            customer: "cus_k",
            status: "trialing",
            metadata: { kind: "plan" },
            cancel_at_period_end: false,
            cancel_at: null,
            default_payment_method: null,
            trial_start: 1_800_000_000,
            trial_end: 1_800_259_200,
            items: {
                data: [
                    {
                        current_period_start: 1_800_000_000,
                        current_period_end: 1_800_259_200,
                        price: { lookup_key: starter.lookupKey },
                    },
                ],
            },
        } as unknown as Stripe.Response<Stripe.Subscription>)
        const paid = {
            id: "evt_k",
            type: "invoice.paid",
            data: {
                object: {
                    id: "in_k",
                    object: "invoice",
                    status: "paid",
                    billing_reason: "subscription_create",
                    parent: { subscription_details: { subscription: "sub_k" } },
                },
            },
        }

        await deliver(paid)
        await deliver(paid)

        const completed = track.mock.calls.filter(
            ([e]) => e === KlaviyoEvents.PAYMENT_COMPLETED,
        )
        expect(completed).toHaveLength(1)
        expect(completed[0]?.[2]).toMatchObject({
            "astromeridian:landing_page_payment_completed": true,
            "astromeridian:current_general_plan": "Starter",
            "astromeridian:general_plan_status": "trialing",
            "astromeridian:general_plan_cancels_at_period_end": false,
            "astromeridian:general_plan_start_date": "2027-01-18T08:00:00.000Z",
            "astromeridian:general_plan_end_date": "2027-02-18T08:00:00.000Z",
            "astromeridian:stripe_subscription_id": "sub_k",
            "astromeridian:is_trial_active": true,
            "astromeridian:general_plan_trial_start_date":
                "2027-01-15T08:00:00.000Z",
            "astromeridian:general_plan_trial_end_date":
                "2027-01-18T08:00:00.000Z",
            "astromeridian:general_plan_next_billing_date":
                "2027-01-18T08:00:00.000Z",
        })
    })

    it("updates the plan's dates when the trial ends and when it is cancelled", async () => {
        const starter = await planOf("starter")
        await request(app)
            .post("/funnel/signup")
            .send({ ...signupBody, hookId: await visit() })
        await UserModel.updateOne(
            { email: userData.email },
            {
                $set: {
                    "billing.customerId": "cus_k",
                    "billing.plan": {
                        subscriptionId: "sub_k",
                        tier: "starter",
                        status: "trialing",
                        currentPeriodEnd: new Date(1_800_259_200_000),
                        cancelAtPeriodEnd: false,
                    },
                },
            },
        )
        const identify = jest.spyOn(klaviyo, "identify")
        const sub = (over: object) =>
            ({
                id: "sub_k",
                customer: "cus_k",
                status: "active",
                metadata: { kind: "plan" },
                cancel_at_period_end: false,
                cancel_at: null,
                trial_start: 1_800_000_000,
                trial_end: 1_800_259_200,
                items: {
                    data: [
                        {
                            current_period_start: 1_800_259_200,
                            current_period_end: 1_802_937_600,
                            price: { lookup_key: starter.lookupKey },
                        },
                    ],
                },
                ...over,
            }) as unknown as Stripe.Response<Stripe.Subscription>
        const retrieve = jest.spyOn(stripe.subscriptions, "retrieve")
        const updated = {
            id: "evt_u",
            type: "customer.subscription.updated",
            data: { object: { id: "sub_k", object: "subscription" } },
        }

        // the trial ends and the first month is billed
        retrieve.mockResolvedValue(sub({}))
        await deliver(updated)
        await deliver(updated) // the same state again sends nothing
        expect(identify).toHaveBeenCalledTimes(1)
        expect(identify.mock.calls[0]?.[1]).toMatchObject({
            "astromeridian:general_plan_status": "active",
            "astromeridian:is_trial_active": false,
            "astromeridian:general_plan_start_date": "2027-01-18T08:00:00.000Z",
            "astromeridian:general_plan_next_billing_date":
                "2027-02-18T08:00:00.000Z",
            "astromeridian:general_plan_trial_end_date":
                "2027-01-18T08:00:00.000Z",
        })

        // cancelled: no next billing date
        retrieve.mockResolvedValue(sub({ cancel_at_period_end: true }))
        await deliver(updated)
        expect(identify.mock.calls[1]?.[1]).toMatchObject({
            "astromeridian:general_plan_cancels_at_period_end": true,
            "astromeridian:general_plan_next_billing_date": null,
        })

        // ended
        retrieve.mockResolvedValue(sub({ status: "canceled" }))
        await deliver(updated)
        expect(identify.mock.calls[2]?.[1]).toMatchObject({
            "astromeridian:general_plan_status": "canceled",
            "astromeridian:general_plan_next_billing_date": null,
        })
    })

    it("syncs a direct sign-up with the 'default' campaign", async () => {
        const identify = jest.spyOn(klaviyo, "identify")
        await request(app).post("/auth/register").send(userData)
        for (let i = 0; i < 20 && !identify.mock.calls.length; i++) {
            await new Promise((r) => setTimeout(r, 25))
        }

        const [email, props] = identify.mock.calls[0] ?? []
        expect(email).toBe(userData.email)
        expect(props).toMatchObject({
            "astromeridian:full_name": "harshal chauhan",
            "astromeridian:utm_source": "default",
            "astromeridian:utm_campaign": "default",
            "astromeridian:utm_medium": "default",
            "astromeridian:astrologer_minutes_total_left": 0,
            "astromeridian:palm_readings_total_left": 0,
            "astromeridian:profiles_allowed": 1,
        })
    })

    it("sends minute and palm purchases once, with the new balance", async () => {
        await request(app).post("/auth/register").send(userData)
        const user = await UserModel.findOneAndUpdate(
            { email: userData.email },
            { $set: { "billing.customerId": "cus_k" } },
        ).orFail()
        const intent = (id: string, metadata: object) => ({
            id: "evt_" + id,
            type: "payment_intent.succeeded",
            data: {
                object: {
                    id,
                    object: "payment_intent",
                    status: "succeeded",
                    customer: "cus_k",
                    amount: 750,
                    currency: "eur",
                    metadata: { userId: String(user._id), ...metadata },
                },
            },
        })
        const minutes = intent("pi_m", {
            kind: "minutes",
            minutes: "20",
            pack: "pack_20",
            quantity: "1",
        })

        await deliver(minutes)
        await deliver(minutes)
        await deliver(
            intent("pi_p", {
                kind: "palm",
                readings: "5",
                pack: "palm_5",
                quantity: "1",
            }),
        )

        const bought = track.mock.calls.filter(
            ([e]) => e === KlaviyoEvents.ASTROLOGER_CREDITS_PURCHASED,
        )
        expect(bought).toHaveLength(1)
        const [, , props, uniqueId, eventProps] = bought[0] ?? []
        expect(uniqueId).toBe("purchase:pi_m")
        expect(props).toMatchObject({
            "astromeridian:astrologer_minutes_purchased_left": 20,
            "astromeridian:astrologer_minutes_total_purchased": 20,
            "astromeridian:astrologer_last_purchase_date": expect.any(
                String,
            ) as string,
        })
        expect(eventProps).toEqual({
            "astromeridian:pack": "pack_20",
            "astromeridian:quantity": 1,
            "astromeridian:minutes": 20,
            "astromeridian:amount": 7.5,
            "astromeridian:currency": "EUR",
            "astromeridian:stripe_payment_intent_id": "pi_m",
        })
        const palm = track.mock.calls.find(
            ([e]) => e === KlaviyoEvents.PALM_READINGS_PURCHASED,
        )
        expect(palm?.[2]).toMatchObject({
            "astromeridian:palm_readings_purchased_left": 5,
            "astromeridian:palm_readings_total_purchased": 5,
        })
    })

    it("follows a profile pack from purchase to change to cancellation", async () => {
        await request(app).post("/auth/register").send(userData)
        await UserModel.updateOne(
            { email: userData.email },
            { $set: { "billing.customerId": "cus_k" } },
        )
        const sub = (lookupKey: string, status = "active") =>
            ({
                id: "sub_p",
                customer: "cus_k",
                status,
                metadata: { kind: "profiles" },
                cancel_at_period_end: false,
                cancel_at: null,
                items: {
                    data: [
                        {
                            current_period_start: 1_800_000_000,
                            current_period_end: 1_802_592_000,
                            price: { lookup_key: lookupKey },
                        },
                    ],
                },
            }) as unknown as Stripe.Response<Stripe.Subscription>
        const retrieve = jest.spyOn(stripe.subscriptions, "retrieve")
        const updated = {
            id: "evt_p",
            type: "customer.subscription.updated",
            data: { object: { id: "sub_p", object: "subscription" } },
        }
        const events = () =>
            track.mock.calls.map(([e, , props, , eventProps]) => ({
                e,
                props,
                eventProps,
            }))

        retrieve.mockResolvedValue(sub("zodiya_profiles_1_monthly"))
        await deliver(updated)
        await deliver(updated)
        retrieve.mockResolvedValue(sub("zodiya_profiles_3_monthly"))
        await deliver(updated)
        retrieve.mockResolvedValue(sub("zodiya_profiles_3_monthly", "canceled"))
        await deliver(updated)

        expect(events().map((x) => x.e)).toEqual([
            KlaviyoEvents.PROFILE_PLAN_PURCHASED,
            KlaviyoEvents.PROFILE_PLAN_CHANGED,
            KlaviyoEvents.PROFILE_PLAN_CANCELLED,
        ])
        const [purchased, changed, cancelled] = events()
        expect(purchased?.props).toMatchObject({
            "astromeridian:profile_plan": "1 extra profile",
            "astromeridian:profile_plan_status": "active",
            "astromeridian:profile_plan_next_billing_date":
                "2027-02-14T08:00:00.000Z",
            "astromeridian:profiles_allowed": 2,
        })
        expect(purchased?.eventProps).toMatchObject({
            "astromeridian:amount": 2.99,
            "astromeridian:currency": "EUR",
        })
        expect(changed?.eventProps).toMatchObject({
            "astromeridian:extra_profiles": 3,
            "astromeridian:previous_extra_profiles": 1,
        })
        expect(cancelled?.props).toMatchObject({
            "astromeridian:profile_plan_status": "canceled",
            "astromeridian:profile_plan_next_billing_date": null,
            "astromeridian:profiles_allowed": 1,
        })
    })

    it("posts to Klaviyo and waits out a 429", async () => {
        track.mockRestore()
        const key = config.KLAVIYO_PRIVATE_API_KEY
        config.KLAVIYO_PRIVATE_API_KEY = "pk_test"
        const fetchSpy = jest
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(
                new Response("", {
                    status: 429,
                    headers: { "Retry-After": "1" },
                }),
            )
            .mockResolvedValueOnce(new Response("", { status: 202 }))
        try {
            klaviyo.track(
                "TEST",
                "a@b.co",
                {
                    x: 1,
                    "astromeridian:first_name": "Ada",
                    "astromeridian:city": "Lisbon",
                },
                "u1",
            )
            for (let i = 0; i < 40 && fetchSpy.mock.calls.length < 2; i++) {
                await new Promise((r) => setTimeout(r, 100))
            }
        } finally {
            config.KLAVIYO_PRIVATE_API_KEY = key
        }

        expect(fetchSpy).toHaveBeenCalledTimes(2)
        const [url, init] = fetchSpy.mock.calls[1] ?? []
        expect(url).toBe("https://a.klaviyo.com/api/events")
        expect((init?.headers as Record<string, string>).Authorization).toBe(
            "Klaviyo-API-Key pk_test",
        )
        const body = JSON.parse(init?.body as string) as {
            data: {
                attributes: {
                    unique_id: string
                    metric: { data: { attributes: { name: string } } }
                    profile: {
                        data: {
                            attributes: {
                                email: string
                                properties: Record<string, unknown>
                            }
                        }
                    }
                }
            }
        }
        const a = body.data.attributes
        expect(a.unique_id).toBe("u1")
        expect(a.metric.data.attributes.name).toBe("TEST")
        expect(a.profile.data.attributes.email).toBe("a@b.co")
        expect(a.profile.data.attributes).toMatchObject({
            first_name: "Ada",
            location: { city: "Lisbon" },
        })
        expect(a.profile.data.attributes.properties).toMatchObject({
            astromeridian: true,
            x: 1,
            "astromeridian:updated_at": expect.any(String) as string,
        })
    })
})
