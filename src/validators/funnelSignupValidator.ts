import { checkSchema } from "express-validator"
import { AVATARS } from "../constants/index.ts"
import { GENDERS } from "../models/User.ts"
import { birthDateInRange } from "./createProfileValidator.ts"

/**
 * The onboarding funnel's one request: an account and its owner's birth
 * details. No password: the funnel never asks for one (see FunnelController).
 */
export default checkSchema(
    {
        email: {
            trim: true,
            notEmpty: { errorMessage: "Email is required!" },
            isEmail: { errorMessage: "Email should be a valid email" },
        },
        firstName: {
            trim: true,
            notEmpty: { errorMessage: "First name is required!" },
        },
        lastName: {
            trim: true,
            notEmpty: { errorMessage: "Last name is required!" },
        },
        gender: {
            isIn: {
                options: [GENDERS],
                errorMessage: `Gender should be one of: ${GENDERS.join(", ")}`,
            },
        },
        avatar: {
            optional: true,
            isIn: {
                options: [AVATARS],
                errorMessage: "Avatar should be one of the built-in portraits",
            },
        },
        birthDate: {
            trim: true,
            isDate: {
                options: { format: "YYYY-MM-DD", strictMode: true },
                errorMessage: "Birth date should be in YYYY-MM-DD format",
                bail: true,
            },
            inRange: birthDateInRange,
        },
        birthTime: {
            optional: true,
            trim: true,
            matches: {
                options: /^([01]\d|2[0-3]):[0-5]\d$/,
                errorMessage: "Birth time should be in HH:mm (24h) format",
            },
        },
        hookId: { optional: true, isUUID: true },
        city: { trim: true, notEmpty: { errorMessage: "City is required!" } },
        state: { trim: true, notEmpty: { errorMessage: "State is required!" } },
        country: {
            trim: true,
            notEmpty: { errorMessage: "Country is required!" },
        },
    },
    ["body"],
)
