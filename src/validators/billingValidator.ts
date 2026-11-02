import { checkSchema } from "express-validator"
import { BillingKinds } from "../constants/index.ts"
import { catalog } from "../services/CatalogService.ts"

/** Passes when `value` is one of `ids`, which are read from the catalog. */
const oneOf = (what: string, ids: () => Promise<string[]>) => ({
    custom: {
        options: async (value: unknown) => {
            const all = await ids()
            if (!all.includes(value as string)) {
                throw new Error(`${what} should be one of: ${all.join(", ")}`)
            }
            return true
        },
    },
})

/** A plan on sale; the funnel checks its plan the same way. */
export const plan = oneOf("Plan", async () =>
    (await catalog.plans()).map((p) => p.tier),
)

export const subscribeValidator = checkSchema(
    {
        plan,
        trial: { optional: true, isBoolean: { options: { strict: true } } },
    },
    ["body"],
)

export const changePlanValidator = checkSchema({ plan }, ["body"])

const packValidator = (ids: () => Promise<{ packId: string }[]>) =>
    checkSchema(
        {
            pack: oneOf("Pack", async () => (await ids()).map((p) => p.packId)),
            quantity: {
                optional: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: "Quantity should be a whole number from 1",
                },
                toInt: true,
                custom: {
                    options: async (value: number) => {
                        const max = (await catalog.settings()).maxPackQuantity
                        if (value > max) {
                            throw new Error(
                                `Quantity should be 1 to ${String(max)}`,
                            )
                        }
                        return true
                    },
                },
            },
        },
        ["body"],
    )

export const minutesValidator = packValidator(() => catalog.minutePacks())

export const palmValidator = packValidator(() => catalog.palmPacks())

export const profilePackValidator = checkSchema(
    {
        pack: oneOf("Pack", async () =>
            (await catalog.profilePacks()).map((p) => p.packId),
        ),
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

// Stripe holds a metadata value up to 500 characters
export const cancelPlanValidator = checkSchema(
    {
        reason: {
            isString: { errorMessage: "Tell us why you are cancelling" },
            trim: true,
            isLength: {
                options: { min: 1, max: 500 },
                errorMessage: "The reason should be 1 to 500 characters",
            },
        },
        stayIfOffered: {
            optional: true,
            isArray: { errorMessage: "stayIfOffered should be a list" },
            custom: {
                options: (value: unknown[]) => {
                    if (
                        !value.every((v) => typeof v === "string" && v.trim())
                    ) {
                        throw new Error("stayIfOffered should list text only")
                    }
                    if (value.join(", ").length > 500) {
                        throw new Error("stayIfOffered is too long")
                    }
                    return true
                },
            },
        },
    },
    ["body"],
)
