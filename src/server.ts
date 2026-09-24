import app from "./app.ts"
import { config } from "./config/index.ts"
import logger from "./config/logger.ts"
import { connectDB } from "./config/db.ts"

const startServer = async () => {
    try {
        await connectDB()
        logger.info("Database connected successfully")

        app.listen(config.PORT, () => {
            logger.info(
                `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`,
            )
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message)
            setTimeout(() => {
                process.exit(1)
            }, 1000)
        }
    }
}

void startServer()
