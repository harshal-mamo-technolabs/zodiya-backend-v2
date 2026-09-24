import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import app from "../../src/app.ts"
import { connectDB, disconnectDB } from "../../src/config/db.ts"
import { TarotService } from "../../src/services/TarotService.ts"
import {
    MAJOR_ARCANA,
    TAROT_DECK,
    TAROT_RANKS,
    TarotSpreads,
    TarotSuits,
} from "../../src/constants/index.ts"
import type { TarotDrawResponse } from "../../src/types/index.ts"
import { registerAndGetCookie } from "../utils/index.ts"

const tarot = new TarotService()

/** A fake generator that hands back the given values in order, then zeros. */
const scripted = (values: number[]) => {
    let i = 0
    return (max: number) => Math.min(values[i++] ?? 0, max - 1)
}

describe("TarotService", () => {
    describe("the deck", () => {
        it("has seventy eight cards, twenty two of them major", () => {
            expect(TAROT_DECK).toHaveLength(78)
            expect(TAROT_DECK.filter((c) => c.arcana === "major")).toHaveLength(
                MAJOR_ARCANA.length,
            )
        })

        it("has fourteen of each suit", () => {
            for (const suit of Object.values(TarotSuits)) {
                expect(
                    TAROT_DECK.filter(
                        (c) => c.arcana === "minor" && c.suit === suit,
                    ),
                ).toHaveLength(TAROT_RANKS.length)
            }
        })

        it("has no duplicate ids", () => {
            expect(new Set(TAROT_DECK.map((c) => c.id)).size).toBe(78)
        })
    })

    describe("draw", () => {
        it("turns one card for a single spread and three for three", () => {
            expect(tarot.draw(TarotSpreads.SINGLE).cards).toHaveLength(1)
            expect(tarot.draw(TarotSpreads.THREE).cards).toHaveLength(3)
            expect(tarot.draw(TarotSpreads.YES_NO).cards).toHaveLength(1)
        })

        it("never deals the same card twice in a spread", () => {
            for (let i = 0; i < 200; i++) {
                const ids = tarot
                    .draw(TarotSpreads.THREE)
                    .cards.map((c) => c.id)
                expect(new Set(ids).size).toBe(3)
            }
        })

        it("labels the three positions in order", () => {
            expect(
                tarot.draw(TarotSpreads.THREE).cards.map((c) => c.position),
            ).toEqual(["Past", "Present", "What follows"])
        })

        /* random(78) = 0 picks the Fool; random(3) = 1 keeps it upright */
        it("reads the upright side when the card lands upright", () => {
            const drawn = tarot.draw(
                TarotSpreads.SINGLE,
                "en",
                scripted([0, 1]),
            )
            const card = drawn.cards[0]

            expect(card?.id).toBe("fool")
            expect(card?.name).toBe("The Fool")
            expect(card?.reversed).toBe(false)
            expect(card?.orientation).toBe("Upright")
            expect(card?.lede).toBe("Start before you feel ready.")
        })

        /* random(3) = 0 reverses */
        it("reads the reversed side when the card lands reversed", () => {
            const drawn = tarot.draw(
                TarotSpreads.SINGLE,
                "en",
                scripted([0, 0]),
            )
            const card = drawn.cards[0]

            expect(card?.reversed).toBe(true)
            expect(card?.orientation).toBe("Reversed")
            expect(card?.lede).toContain("jump")
        })

        it("carries suit and rank for minors and nulls for majors", () => {
            const major = tarot.draw(
                TarotSpreads.SINGLE,
                "en",
                scripted([0, 1]),
            )
            expect(major.cards[0]?.suit).toBeNull()
            expect(major.cards[0]?.rank).toBeNull()

            // index 22 is the first minor: ace of wands
            const minor = tarot.draw(
                TarotSpreads.SINGLE,
                "en",
                scripted([22, 1]),
            )
            expect(minor.cards[0]?.id).toBe("wands-ace")
            expect(minor.cards[0]?.suit).toBe("wands")
            expect(minor.cards[0]?.rank).toBe("ace")
            expect(minor.cards[0]?.number).toBe(1)
        })

        it("answers yes to an upright card and not yet to a reversed one", () => {
            expect(
                tarot.draw(TarotSpreads.YES_NO, "en", scripted([5, 1])).verdict
                    ?.title,
            ).toBe("Yes")
            expect(
                tarot.draw(TarotSpreads.YES_NO, "en", scripted([5, 0])).verdict
                    ?.title,
            ).toBe("Not yet")
            expect(tarot.draw(TarotSpreads.THREE).verdict).toBeNull()
        })

        it("lands roughly a third of cards reversed", () => {
            let reversed = 0
            const total = 3000
            for (let i = 0; i < total; i++) {
                if (tarot.draw(TarotSpreads.SINGLE).cards[0]?.reversed) {
                    reversed++
                }
            }
            expect(reversed / total).toBeGreaterThan(0.26)
            expect(reversed / total).toBeLessThan(0.41)
        })
    })

    /* Every card gets read eventually, so every side must be written. */
    describe("copy coverage", () => {
        it("has both sides, three keywords and no dashes for all seventy eight", () => {
            for (const [index] of TAROT_DECK.entries()) {
                for (const orientation of [0, 1]) {
                    const card = tarot.draw(
                        TarotSpreads.SINGLE,
                        "en",
                        scripted([index, orientation]),
                    ).cards[0]

                    expect(card?.name.length ?? 0).toBeGreaterThan(2)
                    expect(card?.lede.length ?? 0).toBeGreaterThan(10)
                    expect(card?.text.length ?? 0).toBeGreaterThan(80)
                    expect(card?.keywords).toHaveLength(3)
                    expect(JSON.stringify(card)).not.toMatch(/[–—]/)
                }
            }
        })
    })
})

describe("POST /tarot/draw", () => {
    let mongod: MongoMemoryServer
    let cookie: string

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await connectDB(mongod.getUri())
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
        cookie = await registerAndGetCookie(app)
    })

    afterAll(async () => {
        await disconnectDB()
        await mongod.stop()
    })

    it("requires a session", async () => {
        const response = await request(app)
            .post("/tarot/draw")
            .send({ spread: "three" })
        expect(response.statusCode).toBe(401)
    })

    it("draws a spread for a signed in user", async () => {
        const response = await request(app)
            .post("/tarot/draw")
            .set("Cookie", [cookie])
            .send({ spread: "three" })

        expect(response.statusCode).toBe(200)
        const body = response.body as TarotDrawResponse
        expect(body.cards).toHaveLength(3)
        expect(body.headline).toBe("Three cards, one thread.")
        expect(body.spreads.map((s) => s.key)).toEqual([
            "single",
            "three",
            "yesNo",
        ])
    })

    it("rejects an unknown spread", async () => {
        const response = await request(app)
            .post("/tarot/draw")
            .set("Cookie", [cookie])
            .send({ spread: "celtic-cross" })
        expect(response.statusCode).toBe(400)
    })
})
