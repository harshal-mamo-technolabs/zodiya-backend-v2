import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

/** One palm reading: the report and the S3 keys of its photos (never URLs). */
const palmReadingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        // whose palm: one of the user's profiles, or someone typed in by name
        subject: {
            kind: { type: String, enum: ["profile", "other"], required: true },
            profile: { type: Schema.Types.ObjectId, ref: "Profile" },
            name: { type: String, required: true },
            gender: { type: String, default: null },
            age: { type: Number, default: null },
        },
        hand: { type: String, enum: ["left", "right"], required: true },
        dominant: { type: Boolean, required: true },
        lang: { type: String, required: true },
        model: { type: String, required: true },
        report: { type: Schema.Types.Mixed, required: true },
        images: {
            original: { type: String, required: true },
            highlighted: { type: String, default: null },
        },
        highlight: {
            state: {
                type: String,
                enum: ["none", "done", "failed"],
                default: "none",
            },
            model: { type: String, default: null },
        },
    },
    { timestamps: true, collection: "palmreadings" },
)

palmReadingSchema.index({ user: 1, createdAt: -1 })

export type PalmReading = InferSchemaType<typeof palmReadingSchema>
export type PalmReadingDocument = HydratedDocument<PalmReading>
export const PalmReadingModel = model("PalmReading", palmReadingSchema)
