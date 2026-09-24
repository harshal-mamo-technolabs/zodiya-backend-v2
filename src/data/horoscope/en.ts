import {
    AspectTypes,
    Bodies,
    HoroscopeCategories,
    HoroscopePeriods,
    Lunations,
    MoodBands,
    MoonPhases,
    QUIET_RELATION,
    SupportedLanguages,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { HoroscopeCopy, HoroscopePeriodCopy } from "../../types/index.ts"

/**
 * English horoscope copy. A reading is chosen by the period, the category
 * and the angle the category's lead planet makes to the sign: in the sign
 * (conjunction), two signs away (sextile), three (square), four (trine),
 * opposite, or none of those (quiet). {planet} is the lead planet's name.
 * Several options per slot keep neighbouring days from reading the same.
 */

const C = HoroscopeCategories
const R = { ...AspectTypes, QUIET: QUIET_RELATION } as const

const daily: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign today, and the people close to you feel it before you do. Say the warm thing early, before the day fills up. Someone is waiting for it more than they will admit.",
            "With {planet} in your sign, you are easy to be around today and slightly hard to argue with. Use it for the conversation you have been circling. Ask, do not hint.",
        ],
        [R.SEXTILE]: [
            "{planet} sits two signs from yours, which opens a small door. A friend, a neighbour or a message you did not expect gives the day its shape. Answer it the same day.",
            "An easy day for the people in your orbit. {planet} makes it simple to be kind without effort, so spend the ease on someone who has had a harder week than you.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, so someone close will want more of you than you have to give today. Do not promise the whole evening. Give one honest hour and mean it.",
            "Friction at home or with a partner, and it is nobody's fault. {planet} is at a hard angle to your sign, and small requests land as demands. Repeat back what you heard before you answer.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the people around you are on your side today. Plans made together stick. Say yes to the invitation even if it means moving something.",
            "A settled, affectionate day. With {planet} in easy aspect, you can raise the delicate subject and be met halfway. Do it over food rather than by text.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, in the part of the sky that belongs to other people. Today the other person's point of view is the useful one. Ask a question and let the answer be longer than you would like.",
            "Someone mirrors you back to yourself today, not always kindly. {planet} opposite your sign is a day for listening more than explaining. What you learn will be worth the discomfort.",
        ],
        [R.QUIET]: [
            "No strong pull on the people in your life today, which is its own kind of gift. Text the friend you keep meaning to. The quiet days are when those messages get answered.",
            "A plain day for love and friendship, with nothing forcing the issue. Keep the promise you made last week and let that be the whole romance of the day.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign, which puts you at the centre of the work today whether you like it or not. Take the meeting, own the decision, and keep the email short. People will follow a clear lead.",
            "Your name comes up today. With {planet} in your sign the spotlight is on your work, so make sure what is visible is the finished thing and not the draft.",
        ],
        [R.SEXTILE]: [
            "{planet} is in easy reach of your sign. A colleague or a contact has something useful, and you only have to ask. The morning is better than the afternoon for it.",
            "A workable, pleasant day at work. Nothing is on fire and small things get done. Use it to clear the list that has been quietly growing since last week.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign and the work pushes back. Something you assumed would hold needs shoring up. Do the boring part first and do not start anything new before the current thing is finished.",
            "A day of resistance at work: a deadline moves, a tool breaks, a person is unavailable. It is friction, not failure. Cut the scope, keep the standard, and finish one thing properly.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign, and the work runs the way you always hope it will. Ask plainly for what the job is worth today. Send the message before the afternoon, while the ease lasts.",
            "A productive day with no fight in it. Whatever you have been putting off because it felt like a battle is not one today. Start it now and you will get further than you expect.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, so today the work is about the other side: the client, the manager, the person who has to say yes. Their timing rules the day. Prepare, then wait.",
            "You are being measured today, quietly, by someone across the table. {planet} opposite your sign rewards the calm answer over the clever one. Say less and let the work speak.",
        ],
        [R.QUIET]: [
            "A steady, unremarkable day for work, and those are the days careers are actually built on. Do the next thing on the list well. Nobody will notice today, which is the point.",
            "Nothing in the sky pulls at your working life today. Use the quiet to tidy: the inbox, the files, the one document that everyone keeps asking for.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign, and today you feel everything at full volume. That is not a problem to fix. Let the mood be what it is for an hour and it will settle on its own.",
            "A tender, thin-skinned day. With {planet} in your sign the small things reach you, the kind word and the careless one alike. Be around people who are gentle.",
        ],
        [R.SEXTILE]: [
            "A light, even mood. {planet} is at an easy angle to your sign and the day asks little of you emotionally. Enjoy that; it is rarer than it sounds.",
            "Feelings are close to the surface but not heavy. A good day to say out loud something you have been feeling for a while and see how it sounds.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, so expect a low-grade irritation with no clear object. It belongs to the sky, not to the people near you. Do not spend it on them.",
            "A scratchy day inside. Something is being asked of you and you do not want to give it. Name the feeling to yourself, then decide nothing until tomorrow.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the inside weather is good. You feel like yourself. Do the thing that only works when you are in a good mood: the difficult call, the honest note.",
            "Warm, settled, unhurried. Today's ease is the kind that lets you be generous. Spend it on someone who has been carrying more than they say.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, and today your mood depends more than usual on another person. That is fine as long as you know it. Take the compliment, discount the slight.",
            "A day of being pulled between what you feel and what someone else needs. Neither has to win. Say what is true for you and leave room for what is true for them.",
        ],
        [R.QUIET]: [
            "A calm day with no strong emotional weather. If something surfaces, it is old rather than new. Let it pass through without a story attached.",
            "Level and quiet. Nothing in the sky is pressing on you today, so whatever you feel is yours to choose. Choose the lighter thing.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign brings energy, and it is unevenly distributed. Move early, eat properly at midday, and the evening will hold. Skip the early exercise and the day drags.",
            "A high-charge day in the body. Good for effort, bad for stillness. If you have been meaning to start something physical, today it will feel easy to begin.",
        ],
        [R.SEXTILE]: [
            "A good, ordinary day for the body. Nothing hurts more than usual and the energy is there for the taking. A walk in daylight does more today than it would tomorrow.",
            "Small, steady energy. {planet} favours the routine over the heroic effort. Do the thing you do every day, and do it slightly better.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, so the body asks for more care than you planned to give it. Sleep debt shows. Go to bed early; it is the correct decision even if it feels like a defeat.",
            "Tension sits in the shoulders and the jaw today. It is the sky pressing, not something wrong. Stretch, drink water, and cancel the thing you were dreading if you can.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the body feels capable. A genuinely good day to begin the routine you have been describing to people for a month. Start small and you will keep it.",
            "Energy is good and stays good. Use it on something that leaves you tired in the right way. Tonight's sleep will be the deepest of the week.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, and today the body is easily talked out of rest by other people's plans. Guard one hour that is only yours. The rest can be shared.",
            "Your energy and someone else's schedule are in a tug of war. Eat when you are hungry rather than when it is convenient, and the day goes better.",
        ],
        [R.QUIET]: [
            "Nothing in the sky presses on the body today. Keep the habits you already have and do not add a new one. Steady is the whole assignment.",
            "A neutral day physically. If you feel off, it is last night's sleep rather than the stars. Water, daylight, an early night. Nothing more clever than that.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign, and movement suits you today. Take the long way, say yes to the errand across town, book the thing. The day rewards being somewhere else.",
            "Restless in a good way. With {planet} in your sign, journeys started today go smoothly and conversations on the road go further than the ones at home.",
        ],
        [R.SEXTILE]: [
            "Local movement is smooth today. A short trip or a message from a distance lands well. Bookings made this morning will be the cheapest of the week.",
            "An easy day to be on the move. Nothing runs late that matters, and the small detours turn out to be the point. Leave ten minutes earlier and enjoy it.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, so short journeys run late and messages cross in the post. Not a day for tight connections. Build in the slack now and you will not need it.",
            "Plans involving distance need one revision today before they are real. Confirm the time, the place and the platform, then confirm them again.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the road opens. Longer plans made today are the ones that happen. If you have been waiting for the right day to book it, this is the day.",
            "Travel and news from far away both go well. Someone at a distance thinks of you and says so. Reply properly rather than with a thumbs up.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign turns the day's movement around someone else: their arrival, their delay, their choice of route. Go with it. Resisting the itinerary costs more than following it.",
            "A day of meeting people halfway, sometimes literally. Let the other person set the time and the place, and bring the thing they forgot.",
        ],
        [R.QUIET]: [
            "No pull toward the door today. Stay put and plan instead: the trip you keep mentioning gets a date on it, which is more than it had yesterday.",
            "A still day for travel and errands. If you must move, move early. The afternoon is for staying where you are.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign, and the day is inclined to say yes. Ask for the thing you have been rehearsing. Favours arrive through people slightly senior to you, so take the introduction.",
            "A lucky-feeling day, and the feeling is mostly right. With {planet} in your sign, the odds tilt your way in small things. Do not bet the big thing on it.",
        ],
        [R.SEXTILE]: [
            "A small piece of good news arrives through someone you had not spoken to in months. {planet} at an easy angle makes the day pleasantly surprising rather than dramatic.",
            "Quiet luck: a queue that moves, a fee that is waived, a seat that is free. Notice it. Days like this are more common than the big ones and easier to miss.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, so the easy win is not on offer today. Nothing is against you; the sky is just not handing anything over. Earn it or wait.",
            "A day to keep your money in your pocket and your name off the raffle. What looks like a shortcut costs more than the long way. Tomorrow is better for chances.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the day is generous. Say yes to what arrives, but check the size of the bite. Good fortune today comes through timing, so be where you said you would be.",
            "Things fall your way without being pushed. The right person is at the right desk, the answer is yes, the door is open. Walk through it.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, which means today's luck belongs to someone else, and some of it rubs off. Be near people who are having a good day. Congratulate them properly.",
            "Fortune comes secondhand today: through a partner, a rival, a stranger who makes a decision that helps you. Be gracious and it lasts.",
        ],
        [R.QUIET]: [
            "Nothing arrives unasked for today, which is fine, because the day rewards asking. Make the request you have been sitting on and let the answer be what it is.",
            "An even day, neither charmed nor cursed. Luck this size is made, not found. Do the small thing that puts you in the way of the bigger one.",
        ],
    },
}

