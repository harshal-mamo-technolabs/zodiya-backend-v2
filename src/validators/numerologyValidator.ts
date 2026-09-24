import { checkSchema } from "express-validator"
import { SupportedLanguages } from "../constants/index.ts"

const languages = Object.values(SupportedLanguages)

export default checkSchema(
    {
        name: {
            in: ["body"],
            trim: true,
            isLength: {
                options: { min: 1, max: 120 },
                errorMessage: "Name is required",
            },
            matches: {
                options: /[A-Za-z]/,
                errorMessage: "Name must contain at least one letter A to Z",
            },
        },
        birthDate: {
            in: ["body"],
            trim: true,
            isDate: {
                options: { format: "YYYY-MM-DD", strictMode: true },
                errorMessage: "Birth date should be in YYYY-MM-DD format",
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
    ["body", "query"],
)
