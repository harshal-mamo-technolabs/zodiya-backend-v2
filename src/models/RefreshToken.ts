import { char, datetime, mysqlTable } from "drizzle-orm/mysql-core"
import { objectId } from "../utils/index.ts"
import { users } from "./User.ts"

// expired rows are purged by a MySQL event (scripts/sql/01_schema.sql)
export const refreshTokens = mysqlTable("refresh_tokens", {
    _id: char("id", { length: 24 }).primaryKey().$defaultFn(objectId),
    user: char("user_id", { length: 24 })
        .notNull()
        .references(() => users._id, { onDelete: "cascade" }),
    expiresAt: datetime("expires_at", { mode: "date", fsp: 3 }).notNull(),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
})

export type RefreshToken = typeof refreshTokens.$inferSelect
