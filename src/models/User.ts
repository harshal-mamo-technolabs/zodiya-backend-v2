import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"
import { Roles } from "../constants/index.ts"

export const GENDERS = ["female", "male"] as const

const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, select: false },
        // a hash: the link itself only ever goes to the owner's inbox
        passwordResetToken: {
            type: String,
            select: false,
            index: true,
            sparse: true,
        },
        // optional; only the onboarding funnel asks for it
        gender: { type: String, enum: GENDERS },
        // the campaign that first brought them, as the funnel's landing URL
        // said; also sent to Stripe and Help Scout. Set when the account is
        // created and never again: immutable makes mongoose drop any later write.
        utm_source: { type: String, default: "organic", immutable: true },
        utm_campaign: { type: String, default: "organic", immutable: true },
        utm_medium: { type: String, default: "organic", immutable: true },
        // how the account was created; the analytics dashboard counts signups by it
        signupType: { type: String, default: "email", immutable: true },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.CUSTOMER,
            required: true,
        },
        // set when the owner deletes the account; nothing is removed, and
        // logging in again clears it
        deletedAt: { type: Date, default: null },
        // what the account has asked to be sent, once sending exists
        notifications: {
            daily: { type: Boolean, default: true },
            transits: { type: Boolean, default: true },
            retro: { type: Boolean, default: false },
            // local wall-clock HH:mm
            deliveryTime: { type: String, default: "07:30" },
        },
        // a mirror of Stripe, written by BillingService from webhooks and syncs
        billing: {
            customerId: { type: String, index: true, sparse: true },
            trialUsed: { type: Boolean, default: false },
            plan: {
                subscriptionId: String,
                // a Plan tier from the billing catalog
                tier: String,
                // a Stripe subscription status
                status: String,
                currentPeriodEnd: Date,
                cancelAtPeriodEnd: { type: Boolean, default: false },
            },
            profiles: {
                subscriptionId: String,
                quantity: { type: Number, default: 0 },
                status: String,
                currentPeriodEnd: Date,
                cancelAtPeriodEnd: { type: Boolean, default: false },
            },
            // all in seconds; plan time resets each cycle, top-ups never expire
            minutes: {
                allowance: { type: Number, default: 0 },
                used: { type: Number, default: 0 },
                topup: { type: Number, default: 0 },
                // every top-up ever bought, for reporting
                purchased: { type: Number, default: 0 },
            },
            // palm readings, counted like minutes but in readings
            palm: {
                allowance: { type: Number, default: 0 },
                used: { type: Number, default: 0 },
                topup: { type: Number, default: 0 },
                purchased: { type: Number, default: 0 },
            },
        },
    },
    { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>
export const UserModel = model("User", userSchema)