const weekly: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} spends the week in your sign, and you are the one people gravitate to. It is a good week to host, to reconcile, to say the thing you have been saving. Being seen this clearly is a chance, so use it kindly.",
        ],
        [R.SEXTILE]: [
            "{planet} sits two signs from yours all week, which keeps the people in your life easy to reach and easy to be with. Friends do more for you than family this week. Let them.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this week and the people closest to you feel it as pressure. Someone wants more than you are giving, or the other way round. Have the awkward conversation by Thursday rather than carrying it into the weekend.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign, and the week is warm at close range. Plans made with a partner or a friend hold, and the difficult subject can be raised without the room going cold. A good week to be generous first.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign this week, in the part of the sky that belongs to other people. Partnerships, contracts, the other side of every conversation: that is where the week is decided. Listen twice as much as you speak and you will come out ahead.",
        ],
        [R.QUIET]: [
            "A quiet week for love and friendship, with nothing forcing the issue either way. Use it for maintenance: the call you owe, the birthday you nearly missed, the small kindness that keeps a friendship alive between the big moments.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} is in your sign all week, so your work is visible whether you planned it or not. Put the finished thing in front of people, not the draft. Decisions made with your name on them this week tend to stick.",
        ],
        [R.SEXTILE]: [
            "A workable week with help available for the asking. {planet} keeps the right contact within reach, and a short conversation early in the week saves a long one later. Ask the question on Monday.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this week, which puts pressure on the work. Something built in a hurry needs rebuilding properly. Cut scope, not standards, and do not start anything new before the current thing is finished.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the week runs the way you always hope a week will. Ask for what the work is worth, send the proposal, take the meeting. The ease lasts through Friday, so front-load the asks.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign, so this week the work turns on someone else's decision: a client, a manager, a partner across the table. Prepare thoroughly and then wait without chasing. The calm answer beats the clever one.",
        ],
        [R.QUIET]: [
            "Nothing in the sky pulls at your working life this week, and that is when the real building happens. Clear the backlog, fix the thing everyone works around, and write down the process only you know.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign turns the volume up on everything you feel this week. You are more open than usual and more easily bruised. Choose the company you keep with that in mind and the week will be a good one.",
        ],
        [R.SEXTILE]: [
            "A light, even week inside. {planet} at an easy angle to your sign keeps the mood steady and the small pleasures close. Say the thing you have been feeling out loud; it will sound better than you fear.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign and the week has an edge to it. Irritation arrives without an obvious cause and looks for somewhere to land. Move your body, keep your tongue, and let the mood pass through rather than deciding anything inside it.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the inside weather is good all week. You feel like yourself, and the people around you get the best version. Spend some of the ease on the one who has been carrying the most.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign makes this a week of feeling through other people: their moods set yours more than usual. Take the compliments at face value and discount the slights. Keep one evening that is only yours.",
        ],
        [R.QUIET]: [
            "A calm, uneventful week emotionally. If anything surfaces it is old rather than new, and it is best let through without a story attached. Rest is the point of a week like this.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign gives the body a charge this week, unevenly spread. Use it early in the day and early in the week. By Friday, protect your sleep; the energy is real but it runs out.",
        ],
        [R.SEXTILE]: [
            "A steady week for the body with the energy there when you reach for it. {planet} favours the routine over the heroic effort. The habit you keep every day this week is the one that survives the month.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this week and the body asks for more care than you planned to give it. Tension in the neck and shoulders, shorter sleep, a temper on a shorter fuse. Water, daylight, early nights. Cancel the thing you were dreading.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the body feels capable all week. A genuinely good time to begin the routine you keep describing to people. Start it on a weekday and by Sunday it is a habit rather than a plan.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means other people's schedules keep talking the body out of rest this week. Guard one hour a day that belongs to nobody else. Eat when hungry, not when convenient.",
        ],
        [R.QUIET]: [
            "Nothing in the sky presses on the body this week. Keep the habits you already have and do not add a new one. If you feel off, it is sleep or food, not the stars.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign makes this a week for moving: trips, errands, the visit you keep postponing. Journeys started this week go smoothly and conversations away from home go further than the ones in it.",
        ],
        [R.SEXTILE]: [
            "Movement is easy this week and news from a distance is good. Bookings made early in the week are the cheapest, and the paperwork stays honest. Take the short trip.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this week, so journeys run late and messages cross. Confirm every time and place twice. Not a week for tight connections or for signing anything sent from far away.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the road opens. Longer plans made this week are the ones that actually happen, and someone at a distance thinks of you and says so. Book the thing.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign turns the week's movement around other people: their arrivals, their delays, their choice of route. Go with the itinerary that is not yours and bring what they forgot.",
        ],
        [R.QUIET]: [
            "No strong pull toward the door this week. Plan rather than go: give the trip you keep mentioning a date and a budget, which is more than it had last week.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign tilts the week toward yes. Ask for the thing you have been rehearsing, and take the introduction even if the timing is inconvenient. Favours come through people a little senior to you.",
        ],
        [R.SEXTILE]: [
            "Quiet luck all week: a queue that moves, a fee waived, good news through someone you had not heard from in months. Notice it and say thank you properly; that is how it continues.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign and the easy win is off the table this week. Nothing is against you; the sky is just not handing anything over. Keep your money in your pocket and earn what you want.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the week is generous. The right person is at the right desk and the answer is yes. Say yes back, but check the size of the bite before you do.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means this week's luck belongs to someone else and some of it rubs off. Be near people having a good week, congratulate them properly, and let the tide carry you.",
        ],
        [R.QUIET]: [
            "An even week, neither charmed nor cursed. Luck this size is made rather than found. Do the small thing that puts you in the way of the bigger one, then be patient.",
        ],
    },
}

