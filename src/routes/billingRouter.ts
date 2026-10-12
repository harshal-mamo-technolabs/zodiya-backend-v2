import express from "express"
import BillingController from "../controllers/BillingController.ts"
import { BillingService } from "../services/BillingService.ts"
import { UserModel } from "../models/User.ts"
import { ProfileModel } from "../models/Profile.ts"
import { BillingGrantModel } from "../models/BillingGrant.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import requirePlan, { requirePayments } from "../middlewares/requirePlan.ts"
import {
    changePlanValidator,
    minutesValidator,
    payOpenValidator,
    profilePackValidator,
    saveCardValidator,
    subscribeValidator,
    syncValidator,
} from "../validators/billingValidator.ts"

const billingService = new BillingService(
    UserModel,
    ProfileModel,
    BillingGrantModel,
)
const controller = new BillingController(billingService, logger)

const router = express.Router()

// app.ts hands this one the raw body, which the signature is computed over
router.post("/webhook", controller.webhook.bind(controller))

router.get("/catalog", controller.catalog.bind(controller))
router.get("/status", authenticate, controller.status.bind(controller))
router.post(
    "/sync",
    authenticate,
    syncValidator,
    controller.sync.bind(controller),
)

// what someone without a plan may do: start one, fix a failed payment, see receipts
router.post(
    "/subscribe",
    authenticate,
    requirePayments,
    subscribeValidator,
    controller.subscribe.bind(controller),
)
router.post(
    "/pay-open",
    authenticate,
    requirePayments,
    payOpenValidator,
    controller.payOpen.bind(controller),
)
router.get("/card", authenticate, controller.card.bind(controller))
router.post(
    "/card",
    authenticate,
    requirePayments,
    controller.cardSetup.bind(controller),
)
router.put(
    "/card",
    authenticate,
    requirePayments,
    saveCardValidator,
    controller.saveCard.bind(controller),
)
router.get("/receipts", authenticate, controller.receipts.bind(controller))

router.post(
    "/plan/change",
    authenticate,
    requirePayments,
    requirePlan,
    changePlanValidator,
    controller.changePlan.bind(controller),
)
router.post(
    "/plan/cancel",
    authenticate,
    requirePayments,
    requirePlan,
    controller.cancel.bind(controller),
)
router.post(
    "/plan/resume",
    authenticate,
    requirePayments,
    requirePlan,
    controller.resume.bind(controller),
)
router.post(
    "/profiles",
    authenticate,
    requirePayments,
    requirePlan,
    profilePackValidator,
    controller.chooseProfilePack.bind(controller),
)
router.post(
    "/minutes",
    authenticate,
    requirePayments,
    requirePlan,
    minutesValidator,
    controller.buyMinutes.bind(controller),
)

export default router
