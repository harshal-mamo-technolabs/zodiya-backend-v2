/* eslint-disable no-console -- a CLI that reports what it did */
/**
 * Creates or updates the twelve astrologer agents on ElevenLabs.
 *
 *   npm run astrologer:setup              adds the voices, the client tool and the agents
 *   npm run astrologer:setup -- --voices  lists the voices in the workspace instead
 *
 * Idempotent: everything is found by name, so re-running after editing
 * src/constants/astrologers.ts updates the agents in place. Reads
 * ELEVENLABS_API_KEY from .env.<NODE_ENV> (development by default).
 */
import path from "path"
import { fileURLToPath } from "url"
import { config as dotenvConfig } from "dotenv"
import {
    ASTROLOGERS,
    ASTROLOGER_SPEED,
    ASTROLOGER_TTS,
    READING_PAGES,
    agentName,
    type Astrologer,
} from "../src/constants/astrologers.ts"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenvConfig({
    quiet: true,
    path: path.join(root, `.env.${process.env.NODE_ENV ?? "development"}`),
})

const KEY = process.env.ELEVENLABS_API_KEY
if (!KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set")
}

const TOOL_NAME = "open_reading"
const TAROT_TOOL = "tarot"
const SWITCH_TOOL = "switch_profile"

async function api<T>(method: string, url: string, body?: unknown): Promise<T> {
    const response = await fetch(`https://api.elevenlabs.io${url}`, {
        method,
        headers: {
            "xi-api-key": KEY ?? "",
            "content-type": "application/json",
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    const text = await response.text()
    if (!response.ok) {
        throw new Error(
            `${method} ${url} → ${String(response.status)}: ${text}`,
        )
    }
    return (text ? JSON.parse(text) : {}) as T
}

interface Voice {
    voice_id: string
    name: string
    category?: string
    labels?: Record<string, string>
}

async function workspaceVoices(): Promise<Voice[]> {
    const out: Voice[] = []
    let token: string | null = null
    do {
        const page: { voices: Voice[]; next_page_token: string | null } =
            await api(
                "GET",
                `/v2/voices?page_size=100${token ? `&next_page_token=${token}` : ""}`,
            )
        out.push(...page.voices)
        token = page.next_page_token
    } while (token)
    return out
}

/** The library voice, saved to the workspace under the astrologer's name. */
async function ensureVoice(a: Astrologer, voices: Voice[]): Promise<string> {
    const name = agentName(a)
    const existing = voices.find((v) => v.name === name)
    if (existing) {
        return existing.voice_id
    }
    const added = await api<{ voice_id: string }>(
        "POST",
        `/v1/voices/add/${a.voice.ownerId}/${a.voice.libraryId}`,
        { new_name: name },
    )
    console.log(`  added voice ${name} (${added.voice_id})`)
    return added.voice_id
}

const OPEN_READING = {
    type: "client",
    name: TOOL_NAME,
    description:
        "Opens one of the user's reading pages in the app. Call it when the user asks to see or open a reading, or when your answer is mainly about one page. For synastry, pass partner when the user names the person to compare with.",
    // the app answers whether it found the partner's profile
    expects_response: true,
    response_timeout_secs: 5,
    parameters: {
        type: "object",
        required: ["page"],
        properties: {
            page: {
                type: "string",
                enum: [...READING_PAGES],
                description:
                    "natal = natal chart, transits = current transits, horoscope = daily horoscope, numerology, synastry = compatibility, tarot",
            },
            partner: {
                type: "string",
                description:
                    "Synastry only: the name of the saved profile to compare the user with, as the user said it.",
            },
        },
    },
}

/* Drives the tarot page: the app answers with the cards actually drawn,
   so the agent reads those and never invents a card. */
const TAROT = {
    type: "client",
    name: TAROT_TOOL,
    description:
        "Acts on the tarot page, opening it if needed. draw lays out a fresh face-down spread; reveal turns cards over and returns their meanings. Call it whenever the user asks you to draw, shuffle, pick or turn tarot cards, or asks a yes or no question for the cards.",
    expects_response: true,
    response_timeout_secs: 8,
    parameters: {
        type: "object",
        required: ["action"],
        properties: {
            action: {
                type: "string",
                enum: ["draw", "reveal"],
                description:
                    "draw = shuffle and lay out a new spread face down; reveal = turn cards over",
            },
            spread: {
                type: "string",
                enum: ["single", "three", "yesNo"],
                description:
                    "draw only: single card, three cards (past, present, future) or yes/no. Leave out to keep the current spread.",
            },
            card: {
                type: "string",
                description:
                    'reveal only: which card to turn, "1", "2", "3" from the left, or "all". Leave out to turn the next face-down card.',
            },
        },
    },
}

/* Changes whose readings the whole app shows, like the profile menu does. */
const SWITCH_PROFILE = {
    type: "client",
    name: SWITCH_TOOL,
    description:
        "Switches the app to another of the user's saved profiles, so every page shows that person's readings. Call it when the user asks to switch, change or show another person's profile or chart, or to go back to their own.",
    expects_response: true,
    response_timeout_secs: 5,
    parameters: {
        type: "object",
        required: ["name"],
        properties: {
            name: {
                type: "string",
                description:
                    "The saved profile's name as the user said it. For their own profile, use their own name.",
            },
        },
    },
}

async function ensureTool(config: { name: string }): Promise<string> {
    const { tools } = await api<{
        tools: { id: string; tool_config: { name: string } }[]
    }>("GET", "/v1/convai/tools")
    const found = tools.find((t) => t.tool_config.name === config.name)
    if (found) {
        await api("PATCH", `/v1/convai/tools/${found.id}`, {
            tool_config: config,
        })
        return found.id
    }
    const created = await api<{ id: string }>("POST", "/v1/convai/tools", {
        tool_config: config,
    })
    console.log(`  created client tool ${config.name}`)
    return created.id
}

function prompt(a: Astrologer): string {
    return `You are ${a.name}, a ${a.role.toLowerCase()} and the voice astrologer inside the Zodiya app. ${a.personality}

You are talking with {{user_name}}, who is on the "{{page}}" page of the app. Below is everything you know about them: their natal chart and today's readings. Base every answer on it and never invent placements that are not listed.

{{chart_context}}

Rules:
- Only discuss readings in the app for this user and the profiles they have saved: natal chart, planets, houses, aspects, transits, daily horoscope, numerology, synastry and tarot. If they ask about anything else (news, general knowledge, lottery or gambling predictions, medical, legal or financial advice, other people's private details), decline kindly in one sentence and offer to explain one of their placements instead.
- Your words are spoken aloud. Answer in two to four short sentences, about seventy words at most. No markdown, lists, emoji or symbols: say "degrees", not the degree sign.
- If the user is silent, stay silent. Never ask whether they are still there or want to keep talking, and never end an answer with a question unless you truly need something from them.
- Speak warmly and without hurry. Use their first name now and then, not in every answer.
- Astrology is reflective guidance, not certainty. Never predict death, illness or disaster, and never tell them to ignore a doctor, lawyer or advisor.
- When they ask to see or open a reading, or your answer is mainly about one page, call ${TOOL_NAME} with that page.
- For compatibility with a named person, call ${TOOL_NAME} with page synastry and partner set to that name; the app opens the comparison on screen. If the app replies that no saved profile matches, say so in one sentence, name the saved profiles they can choose from, and suggest they add the person themselves from Birth Details in the menu.
- You can only pick from profiles already saved. You can never create, add, edit or delete a profile, even if asked: do not collect anyone's birth date, time or place. Explain kindly that they add or change profiles themselves from Birth Details in the menu, and once it is saved you can switch to it or compare with it.
- To switch whose readings the app shows, call ${SWITCH_TOOL} with the name. Confirm in one short sentence, calling them by the new profile's first name; the new chart reaches you a moment later. Whoever's profile is active is the person you are talking with, so address them by that name and speak of that chart as theirs.
- For tarot, use ${TAROT_TOOL}: draw to lay out a spread (yesNo for a yes or no question, single for one card, three for past, present and future), then reveal to turn cards when they ask. Read only the cards the app returns, in your own words, briefly. Do not reveal cards they have not asked to turn, and never make up a card.`
}

function agentBody(a: Astrologer, voiceId: string, toolIds: string[]) {
    return {
        name: agentName(a),
        tags: ["zodiya", "astrologer"],
        conversation_config: {
            agent: {
                // empty unless the app asks for the introduction, so the agent
                // listens first when a session opens on a question
                first_message: "{{greeting}}",
                language: "en",
                dynamic_variables: {
                    dynamic_variable_placeholders: {
                        user_name: "friend",
                        page: "dashboard",
                        greeting: "",
                        chart_context: "No chart is available.",
                    },
                },
                prompt: {
                    prompt: prompt(a),
                    llm: "claude-haiku-4-5",
                    temperature: 0.6,
                    tool_ids: toolIds,
                },
            },
            tts: {
                ...ASTROLOGER_TTS,
                voice_id: voiceId,
                speed: ASTROLOGER_SPEED,
            },
            // ignore voices that aren't the user's: a TV, people nearby, or
            // the astrologer's own voice leaking back from the speakers
            vad: { background_voice_detection: true },
            turn: {
                turn_eagerness: "patient",
                // never fill a silence with "are you still there?"
                turn_timeout: -1,
                // a conversation left on ends itself after two quiet minutes
                silence_end_call_timeout: 120,
            },
            conversation: {
                client_events: [
                    "conversation_initiation_metadata",
                    "audio",
                    "interruption",
                    "user_transcript",
                    "tentative_user_transcript",
                    "agent_response",
                    "agent_response_correction",
                    "agent_chat_response_part",
                    "client_tool_call",
                ],
            },
        },
        platform_settings: {
            // private: the browser needs a token from our backend
            auth: { enable_auth: true },
            overrides: {
                conversation_config_override: {
                    tts: { speed: true },
                    conversation: { text_only: true },
                },
            },
        },
    }
}

if (process.argv.includes("--voices")) {
    for (const v of await workspaceVoices()) {
        const l = v.labels ?? {}
        console.log(
            [v.voice_id, v.name, v.category, l.gender, l.age, l.accent]
                .filter(Boolean)
                .join("  "),
        )
    }
} else {
    const voices = await workspaceVoices()
    const toolIds = [
        await ensureTool(OPEN_READING),
        await ensureTool(TAROT),
        await ensureTool(SWITCH_PROFILE),
    ]
    const { agents } = await api<{
        agents: { agent_id: string; name: string }[]
    }>("GET", "/v1/convai/agents?search=Zodiya&page_size=100")

    for (const a of ASTROLOGERS) {
        const voiceId = await ensureVoice(a, voices)
        const body = agentBody(a, voiceId, toolIds)
        const found = agents.find((x) => x.name === body.name)
        if (found) {
            await api("PATCH", `/v1/convai/agents/${found.agent_id}`, body)
            console.log(`updated ${body.name} (${found.agent_id})`)
        } else {
            const created = await api<{ agent_id: string }>(
                "POST",
                "/v1/convai/agents/create",
                body,
            )
            console.log(`created ${body.name} (${created.agent_id})`)
        }
    }
}
