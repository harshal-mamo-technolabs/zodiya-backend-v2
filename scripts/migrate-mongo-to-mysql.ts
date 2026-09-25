/* eslint-disable no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions -- one-off CLI over untyped mongo documents */
/**
 * Copies users, profiles and refresh tokens from MongoDB into MySQL.
 *
 *   MONGO_URI=... DATABASE_URL=mysql://... npm run db:migrate-from-mongo
 *
 * Both URLs are read from .env.<NODE_ENV> (development by default) when not
 * set. MONGO_DB picks the database; otherwise the one in MONGO_URI, else
 * "test" (mongoose's default). Applies scripts/sql/01_schema.sql first and
 * upserts by id, so it is safe to run again.
 */
import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { config as dotenvConfig } from "dotenv"
import { MongoClient, type Document } from "mongodb"
import mysql from "mysql2/promise"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenvConfig({
    quiet: true,
    path: path.join(root, `.env.${process.env.NODE_ENV ?? "development"}`),
})

const { MONGO_URI, DATABASE_URL } = process.env
if (!MONGO_URI || !DATABASE_URL) {
    throw new Error("MONGO_URI and DATABASE_URL must both be set")
}

const id = (value: unknown) => String(value)
const trim = (value: unknown) =>
    typeof value === "string" ? value.trim() : null
const date = (value: unknown) =>
    value instanceof Date
        ? value
        : new Date(typeof value === "string" ? value : Date.now())

const mongo = await MongoClient.connect(MONGO_URI)
const source = mongo.db(
    process.env.MONGO_DB ?? (mongo.db().databaseName || "test"),
)
const sql = await mysql.createConnection({
    uri: DATABASE_URL,
    timezone: "Z",
    multipleStatements: true,
})

try {
    await sql.query(
        await readFile(path.join(root, "scripts/sql/01_schema.sql"), "utf8"),
    )

    const all = (name: string) => source.collection(name).find().toArray()
    const [users, profiles, tokens] = await Promise.all([
        all("users"),
        all("profiles"),
        all("refreshtokens"),
    ])
    const userIds = new Set(users.map((u) => id(u._id)))
    // rows whose owner is gone were unreachable in mongo; the FK would reject them
    const owned = (doc: Document) => userIds.has(id(doc.user))

    const upsert = async (table: string, rows: Record<string, unknown>[]) => {
        const first = rows[0]
        if (!first) {
            return
        }
        const columns = Object.keys(first)
        await sql.query(
            `INSERT INTO ${table} (${columns.join(", ")}) VALUES ? ` +
                `ON DUPLICATE KEY UPDATE ${columns.map((c) => `${c} = VALUES(${c})`).join(", ")}`,
            [rows.map((row) => columns.map((c) => row[c]))],
        )
    }

    await sql.beginTransaction()

    await upsert(
        "users",
        users.map((u) => ({
            id: id(u._id),
            first_name: trim(u.firstName),
            last_name: trim(u.lastName),
            email: trim(u.email)?.toLowerCase(),
            password: u.password,
            role: u.role ?? "customer",
            notifications: JSON.stringify({
                daily: true,
                transits: true,
                retro: false,
                deliveryTime: "07:30",
                ...u.notifications,
            }),
            created_at: date(u.createdAt),
            updated_at: date(u.updatedAt),
        })),
    )

    const keptProfiles = profiles.filter(owned)
    await upsert(
        "profiles",
        keptProfiles.map((p) => ({
            id: id(p._id),
            user_id: id(p.user),
            first_name: trim(p.firstName),
            last_name: trim(p.lastName),
            birth_name: trim(p.birthName),
            avatar: p.avatar ?? null,
            birth_date: p.birthDate,
            birth_time: p.birthTime,
            city: trim(p.city),
            state: trim(p.state),
            country: trim(p.country),
            lat: p.lat,
            lon: p.lon,
            tzone: p.tzone,
            timezone_id: p.timezoneId,
            zodiac_sign: p.zodiacSign,
            relationship: p.relationship ?? "self",
            is_primary: Boolean(p.isPrimary),
            share_token: p.shareToken ?? null,
            created_at: date(p.createdAt),
            updated_at: date(p.updatedAt),
        })),
    )

    const now = Date.now()
    const keptTokens = tokens.filter(
        (t) => owned(t) && date(t.expiresAt).getTime() > now,
    )
    await upsert(
        "refresh_tokens",
        keptTokens.map((t) => ({
            id: id(t._id),
            user_id: id(t.user),
            expires_at: date(t.expiresAt),
            created_at: date(t.createdAt),
            updated_at: date(t.updatedAt),
        })),
    )

    await sql.commit()

    console.log(`source: mongo database "${source.databaseName}"`)
    console.log(`users:          ${users.length} migrated`)
    console.log(
        `profiles:       ${keptProfiles.length} migrated, ${profiles.length - keptProfiles.length} skipped (no owner)`,
    )
    console.log(
        `refresh_tokens: ${keptTokens.length} migrated, ${tokens.length - keptTokens.length} skipped (expired or no owner)`,
    )
} catch (err) {
    await sql.rollback().catch(() => undefined)
    throw err
} finally {
    await sql.end()
    await mongo.close()
}
