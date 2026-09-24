import { checkSchema } from "express-validator"
import { SupportedLanguages } from "../constants/index.ts"

const languages = Object.values(SupportedLanguages)

export default checkSchema(
    {
        id: {
            in: ["params"],
            isMongoId: {
                errorMessage: "Profile id is not valid",
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
    ["params", "query"],
)
