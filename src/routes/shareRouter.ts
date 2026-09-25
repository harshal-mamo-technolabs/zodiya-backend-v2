import express from "express"
import ShareController from "../controllers/ShareController.ts"
import { ProfileService } from "../services/ProfileService.ts"
import { GeoService } from "../services/GeoService.ts"
import { ChartService } from "../services/ChartService.ts"
import { ReadingService } from "../services/ReadingService.ts"
import { db } from "../config/db.ts"
import logger from "../config/logger.ts"

const profileService = new ProfileService(
    db,
    new GeoService(),
    new ChartService(),
    new ReadingService(),
)
const shareController = new ShareController(profileService, logger)

/** Public — the token in the path is the only credential. */
const publicRouter = express.Router()
publicRouter.get("/:token", shareController.read.bind(shareController))

export default publicRouter
