import { randomBytes } from "crypto"
import type { Model } from "mongoose"
import createHttpError from "http-errors"
import type { Profile, ProfileDocument } from "../models/Profile.ts"
import type {
    ChartResponse,
    NatalChart,
    ProfileData,
    ProfilePatch,
    SharedChartResponse,
} from "../types/index.ts"
import type { GeoService } from "./GeoService.ts"
import type { ChartService } from "./ChartService.ts"
import type { ReadingService } from "./ReadingService.ts"
import {
    Bodies,
    COUNTED_PROFILE_FIELDS,
    DEFAULT_BIRTH_TIME,
    PROFILE_EDIT_LIMITS,
    type Language,
} from "../constants/index.ts"

/** Lifetime edits this profile has left. */
export const editsLeft = (profile: ProfileDocument) =>
    Math.max(
        0,
        PROFILE_EDIT_LIMITS[profile.isPrimary ? "primary" : "extra"] -
            profile.editCount,
    )

/** A profile as the API returns it: the stored fields plus its edits left. */
export const profileView = (profile: ProfileDocument) => ({
    ...profile.toJSON(),
    editsLeft: editsLeft(profile),
})

// profiles saved before these fields existed have neither set
const ENABLED = { disabled: { $ne: true } }

export class ProfileService {
    constructor(
        private profileModel: Model<Profile>,
        private geoService: GeoService,
        private chartService: ChartService,
        private readingService: ReadingService,
    ) {}

    async create(userId: string, data: ProfileData) {
        // birth time is optional at the edge; midnight is the agreed default
        const birthTime = data.birthTime ?? DEFAULT_BIRTH_TIME
        const derived = await this.derive({ ...data, birthTime })

        const existingCount = await this.profileModel.countDocuments({
            user: userId,
        })

        try {
            return await this.profileModel.create({
                ...data,
                birthTime,
                ...derived,
                user: userId,
                isPrimary: existingCount === 0,
            })
        } catch {
            const error = createHttpError(
                500,
                "Failed to store data in database",
            )
            throw error
        }
    }

    /** Coordinates, zone and the sun sign all follow from when and where. */
    private async derive(
        data: Required<
            Pick<
                ProfileData,
                "birthDate" | "birthTime" | "city" | "state" | "country"
            >
        >,
    ) {
        const geo = await this.geoService.lookup(
            data.city,
            data.state,
            data.country,
            data.birthDate,
            data.birthTime,
        )

        // the real solar ingress, not a fixed calendar table — otherwise a
        // cusp birth gets a sign that contradicts its own chart
        const chart = this.chartService.compute({
            birthDate: data.birthDate,
            birthTime: data.birthTime,
            lat: geo.lat,
            lon: geo.lon,
            tzone: geo.tzone,
        })
        const sun = chart.bodies.find((body) => body.body === Bodies.SUN)

        if (!sun) {
            throw createHttpError(500, "Could not compute the sun position")
        }

        return { ...geo, zodiacSign: sun.sign }
    }

    /** Enabled profiles only, unless the caller manages them (the account page). */
    async findAllByUser(userId: string, includeDisabled = false) {
        return await this.profileModel
            .find({ user: userId, ...(!includeDisabled && ENABLED) })
            .sort({ isPrimary: -1, createdAt: 1 })
    }

    /** An enabled profile: every reading, share and comparison goes through here. */
    async findById(id: string, userId: string) {
        return await this.profileModel.findOne({
            _id: id,
            user: userId,
            ...ENABLED,
        })
    }

