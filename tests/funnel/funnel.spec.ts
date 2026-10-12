import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { LandingPageHookModel } from "../../src/models/LandingPageHook.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { geoData, profileData, userData } from "../utils/index.ts"

// no password: the funnel never asks for one
const signupBody = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    gender: "female",
    avatar: "avatar-03",
    birthDate: profileData.birthDate,
    birthTime: profileData.birthTime,
    city: profileData.city,
    state: profileData.state,
    country: profileData.country,
}

const signup = (body: object = signupBody) =>
    request(app).post("/funnel/signup").send(body)

describe("funnel", () => {
    let mongod: MongoMemoryServer

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    describe("POST /funnel/signup", () => {
        it("creates the account and its own chart, and returns a token to pay with", async () => {
            const response = await signup()

            expect(response.statusCode).toBe(201)
            const body = response.body as {
                accessToken: string
                sunSign: string
            }
            expect(body.sunSign).toBe("leo")
            const user = await UserModel.findOne({ email: userData.email })
            if (!user) throw new Error("no account was created")
            expect(user.gender).toBe("female")
            const profile = await ProfileModel.findOne({ user: user._id })
            expect(profile?.isPrimary).toBe(true)
            expect(profile?.city).toBe(profileData.city)
            expect(profile?.avatar).toBe("avatar-03")

            // the token works as a bearer for checkout
            const status = await request(app)
                .get("/billing/status")
                .set("Authorization", `Bearer ${body.accessToken}`)
            expect(status.statusCode).toBe(200)
            expect((status.body as { entitled: boolean }).entitled).toBe(false)
        })

        it("gives the account a random password nobody knows", async () => {
            await signup()
            const user = await UserModel.findOne({
                email: userData.email,
            }).select("+password")
            expect(user?.password).toMatch(/^\$2[aby]\$/)
            const login = await request(app)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password })
            expect(login.statusCode).toBe(400)
        })

        it("never signs in to an existing account", async () => {
            await signup()
            const again = await signup()

            expect(again.statusCode).toBe(409)
            expect(
                (again.body as { errors: { code?: string }[] }).errors[0]?.code,
            ).toBe("account_exists")
            expect(again.body).not.toHaveProperty("accessToken")
            expect(await ProfileModel.countDocuments()).toBe(1)
        })

        it("leaves no half-made account behind when the chart fails", async () => {
            jest.spyOn(GeoService.prototype, "lookup").mockRejectedValue(
                new Error("geo down"),
            )

            const response = await signup()

            expect(response.statusCode).toBe(500)
            expect(await UserModel.countDocuments()).toBe(0)
            expect(await ProfileModel.countDocuments()).toBe(0)
        })

        it("rejects a bad birth date, email or gender", async () => {
            for (const body of [
                { ...signupBody, birthDate: "0341-01-21" },
                { ...signupBody, email: "not-an-email" },
                { ...signupBody, gender: undefined },
                { ...signupBody, gender: "robot" },
            ]) {
                expect((await signup(body)).statusCode).toBe(400)
            }
            expect(await UserModel.countDocuments()).toBe(0)
        })
    })

    it("searches places without an account", async () => {
        jest.spyOn(GeoService.prototype, "searchPlaces").mockResolvedValue([
            {
                placeId: "p1",
                description: "Ahmedabad, Gujarat, India",
                main: "Ahmedabad",
                secondary: "Gujarat, India",
            },
        ] as never)

        const response = await request(app).get("/funnel/places?q=Ahmed")

        expect(response.statusCode).toBe(200)
        expect((response.body as unknown[]).length).toBe(1)
    })

    describe("handoff into the app", () => {
        const handoffToken = async () => {
            const { accessToken } = (await signup()).body as {
                accessToken: string
            }
            const response = await request(app)
                .post("/funnel/handoff")
                .set("Authorization", `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            return (response.body as { token: string }).token
        }

        it("turns the one-time token into a normal session, once", async () => {
            const token = await handoffToken()

            const first = await request(app)
                .post("/auth/handoff")
                .send({ token })
            expect(first.statusCode).toBe(200)
            const cookies = (
                first.headers as unknown as { "set-cookie": string[] }
            )["set-cookie"].join(" ")
            expect(cookies).toMatch(/accessToken=/)
            expect(cookies).toMatch(/refreshToken=/)

            const reused = await request(app)
                .post("/auth/handoff")
                .send({ token })
            expect(reused.statusCode).toBe(401)
        })

        it("refuses anything that is not a handoff token", async () => {
            const { accessToken } = (await signup()).body as {
                accessToken: string
            }
            for (const token of ["garbage", accessToken, undefined]) {
                const response = await request(app)
                    .post("/auth/handoff")
                    .send({ token })
                expect(response.statusCode).toBe(401)
            }
        })

        it("needs the funnel's token to issue one", async () => {
            expect(
                (await request(app).post("/funnel/handoff")).statusCode,
            ).toBe(401)
        })
    })

    describe("landing page hook", () => {
        const visit = async (utm: object = {}) =>
            (
                (await request(app).post("/funnel/hook").send(utm)).body as {
                    uuid: string
                }
            ).uuid

        it("records a visit, with 'default' for any missing utm field", async () => {
            const uuid = await visit({ utm_source: "fb", utm_medium: "" })
            const hook = await LandingPageHookModel.findOne({ uuid })
            expect(hook?.utm_source).toBe("fb")
            expect(hook?.utm_medium).toBe("default")
            expect(hook?.utm_campaign).toBe("default")
        })

        it("adds each step's answers and nothing else", async () => {
            const uuid = await visit()
            const res = await request(app).patch(`/funnel/hook/${uuid}`).send({
                firstName: "Ana",
                gender: "female",
                lat: 41.1,
                role: "admin",
            })
            expect(res.statusCode).toBe(204)
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ interests: ["love"], plan: "premium", trial: true })
            const hook = await LandingPageHookModel.findOne({ uuid }).lean()
            expect(hook).toMatchObject({
                firstName: "Ana",
                gender: "female",
                lat: 41.1,
                interests: ["love"],
                plan: "premium",
                trial: true,
            })
            expect(hook).not.toHaveProperty("role")
            const bad = await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ gender: "other" })
            expect(bad.statusCode).toBe(400)
        })

        it("copies the visit's campaign onto the account", async () => {
            const hookId = await visit({ utm_source: "fb", utm_medium: "cpc" })
            await signup({ ...signupBody, hookId })
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.utm_source).toBe("fb")
            expect(user?.utm_medium).toBe("cpc")
            expect(user?.utm_campaign).toBe("default")
        })

        it("marks the email on sign-up, payment not started", async () => {
            const hookId = await visit()
            await signup({ ...signupBody, hookId })
            const hook = await LandingPageHookModel.findOne({ uuid: hookId })
            expect(hook?.email).toBe(userData.email.toLowerCase())
            expect(hook?.isPaymentInitiated).toBe(false)
            expect(hook?.isPaymentCompleted).toBe(false)
        })

        it("starts over for a returning visitor who never paid", async () => {
            const first = await visit()
            await signup({ ...signupBody, hookId: first })
            const old = await UserModel.findOne({ email: userData.email })
            if (!old) throw new Error("no account was created")

            const second = await visit()
            const res = await signup({ ...signupBody, hookId: second })

            expect(res.statusCode).toBe(201)
            expect(await UserModel.exists({ _id: old._id })).toBeNull()
            expect(await ProfileModel.countDocuments({ user: old._id })).toBe(0)
            expect(
                await LandingPageHookModel.exists({ uuid: first }),
            ).toBeNull()
            expect(
                await LandingPageHookModel.exists({ uuid: second }),
            ).not.toBeNull()
        })

        it("sends a returning visitor with a plan to log in", async () => {
            await signup({ ...signupBody, hookId: await visit() })
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.plan.status": "trialing" } },
            )
            const hookId = await visit()
            const res = await signup({ ...signupBody, hookId })
            expect(res.statusCode).toBe(409)
            expect(await UserModel.countDocuments()).toBe(1)
            expect(
                await LandingPageHookModel.exists({ uuid: hookId }),
            ).toBeNull()
        })
    })
})
