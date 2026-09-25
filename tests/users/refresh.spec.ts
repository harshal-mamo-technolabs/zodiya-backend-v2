import request from "supertest"
import app from "../../src/app.ts"
import { resetDB, countRows } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { refreshTokens as refreshTokenTable } from "../../src/models/RefreshToken.ts"
import { userData } from "../utils/index.ts"

const cookiesOf = (response: request.Response) =>
    (
        (response.headers as unknown as { "set-cookie"?: string[] })[
            "set-cookie"
        ] ?? []
    ).map((c) => c.split(";")[0] ?? "")

describe("POST /auth/refresh", () => {
    let cookies: string[]

    beforeEach(async () => {
        await resetDB()
        cookies = cookiesOf(
            await request(app).post("/auth/register").send(userData),
        )
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("issues a new pair and the new access cookie works", async () => {
        const refreshOnly = cookies.filter((c) => c.startsWith("refreshToken="))
        const response = await request(app)
            .post("/auth/refresh")
            .set("Cookie", refreshOnly)
        expect(response.statusCode).toBe(204)
        const fresh = cookiesOf(response)
        expect(
            fresh.some((c) => c.startsWith("accessToken=") && c.length > 20),
        ).toBe(true)
        expect(
            fresh.some((c) => c.startsWith("refreshToken=") && c.length > 20),
        ).toBe(true)

        const me = await request(app)
            .get("/auth/me")
            .set(
                "Cookie",
                fresh.filter((c) => c.startsWith("accessToken=")),
            )
        expect(me.statusCode).toBe(200)
    })

    it("rotates: the old refresh cookie is dead after one use", async () => {
        const refreshOnly = cookies.filter((c) => c.startsWith("refreshToken="))
        expect(await countRows(refreshTokenTable)).toBe(1)
        await request(app).post("/auth/refresh").set("Cookie", refreshOnly)
        expect(await countRows(refreshTokenTable)).toBe(1)

        const again = await request(app)
            .post("/auth/refresh")
            .set("Cookie", refreshOnly)
        expect(again.statusCode).toBe(401)
    })

    it("refuses without a cookie, and after logout", async () => {
        expect((await request(app).post("/auth/refresh")).statusCode).toBe(401)
        await request(app).post("/auth/logout").set("Cookie", cookies)
        const after = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                cookies.filter((c) => c.startsWith("refreshToken=")),
            )
        expect(after.statusCode).toBe(401)
    })

    it("refuses a tampered cookie", async () => {
        const response = await request(app)
            .post("/auth/refresh")
            .set("Cookie", ["refreshToken=eyJhbGciOiJIUzI1NiJ9.e30.bad"])
        expect(response.statusCode).toBe(401)
    })
})
