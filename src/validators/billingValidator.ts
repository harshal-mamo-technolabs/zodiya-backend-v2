import { checkSchema } from "express-validator"
import {
    BillingKinds,
    MAX_PACK_QUANTITY,
    MINUTE_PACK_IDS,
    PLAN_TIERS,
} from "../constants/billing.ts"

const plan = {
    isIn: {
        options: [PLAN_TIERS],
        errorMessage: `Plan should be one of: ${PLAN_TIERS.join(", ")}`,
    },
}

export const subscribeValidator = checkSchema(
    {
        plan,
        trial: { optional: true, isBoolean: { options: { strict: true } } },
    },
    ["body"],
)

export const changePlanValidator = checkSchema({ plan }, ["body"])

export const minutesValidator = checkSchema(
    {
        pack: {
            isIn: {
                options: [MINUTE_PACK_IDS],
                errorMessage: `Pack should be one of: ${MINUTE_PACK_IDS.join(", ")}`,
            },
        },
        quantity: {
            optional: true,
            isInt: {
                options: { min: 1, max: MAX_PACK_QUANTITY },
                errorMessage: `Quantity should be 1 to ${String(MAX_PACK_QUANTITY)}`,
            },
            toInt: true,
        },
    },
    ["body"],
)

export const payOpenValidator = checkSchema(
    {
        kind: {
            isIn: {
                options: [[BillingKinds.PLAN, BillingKinds.PROFILES]],
                errorMessage: "Kind should be plan or profiles",
            },
        },
    },
    ["body"],
)

export const saveCardValidator = checkSchema(
    {
        setupIntentId: {
            isString: true,
            matches: { options: /^seti_[A-Za-z0-9]+$/ },
            errorMessage: "Setup intent id is not valid",
        },
    },
    ["body"],
)

export const syncValidator = checkSchema(
    {
        paymentIntentId: {
            optional: true,
            isString: true,
            matches: { options: /^pi_[A-Za-z0-9]+$/ },
            errorMessage: "Payment intent id is not valid",
        },
    },
    ["body"],
)
