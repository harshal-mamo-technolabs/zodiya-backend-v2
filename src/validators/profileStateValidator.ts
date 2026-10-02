import { checkSchema } from "express-validator"

export default checkSchema({
    id: {
        in: ["params"],
        isMongoId: true,
        errorMessage: "Invalid profile id",
    },
    disabled: {
        in: ["body"],
        isBoolean: { options: { strict: true } },
        errorMessage: "disabled should be true or false",
    },
})
