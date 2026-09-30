import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express"
import cookieParser from "cookie-parser"
import { type HttpError } from "http-errors"
import { config } from "./config/index.ts"
import logger from "./config/logger.ts"
import authRouter from "./routes/authRouter.ts"
import profileRouter from "./routes/profileRouter.ts"
import placeRouter from "./routes/placeRouter.ts"
import sharedRouter from "./routes/shareRouter.ts"
import numerologyRouter from "./routes/numerologyRouter.ts"
import tarotRouter from "./routes/tarotRouter.ts"
import horoscopeRouter from "./routes/horoscopeRouter.ts"
import statsRouter from "./routes/statsRouter.ts"
import astrologerRouter from "./routes/astrologerRouter.ts"

const app = express()
app.use((req, res, next) => {
    const origin = req.headers.origin
    if (origin && config.CORS_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin)
        res.setHeader("Access-Control-Allow-Credentials", "true")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        )
        res.setHeader("Vary", "Origin")
    }
    if (req.method === "OPTIONS") {
        res.sendStatus(204)
        return
    }
    next()
})
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
app.use("/astrologer", astrologerRouter)

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
