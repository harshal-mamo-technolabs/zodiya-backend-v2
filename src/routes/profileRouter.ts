import express from "express"
import ProfileController from "../controllers/ProfileController.ts"
import { ProfileService } from "../services/ProfileService.ts"
import { GeoService } from "../services/GeoService.ts"
import { ChartService } from "../services/ChartService.ts"
import { ReadingService } from "../services/ReadingService.ts"
import { db } from "../config/db.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import createProfileValidator from "../validators/createProfileValidator.ts"
import profileIdValidator from "../validators/profileIdValidator.ts"
import chartValidator from "../validators/chartValidator.ts"
import patchProfileValidator from "../validators/patchProfileValidator.ts"
import ShareController from "../controllers/ShareController.ts"
import TransitController from "../controllers/TransitController.ts"
import { TransitService } from "../services/TransitService.ts"
import { TransitReadingService } from "../services/TransitReadingService.ts"
import SynastryController from "../controllers/SynastryController.ts"
import { SynastryService } from "../services/SynastryService.ts"
import { SynastryReadingService } from "../services/SynastryReadingService.ts"
import synastryValidator from "../validators/synastryValidator.ts"

const router = express.Router()

const geoService = new GeoService()
const chartService = new ChartService()
const readingService = new ReadingService()
const profileService = new ProfileService(
    db,
    geoService,
    chartService,
    readingService,
)
const profileController = new ProfileController(profileService, logger)
const shareController = new ShareController(profileService, logger)
const transitService = new TransitService(chartService)
const synastryController = new SynastryController(
    profileService,
    new SynastryService(chartService),
    new SynastryReadingService(chartService),
    logger,
)
const transitController = new TransitController(
    profileService,
    transitService,
    new TransitReadingService(chartService, transitService),
    logger,
)

router.post(
    "/",
    authenticate,
    createProfileValidator,
    profileController.create.bind(profileController),
)

router.get("/", authenticate, profileController.getAll.bind(profileController))

router.get(
    "/:id",
    authenticate,
    profileIdValidator,
    profileController.getOne.bind(profileController),
)

router.patch(
    "/:id",
    authenticate,
    patchProfileValidator,
    profileController.update.bind(profileController),
)

router.delete(
    "/:id",
    authenticate,
    profileIdValidator,
    profileController.remove.bind(profileController),
)

router.get(
    "/:id/chart",
    authenticate,
    chartValidator,
    profileController.getChart.bind(profileController),
)

router.get(
    "/:id/transits",
    authenticate,
    chartValidator,
    transitController.read.bind(transitController),
)

router.get(
    "/:id/synastry/:otherId",
    authenticate,
    synastryValidator,
    synastryController.read.bind(synastryController),
)

router.post(
    "/:id/share",
    authenticate,
    profileIdValidator,
    shareController.create.bind(shareController),
)

router.delete(
    "/:id/share",
    authenticate,
    profileIdValidator,
    shareController.revoke.bind(shareController),
)

export default router
