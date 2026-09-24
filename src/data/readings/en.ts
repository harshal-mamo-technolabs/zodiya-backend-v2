import {
    AspectTypes,
    Bodies,
    Elements,
    Modalities,
    SupportedLanguages,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { ReadingCopy } from "../../types/index.ts"

/**
 * English source copy. Written for someone who has never read a chart before:
 * every term is explained where it is first used, and every line says what the
 * placement actually looks like in someone's life rather than naming it.
 *
 * Other languages are translations of this file: same keys, same
 * {placeholders}, nothing added or removed.
 */
const en: ReadingCopy = {
    lang: SupportedLanguages.EN,

    signs: {
        [ZodiacSigns.ARIES]: {
            name: "Aries",
            essence:
                "you would rather start now and work it out as you go than wait until you are certain",
        },
        [ZodiacSigns.TAURUS]: {
            name: "Taurus",
            essence:
                "you take your time, and once you have committed to something you are very hard to shift",
        },
        [ZodiacSigns.GEMINI]: {
            name: "Gemini",
            essence:
                "you get curious quickly, and you like keeping your options open",
        },
        [ZodiacSigns.CANCER]: {
            name: "Cancer",
            essence:
                "you look after people, and you need somewhere that feels safe before you can relax into anything else",
        },
        [ZodiacSigns.LEO]: {
            name: "Leo",
            essence:
                "you are warm and generous with people, and it genuinely stings when they do not notice",
        },
        [ZodiacSigns.VIRGO]: {
            name: "Virgo",
            essence:
                "you show you care by fixing things, and you spot what is wrong before anyone else does",
        },
        [ZodiacSigns.LIBRA]: {
            name: "Libra",
            essence:
                "you want things to feel fair and pleasant, and you will bend a long way to keep them that way",
        },
        [ZodiacSigns.SCORPIO]: {
            name: "Scorpio",
            essence:
                "you do not do things by halves: it is all the way in or not at all",
        },
        [ZodiacSigns.SAGITTARIUS]: {
            name: "Sagittarius",
            essence: "you need room to move and something to look forward to",
        },
        [ZodiacSigns.CAPRICORN]: {
            name: "Capricorn",
            essence:
                "you are in it for the long run, and you would rather build something real than talk about it",
        },
        [ZodiacSigns.AQUARIUS]: {
            name: "Aquarius",
            essence:
                "you think for yourself, even when that puts you slightly outside the group",
        },
        [ZodiacSigns.PISCES]: {
            name: "Pisces",
            essence:
                "you pick up on what other people are feeling, often before they have said it",
        },
    },

    bodyNames: {
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

    houses: [
        {
            ordinal: "first",
            theme: "in how you come across: your manner, and the first thirty seconds of meeting you",
        },
        {
            ordinal: "second",
            theme: "around money, belongings and self-worth: what you have, and what you feel you are worth",
        },
        {
            ordinal: "third",
            theme: "in everyday conversation, short journeys, and your relationships with siblings and neighbours",
        },
        {
            ordinal: "fourth",
            theme: "at home and in family life, the private part nobody outside really sees",
        },
        {
            ordinal: "fifth",
            theme: "in fun, romance, creativity and children: whatever you do because you want to rather than because you have to",
        },
        {
            ordinal: "sixth",
            theme: "in your daily routine, your job and your health, the ordinary weekday stuff",
        },
        {
            ordinal: "seventh",
            theme: "in your close one-to-one relationships: partners, best friends, and the people you clash with",
        },
        {
            ordinal: "eighth",
            theme: "in the things people do not talk about: shared money, deep intimacy, loss and change",
        },
        {
            ordinal: "ninth",
            theme: "in travel, study and belief: whatever pulls you out of your own back garden",
        },
        {
            ordinal: "tenth",
            theme: "in your work and reputation, the part of your life other people can actually see",
        },
        {
            ordinal: "eleventh",
            theme: "in friendships, groups, and what you are hoping for in the future",
        },
        {
            ordinal: "twelfth",
            theme: "in your private inner life: rest, retreat, and the things you keep to yourself",
        },
    ],

    elements: {
        [Elements.FIRE]: {
            label: "fire",
            line: "Taken as a whole, your chart runs hot. You would rather do something and be wrong than sit still and wonder, and boredom costs you more than failure does.",
            summary: "This is a chart that runs on energy and impatience.",
        },
        [Elements.EARTH]: {
            label: "earth",
            line: "Taken as a whole, your chart is practical. You trust what you can see, count and put a hand on, and you are slow to credit anything you cannot.",
            summary: "This is a chart that runs on practicality.",
        },
        [Elements.AIR]: {
            label: "air",
            line: "Taken as a whole, your chart is a thinking one. You work things out by putting them into words, and a thing left unsaid stays unresolved however long you sit with it.",
            summary: "This is a chart that runs on thinking and talking.",
        },
        [Elements.WATER]: {
            label: "water",
            line: "Taken as a whole, your chart runs on feeling. You take in far more than people realise, and you hold on to it much longer than you let on.",
            summary: "This is a chart that runs on feeling.",
        },
    },

    modalities: {
        [Modalities.CARDINAL]: {
            label: "cardinal",
            clause: "you are the one who gets things moving, and you lose interest once they are ticking along without you",
            summary: "You start things rather than maintain them.",
        },
        [Modalities.FIXED]: {
            label: "fixed",
            clause: "you stay with things, sometimes well past the point where staying is doing you any good",
            summary: "You stay with things, for better and worse.",
        },
        [Modalities.MUTABLE]: {
            label: "mutable",
            clause: "you adjust to whatever is in front of you, which is useful right up until it becomes a way of never choosing",
            summary: "You adapt to whatever is in front of you.",
        },
    },

    aspectNames: {
        [AspectTypes.CONJUNCTION]: "conjunction",
        [AspectTypes.SEXTILE]: "sextile",
        [AspectTypes.SQUARE]: "square",
        [AspectTypes.TRINE]: "trine",
        [AspectTypes.OPPOSITION]: "opposition",
    },

    aspectShort: {
        [AspectTypes.CONJUNCTION]:
            "two sides of you that always turn up together",
        [AspectTypes.SEXTILE]: "two sides of you that get along",
        [AspectTypes.SQUARE]: "two sides of you that grate against each other",
        [AspectTypes.TRINE]: "two sides of you that work together easily",
        [AspectTypes.OPPOSITION]:
            "two sides of you that pull in opposite directions",
    },

    aspectLines: {
        [AspectTypes.CONJUNCTION]:
            "Your {a} and your {b} sit right on top of each other, {orb}° apart, which is close. They do not work separately: when one of them shows up, the other arrives with it.",
        [AspectTypes.SEXTILE]:
            "Your {a} and your {b} get on well, {orb}° off exact. It is there whenever you reach for it, and completely quiet when you do not.",
        [AspectTypes.SQUARE]:
            "Your {a} and your {b} are at right angles, {orb}° off exact. This is the friction one. It is uncomfortable, and it is also where most of your growth comes from.",
        [AspectTypes.TRINE]:
            "Your {a} and your {b} are in easy agreement, {orb}° off exact. It costs you nothing, which is exactly why it is easy to waste.",
        [AspectTypes.OPPOSITION]:
            "Your {a} and your {b} sit directly opposite each other, {orb}° off exact. You tend to swing between the two rather than hold both at once.",
    },

    placements: {
        [Bodies.MOON]: {
            [ZodiacSigns.ARIES]:
                "You feel things fast and they show straight away. The reaction is out of your mouth before you have weighed it up, and it is usually over just as quickly.",
            [ZodiacSigns.TAURUS]:
                "You are slow to get upset and slow to get over it. Comfort is not indulgence for you, it is genuinely how you steady yourself: a decent meal, a familiar place, someone who does not rush you.",
            [ZodiacSigns.GEMINI]:
                "You talk your way back to calm. A feeling you have not put into words yet stays unfinished and buzzing, which is why you need someone to think out loud at.",
            [ZodiacSigns.CANCER]:
                "You remember exactly how everything felt the first time, whether or not you want to. Kindness lands deep with you, and so does the opposite.",
            [ZodiacSigns.LEO]:
                "You feel generously and you are openly warm about it. What actually hurts is not criticism but being overlooked. Indifference stings more than an argument.",
            [ZodiacSigns.VIRGO]:
                "When you are unsettled you fix something small: tidy a drawer, sort a list, solve one solvable thing. It works far more often than it has any right to.",
            [ZodiacSigns.LIBRA]:
                "You read the mood of a room before you read your own, and you can end up carrying someone else's bad day home as if it were yours.",
            [ZodiacSigns.SCORPIO]:
                "You feel things all the way down, or you claim not to feel them at all. There is no middle setting, and the “nothing's wrong” version is rarely true.",
            [ZodiacSigns.SAGITTARIUS]:
                "You need the door unlocked. Once you know you could leave, you are perfectly happy to stay. It is being fenced in that gets to you, not the staying.",
            [ZodiacSigns.CAPRICORN]:
                "You handle the situation first and feel it later, usually alone and usually much later. You are the composed one in a crisis, and it costs you something.",
            [ZodiacSigns.AQUARIUS]:
                "You step back from a feeling to get a proper look at it. That distance is genuinely useful, and it can read as coolness to someone who wanted you closer.",
            [ZodiacSigns.PISCES]:
                "You absorb the mood around you and cannot always tell afterwards which part was yours. Crowded rooms and heavy conversations take more out of you than you expect.",
        },
        [Bodies.MERCURY]: {
            [ZodiacSigns.ARIES]:
                "You think at the speed you talk. The first sentence out is both the rough draft and the argument, which makes you quick in a debate and occasionally committed to a position you were still testing.",
            [ZodiacSigns.TAURUS]:
                "You think slowly on purpose. It can look like hesitation, but by the time you say something you have already tested it, and you rarely have to take it back.",
            [ZodiacSigns.GEMINI]:
                "You think by talking, and you can hold two opposite positions at once long enough to compare them. People sometimes mistake that for not having made your mind up.",
            [ZodiacSigns.CANCER]:
                "You think by remembering. Every judgement carries the scene it came from, which makes you a good read on people and a little stubborn about first impressions.",
            [ZodiacSigns.LEO]:
                "Your ideas arrive already shaped for an audience. You think in statements rather than questions, and you are a better explainer than you give yourself credit for.",
            [ZodiacSigns.VIRGO]:
                "You notice what is wrong first, every time. It makes you extremely useful, and it means you have to consciously remember to say the good part out loud.",
            [ZodiacSigns.LIBRA]:
                "Nothing feels settled until you have heard the other side, so you argue against yourself out of habit. It is thorough, and it is slow.",
            [ZodiacSigns.SCORPIO]:
                "You do not take the stated reason at face value. You are already looking for the one underneath it. Depending on the day that is either perceptive or exhausting.",
            [ZodiacSigns.SAGITTARIUS]:
                "You think in big arcs and fill in the detail later, if at all. You will get the shape of a thing right and the specifics slightly wrong.",
            [ZodiacSigns.CAPRICORN]:
                "An idea only interests you if something follows from it. That is not cynicism. You just do not see the point of a thought you cannot do anything with.",
            [ZodiacSigns.AQUARIUS]:
                "You think in systems, and you are willing to be the only person in the room holding a conclusion. Being outvoted does not change your mind much.",
            [ZodiacSigns.PISCES]:
                "You arrive at the answer well before you can explain how you got there. Your instincts are good; showing your working is the part you have to force.",
        },
        [Bodies.VENUS]: {
            [ZodiacSigns.ARIES]:
                "You go after people directly. Interest gets announced rather than hinted at, and you would rather be turned down quickly than wonder for a month.",
            [ZodiacSigns.TAURUS]:
                "You show it by being there, consistently. Grand gestures matter less to you than someone who turns up, and you are suspicious of anything that arrives too fast.",
            [ZodiacSigns.GEMINI]:
                "You fall for the conversation. Someone who is interesting to talk to will hold you far longer than someone who is easy to look at.",
            [ZodiacSigns.CANCER]:
                "You love by letting someone in, and the door opens slowly and then all at once. Once you have decided someone is yours, you are very hard to get rid of.",
            [ZodiacSigns.LEO]:
                "You are generous and openly affectionate, and you want it seen. Someone being discreet about you tends to read as someone being unsure about you.",
            [ZodiacSigns.VIRGO]:
                "You show love by noticing and fixing: the thing remembered, the thing repaired, the appointment you quietly booked. You say it in actions and then worry you have not said it.",
            [ZodiacSigns.LIBRA]:
                "You want it to feel fair and pleasant, and you will concede a surprising amount to keep it that way. The bill for all that conceding usually arrives late.",
            [ZodiacSigns.SCORPIO]:
                "There is no shallow end with you. Halfway feels worse than nothing, and you would rather have one person completely than five people partly.",
            [ZodiacSigns.SAGITTARIUS]:
                "You need the relationship to be going somewhere: a shared plan, a trip, something you are both aiming at. Standing still is what makes you restless, not the person.",
            [ZodiacSigns.CAPRICORN]:
                "You take it seriously and you show it in commitments kept. Affection that costs nothing does not quite register as affection to you.",
            [ZodiacSigns.AQUARIUS]:
                "You need to be friends first, and you need the other person to stay a whole separate person. Merging makes you claustrophobic.",
            [ZodiacSigns.PISCES]:
                "You love without much of a border, which is lovely and occasionally a problem. Working out where you end and they begin is the real task here.",
        },
        [Bodies.MARS]: {
            [ZodiacSigns.ARIES]:
                "You go straight at it. You would rather be wrong quickly than right too late, and waiting is the genuinely difficult part.",
            [ZodiacSigns.TAURUS]:
                "You are slow to start and almost impossible to stop once you have. People consistently underestimate the second half of that.",
            [ZodiacSigns.GEMINI]:
                "You argue well and fast, and you will occasionally win the exchange while losing the point. Your temper is quick and short.",
            [ZodiacSigns.CANCER]:
                "You do not come at things head-on. You go sideways: by making yourself necessary, by looking after something until it is yours. It works, and from the outside it can look like manipulation.",
            [ZodiacSigns.LEO]:
                "You do your best work with someone watching. That is not vanity, it is just how you switch on, and it means an unwitnessed effort is harder for you to keep up.",
            [ZodiacSigns.VIRGO]:
                "You break the problem into pieces and work them one at a time. It is unglamorous, and it gets further than the louder approach.",
            [ZodiacSigns.LIBRA]:
                "You would rather not have the confrontation, so you put it off, and the delay almost never makes it smaller. When you finally do have it, you are fair about it.",
            [ZodiacSigns.SCORPIO]:
                "You do not announce the move. You wait, you plan, and then there is no second round. It is effective, and it can frighten people.",
            [ZodiacSigns.SAGITTARIUS]:
                "You run on conviction, and you are hardest to stop precisely when you are sure you are right, which is not always the same as being right.",
            [ZodiacSigns.CAPRICORN]:
                "You work in small steps toward a result you decided on ages ago. Nobody notices the effort until the thing is simply done.",
            [ZodiacSigns.AQUARIUS]:
                "You act on principle, and you will still be standing there after everyone else has moved on. Being the last one holding the line does not bother you.",
            [ZodiacSigns.PISCES]:
                "You come at things indirectly, and you are strongest when you are doing it on someone else's behalf. Acting purely for yourself is the part that feels awkward.",
        },
        [Bodies.JUPITER]: {
            [ZodiacSigns.ARIES]:
                "Opportunities come to you when you move first. The luck here rewards nerve rather than planning.",
            [ZodiacSigns.TAURUS]:
                "Things grow for you slowly and steadily, and what you build tends to stay built.",
            [ZodiacSigns.GEMINI]:
                "Opportunities arrive through conversation: someone you happened to talk to, something you happened to read.",
            [ZodiacSigns.CANCER]:
                "Things grow for you through the people you look after. Your luck tends to arrive via family, home, and the ones you have made room for.",
            [ZodiacSigns.LEO]:
                "Things open up for you when you are visible. Generosity and a bit of showmanship genuinely pay off here.",
            [ZodiacSigns.VIRGO]:
                "Growth comes through being useful. It is unglamorous luck, and it compounds.",
            [ZodiacSigns.LIBRA]:
                "Opportunities come through other people: partnerships, introductions, someone who likes you and says so out loud.",
            [ZodiacSigns.SCORPIO]:
                "Growth arrives through the things other people avoid. You get further in the deep end than in the shallow.",
            [ZodiacSigns.SAGITTARIUS]:
                "Things open up when you go further out: travel, study, strangers, anything past the familiar.",
            [ZodiacSigns.CAPRICORN]:
                "Growth comes through responsibility. Being handed more than you feel ready for tends to work out for you.",
            [ZodiacSigns.AQUARIUS]:
                "Opportunities arrive through groups and networks, and through being the one with the odd idea.",
            [ZodiacSigns.PISCES]:
                "Growth comes through generosity and imagination, and often from a direction you could not have planned for.",
        },
        [Bodies.SATURN]: {
            [ZodiacSigns.ARIES]:
                "The lesson is that wanting something badly is not the same as having earned it. You learn patience the slow way.",
            [ZodiacSigns.TAURUS]:
                "The lesson is that security gets built rather than found, and built slowly. Money and stability probably came late, or came hard.",
            [ZodiacSigns.GEMINI]:
                "The lesson is that a voice needs something to say. Being quick was never enough; you have had to find a subject and stay with it.",
            [ZodiacSigns.CANCER]:
                "The lesson is that nobody can hand you the safety you will not build yourself. Family may well have taught you that the difficult way.",
            [ZodiacSigns.LEO]:
                "The lesson is that recognition follows the work and never substitutes for it. Being seen has had to be earned rather than given.",
            [ZodiacSigns.VIRGO]:
                "The lesson is that good enough and delivered beats perfect and withheld. Your standards are both the obstacle and the gift.",
            [ZodiacSigns.LIBRA]:
                "The lesson is that fairness has to be said out loud to exist. Keeping the peace quietly has not worked; asking for what you want has.",
            [ZodiacSigns.SCORPIO]:
                "The lesson is that control you hand over deliberately is the only kind you actually keep. Trust is the difficult subject here.",
            [ZodiacSigns.SAGITTARIUS]:
                "The lesson is that a belief has to survive contact with the facts. You have had to earn your convictions rather than inherit them.",
            [ZodiacSigns.CAPRICORN]:
                "The lesson is that authority is a responsibility before it is a position. You grew up early, whether or not anyone asked you to.",
            [ZodiacSigns.AQUARIUS]:
                "The lesson is that a principle costs something, or it was only ever a preference. You have had to pay for a few of yours.",
            [ZodiacSigns.PISCES]:
                "The lesson is that faith and avoidance look identical from the inside. Knowing which one you are doing is the whole work.",
        },
        [Bodies.NORTH_NODE]: {
            [ZodiacSigns.ARIES]:
                "It points you toward wanting something on your own behalf and saying so first, and away from the comfortable habit of putting yourself last.",
            [ZodiacSigns.TAURUS]:
                "It points you toward staying with one thing long enough for it to become solid, and away from the comfortable habit of intensity and upheaval.",
            [ZodiacSigns.GEMINI]:
                "It points you toward staying curious and asking more questions, and away from the comfortable habit of settling on one big conviction and defending it.",
            [ZodiacSigns.CANCER]:
                "It points you toward needing people openly, and away from the comfortable habit of being so self-sufficient that nobody gets to help.",
            [ZodiacSigns.LEO]:
                "It points you toward taking the centre when it is genuinely yours, and away from the comfortable habit of handing the credit to the group.",
            [ZodiacSigns.VIRGO]:
                "It points you toward doing the small specific work, and away from the comfortable habit of holding a large feeling and drifting.",
            [ZodiacSigns.LIBRA]:
                "It points you toward building something with someone rather than merely near them, and away from the comfortable habit of doing it all alone.",
            [ZodiacSigns.SCORPIO]:
                "It points you toward letting go of what you have kept only because you have always kept it, and away from the comfortable habit of holding on.",
            [ZodiacSigns.SAGITTARIUS]:
                "It points you toward committing to a direction before all the information is in, and away from the comfortable habit of gathering a little more detail first.",
            [ZodiacSigns.CAPRICORN]:
                "It points you toward being accountable in public for what you decided in private, and away from the comfortable habit of staying close to home.",
            [ZodiacSigns.AQUARIUS]:
                "It points you toward serving the wider thing, and away from the comfortable habit of playing to the people who already applaud you.",
            [ZodiacSigns.PISCES]:
                "It points you toward being inside the moment, and away from the comfortable habit of standing outside it, checking and analysing.",
        },
    },

    ascendant: {
        [ZodiacSigns.ARIES]:
            "People read you as decisive and a little impatient, often before you have actually decided anything. You arrive at speed.",
        [ZodiacSigns.TAURUS]:
            "You come across as calm and unhurried, and rooms tend to slow down slightly around you. People find you steadying.",
        [ZodiacSigns.GEMINI]:
            "You are easy to talk to and quick to be liked. Being properly known takes rather longer, which suits you fine.",
        [ZodiacSigns.CANCER]:
            "You test the temperature before you commit to a room. People read you as gentle and a bit guarded, which is fair enough.",
        [ZodiacSigns.LEO]:
            "You are noticeable whether or not you meant to be. Even when you are being quiet, people can tell you are there.",
        [ZodiacSigns.VIRGO]:
            "You come across as capable and slightly reserved. You are sizing up the room while everyone else is still saying hello, and that reads as competence before you have done anything to earn it.",
        [ZodiacSigns.LIBRA]:
            "You come across as easy and agreeable, and people meet you halfway more often than you notice. Charm does a lot of quiet work for you.",
        [ZodiacSigns.SCORPIO]:
            "You are quiet on arrival and felt anyway. People find you hard to read and tend to guess at you, usually wrongly.",
        [ZodiacSigns.SAGITTARIUS]:
            "You come across as open and unguarded, and people trust you faster than is strictly sensible. You are easy company.",
        [ZodiacSigns.CAPRICORN]:
            "You come across as contained and competent, and people assume you are older and more responsible than you are. It is useful, and occasionally lonely.",
        [ZodiacSigns.AQUARIUS]:
            "You stand at a slight angle to the room and people remember you for it. You are distinctive before you are familiar.",
        [ZodiacSigns.PISCES]:
            "You arrive softly and take the shape of the room before you take your own. People find you easy to be around and hard to pin down.",
    },

    midheaven: {
        [ZodiacSigns.ARIES]:
            "for going first. It rests on nerve rather than time served, so you get further by starting something than by waiting your turn.",
        [ZodiacSigns.TAURUS]:
            "for being dependable. It builds slowly and then it holds. People come to you because you do not drop things.",
        [ZodiacSigns.GEMINI]:
            "for what you can explain. Your standing travels through your voice, so the work that gets noticed is the work you can talk about.",
        [ZodiacSigns.CANCER]:
            "for looking after the thing. People trust you with what matters to them, which is a quieter kind of standing and a durable one.",
        [ZodiacSigns.LEO]:
            "by name rather than by title. The work carries your signature, and anonymous work would waste you.",
        [ZodiacSigns.VIRGO]:
            "for getting it exactly right. It is an unshowy reputation and a very hard one to take away from you.",
        [ZodiacSigns.LIBRA]:
            "for being fair. You end up as the person called in when two sides need to be in one room.",
        [ZodiacSigns.SCORPIO]:
            "for handling what other people will not. It carries weight, and it means you get handed the difficult jobs.",
        [ZodiacSigns.SAGITTARIUS]:
            "for the bigger picture. Your standing tends to grow with distance: travel, a wider audience, an outside perspective.",
        [ZodiacSigns.CAPRICORN]:
            "for authority you earned in public. The climb is not incidental here, it is rather the point.",
        [ZodiacSigns.AQUARIUS]:
            "for the position nobody else was holding first. You get known for being early rather than for being safe.",
        [ZodiacSigns.PISCES]:
            "for something that is hard to put a job title on. The work tends to reach people before the description does.",
    },

    templates: {
        sun: "Start with your Sun sign, which is the core of you, the part that stays roughly the same whether you are at work, at home, or on your own. Yours is {sign}, which means {essence}.",
        houseFirst:
            "A chart also splits life into twelve areas, and it matters which one a planet lands in. Your Sun sits in the {ordinal}, so that side of you shows up most {theme}.",
        bodyHouse: "In your chart this plays out mostly {theme}.",
        ascendant:
            "Before anyone gets to any of that, though, they meet your rising sign: the first impression, the version of you that walks into a room. Yours is {sign}. {line}",
        mercury:
            "How your mind works is a separate question from who you are, and yours leans {sign}. {line}",
        moon: "Your Moon sign is the private half of the chart: how you feel things rather than how you show them. It is the version of you that comes out when you are tired, upset, or completely at ease. Yours is {sign}. {line}",
        venus: "Venus is the affection side: what you find attractive, and how you show someone you care. Yours is in {sign}. {line}",
        mars: "Mars is the opposite pole: drive, appetite, and what you do when something gets in your way. Yours is in {sign}. {line}",
        descendant:
            "The point directly opposite your rising sign says a good deal about who you are drawn to. For you that is {sign}, so you tend to go for people who feel like the part you do not claim for yourself: {essence}.",
        midheaven:
            "The very top of a chart is about reputation: what you become known for, rather than what you are like at home. Yours sits in {sign}, and you get known {line}",
        saturn: "Every chart has one area where nothing is handed to you and everything has to be earned. That is Saturn, and yours sits in {sign}. {line}",
        jupiter:
            "Jupiter is the easier one: the place where things tend to open up rather than close down. Yours is in {sign}. {line}",
        node: "The North Node is the one part of a chart that is not about who you already are, but about where you grow. It usually feels slightly unnatural at first and quietly rewarding later. Yours sits in {sign}. {line}",
        pluto: "Pluto moves so slowly that everyone born within a few years of you shares the same sign, so {sign} says more about your generation than about you personally. What makes it yours is where it landed: {theme}. That is the area of life you keep rebuilding from the ground up.",
        dominants: "{elementLine} On top of that, {clause}.",
        sunMoonAspect:
            "Your Sun and Moon are also connected here ({orb}° off exact), which means the part of you that decides and the part of you that feels tend to pull in the same direction.",
        noSunMoonAspect:
            "One last thing: your Sun and Moon make no connection to each other. The deciding part of you and the feeling part run on separate tracks, and you switch between them rather than blending them.",
        summary:
            "{elementSummary} {modalitySummary} The strongest single link in it runs between your {a} and your {b}: {aspectShort}.",
        summaryNoAspect:
            "{elementSummary} {modalitySummary} Nothing in it is tightly wired to anything else, so the pieces work fairly independently.",
        headlineLuminaries: "{sun} Sun, {moon} Moon",
        headlineRising: "{asc} rising",
        position: "{degree}°{minute}′ {sign}",
    },

    sections: {
        personality: {
            numeral: "I",
            title: "Personality",
            subtitle: "Who you are",
        },
        emotions: {
            numeral: "II",
            title: "Emotions",
            subtitle: "How you feel",
        },
        relationships: {
            numeral: "III",
            title: "Relationships",
            subtitle: "How you love",
        },
        career: {
            numeral: "IV",
            title: "Career",
            subtitle: "Work and reputation",
        },
        lifePath: {
            numeral: "V",
            title: "Life path",
            subtitle: "Where you grow",
        },
    },

    labels: {
        sun: "SUN",
        moon: "MOON",
        ascendant: "ASC",
        retrograde: "retrograde",
    },
}

export default en
