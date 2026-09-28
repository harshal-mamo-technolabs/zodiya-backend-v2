import express from "express"
import { rateLimit } from "express-rate-limit"
import AstrologerController from "../controllers/AstrologerController.ts"
import { ProfileService } from "../services/ProfileService.ts"
import { GeoService } from "../services/GeoService.ts"
import { ChartService } from "../services/ChartService.ts"
import { ReadingService } from "../services/ReadingService.ts"
import { TransitService } from "../services/TransitService.ts"
import { TransitReadingService } from "../services/TransitReadingService.ts"
import { HoroscopeService } from "../services/HoroscopeService.ts"
import { HoroscopeReadingService } from "../services/HoroscopeReadingService.ts"
import { NumerologyService } from "../services/NumerologyService.ts"
import { NumerologyReadingService } from "../services/NumerologyReadingService.ts"
import { ElevenLabsService } from "../services/ElevenLabsService.ts"
import { AstrologerContextService } from "../services/AstrologerContextService.ts"
import { ProfileModel } from "../models/Profile.ts"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import {
    previewValidator,
    sessionValidator,
} from "../validators/astrologerValidator.ts"

const router = express.Router()

const chartService = new ChartService()
const readingService = new ReadingService()
const profileService = new ProfileService(
    ProfileModel,
    new GeoService(),
    chartService,
    readingService,
)
const transitService = new TransitService(chartService)
const controller = new AstrologerController(
    profileService,
    new ElevenLabsService(),
    new AstrologerContextService(
        profileService,
        readingService,
        transitService,
        new TransitReadingService(chartService, transitService),
        new HoroscopeService(chartService),
        new HoroscopeReadingService(chartService),
        new NumerologyService(),
        new NumerologyReadingService(),
    ),
    logger,
)

// every session spends ElevenLabs minutes, so a runaway client cannot loop on it
const sessions = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => config.NODE_ENV === "test",
    message: {
        errors: [
            { msg: "Too many conversations. Try again in a few minutes." },
        ],
    },
})

router.get(
    "/characters/:id/preview",
    authenticate,
    previewValidator,
    controller.preview.bind(controller),
)

router.post(
    "/session",
    authenticate,
    sessions,
    sessionValidator,
    controller.session.bind(controller),
)

export default router
