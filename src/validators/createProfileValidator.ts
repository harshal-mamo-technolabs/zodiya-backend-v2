import { checkSchema } from "express-validator"
import { AVATARS, Relationships } from "../constants/index.ts"

export default checkSchema({
    firstName: {
        errorMessage: "First name is required!",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Last name is required!",
        notEmpty: true,
        trim: true,
    },
    birthDate: {
        trim: true,
        errorMessage: "Birth date is required!",
        notEmpty: true,
        isDate: {
            options: { format: "YYYY-MM-DD", strictMode: true },
            errorMessage: "Birth date should be in YYYY-MM-DD format",
        },
    },
    birthTime: {
        // optional at the edge — ProfileService defaults it to midnight
        optional: true,
        trim: true,
        matches: {
            options: /^([01]\d|2[0-3]):[0-5]\d$/,
            errorMessage: "Birth time should be in HH:mm (24h) format",
        },
    },
    city: {
        errorMessage: "City is required!",
        notEmpty: true,
        trim: true,
    },
    state: {
        errorMessage: "State is required!",
        notEmpty: true,
        trim: true,
    },
    country: {
        errorMessage: "Country is required!",
        notEmpty: true,
        trim: true,
    },
    relationship: {
        optional: true,
        trim: true,
        isIn: {
            options: [Object.values(Relationships)],
            errorMessage: `Relationship should be one of: ${Object.values(Relationships).join(", ")}`,
        },
    },
    avatar: {
        optional: true,
        trim: true,
        isIn: {
            options: [AVATARS],
            errorMessage: "Avatar should be one of the built-in portraits",
        },
    },
})
