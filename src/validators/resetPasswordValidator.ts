import { checkSchema } from "express-validator"

export default checkSchema(
    {
        token: {
            isString: true,
            isHexadecimal: true,
            isLength: { options: { max: 128 } },
        },
        password: {
            trim: true,
            errorMessage: "Password is required!",
            notEmpty: true,
            isLength: {
                options: { min: 8 },
                errorMessage: "Password length should be at least 8 chars!",
            },
        },
    },
    ["body"],
)
