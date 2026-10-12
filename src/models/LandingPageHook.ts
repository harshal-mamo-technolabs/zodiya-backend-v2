import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

export const UTM_FIELDS = ["utm_source", "utm_campaign", "utm_medium"] as const

/** One visit to the onboarding funnel, filled in as the visitor moves through it. */
const landingPageHookSchema = new Schema(
    {
        uuid: { type: String, required: true, unique: true },
        utm_source: { type: String, default: "default" },
        utm_campaign: { type: String, default: "default" },
        utm_medium: { type: String, default: "default" },
        firstName: String,
        lastName: String,
        gender: String,
        birthDate: String,
        birthTime: String,
        lat: Number,
        lon: Number,
        city: String,
        state: String,
        country: String,
        interests: { type: [String], default: undefined },
        email: { type: String, lowercase: true, trim: true, index: true },
        isPaymentInitiated: Boolean,
        isPaymentCompleted: Boolean,
        plan: String,
        trial: Boolean,
    },
    { timestamps: true, collection: "landingpagehook" },
)

export type LandingPageHook = InferSchemaType<typeof landingPageHookSchema>
export type LandingPageHookDocument = HydratedDocument<LandingPageHook>
export const LandingPageHookModel = model(
    "LandingPageHook",
    landingPageHookSchema,
)
