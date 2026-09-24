import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { RefreshTokenModel } from "../../src/models/RefreshToken.ts"
import type { AccountResponse } from "../../src/types/index.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

describe("account", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let own: string
    let other: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        const first = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        own = (first.body as Record<string, string>).id ?? ""
        const second = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send({
                ...profileData,
                firstName: "Tomas",
                relationship: "friend",
            })
        other = (second.body as Record<string, string>).id ?? ""
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("GET /auth/me returns the account with default preferences", async () => {
        const response = await request(app)
            .get("/auth/me")
            .set("Cookie", [cookie])
        expect(response.statusCode).toBe(200)
        const body = response.body as AccountResponse
        expect(body.email).toBe(userData.email)
        expect(body.firstName).toBe(userData.firstName)
        expect(body.notifications).toEqual({
            daily: true,
            transits: true,
            retro: false,
            deliveryTime: "07:30",
        })
        expect(body.createdAt).toMatch(/^\d{4}-/)
    })

    it("PATCH /auth/me changes the name and merges preferences", async () => {
        const response = await request(app)
            .patch("/auth/me")
            .set("Cookie", [cookie])
            .send({
                firstName: "Ana",
                notifications: { retro: true, deliveryTime: "06:15" },
            })
        expect(response.statusCode).toBe(200)
        const body = response.body as AccountResponse
        expect(body.firstName).toBe("Ana")
        expect(body.lastName).toBe(userData.lastName)
        expect(body.notifications).toEqual({
            daily: true,
            transits: true,
            retro: true,
            deliveryTime: "06:15",
        })
    })

    it("PATCH /auth/me rejects a bad delivery time and an empty name", async () => {
        for (const send of [
            { notifications: { deliveryTime: "7:30" } },
            { firstName: "  " },
        ]) {
            const response = await request(app)
                .patch("/auth/me")
                .set("Cookie", [cookie])
                .send(send)
            expect(response.statusCode).toBe(400)
        }
    })

    it("DELETE /profiles/:id removes a saved person but never the primary", async () => {
        const gone = await request(app)
            .delete(`/profiles/${other}`)
            .set("Cookie", [cookie])
        expect(gone.statusCode).toBe(204)
        expect(await ProfileModel.countDocuments()).toBe(1)

        const kept = await request(app)
            .delete(`/profiles/${own}`)
            .set("Cookie", [cookie])
        expect(kept.statusCode).toBe(400)
        expect(await ProfileModel.countDocuments()).toBe(1)
    })

    it("DELETE /profiles/:id hides other people's profiles", async () => {
        const otherCookie = await registerAndGetCookie(app, {
            ...userData,
            email: "other@example.com",
        })
        const response = await request(app)
            .delete(`/profiles/${other}`)
            .set("Cookie", [otherCookie])
        expect(response.statusCode).toBe(404)
    })

    it("DELETE /auth/me removes the account, its profiles and its sessions", async () => {
        expect(await RefreshTokenModel.countDocuments()).toBe(1)
        const response = await request(app)
            .delete("/auth/me")
            .set("Cookie", [cookie])
        expect(response.statusCode).toBe(204)
        const cleared = (
            response.headers as unknown as { "set-cookie": string[] }
        )["set-cookie"].join(" ")
        expect(cleared).toMatch(/accessToken=;/)
        expect(await UserModel.countDocuments()).toBe(0)
        expect(await ProfileModel.countDocuments()).toBe(0)
        expect(await RefreshTokenModel.countDocuments()).toBe(0)

        const after = await request(app).get("/auth/me").set("Cookie", [cookie])
        expect(after.statusCode).toBe(404)
    })

    it("requires a session", async () => {
        expect((await request(app).get("/auth/me")).statusCode).toBe(401)
        expect(
            (await request(app).delete(`/profiles/${other}`)).statusCode,
        ).toBe(401)
    })
})
