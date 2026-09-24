import { checkSchema } from "express-validator"
import {
    HoroscopePeriods,
    SupportedLanguages,
    ZodiacSigns,
} from "../constants/index.ts"

const languages = Object.values(SupportedLanguages)
const signs = Object.values(ZodiacSigns)
const periods = Object.values(HoroscopePeriods)

export default checkSchema(
    {
        sign: {
            in: ["query"],
            trim: true,
            toLowerCase: true,
            isIn: {
                options: [signs],
                errorMessage: `Sign should be one of: ${signs.join(", ")}`,
            },
        },
        period: {
            in: ["query"],
            optional: true,
            trim: true,
            toLowerCase: true,
            isIn: {
                options: [periods],
                errorMessage: `Period should be one of: ${periods.join(", ")}`,
            },
        },
        date: {
            in: ["query"],
            optional: true,
            trim: true,
            isDate: {
                options: { format: "YYYY-MM-DD", strictMode: true },
                errorMessage: "Date should be in YYYY-MM-DD format",
            },
        },
        tz: {
            in: ["query"],
            optional: true,
            trim: true,
            custom: {
                options: (value: string) => {
                    try {
                        new Intl.DateTimeFormat("en-US", { timeZone: value })
                        return true
                    } catch {
                        throw new Error("Time zone is not recognised")
                    }
                },
            },
        },
        lang: {
            in: ["query"],
            optional: true,
            trim: true,
            toLowerCase: true,
            isIn: {
                options: [languages],
                errorMessage: `Language should be one of: ${languages.join(", ")}`,
            },
        },
    },
    ["query"],
)
