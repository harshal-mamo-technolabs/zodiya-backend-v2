import { checkSchema } from "express-validator"

export default checkSchema(
    {
        firstName: {
            in: ["body"],
            optional: true,
            trim: true,
            notEmpty: { errorMessage: "First name is required!" },
        },
        lastName: {
            in: ["body"],
            optional: true,
            trim: true,
            notEmpty: { errorMessage: "Last name is required!" },
        },
        "notifications.daily": {
            in: ["body"],
            optional: true,
            isBoolean: { errorMessage: "daily should be true or false" },
            toBoolean: true,
        },
        "notifications.transits": {
            in: ["body"],
            optional: true,
            isBoolean: { errorMessage: "transits should be true or false" },
            toBoolean: true,
        },
        "notifications.retro": {
            in: ["body"],
            optional: true,
            isBoolean: { errorMessage: "retro should be true or false" },
            toBoolean: true,
        },
        "notifications.deliveryTime": {
            in: ["body"],
            optional: true,
            trim: true,
            matches: {
                options: /^([01]\d|2[0-3]):[0-5]\d$/,
                errorMessage: "Delivery time should be in HH:mm (24h) format",
            },
        },
    },
    ["body"],
)
