import { checkSchema } from "express-validator"
import { ASTROLOGER_IDS } from "../constants/astrologers.ts"

const character = {
    isIn: {
        options: [ASTROLOGER_IDS],
        errorMessage: `Astrologer should be one of: ${ASTROLOGER_IDS.join(", ")}`,
    },
}

export const previewValidator = checkSchema({
    id: { in: ["params"], ...character },
})

export const sessionValidator = checkSchema(
    {
        character,
        profileId: {
            isMongoId: { errorMessage: "Profile id is not valid" },
        },
        // where the user is; the agent uses it to pick what to talk about first
        page: {
            optional: true,
            isString: true,
            trim: true,
            isLength: { options: { max: 40 } },
        },
        // true only for the introduction, which the astrologer speaks first
        greet: { optional: true, isBoolean: { options: { strict: true } } },
    },
    ["body"],
)
