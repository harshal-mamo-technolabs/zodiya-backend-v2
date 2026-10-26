import { type InferSchemaType, model, Schema } from "mongoose"

/** A monthly pack of extra profiles; an account holds one at most. */
const profilePackSchema = new Schema(
    {
        packId: { type: String, required: true, unique: true },
        // profiles on top of the plan's included ones
        extra: { type: Number, required: true },
        // cents a month
        amount: { type: Number, required: true },
        lookupKey: { type: String, required: true, unique: true },
        order: { type: Number, required: true },
        active: { type: Boolean, required: true },
    },
    { timestamps: true },
)

export type ProfilePack = InferSchemaType<typeof profilePackSchema>
export const ProfilePackModel = model("ProfilePack", profilePackSchema)
