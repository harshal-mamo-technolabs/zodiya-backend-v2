import { checkSchema } from "express-validator"
import { SupportedLanguages, TarotSpreads } from "../constants/index.ts"

const languages = Object.values(SupportedLanguages)
const spreads = Object.values(TarotSpreads)

export default checkSchema(
    {
        spread: {
            in: ["body"],
            isIn: {
                options: [spreads],
                errorMessage: `Spread should be one of: ${spreads.join(", ")}`,
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
