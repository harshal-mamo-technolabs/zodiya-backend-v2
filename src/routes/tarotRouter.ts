import express from "express"
import TarotController from "../controllers/TarotController.ts"
import { TarotService } from "../services/TarotService.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import requirePlan from "../middlewares/requirePlan.ts"
import tarotValidator from "../validators/tarotValidator.ts"

const router = express.Router()

const controller = new TarotController(new TarotService(), logger)

// POST: a draw is an event, not a lookup, and it must not be cached
router.post(
    "/draw",
    authenticate,
    requirePlan,
    tarotValidator,
    controller.draw.bind(controller),
)

export default router
