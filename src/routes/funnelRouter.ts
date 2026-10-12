import express from "express"
import { rateLimit } from "express-rate-limit"
import FunnelController from "../controllers/FunnelController.ts"
import PlaceController from "../controllers/PlaceController.ts"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import { UserModel } from "../models/User.ts"
import { ProfileModel } from "../models/Profile.ts"
import { RefreshTokenModel } from "../models/RefreshToken.ts"
import { UserService } from "../services/UserService.ts"
import { StorageService } from "../services/StorageService.ts"
import { PalmReadingModel } from "../models/PalmReading.ts"
import { TokenService } from "../services/TokenService.ts"
import { ProfileService } from "../services/ProfileService.ts"
import { GeoService } from "../services/GeoService.ts"
import { ChartService } from "../services/ChartService.ts"
import { ReadingService } from "../services/ReadingService.ts"
import {
    hookCreateValidator,
    hookUpdateValidator,
} from "../validators/funnelHookValidator.ts"
import funnelSignupValidator from "../validators/funnelSignupValidator.ts"
import {
    placeDetailValidator,
    placeSearchValidator,
} from "../validators/placeValidator.ts"

const limited = (windowMs: number, limit: number) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        skip: () => config.NODE_ENV === "test",
        message: {
            errors: [{ msg: "Too many requests. Try again in a few minutes." }],
        },
    })

const geoService = new GeoService()
const placeController = new PlaceController(geoService, logger)
const funnelController = new FunnelController(
    new UserService(
        UserModel,
        ProfileModel,
        RefreshTokenModel,
        PalmReadingModel,
        new StorageService(),
    ),
    new ProfileService(
        ProfileModel,
        geoService,
        new ChartService(),
        new ReadingService(),
    ),
    new TokenService(RefreshTokenModel),
    logger,
)

const router = express.Router()

// visitors have no account yet, so the city search is public here; the limit
// is what keeps it from being a free Google Places proxy
router.get(
    "/places",
    limited(15 * 60 * 1000, 150),
    placeSearchValidator,
    placeController.search.bind(placeController),
)
router.get(
    "/places/:placeId",
    limited(15 * 60 * 1000, 60),
    placeDetailValidator,
    placeController.details.bind(placeController),
)

// every visit to the funnel and how far it got (public: visitors have no account)
router.post(
    "/hook",
    limited(15 * 60 * 1000, 30),
    hookCreateValidator,
    funnelController.createHook.bind(funnelController),
)
router.patch(
    "/hook/:uuid",
    limited(15 * 60 * 1000, 200),
    hookUpdateValidator,
    funnelController.updateHook.bind(funnelController),
)

router.post(
    "/signup",
    limited(60 * 60 * 1000, 10),
    funnelSignupValidator,
    funnelController.signup.bind(funnelController),
)

router.post(
    "/handoff",
    authenticate,
    funnelController.handoff.bind(funnelController),
)

export default router
