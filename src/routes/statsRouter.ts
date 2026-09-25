import express from "express"
import { count } from "drizzle-orm"
import { db } from "../config/db.ts"
import { profiles } from "../models/Profile.ts"

const router = express.Router()

// public: the landing page quotes a real number, not a made-up one
router.get("/", async (_req, res, next) => {
    try {
        const [row] = await db.select({ charts: count() }).from(profiles)
        res.status(200).json({ charts: row?.charts ?? 0 })
    } catch (e) {
        next(e)
    }
})

export default router
