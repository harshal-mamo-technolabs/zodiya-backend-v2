import express from "express"
import NumerologyController from "../controllers/NumerologyController.ts"
import { NumerologyService } from "../services/NumerologyService.ts"
import { NumerologyReadingService } from "../services/NumerologyReadingService.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import numerologyValidator from "../validators/numerologyValidator.ts"

const router = express.Router()

const controller = new NumerologyController(
    new NumerologyService(),
    new NumerologyReadingService(),
    logger,
)

// POST rather than GET: the birth name should not sit in a URL or an access log
router.post(
    "/",
    authenticate,
    numerologyValidator,
    controller.compute.bind(controller),
)

export default router
