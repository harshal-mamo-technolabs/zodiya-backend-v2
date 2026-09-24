import express from "express"
import HoroscopeController from "../controllers/HoroscopeController.ts"
import { HoroscopeService } from "../services/HoroscopeService.ts"
import { HoroscopeReadingService } from "../services/HoroscopeReadingService.ts"
import { ChartService } from "../services/ChartService.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import horoscopeValidator from "../validators/horoscopeValidator.ts"

const router = express.Router()

const chartService = new ChartService()
const controller = new HoroscopeController(
    new HoroscopeService(chartService),
    new HoroscopeReadingService(chartService),
    logger,
)

router.get(
    "/",
    authenticate,
    horoscopeValidator,
    controller.read.bind(controller),
)

export default router
