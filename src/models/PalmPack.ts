import { type InferSchemaType, model, Schema } from "mongoose"

/** One-off palm readings; like minute packs they never expire. */
const palmPackSchema = new Schema(
    {
        packId: { type: String, required: true, unique: true },
        readings: { type: Number, required: true },
        // cents
        amount: { type: Number, required: true },
        order: { type: Number, required: true },
        active: { type: Boolean, required: true },
    },
    { timestamps: true },
)

export type PalmPack = InferSchemaType<typeof palmPackSchema>
export const PalmPackModel = model("PalmPack", palmPackSchema)
