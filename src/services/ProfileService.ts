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
    DEFAULT_BIRTH_TIME,
    type Language,
} from "../constants/index.ts"

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

    async findAllByUser(userId: string) {
        return await this.profileModel
            .find({ user: userId })
            .sort({ isPrimary: -1, createdAt: 1 })
    }

    async findById(id: string, userId: string) {
        return await this.profileModel.findOne({ _id: id, user: userId })
    }

    /** The only editable field so far: the name numerology is run against. */
    async update(id: string, userId: string, patch: ProfilePatch) {
        const profile = await this.findById(id, userId)

        if (!profile) {
            return null
        }

        profile.set(patch)

        const moved = (
            ["birthDate", "birthTime", "city", "state", "country"] as const
        ).some((key) => patch[key] !== undefined)
        if (moved) {
            profile.set(await this.derive(profile))
        }

        await profile.save()

        return profile
    }

    /** Creates the public link if there is not one already; idempotent. */
    /** Removes a saved person. The primary entry is the account's own chart and stays. */
    async remove(
        id: string,
        userId: string,
    ): Promise<"gone" | "primary" | null> {
        const profile = await this.findById(id, userId)
        if (!profile) {
            return null
        }
        if (profile.isPrimary) {
            return "primary"
        }
        await profile.deleteOne()
        return "gone"
    }

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
        const profile = await this.profileModel.findOne({ shareToken: token })

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
