import {
    char,
    datetime,
    json,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core"
import { type Role, Roles } from "../constants/index.ts"
import type { NotificationPrefs } from "../types/index.ts"
import { objectId } from "../utils/index.ts"

// the id column surfaces as `_id` so API payloads keep the shape the client knows
export const users = mysqlTable("users", {
    _id: char("id", { length: 24 }).primaryKey().$defaultFn(objectId),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 })
        .$type<Role>()
        .notNull()
        .default(Roles.CUSTOMER),
    // what the account has asked to be sent, once sending exists; HH:mm local
    notifications: json("notifications")
        .$type<NotificationPrefs>()
        .notNull()
        .$defaultFn(() => ({
            daily: true,
            transits: true,
            retro: false,
            deliveryTime: "07:30",
        })),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
})

export type UserWithPassword = typeof users.$inferSelect
export type User = Omit<UserWithPassword, "password">