    /**
     * A save that changes the name or birth data uses one of the profile's
     * lifetime edits; filling in a birth name for the first time does not.
     */
    async update(id: string, userId: string, patch: ProfilePatch) {
        const profile = await this.profileModel.findOne({
            _id: id,
            user: userId,
        })

        if (!profile) {
            return null
        }
        if (profile.disabled) {
            throw createHttpError(409, "Enable this profile to edit it.", {
                code: "profile_disabled",
            })
        }

        const counted = COUNTED_PROFILE_FIELDS.some((key) => {
            const next = patch[key]
            const now = profile[key]
            return next !== undefined && next !== now && !!now
        })
        if (counted && editsLeft(profile) === 0) {
            const limit =
                PROFILE_EDIT_LIMITS[profile.isPrimary ? "primary" : "extra"]
            throw createHttpError(
                403,
                `This profile has used all ${String(limit)} of its ${limit === 1 ? "edit" : "edits"}.`,
                { code: "edit_limit_reached" },
            )
        }

        profile.set(patch)

        const moved = (
            ["birthDate", "birthTime", "city", "state", "country"] as const
        ).some((key) => patch[key] !== undefined)
        if (moved) {
            profile.set(await this.derive(profile))
        }
        if (counted) {
            profile.editCount += 1
        }

        await profile.save()

        return profile
    }

    /**
     * Profiles are never deleted, or a slot could be reused to read one
     * stranger after another. They can be switched off and on instead; a
     * disabled one keeps its slot. The owner's own profile is always on.
     */
    async setDisabled(
        id: string,
        userId: string,
        disabled: boolean,
    ): Promise<ProfileDocument | "primary" | null> {
        const profile = await this.profileModel.findOne({
            _id: id,
            user: userId,
        })
        if (!profile) {
            return null
        }
        if (profile.isPrimary) {
            return "primary"
        }
        profile.disabled = disabled
        await profile.save()
        return profile
    }

    /** Creates the public link if there is not one already; idempotent. */
    async share(id: string, userId: string): Promise<string | null> {
        const profile = await this.findById(id, userId)

        if (!profile) {
            return null
        }

        if (!profile.shareToken) {
            profile.shareToken = randomBytes(16).toString("base64url")
            await profile.save()
        }

        return profile.shareToken
    }

    /** Revokes the public link. The URL stops working immediately. */
    async unshare(id: string, userId: string): Promise<boolean> {
        const profile = await this.findById(id, userId)

        if (!profile) {
            return false
        }

        profile.set("shareToken", undefined)
        await profile.save()

        return true
    }

    /**
     * The public read. Returns the same chart, minus the meta a stranger has
     * no business with — the exact coordinates, offset and Julian day.
     */
    async buildSharedChart(
        token: string,
        lang: Language,
    ): Promise<SharedChartResponse | null> {
        // a disabled profile's link stops working until it is enabled again
        const profile = await this.profileModel.findOne({
            shareToken: token,
            ...ENABLED,
        })

        if (!profile) {
            return null
        }

        const { profile: owner, chart, reading } = this.assemble(profile, lang)

        return {
            profile: {
                name: owner.name,
                birthDate: owner.birthDate,
                birthTime: owner.birthTime,
                city: owner.city,
                country: owner.country,
            },
            chart: {
                ...chart,
                meta: {
                    birthDate: chart.meta.birthDate,
                    birthTime: chart.meta.birthTime,
                    zodiac: chart.meta.zodiac,
                    houseSystem: chart.meta.houseSystem,
                },
            },
            reading,
        }
    }

    async buildChart(
        id: string,
        userId: string,
        lang: Language,
    ): Promise<ChartResponse | null> {
        const profile = await this.findById(id, userId)

        if (!profile) {
            return null
        }

        return this.assemble(profile, lang)
    }

    /** The raw natal chart for a profile; transits are read against it. */
    natal(profile: ProfileDocument): NatalChart {
        return this.chartService.compute({
            birthDate: profile.birthDate,
            birthTime: profile.birthTime,
            lat: profile.lat,
            lon: profile.lon,
            tzone: profile.tzone,
        })
    }

    private assemble(profile: ProfileDocument, lang: Language): ChartResponse {
        const chart = this.natal(profile)

        return {
            profile: {
                id: String(profile._id),
                name: `${profile.firstName} ${profile.lastName}`,
                birthDate: profile.birthDate,
                birthTime: profile.birthTime,
                city: profile.city,
                state: profile.state,
                country: profile.country,
            },
            chart,
            reading: this.readingService.build(chart, lang),
        }
    }
}