const yearly: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} spends the year in your sign, which makes this a year about you: how you come across, what you want, who you are becoming. Relationships adjust around that. The ones that can are the ones to keep.",
        ],
        [R.SEXTILE]: [
            "{planet} sits two signs from yours this year, which keeps friends, neighbours and the wider circle close and useful. The important people this year are not the obvious ones. Say yes to the invitation from the edge of your life.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this year and the people closest to you feel it as a test. Home, partnership and family ask for a decision you have been postponing. Make it slowly and out loud, and the year ends with fewer people but better ones.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign, and this is a warm year at close range. Love and friendship come easier than they have in a while. Commit to something, or someone, while the sky is this kind.",
        ],
        [R.OPPOSITION]: [
            "{planet} sits opposite your sign this year, in the house of partnership. Whatever this year is about, it is about the other person: meeting one, keeping one, or finally being honest with one. You will not do this year alone.",
        ],
        [R.QUIET]: [
            "No slow planet leans on your relationships this year, which makes it a year of choice rather than fate. Tend what you have. Nothing is being taken away and nothing is being handed over.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign all year puts your working life in the foreground. Whatever you are known for gets tested and, if it holds, confirmed. Take the visible role; hiding will not work this year anyway.",
        ],
        [R.SEXTILE]: [
            "{planet} in easy reach of your sign gives the year a steady tailwind at work. Help is available and small openings keep appearing. None of them is the big break; together they are the career.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this year and the work asks to be rebuilt on firmer ground. Something you have been getting away with stops working. It is a load test, not a punishment. What survives the year is structurally sound.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign, and this is a year the work opens up. Ask for more than feels polite, take the bigger project, put your name on the thing. The sky is inclined to say yes, and it will not stay this inclined.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means the year's professional story runs through other people: the partner, the client, the rival who turns out to be an ally. Negotiate rather than command. The best outcome is one you did not reach alone.",
        ],
        [R.QUIET]: [
            "No slow planet leans on your work this year. That is a year for consolidation: finish what is open, learn the thing you keep putting off, and leave the year with a cleaner desk than you started it with.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign makes this a year of feeling more than usual: more open, more porous, more easily moved. Choose your company carefully and let the year change you a little. It intends to.",
        ],
        [R.SEXTILE]: [
            "A gently supported year inside. {planet} at an easy angle keeps the mood workable even when the circumstances are not. You will handle this year better than you expect.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign and something inside asks to be faced this year rather than managed. An old pattern, a private fear, a grief that never got its time. Give it the time. The year is long enough.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign, and this is a year of feeling like yourself. The inner weather is good and it stays good. Use it to repair what a harder year broke.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign makes this a year of learning yourself through other people. What they reflect back is not always comfortable and is usually accurate. Take it in slowly.",
        ],
        [R.QUIET]: [
            "No slow planet presses on your inner life this year. It is a quiet year in the best sense, and a good one to build the habits that hold you up when louder years come.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign for the year keeps the body in the foreground. Energy runs high and then runs out; the year rewards a rhythm rather than a push. Sleep is the whole strategy.",
        ],
        [R.SEXTILE]: [
            "A steady year for the body with support close by. {planet} favours the routine you can keep over the plan you admire. Build the small habit in the first quarter and it will carry the rest.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign this year and the body asks for the maintenance you have been deferring. The check-up, the dentist, the sleep. Nothing dramatic if you attend to it; something dramatic if you do not.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the body is capable this year. A good year to begin the thing you have been describing for a while and to keep it. Strength built now lasts.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means the year's health story is about balance with other people's demands. Guard your rest against their schedules. What you protect this year, you keep.",
        ],
        [R.QUIET]: [
            "No slow planet presses on the body this year. Keep what works, add nothing heroic, and treat the quiet as the gift it is.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign makes this a year of movement and of being seen in new places. Travel changes something about how you see yourself. Go somewhere you have never been, alone if you can.",
        ],
        [R.SEXTILE]: [
            "Short journeys and near horizons do the most for you this year. {planet} keeps the road easy and the news from a distance good. The trip that matters is closer than you think.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign, and travel this year needs more planning than usual. Delays, paperwork, a route that has to be changed. It all still happens; it just does not happen on the first attempt.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the far horizon opens this year. The long trip, the study abroad, the move you keep discussing. This is the year the sky agrees with the idea.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means this year's journeys are for or with other people: a partner's move, a family visit, a trip someone else has planned. Let them lead and you will see more.",
        ],
        [R.QUIET]: [
            "No strong pull toward distance this year. Travel if you like; nothing in the sky is against it. But the year's real journey is closer to home.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} in your sign for the year is a lucky placement, and the luck is mostly in confidence: you ask for more and you get more. Enjoy the yes, and keep one foot on the ground.",
        ],
        [R.SEXTILE]: [
            "A year of small, steady luck rather than one big break. {planet} keeps opportunity within reach through friends and contacts. Answer every message; you do not know which one it is.",
        ],
        [R.SQUARE]: [
            "{planet} squares your sign and the year does not hand anything over. What you get this year, you earn, and it will be worth more for that. Avoid the shortcut, the scheme, the too-good price.",
        ],
        [R.TRINE]: [
            "{planet} trines your sign and the year is generous. Doors open without being pushed. The one thing to watch is size: say yes to the opportunity and no to the extra zero.",
        ],
        [R.OPPOSITION]: [
            "{planet} opposite your sign means this year's fortune comes through other people. A partnership, a collaboration, someone else's decision that turns out to help you. Be easy to work with and it finds you.",
        ],
        [R.QUIET]: [
            "An even year for luck, neither charmed nor cursed. Luck this size is built. Put yourself where the good things happen and be patient enough to still be there when they do.",
        ],
    },
}

