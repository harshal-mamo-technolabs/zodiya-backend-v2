import { SupportedLanguages, TarotSpreads } from "../../constants/index.ts"
import type { TarotCopy } from "../../types/index.ts"

/**
 * English tarot copy. Every card gets an upright and a reversed reading written
 * for someone who has never held a deck: what the card says about the question,
 * not what it symbolises. The lede is the card in one sentence; the text is the
 * advice.
 */
const en: TarotCopy = {
    lang: SupportedLanguages.EN,

    cards: {
        // ------------------------------------------------------ major arcana
        fool: {
            name: "The Fool",
            up: {
                lede: "Start before you feel ready.",
                text: "This is the card of the first step, taken with more trust than evidence. You do not need the whole plan. You need to leave the ground you are standing on and let the rest of it show up as you go.",
                keywords: ["Beginnings", "Trust", "A leap"],
            },
            rev: {
                lede: "You are about to jump without looking, or refusing to jump at all.",
                text: "Reversed, the Fool is either recklessness or paralysis, and you will know which one is yours. If you are rushing, slow down and read the small print. If you are frozen, admit that waiting for certainty is its own decision.",
                keywords: ["Hesitation", "Recklessness", "Fear"],
            },
        },
        magician: {
            name: "The Magician",
            up: {
                lede: "You already have everything this needs.",
                text: "The tools are on the table. Skill, timing, the right words, the right people. What the Magician asks is that you stop gathering and start using. This is a card of capability, and it does not favour modesty.",
                keywords: ["Skill", "Will", "Resources"],
            },
            rev: {
                lede: "Someone is performing rather than doing.",
                text: "Reversed, the Magician is all presentation. Either you are being sold something by a person who talks better than they deliver, or you are the one talking. Look at what has actually been made, not what has been promised.",
                keywords: ["Manipulation", "Empty talk", "Wasted talent"],
            },
        },
        "high-priestess": {
            name: "The High Priestess",
            up: {
                lede: "You already know. You are waiting for permission to know it.",
                text: "Something is being kept quiet, and it may be you keeping it. The High Priestess is the card of the unsaid: the feeling you cannot justify, the answer that arrived before the question. Do not act yet. Listen a while longer.",
                keywords: ["Intuition", "Silence", "The unseen"],
            },
            rev: {
                lede: "You have stopped listening to yourself.",
                text: "Reversed, this is the card of a hunch overruled. Somebody talked you out of what you felt, or you did it to yourself with logic. The way back is quiet: less input, fewer opinions, and one honest hour alone.",
                keywords: ["Doubt", "Noise", "Ignored instinct"],
            },
        },
        empress: {
            name: "The Empress",
            up: {
                lede: "Let it grow. Do not pull it up to check the roots.",
                text: "The Empress is abundance in its plainest form: things growing because they are tended, not because they are pushed. This favours creating, nurturing, and enjoying what is already good. Comfort is not a weakness this week.",
                keywords: ["Growth", "Care", "Abundance"],
            },
            rev: {
                lede: "You are giving from an empty cupboard.",
                text: "Reversed, the Empress has looked after everyone but herself. Creativity dries up, the house feels like work, and generosity curdles into resentment. Feed yourself first. It is not selfish, it is maintenance.",
                keywords: ["Depletion", "Neglect", "Smothering"],
            },
        },
        emperor: {
            name: "The Emperor",
            up: {
                lede: "Put a structure around it.",
                text: "This card wants rules, a plan, a person in charge. It might be you. Whatever feels chaotic right now will respond to boundaries and a schedule rather than more feeling. Be firm, be fair, and do not apologise for either.",
                keywords: ["Order", "Authority", "Boundaries"],
            },
            rev: {
                lede: "Control has become the point.",
                text: "Reversed, the Emperor is rigid where he should be steady. Someone is ruling by force of habit, or by force. If it is you, ask whether the rule still serves anyone. If it is someone else, stop expecting them to soften on their own.",
                keywords: ["Rigidity", "Domination", "Weak leadership"],
            },
        },
        hierophant: {
            name: "The Hierophant",
            up: {
                lede: "Do it the way it has always been done, for now.",
                text: "Tradition, teachers, institutions, the tried and tested path. The Hierophant says the conventional route is the right one this time. Ask someone who has done it before. Follow the form. There will be time to improvise later.",
                keywords: ["Tradition", "Guidance", "Convention"],
            },
            rev: {
                lede: "The rules have stopped making sense.",
                text: "Reversed, this is the moment you notice the ritual has outlived its reason. A belief, a job, a family expectation you have followed without asking why. You do not have to burn it down. You do have to decide for yourself.",
                keywords: ["Rebellion", "Questioning", "Outgrown"],
            },
        },
        lovers: {
            name: "The Lovers",
            up: {
                lede: "A choice, and it matters which way you go.",
                text: "Yes, this card is about love. It is also about the decision love forces: who you are when you are with this person, and whether that is who you want to be. Choose with your whole self, not the half that is afraid of being alone.",
                keywords: ["Union", "Choice", "Alignment"],
            },
            rev: {
                lede: "You want two things that cannot both be true.",
                text: "Reversed, the Lovers is a values clash. It may be between two people, or between two halves of you. The discomfort will not resolve by ignoring it. Name what each option costs and choose the cost you can live with.",
                keywords: ["Conflict", "Imbalance", "Misalignment"],
            },
        },
        chariot: {
            name: "The Chariot",
            up: {
                lede: "Drive. Do not steer by committee.",
                text: "The Chariot is momentum under control. You have opposing forces to manage, and the trick is not to eliminate one but to hold both and move anyway. Confidence is the whole strategy here. Pick the direction and commit.",
                keywords: ["Drive", "Willpower", "Victory"],
            },
            rev: {
                lede: "All acceleration, no steering.",
                text: "Reversed, the Chariot has lost the reins. Either you are pushing hard at something that is not moving, or you are being pulled in two directions and calling it progress. Stop, look at where you are actually going, then start again.",
                keywords: ["Aggression", "Lost direction", "Stalled"],
            },
        },
        strength: {
            name: "Strength",
            up: {
                lede: "The gentle hand wins this one.",
                text: "Not force. Patience, steadiness, the kind of courage that does not need an audience. Whatever is snarling at you, whether a person, a fear or a habit, meets its match in calm. You are stronger than the situation. Act like it, quietly.",
                keywords: ["Courage", "Patience", "Inner strength"],
            },
            rev: {
                lede: "You are doubting a strength you have already proved.",
                text: "Reversed, Strength is confidence that has slipped. Either you are pushing too hard because you feel weak, or you have given up because you feel weak. Neither is accurate. Look at what you have already survived.",
                keywords: ["Self doubt", "Force", "Fragility"],
            },
        },
        hermit: {
            name: "The Hermit",
            up: {
                lede: "Go quiet on purpose.",
                text: "The Hermit is withdrawal with a reason. Not hiding, but stepping back far enough to see what the noise was hiding. Take the time alone. Read, walk, think. The answer you want is not in the room with the other people.",
                keywords: ["Solitude", "Reflection", "Wisdom"],
            },
            rev: {
                lede: "Alone has turned into lonely.",
                text: "Reversed, the Hermit stayed on the mountain too long. Reflection became avoidance, and privacy became a wall. You have thought about it enough. Come back down and tell someone what you found.",
                keywords: ["Isolation", "Avoidance", "Withdrawal"],
            },
        },
        "wheel-of-fortune": {
            name: "Wheel of Fortune",
            up: {
                lede: "Luck is turning, and it is turning your way.",
                text: "Something shifts that you did not cause and cannot control. The Wheel favours you right now, so say yes to what arrives. This is the card of the good coincidence, the timely call, the door that opens on its own.",
                keywords: ["Change", "Luck", "Turning point"],
            },
            rev: {
                lede: "The turn is against you, and it is not personal.",
                text: "Reversed, the Wheel brings a setback that has nothing to do with your effort. Plans slip, timing fails, a chance goes to someone else. Resist the urge to find a lesson in it. Sometimes it is just the turn. Hold on and it turns again.",
                keywords: ["Bad timing", "Setback", "Outside your hands"],
            },
        },
        justice: {
            name: "Justice",
            up: {
                lede: "It will come out fair, if not fast.",
                text: "Justice is cause and effect with a long memory. What was done will be answered, and what you do now will be too. This favours honesty, contracts, and telling the whole truth even when a partial one would be easier.",
                keywords: ["Fairness", "Truth", "Consequence"],
            },
            rev: {
                lede: "Someone is not getting what they are owed.",
                text: "Reversed, Justice is the unfair outcome, or the unfair excuse. Either you are being treated wrongly, or you are avoiding responsibility for something that was yours. Be honest about which. Then be honest out loud.",
                keywords: ["Unfairness", "Dishonesty", "Avoided blame"],
            },
        },
        "hanged-man": {
            name: "The Hanged Man",
            up: {
                lede: "Stop struggling. The pause is the point.",
                text: "You are suspended, and nothing you push against moves. The Hanged Man says: let it hang. Waiting is not losing. From upside down, the situation looks different, and the different view is what you came for.",
                keywords: ["Surrender", "Waiting", "New angle"],
            },
            rev: {
                lede: "You are stuck and calling it patience.",
                text: "Reversed, the Hanged Man has stopped learning from the pause and started hiding in it. Sacrifice with no purpose is just loss. If nothing has changed in a long while, cut yourself down.",
                keywords: ["Stalling", "Resistance", "Pointless sacrifice"],
            },
        },
        death: {
            name: "Death",
            up: {
                lede: "Something is over. Let it be over.",
                text: "This card almost never means what people fear. It means an ending, complete and necessary: a chapter, a role, a version of yourself. Grieve it if you need to, but do not try to revive it. What comes next needs the space.",
                keywords: ["Ending", "Transformation", "Release"],
            },
            rev: {
                lede: "You are keeping something alive that has already died.",
                text: "Reversed, Death is the ending you refuse to accept. The relationship that finished a year ago, the plan that stopped being possible. Holding on is not loyalty. It is the thing standing between you and what is next.",
                keywords: ["Resistance", "Clinging", "Delayed change"],
            },
        },
        temperance: {
            name: "Temperance",
            up: {
                lede: "Mix, do not choose.",
                text: "Temperance is the middle way, practised rather than preached. Two things that seem opposed can be blended with patience: work and rest, head and heart, you and them. Nothing extreme this week. Small adjustments, made carefully.",
                keywords: ["Balance", "Patience", "Moderation"],
            },
            rev: {
                lede: "Everything is turned up too loud.",
                text: "Reversed, Temperance is excess. Too much of something, whether work, drink, worry or love, at the expense of everything else. The fix is dull and it works: less of the big thing, more of the neglected ones.",
                keywords: ["Excess", "Imbalance", "Impatience"],
            },
        },
        devil: {
            name: "The Devil",
            up: {
                lede: "The chain is loose. You could walk away.",
                text: "The Devil is what you keep choosing though it costs you: a habit, a person, a story about yourself. Notice that nobody is holding you there. This card is not a punishment. It is the moment you see the door was never locked.",
                keywords: ["Attachment", "Habit", "Bondage"],
            },
            rev: {
                lede: "You are getting free, and it feels worse before it feels better.",
                text: "Reversed, the Devil is release. A dependence loosens, a pattern breaks, and the space it leaves is uncomfortable at first. Do not fill it with the next version of the same thing. Sit in the gap a while.",
                keywords: ["Release", "Breaking free", "Recovery"],
            },
        },
        tower: {
            name: "The Tower",
            up: {
                lede: "The structure was always going to fall.",
                text: "Something collapses faster than you can manage it, and the relief underneath the shock tells you it needed to. What survives the fall is what was actually holding weight. Build on that, and nothing else.",
                keywords: ["Rupture", "Truth", "Release"],
            },
            rev: {
                lede: "You are holding up a wall that wants to come down.",
                text: "Reversed, the Tower is a delayed collapse. Every month you postpone it costs more than the fall would. The kindest version of this ends on your own terms, so end it yourself before it ends for you.",
                keywords: ["Avoidance", "Delay", "Cost"],
            },
        },
        star: {
            name: "The Star",
            up: {
                lede: "The worst of it is behind you.",
                text: "After a stretch that took more than it gave, something quiet returns. Not certainty, but the willingness to hope again. Do not rush to make it into a plan. Let it be a direction for now.",
                keywords: ["Renewal", "Hope", "Clarity"],
            },
            rev: {
                lede: "You have stopped expecting anything good.",
                text: "Reversed, the Star points to a faith that dimmed so gradually you did not notice. Nothing is broken. You are tired. The repair is rest and lowered stakes, not a bigger effort.",
                keywords: ["Depletion", "Doubt", "Rest"],
            },
        },
        moon: {
            name: "The Moon",
            up: {
                lede: "You know more than you can prove.",
                text: "Something is unclear on purpose. Not hidden from you, just not ready to be named. Trust the unease; it is information. Do not force a conclusion tonight, and do not sign anything you cannot read in daylight.",
                keywords: ["Intuition", "Uncertainty", "Illusion"],
            },
            rev: {
                lede: "The fog is lifting.",
                text: "Reversed, the Moon releases confusion. A fear you have been circling turns out to be smaller in daylight than it was at three in the morning. Say it out loud to one person and watch it shrink.",
                keywords: ["Clarity", "Release", "Truth"],
            },
        },
        sun: {
            name: "The Sun",
            up: {
                lede: "It is simply good. Enjoy it without checking for the catch.",
                text: "The Sun is the warmest card in the deck: success, health, a clear sky. Whatever you asked about, the answer is generous. The only mistake available is to distrust it. Say yes, and be seen enjoying yourself.",
                keywords: ["Joy", "Success", "Clarity"],
            },
            rev: {
                lede: "The good news is there. You are standing in your own shade.",
                text: "Reversed, the Sun is still the Sun, just partly blocked. Pessimism, exhaustion or a small ego bruise is keeping you from a happiness that is already yours. Step sideways and let it reach you.",
                keywords: ["Dimmed", "Pessimism", "Delayed joy"],
            },
        },
        judgement: {
            name: "Judgement",
            up: {
                lede: "You are being called. Answer.",
                text: "Judgement is the reckoning that sets you free: an honest look at where you have been, and a clear call toward where you are going. Forgive what needs forgiving, including yourself, and then rise. This is a card of second chances taken.",
                keywords: ["Reckoning", "Awakening", "Absolution"],
            },
            rev: {
                lede: "You keep putting yourself on trial.",
                text: "Reversed, Judgement is self criticism with no verdict. The past is being re-read for the tenth time and no new information is coming. The lesson has been learned. Stop the hearing and go and live.",
                keywords: ["Self doubt", "Regret", "Refusing the call"],
            },
        },
        world: {
            name: "The World",
            up: {
                lede: "It is finished, and it is whole.",
                text: "The World is completion: the degree earned, the move made, the cycle closed with nothing left hanging. Take a moment to notice that you did it. Then, and only then, look at what the next circle might be.",
                keywords: ["Completion", "Wholeness", "Arrival"],
            },
            rev: {
                lede: "So close, and stalled at the last step.",
                text: "Reversed, the World is the thing that is nearly done and will not quite close. A loose end, a missing conversation, a goodbye not said. Find the piece you skipped. Finishing is a task of its own.",
                keywords: ["Incomplete", "Loose ends", "Delay"],
            },
        },

        // -------------------------------------------------------------- wands
        "wands-ace": {
            name: "Ace of Wands",
            up: {
                lede: "A spark, and it is real.",
                text: "The idea that arrived this week is worth something. The Ace of Wands is raw beginning: energy before it has a shape. Do not wait to refine it. Do one concrete thing with it today, however small, while it is still hot.",
                keywords: ["Inspiration", "Beginning", "Drive"],
            },
            rev: {
                lede: "The spark keeps going out.",
                text: "Reversed, this is enthusiasm that cannot catch. Ideas arrive and die on the desk. The problem is not the idea; it is that nothing is being given the chance to grow. Pick one and protect it from the next one.",
                keywords: ["False start", "Delay", "Lost enthusiasm"],
            },
        },
        "wands-two": {
            name: "Two of Wands",
            up: {
                lede: "Plan the leaving before you leave.",
                text: "You are standing somewhere safe and looking at somewhere bigger. The Two of Wands is the deliberate plan, the map before the journey. Ambition is right. So is preparation. Decide where, and then decide how.",
                keywords: ["Planning", "Ambition", "The wider view"],
            },
            rev: {
                lede: "Playing it safe has become the whole plan.",
                text: "Reversed, this card is a horizon you keep looking at and never walk toward. Fear of the unknown has dressed itself as sensible caution. If the plan has been ready for months, the missing ingredient is nerve.",
                keywords: ["Fear", "Overplanning", "Playing small"],
            },
        },
        "wands-three": {
            name: "Three of Wands",
            up: {
                lede: "It has set sail. Now you wait for it to come back.",
                text: "The effort is out in the world and beyond your control. The Three of Wands is expansion in progress: doors opening at a distance, results still travelling toward you. Keep looking outward. Something is coming.",
                keywords: ["Expansion", "Foresight", "Progress"],
            },
            rev: {
                lede: "The ships are late, and you are pacing.",
                text: "Reversed, this is a delay you cannot hurry, plus the impatience that makes it feel longer. Something you sent out has not returned yet. Check that the plan was sound, then stop checking the horizon every hour.",
                keywords: ["Delay", "Obstacles", "Impatience"],
            },
        },
        "wands-four": {
            name: "Four of Wands",
            up: {
                lede: "Celebrate it. You have earned a good evening.",
                text: "The Four of Wands is home, a gathering, the milestone with people around it. Something stable has been reached and it deserves to be marked. Do not skip the party because there is more work to do. There is always more work.",
                keywords: ["Celebration", "Home", "Stability"],
            },
            rev: {
                lede: "The home front is unsettled.",
                text: "Reversed, this points to tension where there should be ease: a family strain, a move that will not settle, a celebration that feels like an obligation. Say the awkward thing before the gathering rather than after.",
                keywords: ["Instability", "Tension", "Unsettled home"],
            },
        },
        "wands-five": {
            name: "Five of Wands",
            up: {
                lede: "Everyone is talking and nobody is listening.",
                text: "The Five of Wands is friction: competition, argument, five people with five plans. It is noisy rather than dangerous. The way through is not to win but to organise. Someone has to set the agenda, and it might as well be you.",
                keywords: ["Conflict", "Competition", "Chaos"],
            },
            rev: {
                lede: "You are avoiding a fight that needs having.",
                text: "Reversed, the argument has gone underground. Nobody is shouting and nothing is resolved. Peace kept by silence is not peace. Raise the thing that everyone is stepping around and let it be loud for an hour.",
                keywords: ["Avoidance", "Suppressed tension", "Resolution"],
            },
        },
        "wands-six": {
            name: "Six of Wands",
            up: {
                lede: "You won. Let people see it.",
                text: "Recognition arrives, and publicly. The Six of Wands is the victory lap, the compliment in front of the room. Accept it without deflecting. Being seen to succeed is part of succeeding, and modesty here reads as false.",
                keywords: ["Victory", "Recognition", "Confidence"],
            },
            rev: {
                lede: "The applause has not come, and it is eating at you.",
                text: "Reversed, this is either a fall from favour or the fear of one. You did the work and someone else took the bow, or you did the work and nobody looked. Ask whether you need the applause, or whether you need the work to have mattered.",
                keywords: ["Ego", "Lack of recognition", "Fall"],
            },
        },
        "wands-seven": {
            name: "Seven of Wands",
            up: {
                lede: "Hold the ground. You have the high position.",
                text: "You are being challenged and you are right to defend. The Seven of Wands is standing firm against pressure, whether a rival, a critic, or a crowd of opinions. It is tiring, and you can do it. Do not step down to make it easier for them.",
                keywords: ["Defence", "Perseverance", "Standing firm"],
            },
            rev: {
                lede: "You are too tired to keep defending it.",
                text: "Reversed, this is the fight you are losing not because you are wrong but because you are worn out. Ask for help. Or ask whether the thing you are defending still needs you to defend it.",
                keywords: ["Overwhelm", "Giving up", "Exhaustion"],
            },
        },
        "wands-eight": {
            name: "Eight of Wands",
            up: {
                lede: "Everything is moving at once. Keep up.",
                text: "The Eight of Wands is speed: messages, travel, news, decisions arriving faster than usual. It is a good fast. Answer promptly, book the ticket, say yes while the window is open. Deliberation is for a slower week.",
                keywords: ["Speed", "Movement", "News"],
            },
            rev: {
                lede: "Everything is stuck, and the waiting is the worst part.",
                text: "Reversed, this is the delayed message, the postponed trip, the decision that will not land. Chasing it will not help. Use the pause to check that what you are rushing toward is where you want to arrive.",
                keywords: ["Delay", "Frustration", "Miscommunication"],
            },
        },
        "wands-nine": {
            name: "Nine of Wands",
            up: {
                lede: "One more push. You are closer than you feel.",
                text: "The Nine of Wands is resilience with bruises on it. You have been through a lot and you are still standing, warily. Stay on guard a little longer, but know that this is the last hard stretch, not the middle of one.",
                keywords: ["Resilience", "Persistence", "Guarded"],
            },
            rev: {
                lede: "You are defending against a battle that already ended.",
                text: "Reversed, this is the person who cannot put the shield down. Old injuries are making every new situation look like the old one. Not everyone is an attacker. Lower the guard an inch and see what happens.",
                keywords: ["Paranoia", "Exhaustion", "Old wounds"],
            },
        },
        "wands-ten": {
            name: "Ten of Wands",
            up: {
                lede: "You are carrying too much, and nobody asked you to.",
                text: "The Ten of Wands is the overload you built yourself: responsibilities picked up one by one until the whole pile blocks the view. Put some of it down. Delegate, decline, or drop. Nothing will collapse. Some of it was never yours.",
                keywords: ["Burden", "Overwork", "Responsibility"],
            },
            rev: {
                lede: "Something has to give, and it is about to.",
                text: "Reversed, the load is being dropped, by choice or by collapse. If by choice, good. If by collapse, be kind to yourself about it. Either way, do not pick the same pile up again out of habit.",
                keywords: ["Release", "Burnout", "Letting go"],
            },
        },
        "wands-page": {
            name: "Page of Wands",
            up: {
                lede: "Be a beginner at something, on purpose.",
                text: "The Page of Wands is enthusiasm with no track record yet, and that is its charm. A new interest, a bold message, a plan that sounds naive to people who have stopped starting things. Follow it with curiosity rather than strategy.",
                keywords: ["Curiosity", "Exploration", "Free spirit"],
            },
            rev: {
                lede: "Lots of talk about the idea, and no idea.",
                text: "Reversed, the Page has become the person who announces plans instead of making them. Enthusiasm without follow through. If this is you, finish one small thing before starting the next big one.",
                keywords: ["Hesitation", "Unfinished", "Bluster"],
            },
        },
        "wands-knight": {
            name: "Knight of Wands",
            up: {
                lede: "Go now, before you talk yourself out of it.",
                text: "Momentum is on your side and it does not last forever. This card favours the imperfect start over the well planned wait. Bring the enthusiasm, and borrow the patience from someone else.",
                keywords: ["Momentum", "Boldness", "Now"],
            },
            rev: {
                lede: "All engine, no direction.",
                text: "Reversed, the Knight burns energy in circles. You are not lacking drive; you are lacking a destination worth the fuel. Choose one thing and abandon the other three.",
                keywords: ["Scattered", "Impulse", "Focus"],
            },
        },
        "wands-queen": {
            name: "Queen of Wands",
            up: {
                lede: "Take up the whole room. It suits you.",
                text: "The Queen of Wands is warmth with a spine: confident, generous, and impossible to ignore. Whether this is you or someone near you, the advice is the same. Lead by being fully present, and let people be drawn to it.",
                keywords: ["Confidence", "Warmth", "Magnetism"],
            },
            rev: {
                lede: "The warmth has turned sharp.",
                text: "Reversed, the Queen is confidence that has soured into demand: jealousy, a temper, needing to be the centre. Or her opposite, a fire that has been damped so long it forgot itself. Find the middle. Warm, not hot.",
                keywords: ["Jealousy", "Demanding", "Self doubt"],
            },
        },
        "wands-king": {
            name: "King of Wands",
            up: {
                lede: "Set the vision and let others carry the details.",
                text: "The King of Wands is leadership at its most natural: a clear idea, a bold plan, and the charisma to make people want in. Take the bigger role. You do not need to do all of it yourself; you need to point the way.",
                keywords: ["Leadership", "Vision", "Boldness"],
            },
            rev: {
                lede: "Someone is leading for the sake of being in front.",
                text: "Reversed, the King is a vision that has become a demand for followers. Impatience, arrogance, decisions taken too fast and not explained. Slow the pace and listen to the person at the back of the room.",
                keywords: ["Arrogance", "Impulsiveness", "Tyranny"],
            },
        },

        // --------------------------------------------------------------- cups
        "cups-ace": {
            name: "Ace of Cups",
            up: {
                lede: "Something in you has opened.",
                text: "The Ace of Cups is the beginning of feeling: new love, a friendship deepening, a creative flood, a tenderness you did not plan. Let it overflow a little. This card does not reward keeping the lid on.",
                keywords: ["New feeling", "Love", "Openness"],
            },
            rev: {
                lede: "You have closed the tap.",
                text: "Reversed, this is emotion held back: not feeling, or not letting yourself feel. It might be self protection after something hurt. That is fair, and it also cannot be permanent. Let one small thing in.",
                keywords: ["Blocked", "Repression", "Emptiness"],
            },
        },
        "cups-two": {
            name: "Two of Cups",
            up: {
                lede: "An even exchange, freely given.",
                text: "Two people meeting each other at the same depth, at the same time. Whatever this is, whether new love, a repaired friendship or a working partnership, its strength is that neither side is performing.",
                keywords: ["Union", "Mutuality", "Trust"],
            },
            rev: {
                lede: "One of you is carrying more than half.",
                text: "Reversed, the Two of Cups shows an imbalance neither person has named out loud. The remedy is unglamorous: say what you need, plainly, and let the other person answer honestly.",
                keywords: ["Imbalance", "Withholding", "Repair"],
            },
        },
        "cups-three": {
            name: "Three of Cups",
            up: {
                lede: "Call your people.",
                text: "The Three of Cups is friendship and celebration: the dinner that runs late, the friends who knew you before. Whatever you asked about, the answer involves other people and probably a table. Do not do this one alone.",
                keywords: ["Friendship", "Celebration", "Community"],
            },
            rev: {
                lede: "The group has gone quiet, or gone sour.",
                text: "Reversed, this is either isolation from your circle or a circle that has turned. Gossip, a falling out, too many nights out and not enough real talk. Find the one friend who tells you the truth and start there.",
                keywords: ["Isolation", "Gossip", "Overindulgence"],
            },
        },
        "cups-four": {
            name: "Four of Cups",
            up: {
                lede: "You are being offered something and not seeing it.",
                text: "The Four of Cups is boredom with the options in front of you, while a better one sits just out of view. Apathy is a fog, not a fact. Look at what you have dismissed lately. One of those cups is worth picking up.",
                keywords: ["Apathy", "Missed offers", "Contemplation"],
            },
            rev: {
                lede: "The fog lifts and you want things again.",
                text: "Reversed, this is coming out of a flat stretch. Interest returns, a chance you had ignored looks different, and you are ready to say yes to something. Trust the appetite. It has been away a while.",
                keywords: ["Renewed interest", "Readiness", "Clarity"],
            },
        },
        "cups-five": {
            name: "Five of Cups",
            up: {
                lede: "Three spilled, two still standing.",
                text: "The Five of Cups is grief for what was lost, and it is real. But the card also shows what remains, unnoticed, behind you. Mourn properly. Then turn around. The loss is true and it is not the whole picture.",
                keywords: ["Loss", "Grief", "What remains"],
            },
            rev: {
                lede: "You are ready to turn around.",
                text: "Reversed, the Five of Cups is the first day the loss is not the first thought. Acceptance, forgiveness, or simply tiredness with being sad. Whichever it is, it counts. Take it as a sign you can move.",
                keywords: ["Acceptance", "Moving on", "Forgiveness"],
            },
        },
        "cups-six": {
            name: "Six of Cups",
            up: {
                lede: "Something from the past comes back kindly.",
                text: "The Six of Cups is nostalgia at its most useful: an old friend, a childhood place, a memory that turns out to hold an answer. Let yourself be sentimental. What you were before all this may know something you have forgotten.",
                keywords: ["Nostalgia", "Innocence", "Reunion"],
            },
            rev: {
                lede: "You are living in a photograph.",
                text: "Reversed, this is the past used as a hiding place. Idealising what was, or refusing to grow past it. The old days were good and they are over. Bring one thing forward from them and leave the rest where it belongs.",
                keywords: ["Stuck in the past", "Naivety", "Growing up"],
            },
        },
        "cups-seven": {
            name: "Seven of Cups",
            up: {
                lede: "Too many options, and most of them are mist.",
                text: "The Seven of Cups is the daydream with a dozen doors. Some are real, most are wishful, and staring at all of them means walking through none. Pick the one you could start on tomorrow morning. That is the real one.",
                keywords: ["Choices", "Illusion", "Wishful thinking"],
            },
            rev: {
                lede: "The choice becomes obvious.",
                text: "Reversed, the fog clears and the options collapse to one or two. Either you have decided, or the situation has decided for you. Either way, welcome the narrowing. Focus is the gift here.",
                keywords: ["Clarity", "Decision", "Focus"],
            },
        },
        "cups-eight": {
            name: "Eight of Cups",
            up: {
                lede: "Walk away from something that still works.",
                text: "The Eight of Cups is the hard leaving: not from disaster, but from something that is fine and no longer enough. You will not be able to explain it to everyone. You do not have to. Go, and go quietly.",
                keywords: ["Departure", "Searching", "Letting go"],
            },
            rev: {
                lede: "Staying out of fear, or leaving out of fear.",
                text: "Reversed, this is avoidance in one of two costumes: refusing to leave what is finished, or bolting from what merely got difficult. Ask honestly which. Then do the braver of the two, whichever that is for you.",
                keywords: ["Fear of change", "Aimless", "Avoidance"],
            },
        },
        "cups-nine": {
            name: "Nine of Cups",
            up: {
                lede: "The wish is granted. Say thank you.",
                text: "The Nine of Cups is the wish card, and it means it. Contentment, satisfaction, a good outcome for the thing you asked about. Enjoy it plainly. There is no lesson attached. Some weeks are just good.",
                keywords: ["Satisfaction", "Wish fulfilled", "Pleasure"],
            },
            rev: {
                lede: "You got it and it did not fix the thing.",
                text: "Reversed, this is the wish that arrived and left you flat. The problem was never the missing thing. Check what you actually wanted underneath it, because that is still waiting to be asked for.",
                keywords: ["Dissatisfaction", "Greed", "Hollow win"],
            },
        },
        "cups-ten": {
            name: "Ten of Cups",
            up: {
                lede: "This is what it was all for.",
                text: "The Ten of Cups is home in the fullest sense: love that has lasted, a family that works, a peace that does not need explaining. If you have it, notice it. If you are building toward it, this says you are building right.",
                keywords: ["Harmony", "Family", "Lasting love"],
            },
            rev: {
                lede: "The picture looks right from outside.",
                text: "Reversed, this is the happy family that is not, or the fear that yours is not. Something is unspoken at home. It will not fix itself with a nicer dinner. One honest conversation is worth more than a year of pretending.",
                keywords: ["Disconnection", "Broken home", "Pretence"],
            },
        },
        "cups-page": {
            name: "Page of Cups",
            up: {
                lede: "A small, tender surprise.",
                text: "The Page of Cups is the unexpected feeling: a message that touches you, a creative impulse out of nowhere, someone being sweet when you did not expect it. Be open to it. Cynicism is not protection, it is just less.",
                keywords: ["Sensitivity", "Surprise", "Creativity"],
            },
            rev: {
                lede: "The feeling is real and the delivery is a mess.",
                text: "Reversed, the Page is emotional immaturity: moods, sulks, or using feelings as a lever. If it is someone else, do not take the bait. If it is you, say the plain version of what you feel and skip the performance.",
                keywords: ["Immaturity", "Moodiness", "Blocked creativity"],
            },
        },
        "cups-knight": {
            name: "Knight of Cups",
            up: {
                lede: "An offer made with the heart.",
                text: "The Knight of Cups is romance in motion: the invitation, the grand gesture, the person who means it. Or it is you being that person. Accept the offer, or make it. This card favours the open hand over the careful one.",
                keywords: ["Romance", "Invitation", "Idealism"],
            },
            rev: {
                lede: "All charm, no follow through.",
                text: "Reversed, the Knight promises the moon and delivers a text at midnight. Beware of someone whose gestures outrun their reliability. If this is you, make one small promise this week and keep it completely.",
                keywords: ["Unreliable", "Moody", "Disappointment"],
            },
        },
        "cups-queen": {
            name: "Queen of Cups",
            up: {
                lede: "Feel it fully and stay steady anyway.",
                text: "The Queen of Cups is emotional depth with its feet on the ground: compassionate, intuitive, and not swept away. Trust your read on the people involved. Lead with care, and do not mistake softness for weakness.",
                keywords: ["Compassion", "Intuition", "Emotional depth"],
            },
            rev: {
                lede: "The feelings are running the room.",
                text: "Reversed, the Queen is overwhelmed: too porous, too invested, taking on everyone else's weather. Or she has shut down entirely to cope. Either way, put a boundary back. Care for others starts with a door that closes.",
                keywords: ["Overwhelm", "Codependence", "Shut down"],
            },
        },
        "cups-king": {
            name: "King of Cups",
            up: {
                lede: "Calm in the storm, and it is yours.",
                text: "The King of Cups is emotional maturity: feeling everything and still choosing the wise response. Be the steady one this week. Someone needs a person who does not react, and you are more capable of that than you think.",
                keywords: ["Balance", "Wisdom", "Diplomacy"],
            },
            rev: {
                lede: "The calm is a mask, and it is cracking.",
                text: "Reversed, the King is control instead of composure. Feelings pushed down until they leak out sideways as coldness, manipulation, or a sudden flood. Let something out on purpose before it comes out on its own.",
                keywords: ["Repression", "Manipulation", "Volatility"],
            },
        },

        // ------------------------------------------------------------- swords
        "swords-ace": {
            name: "Ace of Swords",
            up: {
                lede: "Suddenly, it is obvious.",
                text: "The Ace of Swords is the moment of clarity: the truth cutting through, the idea that ends the argument. Say it plainly. This card rewards the clean sentence over the diplomatic paragraph.",
                keywords: ["Clarity", "Truth", "Breakthrough"],
            },
            rev: {
                lede: "Everyone has a point, and none of them add up.",
                text: "Reversed, this is confusion where there should be clarity, or a truth used as a weapon. If you cannot think straight, stop deciding. If someone is being brutal and calling it honesty, you are allowed to leave the room.",
                keywords: ["Confusion", "Cruelty", "Muddled thinking"],
            },
        },
        "swords-two": {
            name: "Two of Swords",
            up: {
                lede: "You are refusing to decide, and that is a decision.",
                text: "The Two of Swords is the stalemate: two options held at arm's length, eyes closed to both. The information you are waiting for is not coming. Open your eyes, choose the one you can live with, and let the other go.",
                keywords: ["Stalemate", "Avoidance", "Difficult choice"],
            },
            rev: {
                lede: "The blindfold comes off.",
                text: "Reversed, the deadlock breaks, sometimes uncomfortably. Information arrives, or your patience runs out. Either way you can see now, and seeing means moving. Do not put the blindfold back on because the view is hard.",
                keywords: ["Release", "Overload", "Truth revealed"],
            },
        },
        "swords-three": {
            name: "Three of Swords",
            up: {
                lede: "It hurts, and it is supposed to.",
                text: "The Three of Swords is heartbreak, said plainly. A loss, a betrayal, a truth that lands like a blow. Do not rush past it or talk yourself out of it. Pain this clean is at least honest. Let it be felt, and it will pass.",
                keywords: ["Heartbreak", "Grief", "Painful truth"],
            },
            rev: {
                lede: "The wound is closing.",
                text: "Reversed, this is either recovery or refusal to feel, and you will know which. If the ache is easing, good, let it. If you have been busy so that you never have to sit with it, it is waiting, and it is patient.",
                keywords: ["Healing", "Suppression", "Forgiveness"],
            },
        },
        "swords-four": {
            name: "Four of Swords",
            up: {
                lede: "Rest. Properly, not guiltily.",
                text: "The Four of Swords is recovery: the pause after the effort, the retreat that makes the next move possible. Whatever you asked about, the answer is not yet. Sleep, step back, and do not apologise for it.",
                keywords: ["Rest", "Recovery", "Retreat"],
            },
            rev: {
                lede: "You have rested long enough. Or not at all.",
                text: "Reversed, this is either restlessness after a pause that has done its work, or burnout from refusing to pause. If you are itching to move, move. If you are running on fumes, this is not a suggestion.",
                keywords: ["Restlessness", "Burnout", "Re-entry"],
            },
        },
        "swords-five": {
            name: "Five of Swords",
            up: {
                lede: "You can win this and lose everyone.",
                text: "The Five of Swords is the hollow victory: being right at the cost of the relationship, or the argument that leaves the winner alone on the field. Ask what you actually want. If it is peace, you may have to stop being correct.",
                keywords: ["Conflict", "Hollow victory", "Cost"],
            },
            rev: {
                lede: "Time to put the sword down.",
                text: "Reversed, this is the end of a fight, or the wish for one. Reconciliation, or at least the decision to stop. Someone has to go first, and the card suggests it could be you. Losing the argument is not losing.",
                keywords: ["Reconciliation", "Release", "Making amends"],
            },
        },
        "swords-six": {
            name: "Six of Swords",
            up: {
                lede: "You are leaving rough water. Do not look back yet.",
                text: "The Six of Swords is transition: the quiet crossing from a hard place to a calmer one. It is not triumphant. It is relief. Let someone else row for a while, and trust that the far shore is real.",
                keywords: ["Transition", "Recovery", "Moving on"],
            },
            rev: {
                lede: "You keep going back to the shore you left.",
                text: "Reversed, the crossing stalls. Baggage you should have left behind is in the boat, or you are turning around halfway. Something unresolved is pulling. Deal with it, but from the far side, not by going back.",
                keywords: ["Resistance", "Baggage", "Stuck"],
            },
        },
        "swords-seven": {
            name: "Seven of Swords",
            up: {
                lede: "Someone is being clever, and it might be you.",
                text: "The Seven of Swords is strategy with a hidden edge: getting what you need by going around rather than through. Sometimes that is smart. Sometimes it is just sneaking. Check whether you would be comfortable if everyone could see.",
                keywords: ["Strategy", "Deception", "Getting away with it"],
            },
            rev: {
                lede: "The secret is about to be seen.",
                text: "Reversed, the hidden thing surfaces. Whether yours or someone else's, a deception runs out of road. If it is yours, own it before it is found. The confession costs less than the discovery.",
                keywords: ["Exposure", "Confession", "Conscience"],
            },
        },
        "swords-eight": {
            name: "Eight of Swords",
            up: {
                lede: "The ropes are loose. You have not tried them.",
                text: "The Eight of Swords is the trap that is mostly belief: feeling stuck, powerless, boxed in, when the exits are open. Fear is doing the tying. Test one assumption you have not tested. It will probably give.",
                keywords: ["Restriction", "Fear", "Self imposed limits"],
            },
            rev: {
                lede: "You are working free.",
                text: "Reversed, the Eight of Swords is the first step out: a limit questioned, a story about yourself finally doubted. It is slow and it counts. Keep going. The blindfold is off; the hands come next.",
                keywords: ["Release", "New perspective", "Freedom"],
            },
        },
        "swords-nine": {
            name: "Nine of Swords",
            up: {
                lede: "Three in the morning is not a reliable narrator.",
                text: "The Nine of Swords is worry at its worst: the sleepless loop, the catastrophe rehearsed a hundred times. Most of it will not happen. Write it down, say it to a person, and notice how it shrinks in the light.",
                keywords: ["Anxiety", "Sleeplessness", "Dread"],
            },
            rev: {
                lede: "The worst night is behind you.",
                text: "Reversed, this is the morning after: perspective returning, the fear shrinking to its real size. Or, less kindly, it is worry you refuse to admit to. Either way, the way out is the same. Say it out loud to someone.",
                keywords: ["Relief", "Perspective", "Hidden worry"],
            },
        },
        "swords-ten": {
            name: "Ten of Swords",
            up: {
                lede: "It is completely over. That is the good news.",
                text: "The Ten of Swords is rock bottom, and rock bottom has one virtue: there is nowhere further to fall. Something has ended badly and fully. Stop trying to save it. The sun on the horizon in this card is rising, not setting.",
                keywords: ["Ending", "Rock bottom", "Finality"],
            },
            rev: {
                lede: "You are getting up.",
                text: "Reversed, the Ten of Swords is recovery from the worst of it, or the refusal to admit it is over. If you are getting back up, take it slowly. If you are still lying there hoping, the card is telling you it is done.",
                keywords: ["Recovery", "Survival", "Refusing the end"],
            },
        },
        "swords-page": {
            name: "Page of Swords",
            up: {
                lede: "Ask the question everyone else is too polite to ask.",
                text: "The Page of Swords is curiosity with an edge: watchful, quick, unafraid of the awkward question. Something needs looking into. Be the one who looks. Keep your tone light and your notes thorough.",
                keywords: ["Curiosity", "Vigilance", "Directness"],
            },
            rev: {
                lede: "All talk, and some of it is not kind.",
                text: "Reversed, the Page is gossip, hasty words, or an argument started for the sport of it. If someone is stirring, do not pick it up. If you are the one stirring, ask what you are avoiding by keeping things loud.",
                keywords: ["Gossip", "Haste", "Defensiveness"],
            },
        },
        "swords-knight": {
            name: "Knight of Swords",
            up: {
                lede: "Charge. Think on the way.",
                text: "The Knight of Swords is speed and certainty: the decision made, the message sent, the idea pursued at full tilt. It suits a moment that has waited long enough. Be direct and be quick, and accept you will not be gentle.",
                keywords: ["Action", "Speed", "Conviction"],
            },
            rev: {
                lede: "Fast, loud, and pointed at the wrong thing.",
                text: "Reversed, the Knight is aggression without aim, or a rush that leaves damage behind it. Words said too fast, decisions made to feel decisive. Slow down enough to check where the sword is pointing.",
                keywords: ["Recklessness", "Aggression", "Poor aim"],
            },
        },
        "swords-queen": {
            name: "Queen of Swords",
            up: {
                lede: "Say it clearly. You do not need to soften it.",
                text: "The Queen of Swords is honesty with grace: seeing clearly, speaking directly, and refusing to be manipulated by sentiment. Be her this week. Set the boundary, state the fact, and let people be adults about it.",
                keywords: ["Clarity", "Honesty", "Independence"],
            },
            rev: {
                lede: "Sharp has turned to cold.",
                text: "Reversed, the Queen is bitterness dressed as realism, or a boundary that has become a wall. Someone is being cutting and calling it honesty. If it is you, remember that clarity and cruelty are different tools.",
                keywords: ["Bitterness", "Coldness", "Harshness"],
            },
        },
        "swords-king": {
            name: "King of Swords",
            up: {
                lede: "Decide on the facts, and then decide.",
                text: "The King of Swords is authority through reason: fair, clear, unswayed by flattery or pressure. This favours the logical route, the expert opinion, the contract read in full. Think it through, then rule.",
                keywords: ["Authority", "Logic", "Judgement"],
            },
            rev: {
                lede: "Being right has become an excuse to be harsh.",
                text: "Reversed, the King rules by intellect alone and calls it fairness. Cold decisions, manipulation, the letter of the law over its spirit. Add a human back into the equation before you rule.",
                keywords: ["Tyranny", "Manipulation", "Coldness"],
            },
        },

        // ---------------------------------------------------------- pentacles
        "pentacles-ace": {
            name: "Ace of Pentacles",
            up: {
                lede: "A real opportunity, with money in it.",
                text: "The Ace of Pentacles is the seed of something material: a job, an offer, a place to live, a plan that could pay. It is a beginning, so it needs tending. Take it seriously and take it slowly, and it grows.",
                keywords: ["Opportunity", "Prosperity", "New venture"],
            },
            rev: {
                lede: "The offer is not what it looks like.",
                text: "Reversed, this is the deal that slips, the opportunity with a hole in it, or money worries crowding out judgement. Read the terms twice. If it feels too easy, it probably is. Wait for the next seed.",
                keywords: ["Missed chance", "Poor planning", "Scarcity"],
            },
        },
        "pentacles-two": {
            name: "Two of Pentacles",
            up: {
                lede: "You are keeping it all in the air, for now.",
                text: "The Two of Pentacles is the juggle: two jobs, two priorities, money coming in and going out on the same day. You are managing, and it is impressive. Just know that it is a phase, not a system. Plan the landing.",
                keywords: ["Balance", "Juggling", "Adaptability"],
            },
            rev: {
                lede: "Something is about to drop.",
                text: "Reversed, the juggle fails. Overcommitment, missed payments, a schedule that finally breaks. Choose what to let fall before it chooses for you. Two things done well beat four things half done.",
                keywords: ["Overwhelm", "Disorganisation", "Imbalance"],
            },
        },
        "pentacles-three": {
            name: "Three of Pentacles",
            up: {
                lede: "Do it with people who know what they are doing.",
                text: "The Three of Pentacles is skilled collaboration: the work that is better because more than one expert touched it. Ask for help from someone good. Show your work. This card rewards craft and rewards teams.",
                keywords: ["Teamwork", "Craft", "Recognition"],
            },
            rev: {
                lede: "Nobody is pulling in the same direction.",
                text: "Reversed, the team is not working: sloppy effort, missing skills, or people who will not listen to each other. Say what the standard is. If it is your work slipping, find out why before anyone else has to point it out.",
                keywords: ["Poor teamwork", "Low quality", "Disharmony"],
            },
        },
        "pentacles-four": {
            name: "Four of Pentacles",
            up: {
                lede: "Hold on to what you have. Just not so tightly.",
                text: "The Four of Pentacles is security, kept: saving, guarding, keeping the boundaries firm. That is sensible, up to a point. The point is where it stops being safety and starts being fear. Keep the savings. Loosen the grip.",
                keywords: ["Security", "Control", "Saving"],
            },
            rev: {
                lede: "The grip loosens, by choice or by force.",
                text: "Reversed, this is either generosity returning or money slipping away. If you are spending more freely, make sure it is on purpose. If you are losing it, look at what you have been clinging to and whether it was ever worth the hold.",
                keywords: ["Generosity", "Loss", "Letting go"],
            },
        },
        "pentacles-five": {
            name: "Five of Pentacles",
            up: {
                lede: "It is cold out here, and there is a door behind you.",
                text: "The Five of Pentacles is hardship: money short, health poor, feeling left outside. What the card also shows is help nearby that you have not asked for. Pride is expensive. Knock on the door.",
                keywords: ["Hardship", "Lack", "Isolation"],
            },
            rev: {
                lede: "The worst of the lean stretch is ending.",
                text: "Reversed, this is recovery from scarcity: money returning, health improving, someone finally letting help in. It is slow. It is real. Do not spend the first good month as if the bad ones never happened.",
                keywords: ["Recovery", "Help arriving", "Renewed hope"],
            },
        },
        "pentacles-six": {
            name: "Six of Pentacles",
            up: {
                lede: "Give, or receive, and keep it fair.",
                text: "The Six of Pentacles is generosity with balance: a gift, a loan, a favour, a raise. Someone is giving and someone is receiving, and the card asks that the exchange be honest. Do not keep score, and do not pretend not to.",
                keywords: ["Generosity", "Exchange", "Fairness"],
            },
            rev: {
                lede: "The gift comes with strings.",
                text: "Reversed, this is charity with a hook in it: help that creates a debt, or a generosity that keeps someone small. Check the terms of what you are giving or taking. Real help does not need to be remembered.",
                keywords: ["Strings attached", "Debt", "Inequality"],
            },
        },
        "pentacles-seven": {
            name: "Seven of Pentacles",
            up: {
                lede: "It is growing; you just cannot see it yet.",
                text: "The work you have put in is not visible from where you are standing. This card asks for the patience of a grower, not the anxiety of a gambler. Check again in a season.",
                keywords: ["Patience", "Investment", "Slow growth"],
            },
            rev: {
                lede: "You are watering something that will not fruit.",
                text: "Reversed, this is the sunk cost card. Effort is not the same as progress. Look honestly at what you have actually harvested, and be willing to plant elsewhere.",
                keywords: ["Sunk cost", "Reassess", "Let go"],
            },
        },
        "pentacles-eight": {
            name: "Eight of Pentacles",
            up: {
                lede: "Do the thing again, a little better.",
                text: "The Eight of Pentacles is craft: the unglamorous repetition that turns competence into mastery. No shortcuts this week. Put the hours in, care about the detail, and let the quality speak later.",
                keywords: ["Craft", "Diligence", "Mastery"],
            },
            rev: {
                lede: "Going through the motions.",
                text: "Reversed, the work has become mechanical, or careless, or you are grinding at something you no longer believe in. Perfectionism can look like this too. Ask whether the effort still has a point. If not, redirect it.",
                keywords: ["Carelessness", "Burnout", "Pointless effort"],
            },
        },
        "pentacles-nine": {
            name: "Nine of Pentacles",
            up: {
                lede: "You built this, and you get to enjoy it alone.",
                text: "The Nine of Pentacles is earned independence: comfort, security and taste, all your own doing. Enjoy it without apology. You do not need a partner or a permission slip to be this content. Buy the good wine.",
                keywords: ["Independence", "Luxury", "Self sufficiency"],
            },
            rev: {
                lede: "The independence has cost more than it gave.",
                text: "Reversed, this is comfort without company, or spending to feel worth something. The garden is lovely and empty. Let someone in, or spend less on things and more on afternoons. Security is not the same as a life.",
                keywords: ["Loneliness", "Overspending", "Hollow success"],
            },
        },
        "pentacles-ten": {
            name: "Ten of Pentacles",
            up: {
                lede: "Think in generations, not weekends.",
                text: "The Ten of Pentacles is legacy: wealth that lasts, family that holds, a foundation others will stand on. Decide with the long view. What you set up now outlives the moment, so set it up properly.",
                keywords: ["Legacy", "Wealth", "Family"],
            },
            rev: {
                lede: "The family fortune is a family argument.",
                text: "Reversed, this is inheritance trouble, money straining a family, or a tradition that has become a burden. The stability everyone assumed is being tested. Talk about it plainly, before the lawyers have to.",
                keywords: ["Family conflict", "Instability", "Loss"],
            },
        },
        "pentacles-page": {
            name: "Page of Pentacles",
            up: {
                lede: "Learn it properly. There is time.",
                text: "The Page of Pentacles is the student: a new skill, a course, a first job, an ambition still being figured out. Be a beginner without embarrassment. Diligence beats talent here, and you have the diligence.",
                keywords: ["Study", "Ambition", "New skill"],
            },
            rev: {
                lede: "Distracted, and calling it research.",
                text: "Reversed, the Page has lost focus: procrastination, a plan with no first step, learning as a way of never starting. Pick one practical task and finish it today. Momentum is built, not found.",
                keywords: ["Procrastination", "Lack of focus", "Unrealistic"],
            },
        },
        "pentacles-knight": {
            name: "Knight of Pentacles",
            up: {
                lede: "Slow, steady, and impossible to stop.",
                text: "The Knight of Pentacles is the reliable one: methodical, unglamorous, and always there when the deadline comes. Be him this week. Not fast, not clever. Present, every day, until it is done.",
                keywords: ["Reliability", "Routine", "Hard work"],
            },
            rev: {
                lede: "Stuck in a rut and calling it discipline.",
                text: "Reversed, the Knight is routine that has become inertia: boredom, stubbornness, doing it the same way because that is how it is done. Change one variable. The reliability can stay; the rut cannot.",
                keywords: ["Boredom", "Stubbornness", "Stagnation"],
            },
        },
        "pentacles-queen": {
            name: "Queen of Pentacles",
            up: {
                lede: "Make it comfortable, and make it work.",
                text: "The Queen of Pentacles is practical care: the home that runs, the money that is managed, the person who feeds everyone and still balances the books. Whatever you asked about, the answer is grounded. Look after the basics well.",
                keywords: ["Nurture", "Practicality", "Security"],
            },
            rev: {
                lede: "Everyone is looked after except you.",
                text: "Reversed, the Queen has given so much that the household is running on her fumes. Or the balance has tipped the other way, into materialism and control. Put your own name on the list of people to care for.",
                keywords: ["Self neglect", "Imbalance", "Materialism"],
            },
        },
        "pentacles-king": {
            name: "King of Pentacles",
            up: {
                lede: "You have arrived. Manage it well.",
                text: "The King of Pentacles is success that has settled: wealth, stability, the authority that comes from having built something real. Act with that confidence. Invest, provide, and be generous in a way that lasts.",
                keywords: ["Success", "Stability", "Abundance"],
            },
            rev: {
                lede: "Wealth has become the whole identity.",
                text: "Reversed, the King is greed, stubbornness, or a status that has to be defended at any cost. Money is a tool and he has made it a throne. Ask what you would be without it. Then go and be some of that.",
                keywords: ["Greed", "Materialism", "Rigidity"],
            },
        },
    },

    spreads: {
        [TarotSpreads.SINGLE]: {
            label: "Single card",
            headline: "One card for today.",
            subline:
                "A single draw to sit with. Come back tomorrow for another.",
            positions: ["Your card"],
        },
        [TarotSpreads.THREE]: {
            label: "Three cards",
            headline: "Three cards, one thread.",
            subline:
                "Past, present, and what follows, read together rather than one at a time.",
            positions: ["Past", "Present", "What follows"],
        },
        [TarotSpreads.YES_NO]: {
            label: "Yes / no",
            headline: "Ask plainly, and turn one card.",
            subline:
                "The card answers the question you actually asked, not the one you hoped for.",
            positions: ["Your question"],
        },
    },

    orientation: { upright: "Upright", reversed: "Reversed" },

    verdict: {
        yes: {
            title: "Yes",
            line: "The card came upright and unambiguous. Move, and do not spend the week looking for a second opinion.",
        },
        notYet: {
            title: "Not yet",
            line: "The card came reversed. The answer is not no. It is that the conditions are not in place yet. Ask again when one of them changes.",
        },
    },

    prompt: "Hold a question in mind, then turn a card. Nothing is read until you touch it.",
    shuffle: "Shuffle a new spread",
}

export default en
