import { NumerologyNumbers, SupportedLanguages } from "../../constants/index.ts"
import type { NumerologyCopy } from "../../types/index.ts"

/**
 * English numerology copy. Written for a reader who has never met any of this
 * before, and position by position: what a 7 means about the road you are on is
 * a different claim from what a 7 means about how strangers read you.
 */
const en: NumerologyCopy = {
    lang: SupportedLanguages.EN,

    labels: {
        [NumerologyNumbers.LIFE_PATH]: {
            label: "Life Path",
            sub: "The road you are on",
        },
        [NumerologyNumbers.BIRTH]: {
            label: "Birth",
            sub: "The gift you arrived with",
        },
        [NumerologyNumbers.DESTINY]: {
            label: "Destiny",
            sub: "What your name is for",
        },
        [NumerologyNumbers.SOUL_URGE]: {
            label: "Soul Urge",
            sub: "What you quietly want",
        },
        [NumerologyNumbers.PERSONALITY]: {
            label: "Personality",
            sub: "What others meet first",
        },
    },

    meanings: {
        [NumerologyNumbers.LIFE_PATH]: {
            1: "Your road is about going first. You are built to lead rather than follow, and the work that suits you is the work nobody has done your way before.",
            2: "Your road is about partnership. You get further alongside someone than out in front, and your real skill is sensing what a situation needs before anyone says it.",
            3: "Your road is about expression. You are meant to be heard, and life goes flat when you stop making things and telling people about them.",
            4: "Your road is about building. Slow, solid, properly founded work suits you, and you end up trusted with whatever has to last.",
            5: "Your road is about change. You are meant to move, try things and collect experience, and you go stale if you settle too early.",
            6: "Your road is about care. Home, family and responsibility find you, and you are at your best looking after something that matters.",
            7: "Your road is about understanding. You are meant to go deep rather than wide, and you need real time alone to do it.",
            8: "Your road is about the practical world. Money, authority and consequence are your subject, and you are meant to handle them rather than avoid them.",
            9: "Your road is about the wider picture. You are meant to give something back, and a life that is only about you will never quite satisfy you.",
            11: "Your road runs at a higher voltage. You pick up far more than you can explain, and the task is turning all that sensitivity into something other people can use.",
            22: "Your road is about building something large and real. The vision is big and so is the practical capacity. The hard part is starting.",
            33: "Your road is about teaching by example. The care you have is meant to reach well past your own household.",
        },
        [NumerologyNumbers.BIRTH]: {
            1: "You arrived self-starting. Even as a child you would rather do it yourself than be shown.",
            2: "You arrived tactful. You have always been able to read a room and smooth something over without being asked.",
            3: "You arrived expressive. Words, humour and performance came easily and early.",
            4: "You arrived reliable. People have always been able to hand you something and then forget about it.",
            5: "You arrived curious and hard to pin down. You were the one who wanted to see round the corner.",
            6: "You arrived responsible. You were looking after other people well before anyone asked you to.",
            7: "You arrived thoughtful. You needed your own room and your own time long before you could explain why.",
            8: "You arrived with a head for the practical. You understood value, fairness and consequence early.",
            9: "You arrived with a wide heart. You felt other people's situations as though they were happening to you.",
            11: "You arrived unusually sensitive. It has been a gift and a load in roughly equal measure.",
            22: "You arrived with rare practical vision. You can see the finished thing and the steps toward it at the same time.",
            33: "You arrived with a strong instinct to look after people, and it has never been limited to your own family.",
        },
        [NumerologyNumbers.DESTINY]: {
            1: "Your name points at independence. What you are here to make is something with your own stamp on it.",
            2: "Your name points at cooperation. What you build will be built with someone, and that is not a lesser version of building it.",
            3: "Your name points at communication. Whatever you end up doing will involve making something and putting it in front of people.",
            4: "Your name points at structure. You are here to make things that hold: systems, institutions, or simply work that does not fall over.",
            5: "Your name points at freedom and variety. One fixed track will never use half of what you have.",
            6: "Your name points at service and beauty. You are here to look after people, or to make things that are better to live with.",
            7: "Your name points at knowledge. You are here to find something out properly and be the one who actually knows.",
            8: "Your name points at achievement. You are here to build something with weight, and to be comfortable with what comes with it.",
            9: "Your name points at contribution. You are here to work on something bigger than your own household.",
            11: "Your name points at inspiration. You are here to notice what other people miss, and to find a way to hand it over.",
            22: "Your name points at building on a large scale. You are here to turn a big idea into an actual standing thing.",
            33: "Your name points at teaching and repair. You are here to look after people at a scale beyond the personal.",
        },
        [NumerologyNumbers.SOUL_URGE]: {
            1: "Underneath everything, you want to be your own person. Being managed, however kindly, chafes.",
            2: "Underneath everything, you want peace and closeness. Conflict costs you more than it costs most people.",
            3: "Underneath everything, you want to be heard. Being talked over is the thing that genuinely upsets you.",
            4: "Underneath everything, you want security. You want to know the ground will hold before you can enjoy standing on it.",
            5: "Underneath everything, you want freedom. Whatever you agree to, you need to know you could still walk away.",
            6: "Underneath everything, you want to be needed. You want a home, and people in it who rely on you.",
            7: "Underneath everything, you want to understand. You want the real answer rather than the comfortable one.",
            8: "Underneath everything, you want to be able to act. Money and position matter to you because they are what let you move.",
            9: "Underneath everything, you want your life to have counted for something beyond yourself.",
            11: "Underneath everything, you want meaning. A perfectly comfortable life leaves you restless in a way that is hard to explain to people.",
            22: "Underneath everything, you want to build something that outlasts you.",
            33: "Underneath everything, you want to be of use, and you go slightly uneasy when the attention turns to you instead.",
        },
        [NumerologyNumbers.PERSONALITY]: {
            1: "People read you as confident and self-contained. You look decided even when you are not.",
            2: "People read you as gentle and easy to be around. You are approachable before you are impressive.",
            3: "People read you as warm and entertaining. You are easy to like and quick to include.",
            4: "People read you as solid and straightforward. They trust you with things before they know much about you.",
            5: "People read you as lively and a little unpredictable. You bring energy into a room with you.",
            6: "People read you as kind and responsible. They bring you their problems, often sooner than you would like.",
            7: "People read you as reserved and slightly hard to know. It reads as depth, and it is.",
            8: "People read you as capable and in charge. They assume you have authority whether or not anyone gave you any.",
            9: "People read you as generous and a little distant, as though part of you is looking at something further off.",
            11: "People read you as unusual and quietly compelling. They are not always sure why they remember you.",
            22: "People read you as serious and capable on a large scale. You do not come across as someone who deals in small things.",
            33: "People read you as unusually warm. People confide in you quickly, sometimes complete strangers.",
        },
    },

    days: {
        1: "Sunday",
        2: "Monday",
        3: "Thursday",
        4: "Saturday",
        5: "Wednesday",
        6: "Friday",
        7: "Monday",
        8: "Saturday",
        9: "Tuesday",
        11: "Monday",
        22: "Saturday",
        33: "Friday",
    },

    // "an" before 8 and 11, which are the only values that start with a vowel sound
    articles: {
        1: "a",
        2: "a",
        3: "a",
        4: "a",
        5: "a",
        6: "a",
        7: "a",
        8: "an",
        9: "a",
        11: "an",
        22: "a",
        33: "a",
    },

    templates: {
        masterOne:
            "Your {labels} sits at a master number, which carries more voltage than most and rather more to carry. ",
        masterMany:
            "Your {labels} all sit at master numbers, which carry more voltage than most and rather more to carry. ",
        agree: "{lifePathArticle} {lifePath} Life Path with {destinyArticle} {destiny} Destiny. The road and the name agree, which is rarer than it sounds.",
        tension:
            "{lifePathArticle} {lifePath} Life Path with {destinyArticle} {destiny} Destiny. The road asks one thing of you and the name asks another, and the interesting part of a life usually sits in that gap.",
        ages: "Age {from} to {to}",
        agesOpen: "Age {from} onward",
        chapter: "{ordinal} chapter",
        passion:
            "{value} turns up {count} times in your name, more than any other number.",
        challengeAgain:
            "The same lesson as an earlier chapter. When one repeats, it usually means the first pass did not finish it.",
    },

    sections: {
        personalYear: {
            title: "Where you are right now",
            sub: "Your numbers stay put for life. This one changes every January.",
        },
        chapters: {
            title: "Life in four chapters",
            sub: "Each chapter has something it hands you and something it asks of you.",
            pinnacle: "What it hands you",
            challenge: "What it asks of you",
        },
        name: {
            title: "Your name, letter by letter",
            sub: "Every letter above feeds one of the three name numbers. Here is the whole alphabet of it.",
            vowels: "Vowels build the Soul Urge",
            consonants: "Consonants build the Personality",
            karmic: "Numbers your name never uses",
            passion: "The number your name leans on",
        },
    },

    personalYear: {
        heading: "{year} is a {value} year",
        meanings: {
            1: "This is a starting year. Whatever you begin now tends to set the shape of the next nine, so it is a poor year to drift and a good one to choose. Expect to feel slightly ahead of everyone else, and slightly alone in it.",
            2: "A slower year on purpose. Last year's beginnings need patience rather than pushing, and most of what matters this year happens through other people. Progress will feel invisible right up until it is not.",
            3: "A year that wants you visible. Say the thing, publish the thing, go to the party. The risk is spreading yourself over ten enjoyable things and finishing none of them.",
            4: "A working year. Unglamorous, useful, and the one that makes the later years possible. Put the boring systems in place now: the paperwork, the savings, the habit you keep skipping.",
            5: "Something loosens. Travel, a move, a change of job or a change of mind, and usually more than one of them. Keep some ground under you, because this year happily takes all of it away.",
            6: "The year home and the people in it come first. Responsibility arrives whether you volunteered or not, and it is also a strong year for settling down, taking someone in, or finally fixing the house.",
            7: "A quiet, inward year. You will want less company than usual and should take it. This is a year for study, rest and working out what you actually think, not for forcing things into the open.",
            8: "Money, work and consequence come to a head. Effort you put in years ago tends to pay out now, and so do the corners you cut. A strong year to negotiate, invest or ask for what you are worth.",
            9: "An ending year, and endings are the point. Things you have outgrown leave, sometimes gracelessly. Let them. Clearing the ground is the whole job, because next year starts the cycle again.",
        },
    },

    pinnacles: {
        1: "A stretch of standing on your own feet. You are pushed to decide, start and lead, often before you feel ready, and leaning on other people works less well here than it used to.",
        2: "A stretch that works through people. Partnership, patience and reading the room get you further than force, and the wins in this period usually have somebody else's name on them too.",
        3: "A stretch of expression. Your voice, your work and your social life open up, and what you make in this period tends to reach people. Scattering your energy is the one real danger.",
        4: "A stretch of building. Hard, steady and not much fun to describe, but this is where foundations get laid: the career, the house, the discipline you keep for the rest of your life.",
        5: "A stretch of movement and change. Jobs, cities and relationships shift more than usual. It is exhilarating if you have something steady to come back to and chaotic if you do not.",
        6: "A stretch centred on home and duty. Family, a partner, or people who depend on you take the front seat, and your sense of a good life quietly reorganises itself around them.",
        7: "A stretch of depth rather than breadth. Study, craft, faith or solitude take over, and you come out of it knowing something you could not have read anywhere.",
        8: "A stretch of real worldly weight. Money, authority and results arrive, along with the pressure that comes attached. Handled well it sets you up for good.",
        9: "A stretch that widens the view. You end up giving something back, working for something bigger than yourself, or letting go of a version of your life you had outgrown.",
        11: "A stretch that runs at a higher voltage. Intuition, pressure and visibility all rise together. Immensely productive if your nerves hold, and hard on you if they do not.",
        22: "A stretch with unusual reach. The chance to build something larger than your own life turns up here, and so does the workload that comes with it. Rare, and not restful.",
    },

    challenges: {
        0: "No single obstacle. That sounds like a gift and is mostly a test of what you do with a free hand, because nothing external decides for you here.",
        1: "Standing up for yourself. You will keep meeting situations where you must decide alone, and the habit of waiting for permission is the thing to break.",
        2: "Oversensitivity. You feel slights that were not meant and keep score quietly. The work is saying the difficult thing out loud instead of absorbing it.",
        3: "Saying what you mean. Self doubt comes out as either silence or scattered chatter, and learning to make one honest point plainly is the whole task.",
        4: "Doing the unglamorous work. Disorganisation and half finished things cost you more than any rival does. Structure is not a personality flaw, it is the fix.",
        5: "Impulse. Freedom is the thing you want most and the thing you overuse. Restlessness, overindulgence and quitting early are the versions of this to watch.",
        6: "Impossible standards. You expect a great deal of the people close to you and more of yourself, and the disappointment that follows is largely self supplied.",
        7: "Trust. You keep people at a distance and call it discretion. The work is letting someone close enough to be wrong about you and staying anyway.",
        8: "Your relationship with money and power. Either can run you if you let it, whether by chasing it or by pretending to be above it.",
    },

    karmicLessons: {
        1: "No 1 in your name. Starting things alone and taking the lead do not come naturally, and you will be handed situations where nobody else will decide for you.",
        2: "No 2 in your name. Patience, tact and working at somebody else's pace are learned rather than given, and life will keep setting up the lesson.",
        3: "No 3 in your name. Expressing yourself lightly is hard work. You may undervalue your own creativity or dismiss enjoyment as unserious.",
        4: "No 4 in your name. Order, routine and follow through take conscious effort, and the cost of avoiding them tends to arrive all at once.",
        5: "No 5 in your name. Change unsettles you more than most, and you may cling to an arrangement well past the point it stopped working.",
        6: "No 6 in your name. Commitment and domestic responsibility feel heavier than they look, and you learn them by being needed rather than by choosing them.",
        7: "No 7 in your name. Sitting with a question rather than solving it fast does not come easily, and depth is something you have to make time for.",
        8: "No 8 in your name. Money, authority and your own worth are the recurring lesson, usually taught by getting it wrong once or twice first.",
        9: "No 9 in your name. Letting go and seeing past your own situation is the work, and life tends to teach it through endings you did not choose.",
    },

    karmicNone:
        "Your name uses all nine numbers, which is uncommon. Nothing is missing, and nothing gets handed to you twice either.",

    hiddenPassion: {
        1: "You keep reaching for independence. Whatever the situation, part of you is looking for the version where you get to decide.",
        2: "You keep reaching for harmony. You would rather have the room settled than be proved right in it.",
        3: "You keep reaching for expression. If you cannot say it, draw it or perform it, it does not feel like it happened.",
        4: "You keep reaching for solid ground. You want the thing built properly, and improvisation makes you uneasy even when it works.",
        5: "You keep reaching for freedom. A closed door bothers you more than a difficult one, and routine wears you down faster than pressure.",
        6: "You keep reaching for people to look after. You are drawn to being the one who holds it together, sometimes past what is good for you.",
        7: "You keep reaching for understanding. A surface answer never satisfies you, and you would rather be alone than be told something shallow.",
        8: "You keep reaching for results you can count. Status, money or scale, you want the effort to show up as something measurable.",
        9: "You keep reaching for meaning. Small ambitions bore you, and you want your effort to matter to more than just yourself.",
    },

    footnote:
        "Letters map A to I as 1 to 9, and then the alphabet repeats. Nothing is hidden in the maths.",
}

export default en
