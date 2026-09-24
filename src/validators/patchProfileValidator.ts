import { checkSchema } from "express-validator"
import { AVATARS, Relationships } from "../constants/index.ts"

export default checkSchema(
    {
        id: {
            in: ["params"],
            isMongoId: true,
            errorMessage: "Invalid profile id",
        },
        birthName: {
            in: ["body"],
            optional: true,
            trim: true,
            isLength: {
                options: { min: 1, max: 120 },
                errorMessage: "Birth name is required",
            },
            matches: {
                options: /[A-Za-z]/,
                errorMessage:
                    "Birth name must contain at least one letter A to Z",
            },
        },
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
        birthDate: {
            in: ["body"],
            optional: true,
            trim: true,
            isDate: {
                options: { format: "YYYY-MM-DD", strictMode: true },
                errorMessage: "Birth date should be in YYYY-MM-DD format",
            },
        },
        birthTime: {
            in: ["body"],
            optional: true,
            trim: true,
            matches: {
                options: /^([01]\d|2[0-3]):[0-5]\d$/,
                errorMessage: "Birth time should be in HH:mm (24h) format",
            },
        },
        city: {
            in: ["body"],
            optional: true,
            trim: true,
            notEmpty: { errorMessage: "City is required!" },
        },
        state: {
            in: ["body"],
            optional: true,
            trim: true,
            notEmpty: { errorMessage: "State is required!" },
        },
        country: {
            in: ["body"],
            optional: true,
            trim: true,
            notEmpty: { errorMessage: "Country is required!" },
        },
        relationship: {
            in: ["body"],
            optional: true,
            trim: true,
            isIn: {
                options: [Object.values(Relationships)],
                errorMessage: `Relationship should be one of: ${Object.values(Relationships).join(", ")}`,
            },
        },
        avatar: {
            in: ["body"],
            optional: true,
            trim: true,
            isIn: {
                options: [AVATARS],
                errorMessage: "Avatar should be one of the built-in portraits",
            },
        },
    },
    ["params", "body"],
)
