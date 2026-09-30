import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { GeoService } from "../../src/services/GeoService.ts"
import { toWords } from "../../src/services/ElevenLabsService.ts"
import { UserModel } from "../../src/models/User.ts"
import { AstrologerSessionModel } from "../../src/models/AstrologerSession.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

const toUrl = (input: string | URL | Request) =>
    new URL(input instanceof Request ? input.url : input)

const jsonResponse = (body: unknown, status = 200) =>
    Promise.resolve(new Response(JSON.stringify(body), { status }))

/** A stand-in for the parts of the ElevenLabs API the backend calls. */
function elevenLabs(input: string | URL | Request) {
    const url = toUrl(input)
    if (url.pathname === "/v1/convai/agents") {
        const name = url.searchParams.get("search") ?? ""
        return jsonResponse({ agents: [{ agent_id: `agent-${name}`, name }] })
    }
    if (url.pathname.startsWith("/v1/convai/agents/")) {
        return jsonResponse({
            conversation_config: { tts: { voice_id: "voice-1" } },
        })
    }
    if (url.pathname === "/v1/convai/conversation/get-signed-url") {
        return jsonResponse({
            signed_url: `wss://example.test/convai?${url.searchParams.toString()}&conversation_id=conv_1`,
        })
    }
    if (url.pathname.startsWith("/v1/convai/conversations/")) {
        return jsonResponse({
            status: "done",
            metadata: { call_duration_secs: 125 },
        })
    }
    if (url.pathname.endsWith("/with-timestamps")) {
        return jsonResponse({
            audio_base64: "QUJD",
            alignment: {
                characters: ["H", "i", " ", "y", "o", "u"],
                character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
            },
        })
    }
    return jsonResponse({ detail: "not found" }, 404)
}

interface SessionBody {
    signedUrl: string
    session: { id: string; maxSeconds: number }
    dynamicVariables: Record<string, string>
}

