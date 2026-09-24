import express from "express"
import PlaceController from "../controllers/PlaceController.ts"
import { GeoService } from "../services/GeoService.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import {
    placeDetailValidator,
    placeSearchValidator,
} from "../validators/placeValidator.ts"

const router = express.Router()

const geoService = new GeoService()
const placeController = new PlaceController(geoService, logger)

// authenticated: these spend our Google quota, so they are not open to the world
router.get(
    "/",
    authenticate,
    placeSearchValidator,
    placeController.search.bind(placeController),
)

router.get(
    "/:placeId",
    authenticate,
    placeDetailValidator,
    placeController.details.bind(placeController),
)

export default router
