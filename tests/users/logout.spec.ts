import request from "supertest"
import app from "../../src/app.ts"
import { resetDB, countRows } from "../utils/db.ts"
import { disconnectDB } from "../../src/config/db.ts"
import { refreshTokens as refreshTokenTable } from "../../src/models/RefreshToken.ts"
import { userData } from "../utils/index.ts"

describe("POST /auth/logout", () => {
    let cookies: string[]

    beforeEach(async () => {
        await resetDB()
        const response = await request(app)
            .post("/auth/register")
            .send(userData)
        cookies = (response.headers as unknown as { "set-cookie": string[] })[
            "set-cookie"
        ].map((c) => c.split(";")[0] ?? "")
    })

    afterAll(async () => {
        await disconnectDB()
    })

    it("should clear both cookies and revoke the refresh token", async () => {
        expect(await countRows(refreshTokenTable)).toBe(1)

        const response = await request(app)
            .post("/auth/logout")
            .set("Cookie", cookies)

        const cleared = (
            response.headers as unknown as { "set-cookie": string[] }
        )["set-cookie"].join(" ")

        expect(response.statusCode).toBe(204)
        expect(cleared).toMatch(/accessToken=;/)
        expect(cleared).toMatch(/refreshToken=;/)
        expect(await countRows(refreshTokenTable)).toBe(0)
    })

    it("should still succeed with no cookies at all", async () => {
        const response = await request(app).post("/auth/logout")
        expect(response.statusCode).toBe(204)
    })

    it("should leave the tokens of other sessions alone", async () => {
        await request(app)
            .post("/auth/login")
            .send({ email: userData.email, password: userData.password })
        expect(await countRows(refreshTokenTable)).toBe(2)

        await request(app).post("/auth/logout").set("Cookie", cookies)

        expect(await countRows(refreshTokenTable)).toBe(1)
    })
})