describe("/astrologer", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let profileId: string
    let fetchSpy: jest.SpiedFunction<typeof fetch>

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        jest.spyOn(GeoService.prototype, "lookup").mockResolvedValue(geoData)
        cookie = await registerAndGetCookie(app)
        const created = await request(app)
            .post("/profiles")
            .set("Cookie", [cookie])
            .send(profileData)
        profileId = (created.body as { id: string }).id
        // after the profile, so geo lookups are not routed here
        fetchSpy = jest
            .spyOn(globalThis, "fetch")
            .mockImplementation(elevenLabs)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    const session = (body: object, withCookie = cookie) =>
        request(app)
            .post("/astrologer/session")
            .set("Cookie", [withCookie])
            .send(body)

    describe("POST /astrologer/session", () => {
        it("returns a signed URL for the astrologer's agent", async () => {
            const response = await session({ character: "virgo", profileId })

            expect(response.statusCode).toBe(200)
            const body = response.body as SessionBody
            expect(new URL(body.signedUrl).searchParams.get("agent_id")).toBe(
                "agent-AstroMeridian · Dev",
            )
        })

        it("never sends the API key to the browser", async () => {
            const response = await session({ character: "leo", profileId })

            expect(JSON.stringify(response.body)).not.toContain(
                "test-elevenlabs-key",
            )
            const [, init] = fetchSpy.mock.calls[0] ?? []
            expect(
                (init?.headers as Record<string, string>)["xi-api-key"],
            ).toBe("test-elevenlabs-key")
        })

        it("gives the agent the reader's own chart", async () => {
            const response = await session({
                character: "libra",
                profileId,
                page: "transits",
            })

            const vars = (response.body as SessionBody).dynamicVariables
            expect(vars.user_name).toBe(profileData.firstName)
            expect(vars.page).toBe("transits")
            expect(vars.greeting).toBe("")
            // 1995-08-15 14:30 Ahmedabad
            expect(vars.chart_context).toContain(
                "Big three: Sun in Leo, Moon in Aries, Sagittarius rising.",
            )
            expect(vars.chart_context).toContain("Transits")
            expect(vars.chart_context).toContain("Daily horoscope for Leo")
            expect(vars.chart_context).toContain("Life Path")
        })

        it("adds the spoken introduction only when asked", async () => {
            const response = await session({
                character: "pisces",
                profileId,
                greet: true,
            })

            expect(
                (response.body as SessionBody).dynamicVariables.greeting,
            ).toContain("I'm Marina")
        })

        it("rejects an unknown astrologer", async () => {
            const response = await session({
                character: "ophiuchus",
                profileId,
            })

            expect(response.statusCode).toBe(400)
        })

        it("will not open a session on someone else's profile", async () => {
            const other = await registerAndGetCookie(app, {
                ...userData,
                email: "someone.else@gmail.com",
            })

            const response = await session(
                { character: "virgo", profileId },
                other,
            )

            expect(response.statusCode).toBe(404)
        })

        it("reports 502 when ElevenLabs fails", async () => {
            fetchSpy.mockImplementation(() => jsonResponse({}, 500))

            const response = await session({ character: "aries", profileId })

            expect(response.statusCode).toBe(502)
        })

        it("opens a metered session capped at the minutes left", async () => {
            const response = await session({ character: "virgo", profileId })

            const body = response.body as SessionBody
            expect(body.session.maxSeconds).toBe(900)
            const stored = await AstrologerSessionModel.findById(
                body.session.id,
            )
            expect(stored?.conversationId).toBe("conv_1")
        })

        it("returns 402 minutes_exhausted with no minutes left", async () => {
            await UserModel.updateOne(
                { email: userData.email },
                { $set: { "billing.minutes.used": 900 } },
            )

            const response = await session({ character: "virgo", profileId })

            expect(response.statusCode).toBe(402)
            expect(
                (response.body as { errors: { code?: string }[] }).errors[0]
                    ?.code,
            ).toBe("minutes_exhausted")
        })

        it("charges ElevenLabs' recorded duration when the call ends", async () => {
            const opened = await session({ character: "virgo", profileId })
            const { id } = (opened.body as SessionBody).session

            const ended = await request(app)
                .post(`/astrologer/session/${id}/end`)
                .set("Cookie", [cookie])

            expect(ended.statusCode).toBe(200)
            expect(ended.body).toEqual({ settled: true, chargedSeconds: 125 })
            const user = await UserModel.findOne({ email: userData.email })
            expect(user?.billing?.minutes?.used).toBe(125)

            // ending twice charges once
            await request(app)
                .post(`/astrologer/session/${id}/end`)
                .set("Cookie", [cookie])
            const again = await UserModel.findOne({ email: userData.email })
            expect(again?.billing?.minutes?.used).toBe(125)
        })

        it("requires a login", async () => {
            const response = await request(app)
                .post("/astrologer/session")
                .send({ character: "virgo", profileId })

            expect(response.statusCode).toBe(401)
        })
    })

    describe("GET /astrologer/characters/:id/preview", () => {
        it("returns the sample line's audio with word timings", async () => {
            const response = await request(app)
                .get("/astrologer/characters/taurus/preview")
                .set("Cookie", [cookie])

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({
                audio: "QUJD",
                words: [
                    { word: "Hi", start: 0, end: 0.2 },
                    { word: "you", start: 0.3, end: 0.6 },
                ],
            })
        })

        it("rejects an unknown astrologer", async () => {
            const response = await request(app)
                .get("/astrologer/characters/nope/preview")
                .set("Cookie", [cookie])

            expect(response.statusCode).toBe(400)
        })
    })
})

describe("toWords", () => {
    it("folds character timings into words", () => {
        expect(
            toWords({
                characters: ["a", " ", " ", "b", "c"],
                character_start_times_seconds: [0, 1, 2, 3, 4],
                character_end_times_seconds: [1, 2, 3, 4, 5],
            }),
        ).toEqual([
            { word: "a", start: 0, end: 1 },
            { word: "bc", start: 3, end: 5 },
        ])
    })
})
