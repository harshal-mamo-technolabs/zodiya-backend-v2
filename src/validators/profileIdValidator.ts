import { checkSchema } from "express-validator"

export default checkSchema({
    id: {
        in: ["params"],
        isMongoId: true,
        errorMessage: "Invalid profile id",
    },
})
