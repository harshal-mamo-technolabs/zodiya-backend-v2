import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

/**
 * One voice conversation. ElevenLabs is the clock: once the conversation is
 * over its recorded duration is charged against the user's minutes.
 */
const astrologerSessionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        conversationId: { type: String, required: true },
        // the balance when it opened; the client hangs up at this point
        maxSeconds: { type: Number, required: true },
        settled: { type: Boolean, default: false, index: true },
        chargedSeconds: { type: Number, default: 0 },
    },
    { timestamps: true },
)

export type AstrologerSession = InferSchemaType<typeof astrologerSessionSchema>
export type AstrologerSessionDocument = HydratedDocument<AstrologerSession>
export const AstrologerSessionModel = model(
    "AstrologerSession",
    astrologerSessionSchema,
)
