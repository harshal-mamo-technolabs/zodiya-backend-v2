import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"
import { Roles } from "../constants/index.ts"
import { PLAN_TIERS } from "../constants/billing.ts"

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
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.CUSTOMER,
            required: true,
        },
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
                tier: { type: String, enum: PLAN_TIERS },
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
            },
            // all in seconds; plan time resets each cycle, top-ups never expire
            minutes: {
                allowance: { type: Number, default: 0 },
                used: { type: Number, default: 0 },
                topup: { type: Number, default: 0 },
            },
        },
    },
    { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>
export const UserModel = model("User", userSchema)
