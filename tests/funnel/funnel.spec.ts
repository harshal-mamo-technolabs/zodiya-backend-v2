import { jest } from "@jest/globals"
import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { UserModel } from "../../src/models/User.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { LandingPageHookModel } from "../../src/models/LandingPageHook.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { resumeToken } from "../../src/services/TokenService.ts"
import { geoData, profileData, resetDB, userData } from "../utils/index.ts"

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
        await resetDB()
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

    describe("email link back into the funnel", () => {
        const resume = (body: object) =>
            request(app).post("/funnel/resume").send(body)
        const newVisit = async (utm: object = {}) =>
            (
                (await request(app).post("/funnel/hook").send(utm)).body as {
                    uuid: string
                }
            ).uuid
        const account = async () => {
            const hookId = await newVisit({ utm_source: "fb" })
            const { accessToken } = (await signup({ ...signupBody, hookId }))
                .body as { accessToken: string }
            const user = await UserModel.findOne({ email: userData.email })
            if (!user) throw new Error("no account was created")
            return {
                hookId,
                user,
                accessToken,
                token: resumeToken(String(user._id)),
            }
        }

        it("signs an unpaid account in, back at the plans", async () => {
            const { hookId, token } = await account()

            const res = await resume({ token })

            expect(res.statusCode).toBe(200)
            const body = res.body as Record<string, string>
            expect(body).toMatchObject({
                stage: "plans",
                hookId,
                firstName: userData.firstName,
                sunSign: "leo",
            })
            const status = await request(app)
                .get("/billing/status")
                .set("Authorization", `Bearer ${String(body.accessToken)}`)
            expect(status.statusCode).toBe(200)
            expect(await LandingPageHookModel.countDocuments()).toBe(1)
        })

        it("returns to the checkout of the plan they had chosen", async () => {
            const { hookId, token } = await account()
            await request(app)
                .patch(`/funnel/hook/${hookId}`)
                .send({ plan: "premium", trial: true })

            const res = await resume({ token })

            expect(res.body).toMatchObject({
                stage: "pay",
                plan: "premium",
                trial: true,
            })
            expect(res.body).toHaveProperty("accessToken")
        })

        it("keeps the chosen plan when the link has a new campaign", async () => {
            const { hookId, token } = await account()
            await request(app)
                .patch(`/funnel/hook/${hookId}`)
                .send({ plan: "premium" })

            const res = await resume({ token, utm_campaign: "winback" })

            expect(res.body).toMatchObject({ stage: "pay", plan: "premium" })
            expect((res.body as { hookId: string }).hookId).not.toBe(hookId)
        })

        it("keeps the flow id per visit", async () => {
            const { token, hookId } = await account()
            await request(app)
                .patch(`/funnel/hook/${hookId}`)
                .send({ flow_id: "FLOW1" })
            await resume({ token, flow_id: "FLOW2" })
            await resume({ token, flow_id: "FLOW2" })

            const visits = await LandingPageHookModel.find({
                email: userData.email,
            })
                .sort({ _id: 1 })
                .lean()
            expect(visits.map((v) => [v.flow_id, v.utm_source])).toEqual([
                [undefined, "fb"],
                ["FLOW1", "fb"],
                ["FLOW2", "fb"],
            ])
        })

        it("does not reopen an old plan after starting over", async () => {
            const { hookId } = await account()
            await request(app)
                .patch(`/funnel/hook/${hookId}`)
                .send({ plan: "premium" })

            await signup({ ...signupBody, hookId: await newVisit() })
            const user = await UserModel.findOne({ email: userData.email })
            const res = await resume({ token: resumeToken(String(user?._id)) })

            expect((res.body as { stage: string }).stage).toBe("plans")
        })

        it("continues on a new record when the link has a new campaign", async () => {
            const { hookId, token } = await account()
            const utm = { utm_source: "klaviyo", utm_medium: "email" }

            const res = await resume({ token, ...utm })
            await resume({ token, ...utm }) // the same link clicked again
            await resume({ token, utm_source: "other" }) // a source alone is no change

            const hooks = await LandingPageHookModel.find().sort({ _id: 1 })
            expect(hooks).toHaveLength(2)
            expect(hooks[1]?.utm_source).toBe("fb")
            expect(hooks[1]?.utm_medium).toBe("email")
            const body = res.body as { hookId: string }
            expect(body.hookId).toBe(hooks[1]?.uuid)
            expect(body.hookId).not.toBe(hookId)
        })

        it("gives no session to an account with a plan", async () => {
            const { user, token } = await account()
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { "billing.plan.status": "active" } },
            )
            const res = await resume({ token })
            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({ stage: "login" })
        })

        it("refuses a deleted account, or anything but a resume token", async () => {
            const { hookId, user, accessToken, token } = await account()
            for (const bad of ["garbage", hookId, accessToken]) {
                expect((await resume({ token: bad })).statusCode).toBe(401)
            }
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { deletedAt: new Date() } },
            )
            expect((await resume({ token })).statusCode).toBe(401)
        })

        it("is no use as an API token", async () => {
            const { token } = await account()
            const res = await request(app)
                .get("/billing/status")
                .set("Authorization", `Bearer ${token}`)
            expect(res.statusCode).toBe(401)
        })

        it("cannot be had by naming someone's email at sign-up", async () => {
            await account()
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.plan.status": "active" } },
            )
            const hookId = await newVisit()
            await signup({ ...signupBody, hookId })

            const res = await resume({ token: hookId })
            expect(res.statusCode).toBe(401)
        })
    })

    describe("landing page hook", () => {
        const visit = async (utm: object = {}) =>
            (
                (await request(app).post("/funnel/hook").send(utm)).body as {
                    uuid: string
                }
            ).uuid

        it("records a visit, with 'organic' for any missing utm field", async () => {
            const uuid = await visit({ utm_source: "fb", utm_medium: "" })
            const hook = await LandingPageHookModel.findOne({ uuid })
            expect(hook?.utm_source).toBe("fb")
            expect(hook?.utm_medium).toBe("organic")
            expect(hook?.utm_campaign).toBe("organic")
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
            expect(user?.utm_campaign).toBe("organic")
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
            // both visits stay, each with its own campaign
            expect(await LandingPageHookModel.countDocuments()).toBe(2)
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
            ).not.toBeNull()
        })

        const email = userData.email.toLowerCase()
        const campaign = { utm_source: "klaviyo", utm_medium: "email" }

        it("updates the campaign in place while the email is unknown", async () => {
            const uuid = await visit({ utm_source: "fb", utm_medium: "cpc" })
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ ...campaign, utm_campaign: "" })
            expect(await LandingPageHookModel.countDocuments()).toBe(1)
            expect(
                await LandingPageHookModel.findOne({ uuid }).lean(),
            ).toMatchObject({
                utm_source: "fb",
                utm_medium: "email",
                utm_campaign: "organic",
            })
        })

        it("copies the record for a new campaign, and keeps all in step", async () => {
            const uuid = await visit({ utm_source: "fb", utm_medium: "cpc" })
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ firstName: "Ana" })
            await signup({ ...signupBody, hookId: uuid })

            const landed = () =>
                request(app).patch(`/funnel/hook/${uuid}`).send(campaign)
            await landed()
            await landed() // the same link again is no new campaign

            const hooks = await LandingPageHookModel.find({ email })
                .sort({ _id: 1 })
                .lean()
            expect(hooks).toHaveLength(2)
            expect(hooks[0]).toMatchObject({ uuid, utm_source: "fb" })
            expect(hooks[1]).toMatchObject({
                firstName: "Ana",
                utm_source: "fb",
                utm_medium: "email",
                utm_campaign: "organic",
            })
            expect(hooks[1]?.uuid).not.toBe(uuid)

            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ firstName: "Ann", plan: "premium" })
            const after = await LandingPageHookModel.find({ email }).lean()
            for (const h of after) {
                expect(h).toMatchObject({ firstName: "Ann", plan: "premium" })
            }
            expect(after.map((h) => h.utm_medium).sort()).toEqual([
                "cpc",
                "email",
            ])
        })

        it("links a paying customer's new visit without taking its answers", async () => {
            const first = await visit({ utm_source: "fb" })
            await request(app)
                .patch(`/funnel/hook/${first}`)
                .send({ firstName: "Ana" })
            await signup({ ...signupBody, hookId: first })
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.plan.status": "active" } },
            )

            const second = await visit(campaign)
            await request(app)
                .patch(`/funnel/hook/${second}`)
                .send({ firstName: "Mallory" })
            const res = await signup({ ...signupBody, hookId: second })

            expect(res.statusCode).toBe(409)
            const hooks = await LandingPageHookModel.find({ email })
                .sort({ _id: 1 })
                .lean()
            expect(hooks.map((h) => h.firstName)).toEqual(["Ana", "Ana"])
            expect(hooks.map((h) => h.utm_source)).toEqual(["fb", "fb"])
            expect(hooks.map((h) => h.utm_medium)).toEqual(["organic", "email"])
        })

        it("keeps the landing page name per record", async () => {
            const first = await visit({
                utm_medium: "cpc",
                landingPageName: "landing-page-1",
            })
            await signup({ ...signupBody, hookId: first })

            // a new campaign's copy carries the name it arrived with
            await request(app)
                .patch(`/funnel/hook/${first}`)
                .send({ utm_medium: "email" })
            const copy = await LandingPageHookModel.findOne({
                utm_medium: "email",
            }).lean()
            expect(copy?.landingPageName).toBe("landing-page-1")

            // answers are shared across the email's records, the name is not
            const second = await visit({ landingPageName: "landing-page-2" })
            await signup({ ...signupBody, hookId: second })
            const names = await LandingPageHookModel.find()
                .sort({ _id: 1 })
                .lean()
            expect(names.map((h) => h.landingPageName)).toEqual([
                "landing-page-1",
                "landing-page-1",
                "landing-page-2",
            ])
        })

        it("gets the name from an update if the first request was lost", async () => {
            const uuid = "6a1c2f30-8d1e-4a7b-9c55-2e7b1d3f4a10"
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ landingPageName: "landing-page-1" })
            expect(
                (await LandingPageHookModel.findOne({ uuid }).lean())
                    ?.landingPageName,
            ).toBe("landing-page-1")
        })

        it("never changes the source of a record, even with no email yet", async () => {
            const uuid = await visit({ utm_source: "fb" })
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ utm_source: "tiktok", utm_campaign: "spring" })
            expect(
                await LandingPageHookModel.findOne({ uuid }).lean(),
            ).toMatchObject({ utm_source: "fb", utm_campaign: "spring" })
        })

        it("takes the source of a record whose first request was lost", async () => {
            const uuid = "4b0f6a1e-3c55-4d0a-9d6e-6f1f6c9a2b11"
            await request(app)
                .patch(`/funnel/hook/${uuid}`)
                .send({ utm_source: "fb" })
            expect(
                (await LandingPageHookModel.findOne({ uuid }).lean())
                    ?.utm_source,
            ).toBe("fb")
        })

        it("keeps the account's first campaign when they start over", async () => {
            await signup({
                ...signupBody,
                hookId: await visit({
                    utm_source: "fb",
                    utm_campaign: "launch",
                    utm_medium: "cpc",
                }),
            })

            const second = await visit({
                utm_source: "klaviyo",
                utm_campaign: "winback",
                utm_medium: "email",
            })
            const res = await signup({ ...signupBody, hookId: second })

            expect(res.statusCode).toBe(201)
            expect(
                await UserModel.findOne({ email: userData.email }).lean(),
            ).toMatchObject({
                utm_source: "fb",
                utm_campaign: "launch",
                utm_medium: "cpc",
            })
            // the new visit keeps its own campaign, under the first source
            expect(
                await LandingPageHookModel.findOne({ uuid: second }).lean(),
            ).toMatchObject({
                utm_source: "fb",
                utm_campaign: "winback",
                utm_medium: "email",
            })
        })

        it("refuses every later write to the account's utm fields", async () => {
            await signup({
                ...signupBody,
                hookId: await visit({ utm_source: "fb", utm_medium: "cpc" }),
            })
            const filter = { email: userData.email }
            const changed = {
                utm_source: "x",
                utm_campaign: "x",
                utm_medium: "x",
            }

            await UserModel.updateOne(filter, { $set: changed })
            await UserModel.findOneAndUpdate(filter, { $set: changed })
            const doc = await UserModel.findOne(filter)
            doc?.set(changed)
            await doc?.save()

            expect(await UserModel.findOne(filter).lean()).toMatchObject({
                utm_source: "fb",
                utm_campaign: "organic",
                utm_medium: "cpc",
            })
        })
    })
})
