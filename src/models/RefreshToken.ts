import {
    type HydratedDocument,
    type InferSchemaType,
    model,
    Schema,
} from "mongoose"

const refreshTokenSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
)

// TTL index: mongo deletes the document itself once expiresAt has passed
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type RefreshToken = InferSchemaType<typeof refreshTokenSchema>
export type RefreshTokenDocument = HydratedDocument<RefreshToken>
export const RefreshTokenModel = model("RefreshToken", refreshTokenSchema)
