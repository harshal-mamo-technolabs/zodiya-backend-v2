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
import { PlanModel } from "../../src/models/Plan.ts"
import { PalmPackModel } from "../../src/models/PalmPack.ts"
import { BillingService, stripe } from "../../src/services/BillingService.ts"
import { catalog } from "../../src/services/CatalogService.ts"
import { seedBilling } from "../../scripts/seedBilling.ts"
import {
    planOf,
    registerAndGetCookie,
    resetDB,
    userData,
} from "../utils/index.ts"

interface CatalogBody {
    plans: {
        tier: string
        amount: number
        minutes: number
        featured: boolean
    }[]
    palmPacks: { id: string }[]
}

describe("billing catalog from the database", () => {
    let mongod: MongoMemoryServer

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await resetDB()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("serves an edited plan and grants its new minutes on the next cycle", async () => {
        await PlanModel.updateOne(
            { tier: "premium" },
            { $set: { amount: 2900, minutes: 60 } },
        )
        catalog.clearCache()

        const body = (await request(app).get("/billing/catalog"))
            .body as CatalogBody
        expect(body.plans.find((p) => p.tier === "premium")).toMatchObject({
            amount: 2900,
            minutes: 60,
            featured: true,
        })

        await registerAndGetCookie(app)
        const premium = await planOf("premium")
        jest.spyOn(stripe.subscriptions, "retrieve").mockResolvedValue({
            id: "sub_test_plan",
            customer: `cus_test_${userData.email}`,
            status: "active",
            metadata: { kind: "plan" },
            cancel_at_period_end: false,
            cancel_at: null,
            items: {
                data: [
                    {
                        current_period_end: 1_900_000_000,
                        price: { lookup_key: premium.lookupKey },
                    },
                ],
            },
        } as unknown as Stripe.Response<Stripe.Subscription>)
        await new BillingService(
            UserModel,
            ProfileModel,
            BillingGrantModel,
        ).handleEvent({
            type: "invoice.paid",
            data: {
                object: {
                    id: "in_cycle",
                    status: "paid",
                    billing_reason: "subscription_cycle",
                    parent: {
                        subscription_details: { subscription: "sub_test_plan" },
                    },
                },
            },
        } as unknown as Stripe.Event)

        const user = await UserModel.findOne({ email: userData.email })
        expect(user?.billing?.minutes?.allowance).toBe(60 * 60)
    })

    it("does not sell an inactive pack", async () => {
        await PalmPackModel.updateOne(
            { packId: "palm_3" },
            { $set: { active: false } },
        )
        catalog.clearCache()
        const cookie = await registerAndGetCookie(app)
        const create = jest.spyOn(stripe.paymentIntents, "create")

        const body = (await request(app).get("/billing/catalog"))
            .body as CatalogBody
        expect(body.palmPacks.map((p) => p.id)).toEqual(["palm_7", "palm_10"])
        const response = await request(app)
            .post("/billing/palm")
            .set("Cookie", [cookie])
            .send({ pack: "palm_3" })
        expect(response.statusCode).toBe(400)
        expect(create).not.toHaveBeenCalled()
    })

    it("charges a minute pack at its catalog price", async () => {
        const cookie = await registerAndGetCookie(app)
        const create = jest
            .spyOn(stripe.paymentIntents, "create")
            .mockResolvedValue({ id: "pi_m", client_secret: "s" } as never)

        const response = await request(app)
            .post("/billing/minutes")
            .set("Cookie", [cookie])
            .send({ pack: "pack_30", quantity: 2 })

        expect(response.statusCode).toBe(200)
        expect(create).toHaveBeenCalledWith(
            expect.objectContaining({ amount: 2398, currency: "eur" }),
        )
    })

    it("keeps edited rows when seeded again", async () => {
        await PlanModel.updateOne({ tier: "gold" }, { $set: { amount: 4500 } })
        expect(await seedBilling()).toBe(0)
        expect((await PlanModel.findOne({ tier: "gold" }))?.amount).toBe(4500)
    })

    it("answers 503 when the catalog was never seeded", async () => {
        await mongoose.connection.dropDatabase()
        catalog.clearCache()
        const response = await request(app).get("/billing/catalog")
        expect(response.statusCode).toBe(503)
    })
})