const en: HoroscopeCopy = {
    lang: SupportedLanguages.EN,

    labels: {
        ephemeris: "Ephemeris",
        selectSign: "Select a sign",
        ruledBy: "Ruled by",
        periods: {
            [HoroscopePeriods.DAILY]: "Daily",
            [HoroscopePeriods.WEEKLY]: "Weekly",
            [HoroscopePeriods.YEARLY]: "Yearly",
        },
        readings: "Six readings",
        strength: "Strength",
        mood: "Mood",
        luckyNumber: "Lucky number",
        luckyColour: "Lucky colour",
        moon: {
            [HoroscopePeriods.DAILY]: "Moon today",
            [HoroscopePeriods.WEEKLY]: "Moon this week",
            [HoroscopePeriods.YEARLY]: "Moon at midyear",
        },
        why: {
            [HoroscopePeriods.DAILY]: "Today's sky · why this reading",
            [HoroscopePeriods.WEEKLY]: "This week's sky · why this reading",
            [HoroscopePeriods.YEARLY]: "This year's sky · why this reading",
        },
        forMyChart: "Read this for my chart instead",
        email: "Email it each morning",
        emailSoon: "Morning emails are not ready yet",
    },

    signs: {
        [ZodiacSigns.ARIES]: {
            name: "Aries",
            abbr: "Ari",
            range: "21 Mar – 19 Apr",
        },
        [ZodiacSigns.TAURUS]: {
            name: "Taurus",
            abbr: "Tau",
            range: "20 Apr – 20 May",
        },
        [ZodiacSigns.GEMINI]: {
            name: "Gemini",
            abbr: "Gem",
            range: "21 May – 20 Jun",
        },
        [ZodiacSigns.CANCER]: {
            name: "Cancer",
            abbr: "Can",
            range: "21 Jun – 22 Jul",
        },
        [ZodiacSigns.LEO]: {
            name: "Leo",
            abbr: "Leo",
            range: "23 Jul – 22 Aug",
        },
        [ZodiacSigns.VIRGO]: {
            name: "Virgo",
            abbr: "Vir",
            range: "23 Aug – 22 Sep",
        },
        [ZodiacSigns.LIBRA]: {
            name: "Libra",
            abbr: "Lib",
            range: "23 Sep – 22 Oct",
        },
        [ZodiacSigns.SCORPIO]: {
            name: "Scorpio",
            abbr: "Sco",
            range: "23 Oct – 21 Nov",
        },
        [ZodiacSigns.SAGITTARIUS]: {
            name: "Sagittarius",
            abbr: "Sag",
            range: "22 Nov – 21 Dec",
        },
        [ZodiacSigns.CAPRICORN]: {
            name: "Capricorn",
            abbr: "Cap",
            range: "22 Dec – 19 Jan",
        },
        [ZodiacSigns.AQUARIUS]: {
            name: "Aquarius",
            abbr: "Aqu",
            range: "20 Jan – 18 Feb",
        },
        [ZodiacSigns.PISCES]: {
            name: "Pisces",
            abbr: "Pis",
            range: "19 Feb – 20 Mar",
        },
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

    aspects: {
        [AspectTypes.CONJUNCTION]: "conjunct",
        [AspectTypes.SEXTILE]: "sextile",
        [AspectTypes.SQUARE]: "square",
        [AspectTypes.TRINE]: "trine",
        [AspectTypes.OPPOSITION]: "opposite",
    },

    phases: {
        [MoonPhases.NEW]: "New Moon",
        [MoonPhases.WAXING_CRESCENT]: "Waxing crescent",
        [MoonPhases.FIRST_QUARTER]: "First quarter",
        [MoonPhases.WAXING_GIBBOUS]: "Waxing gibbous",
        [MoonPhases.FULL]: "Full Moon",
        [MoonPhases.WANING_GIBBOUS]: "Waning gibbous",
        [MoonPhases.LAST_QUARTER]: "Last quarter",
        [MoonPhases.WANING_CRESCENT]: "Waning crescent",
    },

    colours: {
        [ZodiacSigns.ARIES]: "Oxblood",
        [ZodiacSigns.TAURUS]: "Moss",
        [ZodiacSigns.GEMINI]: "Saffron",
        [ZodiacSigns.CANCER]: "Pearl",
        [ZodiacSigns.LEO]: "Old gold",
        [ZodiacSigns.VIRGO]: "Slate",
        [ZodiacSigns.LIBRA]: "Rose",
        [ZodiacSigns.SCORPIO]: "Plum",
        [ZodiacSigns.SAGITTARIUS]: "Indigo",
        [ZodiacSigns.CAPRICORN]: "Graphite",
        [ZodiacSigns.AQUARIUS]: "Verdigris",
        [ZodiacSigns.PISCES]: "Sea glass",
    },

    moods: {
        [MoodBands.HEAVY]: "Heavy",
        [MoodBands.LEVEL]: "Level",
        [MoodBands.STEADY]: "Steady",
        [MoodBands.BRIGHT]: "Bright",
    },

    categories: {
        [C.PERSONAL]: "Personal Life",
        [C.PROFESSION]: "Profession",
        [C.EMOTIONS]: "Emotions",
        [C.HEALTH]: "Health",
        [C.TRAVEL]: "Travel",
        [C.LUCK]: "Luck",
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
        "the part of your life about how you come across and what you want for yourself",
        "the part of your life about money, possessions and what feels like enough",
        "the part of your life about talk, errands, siblings and the everyday mind",
        "the part of your life about home, family and what feels safe",
        "the part of your life about play, romance, children and being seen",
        "the part of your life about work, health and daily routine",
        "the part of your life about partnership and the people you commit to",
        "the part of your life about intimacy, shared money and what you keep private",
        "the part of your life about belief, travel and the bigger picture",
        "the part of your life about career, reputation and what you are known for",
        "the part of your life about friends, groups and hopes for the future",
        "the part of your life about rest, retreat and what stays unspoken",
    ],

    headlines: {
        [HoroscopePeriods.DAILY]: {
            [R.CONJUNCTION]: [
                "The Moon is in your sign. Everything lands a little harder and means a little more.",
                "A day that is all about you, whether you asked for it or not. Let it be.",
            ],
            [R.SEXTILE]: [
                "A light day with a small opening in it. Notice who walks through.",
                "Easy going, easy company. The day asks little and gives a little back.",
            ],
            [R.SQUARE]: [
                "A day that shows you where the friction is. Do not oil it with promises.",
                "Something pushes. Push back gently, or not at all, and it passes by evening.",
            ],
            [R.TRINE]: [
                "A day for finishing rather than starting. What you close today stays closed.",
                "Things line up without being pushed. Use the ease on something that matters.",
            ],
            [R.OPPOSITION]: [
                "The day belongs to the other person. Listen, and you will end up further ahead.",
                "You are being mirrored today. Look, even if the reflection is not flattering.",
            ],
            [R.QUIET]: [
                "A plain day, and plain days are where most of a life actually happens.",
                "Nothing pulls hard today. Choose the lighter thing at every fork.",
            ],
        },
        [HoroscopePeriods.WEEKLY]: {
            [R.CONJUNCTION]: [
                "Your week, with your name on it. Be visible on purpose.",
                "{planet} in your sign makes this a week about you. Spend it on something worth being seen for.",
            ],
            [R.SEXTILE]: [
                "A week that helps if you let it. Say yes early and often.",
                "Small openings all week. None of them is the big one; together they are.",
            ],
            [R.SQUARE]: [
                "A week that tests the structure. Fix what wobbles before Friday.",
                "Pressure, not punishment. Cut scope, keep standards, finish one thing.",
            ],
            [R.TRINE]: [
                "A week that runs the way you always hope a week will. Ask for more than feels polite.",
                "The sky is on your side until Friday. Front-load the asks.",
            ],
            [R.OPPOSITION]: [
                "A week decided by other people. Prepare, then wait without chasing.",
                "The other side of the table sets the pace this week. Match it.",
            ],
            [R.QUIET]: [
                "A quiet week, and the useful kind. Tidy, finish, rest.",
                "Nothing pulls hard this week. Build something small that will still be standing next month.",
            ],
        },
        [HoroscopePeriods.YEARLY]: {
            [R.CONJUNCTION]: [
                "A year with your name on it. Whatever you become, you become in public.",
                "{planet} in your sign all year: a year of being seen, tested and confirmed.",
            ],
            [R.SEXTILE]: [
                "A year of small doors. Walk through the ones that open on their own.",
                "Help is close all year. The people who matter this year are the ones at the edge of the room.",
            ],
            [R.SQUARE]: [
                "A year that asks to be earned. What you build under pressure is the part that lasts.",
                "Not an easy year, and a useful one. Something gets rebuilt on firmer ground.",
            ],
            [R.TRINE]: [
                "A year the sky agrees with you. Ask for more than feels polite and mean it.",
                "Doors open without being pushed this year. Choose which ones to walk through.",
            ],
            [R.OPPOSITION]: [
                "A year decided with someone else. You will not do it alone, and you should not try.",
                "The year runs through partnership. Negotiate everything, command nothing.",
            ],
            [R.QUIET]: [
                "A year of your own choosing. Nothing is taken away and nothing is handed over.",
                "A quiet year in the sky, which makes it a year for building rather than reacting.",
            ],
        },
    },

    readings: {
        [HoroscopePeriods.DAILY]: daily,
        [HoroscopePeriods.WEEKLY]: weekly,
        [HoroscopePeriods.YEARLY]: yearly,
    },

    moonHouse: [
        "The Moon crosses your sign today, so whatever you feel, you feel it in the first person.",
        "The Moon sits in your second house today, and the mood follows the money: spend a little, but not to feel better.",
        "The Moon is in your third house today, so the feeling wants to be talked out. Find the right listener rather than the nearest one.",
        "The Moon is at the bottom of your chart today, in the house of home. Stay in if you can; the evening is where the day is good.",
        "The Moon is in your fifth house today, the house of play. The mood improves the moment you stop being useful.",
        "The Moon sits in your sixth house today, and the feelings show up as tasks. Do two of them and the rest of the list loses its grip.",
        "The Moon is opposite your sign today, in the house of the other person. Your mood and theirs are tangled; untangle gently.",
        "The Moon is in your eighth house today, where feelings run deep and private. Not everything needs saying. Some of it only needs knowing.",
        "The Moon is in your ninth house today, and the mood wants a horizon. A longer walk or a longer view does more than any conversation.",
        "The Moon is at the top of your chart today, in the house of work and reputation. Feelings and duty share the room; let duty have the morning.",
        "The Moon is in your eleventh house today, among friends and plans. Company lifts the mood faster than solitude does today.",
        "The Moon sits in your twelfth house today, the quiet one behind the sign. Rest is not avoidance today; it is the assignment.",
    ],

    phaseNotes: {
        [MoonPhases.NEW]:
            "A New Moon empties the room: expect to want less and mind less, and set one small intention in the next two days.",
        [MoonPhases.WAXING_CRESCENT]:
            "The Moon is young and growing, and so is whatever you started this week. Feed it a little.",
        [MoonPhases.FIRST_QUARTER]:
            "A quarter Moon brings one clear obstacle into view. It is smaller than it looks tonight.",
        [MoonPhases.WAXING_GIBBOUS]:
            "The Moon is nearly full, and so is the week. Trim what you can before the peak.",
        [MoonPhases.FULL]:
            "A Full Moon brings things to a head, usually in one evening. Let it be seen, then let the evening go quiet.",
        [MoonPhases.WANING_GIBBOUS]:
            "The Moon is past full and the pressure is coming off. Say thank you for something and mean it.",
        [MoonPhases.LAST_QUARTER]:
            "A waning quarter Moon is for letting go of one thing on purpose. Choose it before it chooses you.",
        [MoonPhases.WANING_CRESCENT]:
            "The old Moon is thin and tired, and so are you. Rest counts as progress this week.",
    },

    retrograde:
        "{planet} is retrograde, so give this part of the reading a second look before acting on it. Old business comes back before new business begins.",

    notes: {
        aspect: "{a} {aspect} {b} · orb {orb}",
        moon: "Moon {pos}",
        retrograde: "{planet} retrograde · {pos}",
        direct: "{planet} direct · {pos}",
        stationary: "{planet} stationary",
        lunation: {
            [Lunations.NEW]: "New Moon in {sign} · {date}",
            [Lunations.FULL]: "Full Moon in {sign} · {date}",
        },
        ingress: "{planet} enters {sign} · {date}",
        moonRun: "Moon through {signs}",
        house: "{planet} in {sign} · your {ordinal} house",
    },
}

export default en
