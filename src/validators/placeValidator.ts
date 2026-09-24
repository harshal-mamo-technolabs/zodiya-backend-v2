import { checkSchema } from "express-validator"

export const placeSearchValidator = checkSchema(
    {
        q: {
            in: ["query"],
            trim: true,
            isLength: {
                options: { min: 2, max: 120 },
                errorMessage: "Search needs at least 2 characters",
            },
        },
    },
    ["query"],
)

export const placeDetailValidator = checkSchema(
    {
        placeId: {
            in: ["params"],
            trim: true,
            isLength: {
                options: { min: 1, max: 512 },
                errorMessage: "Place id is required",
            },
        },
    },
    ["params"],
)
