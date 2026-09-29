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
import requirePlan from "../middlewares/requirePlan.ts"
import {
    previewValidator,
    sessionIdValidator,
    sessionValidator,
} from "../validators/astrologerValidator.ts"
import { AstrologerUsageService } from "../services/AstrologerUsageService.ts"
import { BillingService } from "../services/BillingService.ts"
import { AstrologerSessionModel } from "../models/AstrologerSession.ts"
import { BillingGrantModel } from "../models/BillingGrant.ts"
import { UserModel } from "../models/User.ts"

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
const elevenLabs = new ElevenLabsService()
const controller = new AstrologerController(
    profileService,
    elevenLabs,
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
    new AstrologerUsageService(
        AstrologerSessionModel,
        UserModel,
        elevenLabs,
        new BillingService(UserModel, ProfileModel, BillingGrantModel),
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
    requirePlan,
    previewValidator,
    controller.preview.bind(controller),
)

router.post(
    "/session",
    authenticate,
    requirePlan,
    sessions,
    sessionValidator,
    controller.session.bind(controller),
)

// no requirePlan: a call that ended as the plan lapsed must still be charged
router.post(
    "/session/:id/end",
    authenticate,
    sessionIdValidator,
    controller.end.bind(controller),
)

export default router
