import {
    boolean,
    char,
    datetime,
    double,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core"
import type { Relationship, ZodiacSign } from "../constants/index.ts"
import { Relationships } from "../constants/index.ts"
import { objectId } from "../utils/index.ts"
import { users } from "./User.ts"

// one primary profile per user is enforced in scripts/sql/01_schema.sql
export const profiles = mysqlTable("profiles", {
    _id: char("id", { length: 24 }).primaryKey().$defaultFn(objectId),
    user: char("user_id", { length: 24 })
        .notNull()
        .references(() => users._id, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    // full name as written on the birth certificate; numerology only
    birthName: varchar("birth_name", { length: 255 }),
    // one of AVATARS; null until the user picks a portrait
    avatar: varchar("avatar", { length: 32 }),
    // kept as the local wall-clock strings the user typed (YYYY-MM-DD / HH:mm)
    birthDate: char("birth_date", { length: 10 }).notNull(),
    birthTime: char("birth_time", { length: 5 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    state: varchar("state", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    lat: double("lat").notNull(),
    lon: double("lon").notNull(),
    // UTC offset in hours at the birth instant, e.g. 5.5
    tzone: double("tzone").notNull(),
    timezoneId: varchar("timezone_id", { length: 64 }).notNull(),
    zodiacSign: varchar("zodiac_sign", { length: 16 })
        .$type<ZodiacSign>()
        .notNull(),
    relationship: varchar("relationship", { length: 16 })
        .$type<Relationship>()
        .notNull()
        .default(Relationships.SELF),
    isPrimary: boolean("is_primary").notNull().default(false),
    // set only when the owner asks for a public link; null revokes it
    shareToken: varchar("share_token", { length: 64 }).unique(),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
})

export type Profile = typeof profiles.$inferSelect
