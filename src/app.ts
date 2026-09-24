import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express"
import cookieParser from "cookie-parser"
import { type HttpError } from "http-errors"
import logger from "./config/logger.ts"
import authRouter from "./routes/authRouter.ts"
import profileRouter from "./routes/profileRouter.ts"
import placeRouter from "./routes/placeRouter.ts"
import sharedRouter from "./routes/shareRouter.ts"
import numerologyRouter from "./routes/numerologyRouter.ts"
import tarotRouter from "./routes/tarotRouter.ts"
import horoscopeRouter from "./routes/horoscopeRouter.ts"
import statsRouter from "./routes/statsRouter.ts"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Welcome to the API",
    })
})

app.use("/auth", authRouter)
app.use("/profiles", profileRouter)
app.use("/places", placeRouter)
app.use("/shared", sharedRouter)
app.use("/numerology", numerologyRouter)
app.use("/tarot", tarotRouter)
app.use("/horoscope", horoscopeRouter)
app.use("/stats", statsRouter)

app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    })
})

export default app
