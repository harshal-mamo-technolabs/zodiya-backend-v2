import { checkSchema } from "express-validator"
import { plan } from "./billingValidator.ts"
import { GENDERS } from "../models/User.ts"
import { UTM_FIELDS } from "../models/LandingPageHook.ts"

const text = {
    optional: true,
    isString: true,
    trim: true,
    isLength: { options: { max: 200 } },
}

/** A new visit: the campaign it came from, whichever of the three are given. */
export const hookCreateValidator = checkSchema(
    Object.fromEntries(UTM_FIELDS.map((f) => [f, text])),
    ["body"],
)

/** What a funnel step adds to its visit. Only these fields are ever written. */
export const hookUpdateValidator = checkSchema({
    uuid: { in: ["params"], isUUID: true },
    firstName: text,
    lastName: text,
    gender: { optional: true, isIn: { options: [GENDERS] } },
    birthDate: {
        optional: true,
        isDate: { options: { format: "YYYY-MM-DD", strictMode: true } },
    },
    birthTime: {
        optional: { options: { values: "null" } },
        matches: { options: /^([01]\d|2[0-3]):[0-5]\d$/ },
    },
    lat: {
        optional: true,
        isFloat: { options: { min: -90, max: 90 } },
        toFloat: true,
    },
    lon: {
        optional: true,
        isFloat: { options: { min: -180, max: 180 } },
        toFloat: true,
    },
    city: text,
    state: text,
    country: text,
    interests: { optional: true, isArray: { options: { max: 10 } } },
    "interests.*": { isString: true, isLength: { options: { max: 40 } } },
    isPaymentInitiated: {
        optional: true,
        isBoolean: { options: { strict: true } },
    },
    isPaymentCompleted: {
        optional: true,
        isBoolean: { options: { strict: true } },
    },
    plan: { optional: true, ...plan },
    trial: { optional: true, isBoolean: { options: { strict: true } } },
})
