import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"
import { Roles } from "../constants/index.ts"

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
    },
    { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>
export const UserModel = model("User", userSchema)
