import { randomInt } from "node:crypto"
import {
    DEFAULT_LANGUAGE,
    SupportedLanguages,
    TAROT_DECK,
    TAROT_REVERSED_IN,
    TAROT_SPREAD_SIZE,
    TarotSpreads,
    type Language,
    type TarotCard,
    type TarotSpread,
} from "../constants/index.ts"
import en from "../data/tarot/en.ts"
import type { TarotCopy, TarotDrawResponse } from "../types/index.ts"

/** Add a language by writing src/data/tarot/<lang>.ts and listing it here. */
const COPY: Record<Language, TarotCopy> = {
    [SupportedLanguages.EN]: en,
}

export class TarotService {
    /**
     * Draws a spread. `random` is injectable so a test can force the cards
     * and their orientation; production uses the crypto generator.
     */
    draw(
        spread: TarotSpread,
        lang: Language = DEFAULT_LANGUAGE,
        random: (max: number) => number = (max) => randomInt(max),
    ): TarotDrawResponse {
        const copy = COPY[lang]
        const positions = copy.spreads[spread].positions
        const cards = this.pick(TAROT_SPREAD_SIZE[spread], random).map(
            (card, index) => {
                const reversed = random(TAROT_REVERSED_IN) === 0
                const text = copy.cards[card.id]
                const side = reversed ? text.rev : text.up

                return {
                    ...side,
                    id: card.id,
                    name: text.name,
                    arcana: card.arcana,
                    suit: card.arcana === "minor" ? card.suit : null,
                    rank: card.arcana === "minor" ? card.rank : null,
                    number: card.number,
                    reversed,
                    orientation: reversed
                        ? copy.orientation.reversed
                        : copy.orientation.upright,
                    position: positions[index] ?? "",
                }
            },
        )

        const first = cards[0]
        const verdict =
            spread === TarotSpreads.YES_NO && first
                ? first.reversed
                    ? copy.verdict.notYet
                    : copy.verdict.yes
                : null

        return {
            lang: copy.lang,
            spread,
            headline: copy.spreads[spread].headline,
            subline: copy.spreads[spread].subline,
            prompt: copy.prompt,
            shuffle: copy.shuffle,
            spreads: Object.values(TarotSpreads).map((key) => ({
                key,
                label: copy.spreads[key].label,
            })),
            cards,
            verdict,
        }
    }

    /** `count` distinct cards: a partial Fisher-Yates over a copy of the deck. */
    private pick(count: number, random: (max: number) => number): TarotCard[] {
        const deck = [...TAROT_DECK]

        for (let i = 0; i < count; i++) {
            const j = i + random(deck.length - i)
            const chosen = deck[j]
            const current = deck[i]
            if (chosen && current) {
                deck[i] = chosen
                deck[j] = current
            }
        }

        return deck.slice(0, count)
    }
}
