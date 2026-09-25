import request from "supertest"
import app from "../../src/app.ts"
import { resetDB, rows } from "../utils/db.ts"
import { db } from "../../src/config/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { users as userTable } from "../../src/models/User.ts"
import { refreshTokens as refreshTokenTable } from "../../src/models/RefreshToken.ts"
import { Roles } from "../../src/constants/index.ts"
import { isJwt } from "../../src/utils/index.ts"

describe("POST /auth/register", () => {
    beforeEach(async () => {
        await resetDB()
    })

    afterAll(async () => {
        await disconnectDB()
    })

    const userData = {
        firstName: "harshal",
        lastName: "chauhan",
        email: "harshal@gmail.com",
        password: "1234567890",
    }

    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            expect(response.statusCode).toBe(201)
        })

        it("should return valid JSON response", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            )
        })

        it("should register user in the database", async () => {
            await request(app).post("/auth/register").send(userData)

            const users = await rows(userTable)

            expect(users).toHaveLength(1)
            expect(users[0]?.firstName).toBe(userData.firstName)
            expect(users[0]?.lastName).toBe(userData.lastName)
            expect(users[0]?.email).toBe(userData.email)
        })

        it("should return the id of the created user", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            const users = await rows(userTable)

            expect((response.body as Record<string, string>).id).toBe(
                users[0]?._id,
            )
        })

        it("should assign a customer role", async () => {
            await request(app).post("/auth/register").send(userData)

            const users = await rows(userTable)

            expect(users[0]).toHaveProperty("role")
            expect(users[0]?.role).toBe(Roles.CUSTOMER)
        })

        it("should store the hashed password in the database", async () => {
            await request(app).post("/auth/register").send(userData)

            const users = await rows(userTable)

            expect(users[0]?.password).not.toBe(userData.password)
            expect(users[0]?.password).toHaveLength(60)
        })

        it("should return 400 if email already exists", async () => {
            await db
                .insert(userTable)
                .values({ ...userData, role: Roles.CUSTOMER })

            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            const users = await rows(userTable)

            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })

        it("should return access token and refresh token inside the cookie", async () => {
            interface Headers {
                ["set-cookie"]: string[]
            }

            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            let accessToken: string | null = null
            let refreshToken: string | null = null

            const cookies = (response.headers as unknown as Headers)[
                "set-cookie"
            ]

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0]?.split("=")[1] ?? null
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0]?.split("=")[1] ?? null
                }
            })

            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            expect(isJwt(accessToken)).toBe(true)
            expect(isJwt(refreshToken)).toBe(true)
        })

        it("should store the refresh token in the database", async () => {
            await request(app).post("/auth/register").send(userData)

            const users = await rows(userTable)
            const tokens = await rows(refreshTokenTable)

            expect(tokens).toHaveLength(1)
            expect(tokens[0]?.user).toBe(users[0]?._id)
        })
    })

    describe("Fields are missing", () => {
        it("should return 400 status code if email field is missing", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, email: "" })

            const users = await rows(userTable)

            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(0)
        })

        it("should return 400 status code if firstName is missing", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, firstName: "" })

            expect(response.statusCode).toBe(400)
        })

        it("should return 400 status code if lastName is missing", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, lastName: "" })

            expect(response.statusCode).toBe(400)
        })

        it("should return 400 status code if password is missing", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, password: "" })

            expect(response.statusCode).toBe(400)
        })
    })

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            await request(app)
                .post("/auth/register")
                .send({ ...userData, email: " harshal@gmail.com " })

            const users = await rows(userTable)

            expect(users[0]?.email).toBe("harshal@gmail.com")
        })

        it("should return 400 if email is not a valid email", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, email: "harshal_gmail.com" })

            const users = await rows(userTable)

            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(0)
        })

        it("should return 400 if password length is less than 8 chars", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ ...userData, password: "pass" })

            const users = await rows(userTable)

            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(0)
        })
    })
})
