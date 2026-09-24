import type { Model } from "mongoose"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"
import type { User } from "../models/User.ts"
import type { Profile } from "../models/Profile.ts"
import type { RefreshToken } from "../models/RefreshToken.ts"
import type { AccountPatch } from "../types/index.ts"
import { type Role, Roles } from "../constants/index.ts"

export class UserService {
    constructor(
        private userModel: Model<User>,
        private profileModel?: Model<Profile>,
        private refreshTokenModel?: Model<RefreshToken>,
    ) {}

    async create(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: Role = Roles.CUSTOMER,
    ) {
        const user = await this.userModel.findOne({ email })
        if (user) {
            const err = createHttpError(400, "Email already exist")
            throw err
        }

        const saltRound = 10
        const hashedPassword = await bcrypt.hash(password, saltRound)

        try {
            return await this.userModel.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
            })
        } catch {
            const error = createHttpError(
                500,
                "Failed to store data in database",
            )
            throw error
        }
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).select("+password")
    }

    async findById(id: string) {
        return await this.userModel.findById(id)
    }

    async update(id: string, patch: AccountPatch) {
        const user = await this.userModel.findById(id)
        if (!user) {
            return null
        }
        const { notifications, ...rest } = patch
        user.set(rest)
        if (notifications) {
            user.set("notifications", {
                ...user.notifications,
                ...notifications,
            })
        }
        await user.save()
        return user
    }

    /** The account and everything that hangs off it. */
    async remove(id: string) {
        await this.profileModel?.deleteMany({ user: id })
        await this.refreshTokenModel?.deleteMany({ user: id })
        const result = await this.userModel.deleteOne({ _id: id })
        return result.deletedCount === 1
    }
}
