import {
    Bodies,
    Lunations,
    NatalAngles,
    SupportedLanguages,
    TransitAspects,
    TransitTextGroups,
    TransitTones,
} from "../../constants/index.ts"
import type { TransitCopy } from "../../types/index.ts"

/**
 * English transit copy. A reading is built from three parts: a lede for the
 * transiting body and aspect, a paragraph for the transiting body and how the
 * aspect behaves (easy, hard, or a conjunction), and a closing sentence for
 * the natal point being touched. Written so the three read as one piece.
 */
const en: TransitCopy = {
    lang: SupportedLanguages.EN,

    labels: {
        timeline: "Timeline",
        activeToday: "Active today",
        activeOn: "Active on {date}",
        bySignificance: "by significance",
        transiting: "Transiting",
        natal: "Natal",
        orb: "Orb",
        exact: "Exact",
        quiet: "A quiet sky. No major aspects within a degree on this day.",
        select: "Select a marker on the timeline to read that transit.",
        backToToday: "Back to today",
        headlineToday: "What the sky is doing to your chart today.",
        lookingBackOne: "Looking back 1 day.",
        lookingBackMany: "Looking back {n} days.",
        lookingAheadOne: "Looking ahead 1 day.",
        lookingAheadMany: "Looking ahead {n} days.",
    },

    tones: {
        [TransitTones.TENSE]: "Demanding",
        [TransitTones.FLOW]: "Supportive",
        [TransitTones.NEUTRAL]: "Neutral",
    },

    aspects: {
        [TransitAspects.CONJUNCTION]: { name: "Conjunction", glyph: "☌" },
        [TransitAspects.SEXTILE]: { name: "Sextile", glyph: "⚹" },
        [TransitAspects.SQUARE]: { name: "Square", glyph: "□" },
        [TransitAspects.TRINE]: { name: "Trine", glyph: "△" },
        [TransitAspects.QUINCUNX]: { name: "Quincunx", glyph: "⚻" },
        [TransitAspects.OPPOSITION]: { name: "Opposition", glyph: "☍" },
    },

    points: {
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
        [NatalAngles.ASC]: "Ascendant",
        [NatalAngles.MC]: "Midheaven",
    },

    lunations: {
        [Lunations.NEW]: "New Moon",
        [Lunations.FULL]: "Full Moon",
    },

    motion: {
        retrograde: "Retrograde",
        direct: "Direct",
        slow: "slow",
        fast: "fast",
        lunation: "Lunation",
        joiner: " · ",
    },

    ledes: {
        [Bodies.SUN]: {
            [TransitAspects.CONJUNCTION]: "A light on the thing itself.",
            [TransitAspects.SEXTILE]: "A small opening, easy to use.",
            [TransitAspects.SQUARE]:
                "A day that shows you where the friction is.",
            [TransitAspects.TRINE]: "Things line up without being pushed.",
            [TransitAspects.QUINCUNX]:
                "Two parts of the day that will not quite fit.",
            [TransitAspects.OPPOSITION]: "A glance back at the path.",
        },
        [Bodies.MERCURY]: {
            [TransitAspects.CONJUNCTION]:
                "The words arrive, and they are precise.",
            [TransitAspects.SEXTILE]:
                "A conversation that goes better than expected.",
            [TransitAspects.SQUARE]:
                "A small friction between how you sound and how you mean.",
            [TransitAspects.TRINE]: "Say it now, while it comes out right.",
            [TransitAspects.QUINCUNX]: "Something gets lost in translation.",
            [TransitAspects.OPPOSITION]:
                "Someone hears the opposite of what you said.",
        },
        [Bodies.VENUS]: {
            [TransitAspects.CONJUNCTION]:
                "Softer than usual, and better for it.",
            [TransitAspects.SEXTILE]: "A pleasant chance, if you take it.",
            [TransitAspects.SQUARE]:
                "Wanting the thing and the cost of the thing.",
            [TransitAspects.TRINE]: "Easy company, easy taste, easy money.",
            [TransitAspects.QUINCUNX]:
                "Something you like is quietly out of place.",
            [TransitAspects.OPPOSITION]: "Whose idea of nice is this?",
        },
        [Bodies.MARS]: {
            [TransitAspects.CONJUNCTION]: "Heat, applied directly.",
            [TransitAspects.SEXTILE]: "Energy with somewhere to go.",
            [TransitAspects.SQUARE]: "Sharp words arrive fully formed.",
            [TransitAspects.TRINE]:
                "Drive that does not need to fight anything.",
            [TransitAspects.QUINCUNX]:
                "Effort in a direction that does not quite pay.",
            [TransitAspects.OPPOSITION]: "Someone pushes, and you push back.",
        },
        [Bodies.JUPITER]: {
            [TransitAspects.CONJUNCTION]: "More of it, all at once.",
            [TransitAspects.SEXTILE]: "Room to feel more than usual.",
            [TransitAspects.SQUARE]: "Too much of a good thing, briefly.",
            [TransitAspects.TRINE]: "Luck that looks a lot like timing.",
            [TransitAspects.QUINCUNX]: "Generosity aimed slightly wrong.",
            [TransitAspects.OPPOSITION]: "A big offer, and the fine print.",
        },
        [Bodies.SATURN]: {
            [TransitAspects.CONJUNCTION]: "The long correction.",
            [TransitAspects.SEXTILE]:
                "A quiet chance to build something that lasts.",
            [TransitAspects.SQUARE]: "The wall you have been walking toward.",
            [TransitAspects.TRINE]: "Effort that finally holds.",
            [TransitAspects.QUINCUNX]:
                "A duty that does not fit the life around it.",
            [TransitAspects.OPPOSITION]: "Someone else's rules, up close.",
        },
        [Bodies.URANUS]: {
            [TransitAspects.CONJUNCTION]: "The floor moves.",
            [TransitAspects.SEXTILE]: "A door you did not know was there.",
            [TransitAspects.SQUARE]:
                "The urge to break something that is not broken.",
            [TransitAspects.TRINE]: "Change that feels like relief.",
            [TransitAspects.QUINCUNX]: "Restless for no reason you can name.",
            [TransitAspects.OPPOSITION]:
                "Someone changes the terms without asking.",
        },
        [Bodies.NEPTUNE]: {
            [TransitAspects.CONJUNCTION]: "The edges go soft.",
            [TransitAspects.SEXTILE]: "A gentle blur that helps.",
            [TransitAspects.SQUARE]: "The story you are telling yourself.",
            [TransitAspects.TRINE]: "Faith, arriving quietly.",
            [TransitAspects.QUINCUNX]: "A vague unease that will not resolve.",
            [TransitAspects.OPPOSITION]: "Someone is not who you thought.",
        },
        [Bodies.PLUTO]: {
            [TransitAspects.CONJUNCTION]: "Down to the foundations.",
            [TransitAspects.SEXTILE]: "Power you can use, for once.",
            [TransitAspects.SQUARE]: "What you are refusing to let go of.",
            [TransitAspects.TRINE]: "Strength from somewhere deep.",
            [TransitAspects.QUINCUNX]: "A pressure that has no obvious source.",
            [TransitAspects.OPPOSITION]:
                "A contest of wills, and it is not small.",
        },
    },

    texts: {
        [Bodies.SUN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Once a year the Sun crosses this point in your chart and lights it up. Whatever it stands for gets attention, energy and a little more of you than usual. Not a turning point so much as a checkpoint: notice what is here, and give it a day.",
            [TransitTextGroups.FLOW]:
                "A day or two of easy alignment. Nothing dramatic, just the sense that the thing works without effort. Use it for whatever needs a clear head and a steady hand, because both are available.",
            [TransitTextGroups.TENSE]:
                "Brief and passing, and a useful irritant. For a day or so you can see plainly where you and this part of your life are not pulling together. Do not overreact to it. Note what it shows you and let it move on.",
        },
        [Bodies.MERCURY]: {
            [TransitTextGroups.CONJUNCTION]:
                "Mercury sits on this point for a day or two, and thinking about it gets sharper. Conversations, messages and decisions connected to it come easily. Write the thing down while the words are this clear.",
            [TransitTextGroups.FLOW]:
                "Communication runs smoothly here for a day or two. Say the difficult thing, send the email, ask the question. You will be understood the first time, which is rarer than it sounds.",
            [TransitTextGroups.TENSE]:
                "Brief and passing. You may be misread once or twice this week, usually as sharper than you intended, or you may misread someone else. Add one sentence of context and the problem dissolves.",
        },
        [Bodies.VENUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Venus rests on this point for a few days and whatever it stands for gets warmer, prettier and easier to enjoy. A good stretch to buy the thing, book the table, or forgive the person.",
            [TransitTextGroups.FLOW]:
                "A few pleasant days. People are easier, money is a little looser, and taste is reliable. Nothing here needs to be chased. Accept what is offered and enjoy it without checking for the catch.",
            [TransitTextGroups.TENSE]:
                "A short tension between what you want and what it costs, or between your idea of a good time and someone else's. Not serious. Indulge a little, then stop, and do not sign up for anything on the strength of a nice evening.",
        },
        [Bodies.MARS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Mars sits on this point for a few days and everything it touches runs hotter. Your energy is up, your patience is down, and decisions come fast and blunt. Excellent for starting things, dangerous for group chats. Draft the message, then wait until tomorrow to send the one that matters.",
            [TransitTextGroups.FLOW]:
                "A few days of usable energy with no resistance. Whatever you have been putting off because it felt like a fight is not a fight this week. Start it now and you will get further than you expect.",
            [TransitTextGroups.TENSE]:
                "A few days of friction. Something pushes, you push back, and the argument that follows is rarely about what it seems. Move your body, keep your tongue, and do not make any permanent decision in a temper.",
        },
        [Bodies.JUPITER]: {
            [TransitTextGroups.CONJUNCTION]:
                "Jupiter sits on this point for a couple of weeks and makes it bigger: more opportunity, more confidence, more appetite. Say yes to what arrives, but check the size of the bite. Jupiter enlarges everything, including the mistakes.",
            [TransitTextGroups.FLOW]:
                "Jupiter opens the aperture here for a week or two. Small good things land bigger, help comes when asked for, and the version of you that is normally careful is willing to be generous first. Use the window to say the warm thing you usually keep.",
            [TransitTextGroups.TENSE]:
                "Too much, briefly. Overconfidence, overspending, overpromising, the big plan that skips the boring part. Jupiter in a hard aspect is not unlucky, it is careless. Enjoy the optimism and halve the estimate.",
        },
        [Bodies.SATURN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Saturn spends weeks, sometimes months, within a degree of this point. This is not a crisis, it is an audit. Where you have been coasting on talent it asks for structure; where you have been overworking it asks why. What survives Saturn is what you actually meant.",
            [TransitTextGroups.FLOW]:
                "A long, quiet chance to make something solid. Saturn in an easy aspect does not hand you anything, but it rewards effort at nearly a fair rate, which is more than most months offer. Build the boring thing now. It will still be standing in ten years.",
            [TransitTextGroups.TENSE]:
                "Saturn stays here for weeks, and the pressure is steady rather than sharp. Something is being tested: a commitment, a structure, a way of doing things you assumed would hold. It will hold if it was real. If it was not, this is when you find out, and the finding out is the gift.",
        },
        [Bodies.URANUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Uranus sits on this point for the better part of a year, and it does not sit still. Expect the unexpected in whatever this stands for: a sudden change, a sudden urge to change it yourself. Do not resist the whole thing. Do decide which parts of it are yours.",
            [TransitTextGroups.FLOW]:
                "A long stretch in which change comes as relief rather than shock. Something that was stuck loosens on its own, and new options appear where the walls used to be. Say yes to the strange invitation.",
            [TransitTextGroups.TENSE]:
                "Months of restlessness aimed at whatever this point stands for. You will want to break it, leave it, or turn it upside down, and some of that urge is right. Separate the real need for change from the itch, and act only on the first.",
        },
        [Bodies.NEPTUNE]: {
            [TransitTextGroups.CONJUNCTION]:
                "Neptune spends a year or more on this point, and while it does, the edges of that part of life go soft. Boundaries blur, ideals grow, and it becomes hard to tell inspiration from wishful thinking. Keep a friend who tells you the truth close by, and do not sign anything you cannot read in daylight.",
            [TransitTextGroups.FLOW]:
                "A long, gentle transit that lends imagination and compassion to whatever this touches. Faith comes easily here, and so does forgiveness. It is a good time for art, prayer, rest, and giving people the benefit of the doubt.",
            [TransitTextGroups.TENSE]:
                "Months of low fog around this part of life. Not disaster, but confusion: a story you keep telling yourself, a hope that outruns the evidence, an escape that has become a habit. The way out is unglamorous. Ask plain questions and write the answers down.",
        },
        [Bodies.PLUTO]: {
            [TransitTextGroups.CONJUNCTION]:
                "Pluto sits on this point for years, and it does not leave things as it found them. Whatever this stands for is being taken down to the foundations and rebuilt, whether you asked for it or not. It is slow, it is total, and what comes out the other side is stronger than what went in.",
            [TransitTextGroups.FLOW]:
                "A long transit that hands you real power over this part of your life, quietly. Depth, focus and the ability to change something at the root. Use it on purpose, because Pluto used by accident is heavier than it needs to be.",
            [TransitTextGroups.TENSE]:
                "Years of pressure on whatever this point stands for, and the pressure is aimed at what you are refusing to release. Control, an old identity, a story about how things have to be. Pluto does not negotiate. The sooner you let go of the thing that is already gone, the sooner this eases.",
        },
    },

    lunationLedes: {
        [Lunations.NEW]: {
            [TransitAspects.CONJUNCTION]: "A clean start, exactly here.",
            [TransitAspects.SEXTILE]: "A small seed, well placed.",
            [TransitAspects.SQUARE]: "A beginning with something in its way.",
            [TransitAspects.TRINE]: "A start that will take root on its own.",
            [TransitAspects.QUINCUNX]:
                "A new thing that does not fit the old plan.",
            [TransitAspects.OPPOSITION]:
                "A beginning that asks what you are ending.",
        },
        [Lunations.FULL]: {
            [TransitAspects.CONJUNCTION]:
                "Everything about this comes to light.",
            [TransitAspects.SEXTILE]: "A bright night, easily used.",
            [TransitAspects.SQUARE]: "A night when the tension shows.",
            [TransitAspects.TRINE]: "Fullness without strain.",
            [TransitAspects.QUINCUNX]:
                "Something is complete and still uneasy.",
            [TransitAspects.OPPOSITION]:
                "Two sides of your life pull in opposite directions for a night.",
        },
    },

    lunationTexts: {
        [Lunations.NEW]: {
            [TransitTextGroups.CONJUNCTION]:
                "The New Moon falls directly on this point, which makes it the month's starting line for whatever it stands for. Intentions set in the next two days carry unusually far. Keep them small and specific.",
            [TransitTextGroups.FLOW]:
                "A New Moon in easy aspect here: a gentle month long cycle begins for this part of your life, with the wind behind it. Nothing needs forcing. Decide what you want and let it grow.",
            [TransitTextGroups.TENSE]:
                "A New Moon in hard aspect to this point starts a month with a snag in it. Something in this part of your life wants to begin and something else stands in the way. Name the obstacle in the first week and the month goes better.",
        },
        [Lunations.FULL]: {
            [TransitTextGroups.CONJUNCTION]:
                "The Full Moon lands on this point and lights it completely. What has been building here for two weeks comes to a head, usually in one evening. Let it be seen, and let the evening be quiet afterwards.",
            [TransitTextGroups.FLOW]:
                "A Full Moon in easy aspect here brings a peak without a fight. Something in this part of your life is complete, or nearly, and you get to see it whole. Enjoy the view before the next cycle starts.",
            [TransitTextGroups.TENSE]:
                "A Full Moon in hard aspect to this point pulls on it for a night. Something you have been treating as one problem turns out to have a second, private root. Do not decide anything under it. Sleep, and look again in the morning.",
        },
    },

    advice: {
        [Bodies.SUN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Give this part of your life one full day of your attention, and nothing else.",
            [TransitTextGroups.FLOW]:
                "Do the task that needs a clear head today. It will not feel this easy next week.",
            [TransitTextGroups.TENSE]:
                "Notice what irritates you today and write it down. Decide about it later.",
        },
        [Bodies.MERCURY]: {
            [TransitTextGroups.CONJUNCTION]:
                "Write the thing down while the words are clear. Send it tomorrow.",
            [TransitTextGroups.FLOW]:
                "Have the conversation you have been putting off. You will be understood.",
            [TransitTextGroups.TENSE]:
                "Reread every message before you send it, and add one sentence of context.",
        },
        [Bodies.VENUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Book the table, buy the small thing, or say the kind word you have been saving.",
            [TransitTextGroups.FLOW]:
                "Accept the invitation. Do not look for the catch.",
            [TransitTextGroups.TENSE]:
                "Enjoy the evening, then sign nothing on the strength of it.",
        },
        [Bodies.MARS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Start the thing you have been circling. Draft the sharp message and send it tomorrow.",
            [TransitTextGroups.FLOW]:
                "Begin the job that felt like a fight. This week it is not one.",
            [TransitTextGroups.TENSE]:
                "Move your body hard on the exact day. Make no permanent decision in a temper.",
        },
        [Bodies.JUPITER]: {
            [TransitTextGroups.CONJUNCTION]:
                "Say yes to what arrives, and check the size of the bite before you do.",
            [TransitTextGroups.FLOW]:
                "Ask for the thing you have been rehearsing. Ask while the window is open.",
            [TransitTextGroups.TENSE]:
                "Halve the estimate. Keep the optimism and lose the extra zero.",
        },
        [Bodies.SATURN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Pick the one commitment that matters here and finish it properly. Drop the rest.",
            [TransitTextGroups.FLOW]:
                "Build the boring structure now, while it feels easy. It will hold for years.",
            [TransitTextGroups.TENSE]:
                "Cut scope, not standards. Say no to the extra thing.",
        },
        [Bodies.URANUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Change one thing on purpose before the change chooses itself.",
            [TransitTextGroups.FLOW]:
                "Try the odd idea. This is the season it is allowed to work.",
            [TransitTextGroups.TENSE]:
                "Change one habit deliberately before the impulse changes three for you.",
        },
        [Bodies.NEPTUNE]: {
            [TransitTextGroups.CONJUNCTION]:
                "Make something, rest, or pray. Do not sign anything.",
            [TransitTextGroups.FLOW]:
                "Make art. Let the practical decision wait until the aspect separates.",
            [TransitTextGroups.TENSE]:
                "Check the facts twice, and check who told you them.",
        },
        [Bodies.PLUTO]: {
            [TransitTextGroups.CONJUNCTION]:
                "Let go of the version of this you have been defending. Keep what is still true.",
            [TransitTextGroups.FLOW]:
                "Do the deep, slow work here. Nobody will see it for a year, and it will matter.",
            [TransitTextGroups.TENSE]:
                "Loosen your grip a little. Whatever you hold this tightly is already changing.",
        },
    },
    lunationAdvice: {
        [Lunations.NEW]: {
            [TransitTextGroups.CONJUNCTION]:
                "Set one small, specific intention for this part of your life in the next two days.",
            [TransitTextGroups.FLOW]:
                "Decide what you want here and then leave it alone to grow.",
            [TransitTextGroups.TENSE]:
                "Name the obstacle in the first week. The month goes better once it has a name.",
        },
        [Lunations.FULL]: {
            [TransitTextGroups.CONJUNCTION]:
                "Let what has been building be seen, and keep the evening afterwards quiet.",
            [TransitTextGroups.FLOW]:
                "Take a moment to see what is finished here before the next cycle starts.",
            [TransitTextGroups.TENSE]:
                "Decide nothing tonight. Sleep, and look again in the morning.",
        },
    },

    natal: {
        [Bodies.SUN]:
            "Your Sun is where this lands: your sense of who you are, what you are for, and how much of yourself you are willing to show.",
        [Bodies.MOON]:
            "Your Moon is where this lands: what you need, how you feel, and what you reach for when you are tired.",
        [Bodies.MERCURY]:
            "Your Mercury is where this lands: how you think, how you talk, and what you say when you are not being careful.",
        [Bodies.VENUS]:
            "Your Venus is where this lands: what you love, what you find beautiful, and how you let people close.",
        [Bodies.MARS]:
            "Your Mars is where this lands: your drive, your temper, and what you do when something is in your way.",
        [Bodies.JUPITER]:
            "Your Jupiter is where this lands: your luck, your appetite for more, and the part of you that says yes too quickly.",
        [Bodies.SATURN]:
            "Your Saturn is where this lands: your discipline, your fears, and the rules you set for yourself before anyone else did.",
        [Bodies.URANUS]:
            "Your Uranus is where this lands: the part of you that refuses to be told, and needs its own way even when the old way worked.",
        [Bodies.NEPTUNE]:
            "Your Neptune is where this lands: what you dream about, what you would rather not look at, and where you go to escape.",
        [Bodies.PLUTO]:
            "Your Pluto is where this lands: what you hold on to hardest, and what you would rebuild your whole life around if you had to.",
        [Bodies.NORTH_NODE]:
            "Your North Node is where this lands: the direction your life keeps asking you to grow in, even when it is the uncomfortable one.",
        [NatalAngles.ASC]:
            "Your Ascendant is where this lands: how you come across, how you meet the world, and the first impression you cannot help making.",
        [NatalAngles.MC]:
            "Your Midheaven is where this lands: your work, your reputation, and what you are known for by people who do not know you.",
    },
}

export default en
