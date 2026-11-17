import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

export const UTM_FIELDS = ["utm_source", "utm_campaign", "utm_medium"] as const
/** What a later visit may change: the source stays as it was first set. */
export const CHANGEABLE_UTM = ["utm_campaign", "utm_medium"] as const
/** The email that brought them: Klaviyo's utm_id arrives here as flow_id. */
export const EMAIL_TOUCH = ["flow_id", "utm_email"] as const
/** What differs from one visit record to the next. */
export const PER_VISIT = [...CHANGEABLE_UTM, ...EMAIL_TOUCH] as const

/**
 * One visit to the onboarding funnel, filled in as the visitor moves through it.
 * Someone coming back on another campaign gets another record under their email:
 * the answers and utm_source are the same on all of them, the campaign and
 * medium are per record.
 */
const landingPageHookSchema = new Schema(
    {
        uuid: { type: String, required: true, unique: true },
        utm_source: { type: String, default: "organic" },
        utm_campaign: { type: String, default: "organic" },
        utm_medium: { type: String, default: "organic" },
        flow_id: String,
        utm_email: String,
        // which landing page this visit was on: per record, like the campaign
        landingPageName: String,
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
