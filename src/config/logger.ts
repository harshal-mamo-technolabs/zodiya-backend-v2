import winston from "winston"
import { config } from "./index.ts"

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
)

const logger = winston.createLogger({
    level: config.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta: {
        service: "zodiya-backend",
        env: config.NODE_ENV,
    },
    silent: config.NODE_ENV === "test",
    transports: [
        new winston.transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            format: fileFormat,
        }),
        new winston.transports.File({
            level: "info",
            dirname: "logs",
            filename: "combined.log",
            format: fileFormat,
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    ],
})

export default logger
