import express, { type NextFunction, type Response } from "express"
import { ipKeyGenerator, rateLimit } from "express-rate-limit"
import multer from "multer"
import createHttpError from "http-errors"
import PalmController from "../controllers/PalmController.ts"
import { PalmReportService } from "../services/PalmReportService.ts"
import { PalmImageService } from "../services/PalmImageService.ts"
import { StorageService } from "../services/StorageService.ts"
import { ProfileService } from "../services/ProfileService.ts"
import { GeoService } from "../services/GeoService.ts"
import { ChartService } from "../services/ChartService.ts"
import { ReadingService } from "../services/ReadingService.ts"
import { ProfileModel } from "../models/Profile.ts"
import { PalmReadingModel } from "../models/PalmReading.ts"
import { UserModel } from "../models/User.ts"
import { BillingGrantModel } from "../models/BillingGrant.ts"
import { BillingService } from "../services/BillingService.ts"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"
import authenticate from "../middlewares/authenticate.ts"
import requirePlan from "../middlewares/requirePlan.ts"
import {
    palmIdValidator,
    palmListValidator,
    palmReadValidator,
} from "../validators/palmValidator.ts"
import type { AuthRequest } from "../types/index.ts"

const controller = new PalmController(
    new PalmReportService(),
    new PalmImageService(),
    new StorageService(),
    new ProfileService(
        ProfileModel,
        new GeoService(),
        new ChartService(),
        new ReadingService(),
    ),
    PalmReadingModel,
    new BillingService(UserModel, ProfileModel, BillingGrantModel),
    logger,
)

// every reading costs an OpenAI vision call
const readings = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) =>
        (req as AuthRequest).auth?.sub ?? ipKeyGenerator(req.ip ?? ""),
    skip: () => config.NODE_ENV === "test",
    message: {
        errors: [{ msg: "Too many palm readings. Try again in an hour." }],
    },
})

// drawing the lines is a second, pricier image call, so it has its own allowance
const highlights = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) =>
        (req as AuthRequest).auth?.sub ?? ipKeyGenerator(req.ip ?? ""),
    skip: () => config.NODE_ENV === "test",
    message: {
        errors: [{ msg: "Too many palm drawings. Try again in an hour." }],
    },
})

// rendering a PDF is CPU work, so keep it to a sane number per hour
const pdfs = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) =>
        (req as AuthRequest).auth?.sub ?? ipKeyGenerator(req.ip ?? ""),
    skip: () => config.NODE_ENV === "test",
    message: {
        errors: [{ msg: "Too many PDF downloads. Try again in an hour." }],
    },
})

const unsupported = () =>
    createHttpError(415, "Please upload a JPEG, PNG or WEBP photo.", {
        code: "unsupported_format",
    })

/** The file's own first bytes, so a renamed file cannot pass as an image. */
function isImage(buffer: Buffer, mimetype: string): boolean {
    switch (mimetype) {
        case "image/jpeg":
            return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
        case "image/png":
            return buffer
                .subarray(0, 8)
                .equals(
                    Buffer.from([
                        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
                    ]),
                )
        case "image/webp":
            return (
                buffer.toString("latin1", 0, 4) === "RIFF" &&
                buffer.toString("latin1", 8, 12) === "WEBP"
            )
        default:
            return false
    }
}

// in memory only: the photo is never written to disk
const photo = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
}).single("photo")

function upload(req: AuthRequest, res: Response, next: NextFunction) {
    photo(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            next(
                err.code === "LIMIT_FILE_SIZE"
                    ? createHttpError(
                          413,
                          "The photo is too large. The limit is 10 MB.",
                          { code: "too_large" },
                      )
                    : createHttpError(
                          400,
                          "Send one photo in the photo field.",
                      ),
            )
            return
        }
        if (err) {
            next(err)
            return
        }
        // a missing photo is the controller's 400
        next(
            !req.file || isImage(req.file.buffer, req.file.mimetype)
                ? undefined
                : unsupported(),
        )
    })
}

const router = express.Router()

router.post(
    "/read",
    authenticate,
    requirePlan,
    readings,
    upload,
    palmReadValidator,
    controller.read.bind(controller),
)

router.post(
    "/readings/:id/highlight",
    authenticate,
    requirePlan,
    highlights,
    palmIdValidator,
    controller.highlight.bind(controller),
)

router.get(
    "/readings",
    authenticate,
    requirePlan,
    palmListValidator,
    controller.list.bind(controller),
)

router.get(
    "/readings/:id",
    authenticate,
    requirePlan,
    palmIdValidator,
    controller.get.bind(controller),
)

router.get(
    "/readings/:id/pdf",
    authenticate,
    requirePlan,
    pdfs,
    palmIdValidator,
    controller.pdf.bind(controller),
)

router.delete(
    "/readings/:id",
    authenticate,
    requirePlan,
    palmIdValidator,
    controller.remove.bind(controller),
)

export default router
