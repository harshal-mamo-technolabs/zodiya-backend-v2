import { type InferSchemaType, model, Schema } from "mongoose"

/** The one document of shop-wide billing settings. */
const billingSettingsSchema = new Schema(
    {
        currency: { type: String, required: true, lowercase: true },
        // most packs of one kind in a single payment
        maxPackQuantity: { type: Number, required: true },
    },
    { timestamps: true },
)

export type BillingSettings = InferSchemaType<typeof billingSettingsSchema>
export const BillingSettingsModel = model(
    "BillingSettings",
    billingSettingsSchema,
)
