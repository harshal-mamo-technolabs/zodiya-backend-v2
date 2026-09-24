import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"
import { AVATARS, Relationships, ZodiacSigns } from "../constants/index.ts"

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        // full name as written on the birth certificate; numerology only
        birthName: { type: String, trim: true },
        // one of AVATARS; unset until the user picks a portrait
        avatar: { type: String, enum: AVATARS },
        // kept as the local wall-clock strings the user typed (YYYY-MM-DD / HH:mm)
        birthDate: { type: String, required: true },
        birthTime: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
        // UTC offset in hours at the birth instant, e.g. 5.5
        tzone: { type: Number, required: true },
        timezoneId: { type: String, required: true },
        zodiacSign: {
            type: String,
            enum: Object.values(ZodiacSigns),
            required: true,
        },
        relationship: {
            type: String,
            enum: Object.values(Relationships),
            default: Relationships.SELF,
            required: true,
        },
        isPrimary: { type: Boolean, default: false, required: true },
        // set only when the owner asks for a public link; unset revokes it
        shareToken: { type: String, index: true, sparse: true, unique: true },
    },
    { timestamps: true },
)

// mongo enforces a single primary profile per user
profileSchema.index(
    { user: 1, isPrimary: 1 },
    { unique: true, partialFilterExpression: { isPrimary: true } },
)

export type Profile = InferSchemaType<typeof profileSchema>
export type ProfileDocument = HydratedDocument<Profile>
export const ProfileModel = model("Profile", profileSchema)
