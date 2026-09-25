import { eq, getTableColumns } from "drizzle-orm"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"
import type { Db } from "../config/db.ts"
import { type User, users } from "../models/User.ts"
import type { AccountPatch } from "../types/index.ts"
import { type Role, Roles } from "../constants/index.ts"

// every column but the hash; only login ever needs the password
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password: _password, ...publicColumns } = getTableColumns(users)

export class UserService {
    constructor(private db: Db) {}

    async create(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: Role = Roles.CUSTOMER,
    ): Promise<User> {
        email = email.trim().toLowerCase()
        const user = await this.findByEmail(email)
        if (user) {
            const err = createHttpError(400, "Email already exist")
            throw err
        }

        const saltRound = 10
        const hashedPassword = await bcrypt.hash(password, saltRound)

        try {
            const [row] = await this.db
                .insert(users)
                .values({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email,
                    password: hashedPassword,
                    role,
                })
                .$returningId()
            const created = row && (await this.findById(row._id))
            if (!created) {
                throw new Error("insert returned no row")
            }
            return created
        } catch {
            const error = createHttpError(
                500,
                "Failed to store data in database",
            )
            throw error
        }
    }

    async findByEmail(email: string) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.email, email.trim().toLowerCase()))
        return user ?? null
    }

    async findById(id: string): Promise<User | null> {
        const [user] = await this.db
            .select(publicColumns)
            .from(users)
            .where(eq(users._id, id))
        return user ?? null
    }

    async update(id: string, patch: AccountPatch) {
        const user = await this.findById(id)
        if (!user) {
            return null
        }
        const { notifications, ...rest } = patch
        await this.db
            .update(users)
            .set({
                ...rest,
                notifications: { ...user.notifications, ...notifications },
            })
            .where(eq(users._id, id))
        return await this.findById(id)
    }

    /** The account and everything that hangs off it; profiles and tokens go by ON DELETE CASCADE. */
    async remove(id: string) {
        const [result] = await this.db.delete(users).where(eq(users._id, id))
        return result.affectedRows === 1
    }
}
