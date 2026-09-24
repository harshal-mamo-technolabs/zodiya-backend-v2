import express from "express"
import { ProfileModel } from "../models/Profile.ts"

const router = express.Router()

// public: the landing page quotes a real number, not a made-up one
router.get("/", async (_req, res, next) => {
    try {
        res.status(200).json({ charts: await ProfileModel.countDocuments() })
    } catch (e) {
        next(e)
    }
})

export default router
