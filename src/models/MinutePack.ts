import { type InferSchemaType, model, Schema } from "mongoose"

/** One-off astrologer minutes; they never expire. */
const minutePackSchema = new Schema(
    {
        packId: { type: String, required: true, unique: true },
        minutes: { type: Number, required: true },
        // cents
        amount: { type: Number, required: true },
        order: { type: Number, required: true },
        active: { type: Boolean, required: true },
    },
    { timestamps: true },
)

export type MinutePack = InferSchemaType<typeof minutePackSchema>
export const MinutePackModel = model("MinutePack", minutePackSchema)
