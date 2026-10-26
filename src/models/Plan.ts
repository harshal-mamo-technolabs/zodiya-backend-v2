import { type InferSchemaType, model, Schema } from "mongoose"

const num = { type: Number, required: true }

/** A paid trial in front of a plan: charged up front, then the plan renews. */
const trialSchema = new Schema(
    {
        // the Stripe price of the one-off trial fee
        lookupKey: { type: String, required: true },
        amount: num,
        days: num,
        minutes: num,
        palm: num,
    },
    { _id: false },
)

/**
 * A subscription plan. Stripe holds its price, found by lookupKey
 * (scripts/setupStripe.ts creates it); initial rows come from
 * scripts/seedBilling.ts. An inactive plan is no longer sold, but its
 * subscribers keep being served from it.
 */
const planSchema = new Schema(
    {
        tier: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        lookupKey: { type: String, required: true, unique: true },
        // cents per billing cycle
        amount: num,
        // months per billing cycle
        months: num,
        // astrologer minutes and palm readings each cycle; unused ones do not carry over
        minutes: num,
        palm: num,
        // profiles the plan includes before any profile pack
        includedProfiles: num,
        featured: { type: Boolean, required: true },
        order: num,
        active: { type: Boolean, required: true },
        trial: { type: trialSchema, required: false },
    },
    { timestamps: true },
)

export type Plan = InferSchemaType<typeof planSchema>
export const PlanModel = model("Plan", planSchema)
