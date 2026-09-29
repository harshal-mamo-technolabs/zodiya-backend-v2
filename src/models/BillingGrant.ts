import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

/**
 * One row per Stripe payment that granted minutes (an invoice or a payment
 * intent id). Stripe retries webhooks and the client syncs too, so the unique
 * key is what stops the same payment granting twice.
 */
const billingGrantSchema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
)

export type BillingGrant = InferSchemaType<typeof billingGrantSchema>
export type BillingGrantDocument = HydratedDocument<BillingGrant>
export const BillingGrantModel = model("BillingGrant", billingGrantSchema)
