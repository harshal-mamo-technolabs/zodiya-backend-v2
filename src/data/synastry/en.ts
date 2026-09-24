import {
    AspectTypes,
    Bodies,
    SupportedLanguages,
    SynastryBands,
    SynastrySections,
    TransitTextGroups,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { SynastryCopy } from "../../types/index.ts"

/**
 * English synastry copy. Each section reads a few pairs of planets, one
 * paragraph per pair found, chosen by how the aspect behaves (easy, hard, or
 * a conjunction). {x} is the person who owns the first planet in the pair
 * key, {y} the other. When both planets are the same, {x} is person one.
 */
const en: SynastryCopy = {
    lang: SupportedLanguages.EN,

    labels: {
        stageEntry: "Synastry · entry",
        stagePlate: "Synastry · plate",
        eyebrow: "Comparative plate",
        title: "Two skies, laid one over the other.",
        intro: "Choose two saved profiles. Their charts are already on file. Nothing to type.",
        personOne: "Person one",
        personTwo: "Person two",
        needMore: "Add another profile to run a comparison.",
        addProfile: "Add a profile",
        compare: "Compare the charts",
        ready: "Both profiles chosen",
        notReady: "Choose two different profiles to compare",
        inner: "inner",
        outer: "outer",
        edit: "Edit either entry",
        overall: "Overall reading",
        strongest: "Strongest cross-aspects",
        comparison: "The comparison",
        sectionCount: "Four sections",
        orb: "orb",
    },

    bodies: {
        [Bodies.SUN]: "Sun",
        [Bodies.MOON]: "Moon",
        [Bodies.MERCURY]: "Mercury",
        [Bodies.VENUS]: "Venus",
        [Bodies.MARS]: "Mars",
        [Bodies.JUPITER]: "Jupiter",
        [Bodies.SATURN]: "Saturn",
        [Bodies.URANUS]: "Uranus",
        [Bodies.NEPTUNE]: "Neptune",
        [Bodies.PLUTO]: "Pluto",
        [Bodies.NORTH_NODE]: "North Node",
    },

    signs: {
        [ZodiacSigns.ARIES]: "Aries",
        [ZodiacSigns.TAURUS]: "Taurus",
        [ZodiacSigns.GEMINI]: "Gemini",
        [ZodiacSigns.CANCER]: "Cancer",
        [ZodiacSigns.LEO]: "Leo",
        [ZodiacSigns.VIRGO]: "Virgo",
        [ZodiacSigns.LIBRA]: "Libra",
        [ZodiacSigns.SCORPIO]: "Scorpio",
        [ZodiacSigns.SAGITTARIUS]: "Sagittarius",
        [ZodiacSigns.CAPRICORN]: "Capricorn",
        [ZodiacSigns.AQUARIUS]: "Aquarius",
        [ZodiacSigns.PISCES]: "Pisces",
    },

    aspects: {
        [AspectTypes.CONJUNCTION]: { verb: "conjunct", glyph: "☌" },
        [AspectTypes.SEXTILE]: { verb: "sextile", glyph: "⚹" },
        [AspectTypes.SQUARE]: { verb: "square", glyph: "□" },
        [AspectTypes.TRINE]: { verb: "trine", glyph: "△" },
        [AspectTypes.OPPOSITION]: { verb: "opposite", glyph: "☍" },
    },

    ordinals: [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
        "eleventh",
        "twelfth",
    ],

    houses: [
        "the part of life about how a person comes across and meets the world",
        "the part of life about money, possessions and what feels like enough",
        "the part of life about talk, errands, siblings and the everyday mind",
        "the part of life about home, family and what feels safe",
        "the part of life about play, romance, children and being seen",
        "the part of life about work, health and daily routine",
        "the part of life about partnership and the people one commits to",
        "the part of life about intimacy, shared money and what is held in private",
        "the part of life about belief, travel and the bigger picture",
        "the part of life about career, reputation and what one is known for",
        "the part of life about friends, groups and hopes for the future",
        "the part of life about rest, retreat and what stays unspoken",
    ],
    housePlacement:
        "{x}'s {body} falls in {y}'s {ordinal} house, {meaning}. That is the part of {y}'s life {x} touches just by being there, whether or not either of them notices.",
    houseBasis: "{x} {body} in {y}'s {ordinal} house",

    sections: {
        [SynastrySections.EMOTIONAL]: {
            title: "Emotional Connection",
            none: "Neither Moon makes a close aspect to the other person's Sun, Moon or Venus. This is not a bad sign, just a quiet one. Feeling at home with each other will come from habit and shared time rather than from instinct, and it will take a little longer than it does for some pairs.",
            pairs: {
                "moon-sun": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Moon is in easy aspect to {y}'s Sun, one of the most reliable signs of comfort in a comparison. What {x} needs in order to feel safe is, more or less, how {y} naturally behaves. Neither has to perform for the other, and neither has to explain much.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Moon is in hard aspect to {y}'s Sun. What {x} needs to feel settled and what {y} is simply like do not line up on their own. {y} can read {x}'s moods as criticism, and {x} can feel unseen when {y} is just being {y}. It works when both say plainly what they need instead of expecting it to be guessed.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Moon sits on {y}'s Sun. {x} feels {y}'s moods before they are spoken, and {y} feels understood in a way that is hard to find elsewhere. The risk is that the two blur into one another. A little deliberate distance keeps this warm rather than heavy.",
                },
                "moon-moon": {
                    [TransitTextGroups.FLOW]:
                        "The two Moons are in easy aspect. {x} and {y} get tired, hungry and homesick at similar times and in similar ways, so the small domestic things rarely need negotiating. It is an undramatic gift and one of the best for living together.",
                    [TransitTextGroups.TENSE]:
                        "The two Moons are in hard aspect. {x} and {y} handle feeling differently: one wants to talk it through now, the other wants an hour alone first. Neither method is wrong, but each reads the other's as withdrawal. Naming it helps far more than waiting it out.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Moons sit together. {x} and {y} share an emotional weather system, which makes for deep comfort on good days and a shared slump on bad ones. Someone has to be the one who opens a window.",
                },
                "moon-venus": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Moon is in easy aspect to {y}'s Venus. {y} finds it natural to be kind to {x} in exactly the ways {x} needs, and {x} finds {y} easy to be soft with. Affection here does not have to be worked at.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Moon is in hard aspect to {y}'s Venus. {y} shows care in a style that does not quite land for {x}, and {x} can feel fussed over or overlooked in turns. The fix is small and specific: ask what would actually feel like care, and do that.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Moon sits on {y}'s Venus. There is real tenderness between {x} and {y}, the kind that shows in how they speak to each other when no one else is listening. Keep it from becoming the only language, and it will last.",
                },
            },
        },
        [SynastrySections.ATTRACTION]: {
            title: "Attraction",
            none: "Venus and Mars make no close contact between the two charts. Attraction between {a} and {b}, if it is there, runs on other things: conversation, shared work, timing. It can be steady and real, but it does not switch itself on, and both will need to make the first move more than once.",
            pairs: {
                "venus-mars": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Venus is in easy aspect to {y}'s Mars, the classic pairing for attraction. {y} pursues in the way {x} likes to be pursued, and {x} responds in the way {y} hopes for. Desire here moves at the same tempo for both.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Venus is in hard aspect to {y}'s Mars. The pull is real and a little uncomfortable: {y} pushes, {x} pulls back, and the dance is half the point. It tips into friction when the timing is off, so the honest thing is to say when it is.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Venus sits on {y}'s Mars. This is the aspect people mean when they say chemistry. It is immediate and it does not fade quickly. The work is everything around it, because this part takes care of itself.",
                },
                "mars-mars": {
                    [TransitTextGroups.FLOW]:
                        "The two Mars are in easy aspect. {x} and {y} want things at the same pace and in the same way, which gives the relationship a physical ease neither has to think about. Arguments, when they come, burn out fast.",
                    [TransitTextGroups.TENSE]:
                        "The two Mars are in hard aspect. {x} and {y} both want to lead, and both notice when the other is not following. It makes for energy and also for the occasional flare. Exercise together, and decide in advance who is driving.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Mars sit together. {x} and {y} have the same drive and the same temper, which is exciting and occasionally loud. Point it at a shared goal and it is a strength; point it at each other and it is a long evening.",
                },
                "venus-sun": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Venus is in easy aspect to {y}'s Sun. {x} likes who {y} is, not just what {y} does, and {y} feels it. This is the aspect of being admired for the right reasons.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Venus is in hard aspect to {y}'s Sun. {x} is drawn to exactly the qualities {y} is least sure about, and {y} feels more seen by {x} than by most people. It is attractive and slightly unnerving for both. Let it be.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Venus sits on {y}'s Sun. {x} finds {y} lovely more or less as {y} is, and {y} shines a little brighter around {x}. Simple, warm, and easy to take for granted.",
                },
                "venus-venus": {
                    [TransitTextGroups.FLOW]:
                        "The two Venuses are in easy aspect. {x} and {y} enjoy the same things: the same kind of evening, the same kind of beauty, the same idea of a treat. Shared taste is quieter than passion and outlasts it.",
                    [TransitTextGroups.TENSE]:
                        "The two Venuses are in hard aspect. {x} and {y} have different ideas of a good time and of what affection should look like. It is not serious, but it does mean taking turns rather than assuming.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Venuses sit together. {x} and {y} value the same things and show love in the same style, so it is easy to feel appreciated here. A very comfortable placement for anything built to last.",
                },
            },
        },
        [SynastrySections.COMMUNICATION]: {
            title: "Communication",
            none: "Mercury makes no close contact across the two charts. {a} and {b} will not automatically speak the same language, and that is fine; it means conversations need a little more patience and a little less assuming. Written notes help more than either would expect.",
            pairs: {
                "mercury-mercury": {
                    [TransitTextGroups.FLOW]:
                        "The two Mercuries are in easy aspect. {x} and {y} think at a similar pace and finish each other's sentences more often than not. Plans get made quickly and misunderstandings are rare and short.",
                    [TransitTextGroups.TENSE]:
                        "The two Mercuries are in hard aspect, the classic pattern of two people who are both right and cannot hear it. {x} weighs both sides and revises; {y} decides and moves. Arguments are less about the content than about pace. Slow down on purpose and the content usually agrees.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Mercuries sit together. {x} and {y} share a way of thinking, which makes conversation easy and occasionally an echo chamber. Bring in a third opinion now and then.",
                },
                "mercury-sun": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Mercury is in easy aspect to {y}'s Sun. {x} understands what {y} is about and can put it into words, sometimes better than {y} can. {y} feels heard here.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Mercury is in hard aspect to {y}'s Sun. {x} tends to question the things {y} takes as given, and {y} can hear it as doubt. It sharpens both when it stays curious rather than pointed.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Mercury sits on {y}'s Sun. {x} is a natural spokesperson for {y}, and {y} thinks more clearly with {x} in the room. Good for any shared project.",
                },
                "mercury-moon": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Mercury is in easy aspect to {y}'s Moon. {x} can talk about feelings in a way {y} finds easy to take in, and {y} finds it easy to tell {x} what is going on underneath. Rare, and worth protecting.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Mercury is in hard aspect to {y}'s Moon. {x} reasons where {y} feels, and the words that seem neutral to {x} can land hard on {y}. One extra sentence of warmth from {x} changes everything.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Mercury sits on {y}'s Moon. Head and heart are in the same room here: {x} puts words to what {y} feels, and {y} gives {x}'s ideas a place to land. Talk late and often.",
                },
                "mercury-jupiter": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Mercury is in easy aspect to {y}'s Jupiter. {y} makes {x}'s ideas feel bigger and more possible, and {x} keeps {y}'s optimism in touch with the details. Good conversations, and long ones.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Mercury is in hard aspect to {y}'s Jupiter. {y} tends to round everything up and {x} notices. Plans made together need a second pass with a calculator, and both should know that going in.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Mercury sits on {y}'s Jupiter. {x} and {y} talk each other into things, mostly good ones. Travel, study and big ideas are where this pair does its best thinking.",
                },
                "mercury-saturn": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Mercury is in easy aspect to {y}'s Saturn. {y} gives {x}'s thinking structure, and {x} gives {y}'s caution somewhere useful to go. Conversations here end with something decided.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Mercury is in hard aspect to {y}'s Saturn. {y} can sound like a critic to {x} even when only being careful, and {x} can feel talked down to. It gets better when {y} asks a question instead of stating a concern.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Mercury sits on {y}'s Saturn. Serious talk comes naturally, and {y} is the one who remembers what was agreed. Make sure some of the conversation is just for fun.",
                },
                "mercury-uranus": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Mercury is in easy aspect to {y}'s Uranus. {y} says things that genuinely change {x}'s mind, and {x} finds {y}'s thinking more original than {y} does. Never boring.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Mercury is in hard aspect to {y}'s Uranus. {y} interrupts, changes the subject, and is right often enough to make it maddening. {x} needs to finish a thought sometimes. Say so.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Mercury sits on {y}'s Uranus. Ideas fly between {x} and {y} faster than either can write them down. Brilliant for inventing things, less good for a quiet Sunday.",
                },
            },
        },
        [SynastrySections.LONG_TERM]: {
            title: "Long-term Potential",
            none: "Saturn makes no close contact across the two charts, and neither Sun aspects the other. There is no built-in glue here and no built-in obstacle either. Whether this lasts is a decision {a} and {b} make and keep making, which some people find freeing and others find hard.",
            pairs: {
                "saturn-sun": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Saturn is in easy aspect to {y}'s Sun. {x} is good for {y}'s discipline, and {y} brings warmth to {x}'s seriousness. This is the aspect of a partner who helps the other grow up without making them feel small.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Saturn is in hard aspect to {y}'s Sun. {x} can feel like a brake to {y}, and {y} can feel like a risk to {x}. It is a lasting bond when it works, but the price is that {x} has to say yes more often than feels natural.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Saturn sits on {y}'s Sun. A heavy, durable contact: {x} takes {y} seriously, and {y} takes responsibility around {x}. It can feel like a weight or like a keel, depending on the week.",
                },
                "saturn-moon": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Saturn is in easy aspect to {y}'s Moon. {y} feels safe with {x} in a practical, dependable way, and {x} feels needed. Not the most romantic contact, and one of the best for staying together.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Saturn is in hard aspect to {y}'s Moon. {y} can feel judged or held at a distance by {x}, and {x} can feel {y}'s needs as a demand. Duty holds it together; kindness, offered on purpose, is what makes it worth holding.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Saturn sits on {y}'s Moon. There is loyalty here, and there is a sadness that visits sometimes. {y} needs {x} to soften; {x} needs {y} to trust that the steadiness is love.",
                },
                "saturn-venus": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Saturn is in easy aspect to {y}'s Venus. Affection here is patient and keeps its promises. {x} and {y} are the pair whose friends say they seem like they have been together forever.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Saturn is in hard aspect to {y}'s Venus. {y} can feel unappreciated by {x}, and {x} can feel {y} wants too much. The bond is real but it needs {x} to say the kind thing out loud rather than assume it is known.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Saturn sits on {y}'s Venus. A serious kind of love: slow to start, hard to end. Make room for lightness or it can go grey.",
                },
                "saturn-saturn": {
                    [TransitTextGroups.FLOW]:
                        "The two Saturns are in easy aspect. {x} and {y} hold compatible ideas about what commitment costs and what it is for. Undramatic, and it matters more than almost anything else on this page.",
                    [TransitTextGroups.TENSE]:
                        "The two Saturns are in hard aspect. {x} and {y} were born into different lessons about responsibility, and it shows in how each handles money, time and promises. It can be built across; it takes explicit agreements rather than assumptions.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Saturns sit together, which usually means {x} and {y} were born under the same long cycle. They hold similar ideas about what lasts and what it costs. A quiet, solid foundation.",
                },
                "sun-jupiter": {
                    [TransitTextGroups.FLOW]:
                        "{x}'s Sun is in easy aspect to {y}'s Jupiter. {y} believes in {x}, visibly, and {x} grows in that light. Generous, lucky, and good for the long run.",
                    [TransitTextGroups.TENSE]:
                        "{x}'s Sun is in hard aspect to {y}'s Jupiter. The recurring disagreement here is about how much is enough. It never fully resolves, and it does not need to, as long as both can laugh about it.",
                    [TransitTextGroups.CONJUNCTION]:
                        "{x}'s Sun sits on {y}'s Jupiter. {y} makes {x} feel that more is possible, and {x} gives {y} something worth being generous about. Watch the spending, enjoy the rest.",
                },
                "sun-sun": {
                    [TransitTextGroups.FLOW]:
                        "The two Suns are in easy aspect. {x} and {y} want similar things from life and go about them in compatible ways. Support comes naturally, and so does respect.",
                    [TransitTextGroups.TENSE]:
                        "The two Suns are in hard aspect. {x} and {y} are pulling in different directions, and each occasionally feels the other is in the way. It works when both have a life of their own and bring it home.",
                    [TransitTextGroups.CONJUNCTION]:
                        "The two Suns sit together. {x} and {y} are very alike in what they are here to do, which is comforting and occasionally competitive. Take turns being the one in the spotlight.",
                },
            },
        },
    },

    score: {
        bands: {
            [SynastryBands.STRAINED]: {
                plain: "Strained",
                mixed: "Strained, not without warmth",
            },
            [SynastryBands.WORKABLE]: {
                plain: "Workable",
                mixed: "Workable, with friction",
            },
            [SynastryBands.WARM]: {
                plain: "Warm",
                mixed: "Warm, with friction",
            },
            [SynastryBands.RARE]: {
                plain: "Rare ease",
                mixed: "Rare ease, with an edge",
            },
        },
        detail: "{flow} flowing · {hard} hard · {exact} exact",
        note: "We do not reduce two charts to a percentage. The needle summarises the balance of easy and difficult contacts between personal planets; the sections below are the actual reading.",
    },

    headline: {
        template: "{a} and {b}: {emotional}, {communication}, and {longTerm}.",
        emotional: [
            "a guarded heart",
            "a heart that takes its time",
            "an easy heart",
        ],
        communication: [
            "two different languages",
            "a stubborn argument",
            "the same language",
        ],
        longTerm: [
            "an open question about what lasts",
            "different clocks",
            "the same idea of what lasts",
        ],
    },
}

export default en
