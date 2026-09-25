import { asc, count } from "drizzle-orm"
import type { MySqlTable } from "drizzle-orm/mysql-core"
import { db } from "../../src/config/db.ts"
import { users } from "../../src/models/User.ts"

type Table = MySqlTable & { createdAt: never } & Record<string, never>

/** Empties the test database; profiles and tokens follow users by ON DELETE CASCADE. */
export async function resetDB() {
    await db.delete(users)
}

/** Every row of a table, oldest first, the way Model.find() used to read. */
export async function rows<T extends MySqlTable>(table: T) {
    const t = table as unknown as Table
    return await db.select().from(table).orderBy(asc(t.createdAt))
}

export async function countRows(table: MySqlTable) {
    const [row] = await db.select({ n: count() }).from(table)
    return row?.n ?? 0
}
