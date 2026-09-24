import express from "express"
import AuthController from "../controllers/AuthController.ts"
import { UserService } from "../services/UserService.ts"
import { TokenService } from "../services/TokenService.ts"
import { CredentialService } from "../services/CredentialService.ts"
import { UserModel } from "../models/User.ts"
import { RefreshTokenModel } from "../models/RefreshToken.ts"
import { ProfileModel } from "../models/Profile.ts"
import authenticate from "../middlewares/authenticate.ts"
import accountValidator from "../validators/accountValidator.ts"
import { rateLimit } from "express-rate-limit"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import registerValidator from "../validators/registerValidator.ts"
import loginValidator from "../validators/loginValidator.ts"

const router = express.Router()

// brute force is the only attack these two endpoints face; the suite runs
// hundreds of sign-ups from one address, so it is exempt
const credentials = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => config.NODE_ENV === "test",
    message: {
        errors: [{ msg: "Too many attempts. Try again in a few minutes." }],
    },
})

const userService = new UserService(UserModel, ProfileModel, RefreshTokenModel)
const tokenService = new TokenService(RefreshTokenModel)
const credentialService = new CredentialService()
const authController = new AuthController(
    userService,
    tokenService,
    credentialService,
    logger,
)

router.post(
    "/register",
    credentials,
    registerValidator,
    authController.register.bind(authController),
)

router.post(
    "/login",
    credentials,
    loginValidator,
    authController.login.bind(authController),
)

router.post("/refresh", authController.refresh.bind(authController))

router.post("/logout", authController.logout.bind(authController))

router.get("/me", authenticate, authController.me.bind(authController))

router.patch(
    "/me",
    authenticate,
    accountValidator,
    authController.update.bind(authController),
)

router.delete("/me", authenticate, authController.remove.bind(authController))

export default router
