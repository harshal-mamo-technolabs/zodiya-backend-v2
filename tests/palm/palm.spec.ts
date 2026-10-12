import { jest } from "@jest/globals"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import OpenAI from "openai"
import { S3Client } from "@aws-sdk/client-s3"
import app from "../../src/app.ts"
import { config } from "../../src/config/index.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import {
    LINE_KEYS,
    MOUNTS,
    PALM_REPORT_SCHEMA,
    PHOTO_PROBLEMS,
} from "../../src/services/PalmReportService.ts"
import { highlightPrompt } from "../../src/services/PalmImageService.ts"
import { ProfileModel } from "../../src/models/Profile.ts"
import { UserModel } from "../../src/models/User.ts"
import { PalmReadingModel } from "../../src/models/PalmReading.ts"
import { stripe } from "../../src/services/BillingService.ts"
import { ageFrom } from "../../src/controllers/PalmController.ts"
import {
    geoData,
    profileData,
    registerAndGetCookie,
    userData,
} from "../utils/index.ts"

const JPEG = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    Buffer.alloc(64),
])

const GOOD_PHOTO = {
    subject: "open_palm",
    lighting: "good",
    focus: "sharp",
    palmInFrame: "full",
}

const report = (ok = true, photo: Record<string, string> = {}) => ({
    photo: { ...GOOD_PHOTO, ...photo },
    ok,
    reason: ok ? "" : "Open your hand fully and retake the photo.",
    title: "A steady and curious palm",
    summary: "You think before you act. You value loyalty.",
    hand: {
        type: "Square palm, long fingers",
        element: "Air",
        observation: "Square palm with long fingers.",
        interpretation: "An analytical mind.",
        confidence: "high",
    },
    // out of order and out of range, to prove the server fixes both
    lines: [...LINE_KEYS].reverse().map((key) => ({
        key,
        name: `${key} line`,
        visibility: "clear",
        observation: "Long and deep.",
        quality: "deep and long",
        strength: key === "heart" ? 140 : 60,
        confidence: "medium",
        interpretation: "A traditional meaning.",
    })),
    mounts: MOUNTS.map((name) => ({
        name,
        prominence: "even",
        observation: "Even.",
        interpretation: "balance",
        confidence: "low",
    })),
    mountsText: "Balanced mounts. Steady energy.",
    overall: {
        personality: "p",
        relationships: "r",
        career: "c",
        lifeThemes: "l",
    },
    advice: "Trust your judgement.",
})

