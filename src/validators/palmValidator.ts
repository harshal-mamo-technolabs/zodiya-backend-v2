import { body, checkSchema } from "express-validator"
import { SupportedLanguages } from "../constants/index.ts"
import { GENDERS } from "../models/User.ts"

const side = (field: string) => ({
    isIn: {
        options: [["left", "right"]],
        errorMessage: `${field} should be left or right`,
    },
})

export const palmReadValidator = [
    ...checkSchema(
        {
            // which hand the photo shows, and which one the user writes with
            hand: side("hand"),
            dominant: side("dominant"),
            lang: {
                optional: true,
                isIn: { options: [Object.values(SupportedLanguages)] },
            },
            // whose palm: one of the user's profiles...
            profileId: {
                optional: true,
                isMongoId: { errorMessage: "Profile id is not valid" },
            },
            // ...or someone else, by name
            name: {
                optional: true,
                isString: true,
                trim: true,
                isLength: {
                    options: { min: 1, max: 80 },
                    errorMessage: "Name should be 1 to 80 characters",
                },
            },
            gender: {
                optional: true,
                isIn: {
                    options: [GENDERS],
                    errorMessage: `Gender should be one of: ${GENDERS.join(", ")}`,
                },
            },
            age: {
                optional: true,
                isInt: {
                    options: { min: 1, max: 120 },
                    errorMessage: "Age should be a whole number from 1 to 120",
                },
                toInt: true,
            },
        },
        ["body"],
    ),
    body().custom((value: Record<string, unknown>) => {
        if ((value.profileId === undefined) === (value.name === undefined)) {
            throw new Error("Send either profileId or name, not both")
        }
        return true
    }),
]

export const palmIdValidator = checkSchema({
    id: {
        in: ["params"],
        isMongoId: { errorMessage: "Reading id is not valid" },
    },
})

export const palmListValidator = checkSchema(
    {
        limit: {
            optional: true,
            isInt: {
                options: { min: 1, max: 50 },
                errorMessage: "limit should be 1 to 50",
            },
        },
        // the `next` of the previous page
        before: {
            optional: true,
            isISO8601: { errorMessage: "before should be an ISO date" },
        },
    },
    ["query"],
)
