import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { config } from "./index.ts"
import { users } from "../models/User.ts"
import { profiles } from "../models/Profile.ts"
import { refreshTokens } from "../models/RefreshToken.ts"

// the pool connects lazily, so importing this never touches the network
export const pool = mysql.createPool({
    uri: config.DATABASE_URL,
    // DATETIME columns hold UTC
    timezone: "Z",
})

export const db = drizzle(pool, {
    schema: { users, profiles, refreshTokens },
    mode: "default",
})

export type Db = typeof db

/** Fails fast at boot when the database is unreachable. */
export const connectDB = async () => {
    const connection = await pool.getConnection()
    connection.release()
}

export const disconnectDB = async () => {
    await pool.end()
}