describe("POST /palm/read", () => {
    let mongod: MongoMemoryServer
    let cookie: string
    let openaiSpy: jest.SpiedFunction<OpenAI["responses"]["create"]>
    let userId: string
    // the fake bucket: key -> { body, type }, and every command sent to it
    let bucket: Map<string, { body: Buffer; type: string }>
    let s3Calls: { name: string; input: Record<string, unknown> }[]
    let s3Fail: string | null

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        cookie = await registerAndGetCookie(app)
        userId = String(
            (await UserModel.findOne({ email: userData.email }))?._id,
        )
        config.OPENAI_API_KEY = "test-openai-key"
        config.AWS_ACCESS_KEY_ID = "test-key-id"
        config.AWS_SECRET_ACCESS_KEY = "test-secret"
        config.AWS_BUCKET_NAME = "test-bucket"
        bucket = new Map()
        s3Calls = []
        s3Fail = null
        jest.spyOn(S3Client.prototype, "send").mockImplementation(((command: {
            input: Record<string, unknown>
        }) => {
            const name = command.constructor.name
            const input = command.input
            s3Calls.push({ name, input })
            if (name === s3Fail) {
                return Promise.reject(new Error("AccessDenied"))
            }
            const key = input.Key as string
            switch (name) {
                case "PutObjectCommand":
                    bucket.set(key, {
                        body: input.Body as Buffer,
                        type: input.ContentType as string,
                    })
                    return Promise.resolve({})
                case "GetObjectCommand": {
                    const object = bucket.get(key)
                    return object
                        ? Promise.resolve({
                              Body: {
                                  transformToByteArray: () =>
                                      Promise.resolve(
                                          new Uint8Array(object.body),
                                      ),
                              },
                          })
                        : Promise.reject(new Error("NoSuchKey"))
                }
                case "ListObjectsV2Command":
                    return Promise.resolve({
                        Contents: [...bucket.keys()]
                            .filter((k) => k.startsWith(input.Prefix as string))
                            .map((Key) => ({ Key })),
                        IsTruncated: false,
                    })
                case "DeleteObjectsCommand":
                    for (const o of (
                        input.Delete as { Objects: { Key: string }[] }
                    ).Objects) {
                        bucket.delete(o.Key)
                    }
                    return Promise.resolve({})
                default:
                    return Promise.reject(new Error(`unexpected ${name}`))
            }
        }) as never)
        openaiSpy = jest
            .spyOn(OpenAI.Responses.prototype, "create")
            .mockImplementation(
                () =>
                    Promise.resolve({
                        output_text: JSON.stringify(report()),
                    }) as never,
            )
    })

    afterEach(() => {
        jest.restoreAllMocks()
        config.OPENAI_API_KEY = ""
        config.AWS_ACCESS_KEY_ID = ""
        config.AWS_SECRET_ACCESS_KEY = ""
        config.AWS_BUCKET_NAME = ""
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    const read = (
        fields: Record<string, string> = {},
        file: Buffer = JPEG,
        contentType = "image/jpeg",
        withCookie = cookie,
    ) => {
        const req = request(app).post("/palm/read").set("Cookie", [withCookie])
        for (const [k, v] of Object.entries({
            hand: "right",
            dominant: "right",
            lang: "en",
            ...(!fields.profileId && { name: "Asha Rao" }),
            ...fields,
        })) {
            void req.field(k, v)
        }
        return req.attach("photo", file, { filename: "palm", contentType })
    }

    const firstOpenAIBody = () =>
        openaiSpy.mock.calls[0]?.[0] as unknown as {
            model: string
            instructions: string
            input: {
                content: { type: string; text?: string; image_url?: string }[]
            }[]
            text: { format: { strict: boolean; schema: unknown } }
        }

    it("returns the report", async () => {
        const response = await read()

        expect(response.statusCode).toBe(200)
        const body = response.body as Record<string, unknown> & {
            report: { lines: { key: string; strength: number }[] }
        }
        expect(body).toMatchObject({
            hand: "right",
            dominant: true,
            model: config.OPENAI_VISION_MODEL,
        })
        expect(body).not.toHaveProperty("vision")
        expect(body.report.lines.map((l) => l.key)).toEqual([...LINE_KEYS])
        expect(body.report.lines[0]?.strength).toBe(100)

        const sent = firstOpenAIBody()
        expect(sent.model).toBe(config.OPENAI_VISION_MODEL)
        expect(sent.input[0]?.content[0]?.text).toContain(
            "Asha Rao's right hand",
        )
        expect(sent.input[0]?.content[1]?.image_url).toMatch(
            /^data:image\/jpeg;base64,/,
        )
        expect(sent.text.format.strict).toBe(true)
        expect(sent.text.format.schema).toBe(PALM_REPORT_SCHEMA)
        expect(JSON.stringify(body)).not.toContain("test-openai-key")
    })

    it("asks for German with du when lang is de", async () => {
        await read({ lang: "de", dominant: "left" })
        expect(firstOpenAIBody().instructions).toContain('informal "du"')
    })

    it("uses a strict schema: every property required, nothing extra", () => {
        const walk = (node: unknown) => {
            const n = node as {
                type?: string
                properties?: Record<string, unknown>
                required?: string[]
                additionalProperties?: boolean
                items?: unknown
            }
            if (n.type === "object") {
                expect(n.additionalProperties).toBe(false)
                expect(n.required).toEqual(Object.keys(n.properties ?? {}))
                Object.values(n.properties ?? {}).forEach(walk)
            }
            if (n.type === "array") walk(n.items)
        }
        walk(PALM_REPORT_SCHEMA)
    })

    it("answers 422 palm_unclear when the AI cannot read it", async () => {
        openaiSpy.mockImplementation(
            () =>
                Promise.resolve({
                    output_text: JSON.stringify(report(false)),
                }) as never,
        )
        const response = await read()

        expect(response.statusCode).toBe(422)
        expect(response.body).toMatchObject({
            errors: [
                {
                    code: "palm_unclear",
                    msg: "Open your hand fully and retake the photo.",
                },
            ],
        })
    })

    it("answers 502 ai_failed when OpenAI fails, without provider details", async () => {
        openaiSpy.mockImplementation(
            () =>
                Promise.reject(
                    new Error("Rate limit reached for org-secret"),
                ) as never,
        )
        const response = await read()

        expect(response.statusCode).toBe(502)
        expect(response.body).toMatchObject({ errors: [{ code: "ai_failed" }] })
        expect(JSON.stringify(response.body)).not.toContain("org-secret")
    })

    it("answers 502 ai_failed on invalid JSON", async () => {
        openaiSpy.mockImplementation(
            () => Promise.resolve({ output_text: "" }) as never,
        )
        const response = await read()
        expect(response.statusCode).toBe(502)
    })

    it("answers 503 ai_not_configured without an OpenAI key", async () => {
        config.OPENAI_API_KEY = ""
        const response = await read()

        expect(response.statusCode).toBe(503)
        expect(response.body).toMatchObject({
            errors: [
                {
                    code: "ai_not_configured",
                    msg: "Palm reading is not configured: OPENAI_API_KEY is missing on the server.",
                },
            ],
        })
    })

    it("answers 413 too_large over 10 MB", async () => {
        const big = Buffer.concat([JPEG, Buffer.alloc(10 * 1024 * 1024)])
        const response = await read({}, big)

        expect(response.statusCode).toBe(413)
        expect(response.body).toMatchObject({ errors: [{ code: "too_large" }] })
        expect(openaiSpy).not.toHaveBeenCalled()
    })

    it.each([
        ["a non-image type", Buffer.from("hello"), "text/plain"],
        [
            "an image type with the wrong bytes",
            Buffer.from("hello"),
            "image/jpeg",
        ],
    ])("answers 415 unsupported_format for %s", async (_name, file, type) => {
        const response = await read({}, file, type)

        expect(response.statusCode).toBe(415)
        expect(response.body).toMatchObject({
            errors: [{ code: "unsupported_format" }],
        })
    })

    it("answers 401 without a login", async () => {
        const response = await read({}, JPEG, "image/jpeg", "")
        expect(response.statusCode).toBe(401)
    })

    it("answers 400 for a bad hand", async () => {
        const response = await read({ hand: "middle" })

        expect(response.statusCode).toBe(400)
        expect(openaiSpy).not.toHaveBeenCalled()
    })

    it.each([
        [{ subject: "not_a_hand" }, "not_a_hand"],
        [{ subject: "back_of_hand" }, "back_of_hand"],
        [{ subject: "closed_hand" }, "closed_hand"],
        [{ subject: "multiple_hands" }, "multiple_hands"],
        [{ lighting: "too_dark" }, "poor_light"],
        [{ lighting: "too_bright" }, "poor_light"],
        [{ focus: "blurry" }, "blurry"],
        [{ palmInFrame: "partial" }, "palm_cropped"],
    ])("turns the photo away when the check says %j", async (photo, code) => {
        openaiSpy.mockImplementation(
            () =>
                Promise.resolve({
                    output_text: JSON.stringify(report(true, photo)),
                }) as never,
        )
        const response = await read()

        expect(response.statusCode).toBe(422)
        expect(response.body).toMatchObject({
            errors: [
                {
                    code,
                    msg: PHOTO_PROBLEMS[code as keyof typeof PHOTO_PROBLEMS],
                },
            ],
        })
    })

    it("turns the photo away as poor_light when no main line can be seen", async () => {
        const dim = report()
        dim.lines = dim.lines.map((l) =>
            l.key === "fate" ? l : { ...l, visibility: "not_visible" },
        )
        openaiSpy.mockImplementation(
            () =>
                Promise.resolve({ output_text: JSON.stringify(dim) }) as never,
        )
        const response = await read()
        expect(response.body).toMatchObject({
            errors: [{ code: "poor_light" }],
        })
    })

    it("still reads uneven light and slight blur when the lines show", async () => {
        openaiSpy.mockImplementation(
            () =>
                Promise.resolve({
                    output_text: JSON.stringify(
                        report(true, {
                            lighting: "uneven_or_glare",
                            focus: "slightly_blurry",
                        }),
                    ),
                }) as never,
        )
        expect((await read()).statusCode).toBe(200)
    })

    it("asks the model to check the photo before reading it", () => {
        expect(Object.keys(PALM_REPORT_SCHEMA.properties)[0]).toBe("photo")
    })

    const makeProfile = async (owner = userId) =>
        String(
            (
                await ProfileModel.create({
                    ...profileData,
                    ...geoData,
                    user: owner,
                    zodiacSign: "leo",
                })
            )._id,
        )

    const puts = () => s3Calls.filter((c) => c.name === "PutObjectCommand")

    /** A saved reading's id, for the routes that work on one. */
    const saved = async (withCookie = cookie) => {
        const response = await read({}, JPEG, "image/jpeg", withCookie)
        return (response.body as { id: string }).id
    }

    describe("saving readings", () => {
        it("reads a profile's palm, stores the photo and returns a signed URL", async () => {
            const profileId = await makeProfile()
            const response = await read({ profileId })

            expect(response.statusCode).toBe(200)
            const body = response.body as {
                id: string
                saved: boolean
                subject: Record<string, unknown>
                images: { original: string; highlighted: null }
            }
            expect(body.saved).toBe(true)
            expect(body.subject).toEqual({
                kind: "profile",
                profile: profileId,
                name: "harshal chauhan",
                gender: null,
                age: ageFrom(profileData.birthDate),
            })

            const [put] = puts()
            const key = put?.input.Key as string
            expect(key).toMatch(
                new RegExp(
                    `^meridian/palm/${userId}/${body.id}/[0-9a-f-]{36}-original\\.jpg$`,
                ),
            )
            expect(put?.input).toMatchObject({
                Bucket: "test-bucket",
                ContentType: "image/jpeg",
                ServerSideEncryption: "AES256",
            })
            expect(put?.input).not.toHaveProperty("ACL")
            expect(body.images.highlighted).toBeNull()
            // presigned, never the raw object URL
            expect(body.images.original).toContain(encodeURI(key))
            expect(body.images.original).toContain("X-Amz-Signature=")
            expect(body.images.original).toContain("X-Amz-Expires=3600")

            const doc = await PalmReadingModel.findById(body.id)
            expect(doc?.images?.original).toBe(key)
            expect(String(doc?.user)).toBe(userId)
            expect(firstOpenAIBody().instructions).toContain(
                "This reading is for harshal chauhan",
            )
        })

        it("reads someone else's palm by name, gender and age", async () => {
            const response = await read({
                name: "  Mira Shah ",
                gender: "female",
                age: "34",
            })

            expect(response.statusCode).toBe(200)
            const doc = await PalmReadingModel.findById(
                (response.body as { id: string }).id,
            )
            expect(doc?.subject).toMatchObject({
                kind: "other",
                name: "Mira Shah",
                gender: "female",
                age: 34,
            })
            const { instructions } = firstOpenAIBody()
            expect(instructions).toContain("first name, Mira")
            expect(instructions).toContain("never use gendered stereotypes")
        })

        it.each([
            ["both profileId and name", { profileId: "a".repeat(24) }, true],
            ["neither", {}, false],
            ["a bad gender", { gender: "robot" }, true],
            ["an age over 120", { age: "121" }, true],
            ["a blank name", { name: "   " }, true],
        ])(
            "answers 400 for %s",
            async (_name, fields: Record<string, string>, withName) => {
                const req = request(app)
                    .post("/palm/read")
                    .set("Cookie", [cookie])
                for (const [k, v] of Object.entries({
                    hand: "right",
                    dominant: "right",
                    ...(withName && { name: "Asha" }),
                    ...fields,
                })) {
                    void req.field(k, v)
                }
                const response = await req.attach("photo", JPEG, {
                    filename: "palm",
                    contentType: "image/jpeg",
                })
                expect(response.statusCode).toBe(400)
                expect(openaiSpy).not.toHaveBeenCalled()
            },
        )

        it("answers 404 profile_not_found for another user's profile", async () => {
            await registerAndGetCookie(app, {
                ...userData,
                email: "other@gmail.com",
            })
            const other = await UserModel.findOne({ email: "other@gmail.com" })
            const profileId = await makeProfile(String(other?._id))

            const response = await read({ profileId })
            expect(response.statusCode).toBe(404)
            expect(response.body).toMatchObject({
                errors: [{ code: "profile_not_found" }],
            })
            expect(openaiSpy).not.toHaveBeenCalled()
        })

        it("stores nothing for a photo it turns away", async () => {
            openaiSpy.mockImplementation(
                () =>
                    Promise.resolve({
                        output_text: JSON.stringify(
                            report(true, { subject: "not_a_hand" }),
                        ),
                    }) as never,
            )
            expect((await read()).statusCode).toBe(422)
            expect(puts()).toHaveLength(0)
            expect(await PalmReadingModel.countDocuments()).toBe(0)
        })

        it("still hands over the reading when storage fails", async () => {
            s3Fail = "PutObjectCommand"
            const response = await read()

            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject({
                id: null,
                saved: false,
                report: { title: "A steady and curious palm" },
            })
            expect(await PalmReadingModel.countDocuments()).toBe(0)
        })

        it("answers 503 storage_not_configured before calling OpenAI", async () => {
            const id = await saved()
            openaiSpy.mockClear()
            config.AWS_BUCKET_NAME = ""
            const response = await read()

            expect(response.statusCode).toBe(503)
            expect(response.body).toMatchObject({
                errors: [{ code: "storage_not_configured" }],
            })
            expect(openaiSpy).not.toHaveBeenCalled()
            const one = await request(app)
                .get(`/palm/readings/${id}`)
                .set("Cookie", [cookie])
            expect(one.statusCode).toBe(503)
        })
    })

    describe("POST /palm/readings/:id/highlight", () => {
        let editSpy: jest.SpiedFunction<OpenAI["images"]["edit"]>

        beforeEach(() => {
            editSpy = jest
                .spyOn(OpenAI.Images.prototype, "edit")
                .mockImplementation(
                    () =>
                        Promise.resolve({
                            created: 0,
                            data: [{ b64_json: "SElHSA==" }],
                        }) as never,
                )
        })

        const draw = (id: string, withCookie = cookie) =>
            request(app)
                .post(`/palm/readings/${id}/highlight`)
                .set("Cookie", [withCookie])

        const sent = () =>
            editSpy.mock.calls[0]?.[0] as unknown as {
                model: string
                quality: string
                prompt: string
            }

        it("draws the stored photo once, stores it, then reuses it", async () => {
            const id = await saved()
            const response = await draw(id)

            expect(response.statusCode).toBe(200)
            const body = response.body as { image: string; model: string }
            expect(body.model).toBe(config.OPENAI_IMAGE_MODEL)
            expect(body.image).toContain("X-Amz-Signature=")
            expect(sent().model).toBe(config.OPENAI_IMAGE_MODEL)
            expect(sent().quality).toBe(config.OPENAI_IMAGE_QUALITY)
            expect(sent().prompt).toContain("red #E5484D")
            expect(sent().prompt).toContain("gold #E3B64B")

            expect(s3Calls.some((c) => c.name === "GetObjectCommand")).toBe(
                true,
            )
            const put = puts()[1]
            const key = put?.input.Key as string
            expect(key).toMatch(
                new RegExp(
                    `^meridian/palm/${userId}/${id}/[0-9a-f-]{36}-highlighted\\.jpg$`,
                ),
            )
            expect(put?.input).toMatchObject({
                ContentType: "image/jpeg",
                ServerSideEncryption: "AES256",
            })
            expect(bucket.get(key)?.body.toString()).toBe("HIGH")
            const doc = await PalmReadingModel.findById(id)
            expect(doc?.images?.highlighted).toBe(key)
            expect(doc?.highlight).toMatchObject({
                state: "done",
                model: config.OPENAI_IMAGE_MODEL,
            })

            const again = await draw(id)
            expect(again.statusCode).toBe(200)
            expect((again.body as { image: string }).image).toContain(
                encodeURI(key),
            )
            expect(editSpy).toHaveBeenCalledTimes(1)
        })

        it("does not ask for lines the reading found not visible", async () => {
            const dim = report()
            dim.lines = dim.lines.map((l) =>
                l.key === "fate" ? { ...l, visibility: "not_visible" } : l,
            )
            openaiSpy.mockImplementation(
                () =>
                    Promise.resolve({
                        output_text: JSON.stringify(dim),
                    }) as never,
            )
            await draw(await saved())
            expect(sent().prompt).not.toContain("fate line")
            expect(sent().prompt).toContain("life line")
        })

        it("keeps every line in the prompt by default", () => {
            for (const key of LINE_KEYS) {
                expect(highlightPrompt([])).toContain(`${key} line`)
            }
        })

        it("answers 404 for another user's reading and 400 for a bad id", async () => {
            const id = await saved()
            const other = await registerAndGetCookie(app, {
                ...userData,
                email: "other@gmail.com",
            })
            expect((await draw(id, other)).statusCode).toBe(404)
            expect((await draw("nope")).statusCode).toBe(400)
            expect(editSpy).not.toHaveBeenCalled()
        })

        it("answers 503 ai_not_configured without an OpenAI key", async () => {
            const id = await saved()
            config.OPENAI_API_KEY = ""
            const response = await draw(id)
            expect(response.statusCode).toBe(503)
            expect(response.body).toMatchObject({
                errors: [{ code: "ai_not_configured" }],
            })
        })

        it("answers 422 image_refused when the safety system declines", async () => {
            editSpy.mockImplementation(
                () =>
                    Promise.reject(
                        new OpenAI.BadRequestError(
                            400,
                            undefined,
                            "Your request was rejected by the safety system.",
                            new Headers(),
                        ),
                    ) as never,
            )
            const response = await draw(await saved())
            expect(response.statusCode).toBe(422)
            expect(response.body).toMatchObject({
                errors: [{ code: "image_refused" }],
            })
        })

        it("answers 502 ai_failed and marks the reading failed", async () => {
            const id = await saved()
            editSpy.mockImplementation(
                () => Promise.reject(new Error("socket hang up")) as never,
            )
            expect((await draw(id)).statusCode).toBe(502)
            expect(
                (await PalmReadingModel.findById(id))?.highlight?.state,
            ).toBe("failed")

            editSpy.mockImplementation(
                () => Promise.resolve({ created: 0, data: [] }) as never,
            )
            const empty = await draw(id)
            expect(empty.statusCode).toBe(502)
            expect(empty.body).toMatchObject({
                errors: [{ code: "ai_failed" }],
            })
        })

        it("answers 401 without a login", async () => {
            expect((await draw(await saved(), "")).statusCode).toBe(401)
        })
    })

    describe("reading history", () => {
        it("lists readings newest first, a page at a time", async () => {
            const ids = [await saved(), await saved(), await saved()]
            // spread them out so the createdAt cursor is unambiguous
            await Promise.all(
                ids.map((id, i) =>
                    PalmReadingModel.collection.updateOne(
                        { _id: new mongoose.Types.ObjectId(id) },
                        {
                            $set: {
                                createdAt: new Date(Date.UTC(2026, 0, i + 1)),
                            },
                        },
                    ),
                ),
            )

            const first = await request(app)
                .get("/palm/readings?limit=2")
                .set("Cookie", [cookie])
            expect(first.statusCode).toBe(200)
            const page = first.body as {
                readings: Record<string, unknown>[]
                next: string
            }
            expect(page.readings.map((r) => r.id)).toEqual([ids[2], ids[1]])
            expect(page.readings[0]).toMatchObject({
                subject: { name: "Asha Rao", kind: "other" },
                hand: "right",
                title: "A steady and curious palm",
                createdAt: "2026-01-03T00:00:00.000Z",
            })
            expect(page.readings[0]?.thumb).toContain("-original.jpg")
            expect(page.next).toBe("2026-01-02T00:00:00.000Z")

            const second = await request(app)
                .get(`/palm/readings?limit=2&before=${page.next}`)
                .set("Cookie", [cookie])
            expect(
                (second.body as { readings: { id: string }[] }).readings.map(
                    (r) => r.id,
                ),
            ).toEqual([ids[0]])
            expect((second.body as { next: null }).next).toBeNull()
        })

        it("lists only the user's own readings and checks the query", async () => {
            await saved()
            const other = await registerAndGetCookie(app, {
                ...userData,
                email: "other@gmail.com",
            })
            const response = await request(app)
                .get("/palm/readings")
                .set("Cookie", [other])
            expect(response.body).toEqual({ readings: [], next: null })
            expect(
                (
                    await request(app)
                        .get("/palm/readings?limit=51")
                        .set("Cookie", [cookie])
                ).statusCode,
            ).toBe(400)
        })

        it("returns one reading with signed image URLs", async () => {
            const id = await saved()
            const response = await request(app)
                .get(`/palm/readings/${id}`)
                .set("Cookie", [cookie])

            expect(response.statusCode).toBe(200)
            const body = response.body as Record<string, unknown> & {
                images: { original: string; highlighted: null }
            }
            expect(body).toMatchObject({
                id,
                hand: "right",
                dominant: true,
                lang: "en",
                model: config.OPENAI_VISION_MODEL,
                subject: { kind: "other", name: "Asha Rao" },
                report: { title: "A steady and curious palm" },
                highlight: { state: "none" },
            })
            expect(body.images.original).toContain("X-Amz-Signature=")
            expect(body.images.highlighted).toBeNull()

            const other = await registerAndGetCookie(app, {
                ...userData,
                email: "other@gmail.com",
            })
            expect(
                (
                    await request(app)
                        .get(`/palm/readings/${id}`)
                        .set("Cookie", [other])
                ).statusCode,
            ).toBe(404)
        })

        it("deletes a reading and its photos", async () => {
            const id = await saved()
            jest.spyOn(OpenAI.Images.prototype, "edit").mockImplementation(
                () =>
                    Promise.resolve({
                        created: 0,
                        data: [{ b64_json: "SElHSA==" }],
                    }) as never,
            )
            await request(app)
                .post(`/palm/readings/${id}/highlight`)
                .set("Cookie", [cookie])
            expect(bucket.size).toBe(2)

            const response = await request(app)
                .delete(`/palm/readings/${id}`)
                .set("Cookie", [cookie])
            expect(response.statusCode).toBe(204)
            expect(bucket.size).toBe(0)
            expect(await PalmReadingModel.countDocuments()).toBe(0)
        })

        it("removes the user's readings and photos with the account", async () => {
            await saved()
            await saved()
            jest.spyOn(stripe.customers, "del").mockResolvedValue({} as never)

            const response = await request(app)
                .delete("/auth/me")
                .set("Cookie", [cookie])
            expect(response.statusCode).toBe(204)
            expect(await PalmReadingModel.countDocuments()).toBe(0)
            expect(
                s3Calls.find((c) => c.name === "ListObjectsV2Command")?.input
                    .Prefix,
            ).toBe(`meridian/palm/${userId}/`)
            expect(bucket.size).toBe(0)
        })

        it("still removes the account when storage fails", async () => {
            await saved()
            s3Fail = "ListObjectsV2Command"
            jest.spyOn(stripe.customers, "del").mockResolvedValue({} as never)

            const response = await request(app)
                .delete("/auth/me")
                .set("Cookie", [cookie])
            expect(response.statusCode).toBe(204)
            expect(await UserModel.countDocuments()).toBe(0)
            expect(await PalmReadingModel.countDocuments()).toBe(0)
        })
    })
})
