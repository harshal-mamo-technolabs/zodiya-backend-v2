import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import {
    ASTROLOGER_SPEED,
    ASTROLOGER_TTS,
    agentName,
    type Astrologer,
} from "../constants/astrologers.ts"

export const ELEVENLABS_API = "https://api.elevenlabs.io"

export interface AstrologerAgent {
    agentId: string
    voiceId: string
}

export interface SpokenWord {
    word: string
    /** Seconds from the start of the clip. */
    start: number
    end: number
}

export interface VoicePreview {
    /** mp3, base64 */
    audio: string
    words: SpokenWord[]
}

interface AgentsPage {
    agents: { agent_id: string; name: string }[]
}

interface AgentDetail {
    conversation_config?: { tts?: { voice_id?: string } }
}

interface Alignment {
    characters: string[]
    character_start_times_seconds: number[]
    character_end_times_seconds: number[]
}

/** The only place that talks to ElevenLabs; the API key never leaves the server. */
export class ElevenLabsService {
    // agents and previews only change when the setup script runs again
    private agents = new Map<string, AstrologerAgent>()
    private previews = new Map<string, VoicePreview>()

    async agentFor(astrologer: Astrologer): Promise<AstrologerAgent> {
        const cached = this.agents.get(astrologer.id)
        if (cached) {
            return cached
        }

        const name = agentName(astrologer)
        const page = await this.request<AgentsPage>(
            `/v1/convai/agents?search=${encodeURIComponent(name)}&page_size=30`,
        )
        const found = page.agents.find((a) => a.name === name)
        if (!found) {
            throw createHttpError(
                503,
                `${astrologer.name} is not set up yet. Run npm run astrologer:setup.`,
            )
        }

        const detail = await this.request<AgentDetail>(
            `/v1/convai/agents/${found.agent_id}`,
        )
        const agent = {
            agentId: found.agent_id,
            voiceId:
                detail.conversation_config?.tts?.voice_id ??
                astrologer.voice.libraryId,
        }
        this.agents.set(astrologer.id, agent)
        return agent
    }

    /** A signed WebSocket URL for one conversation with a private agent; it must be opened within 15 minutes. */
    async signedUrl(agentId: string): Promise<string> {
        const { signed_url } = await this.request<{ signed_url: string }>(
            `/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
        )
        return signed_url
    }

    /** The astrologer's sample line in their own voice, with word timings for captions. */
    async preview(astrologer: Astrologer): Promise<VoicePreview> {
        const cached = this.previews.get(astrologer.id)
        if (cached) {
            return cached
        }

        const { voiceId } = await this.agentFor(astrologer)
        const data = await this.request<{
            audio_base64: string
            alignment: Alignment | null
        }>(`/v1/text-to-speech/${voiceId}/with-timestamps`, {
            method: "POST",
            body: JSON.stringify({
                text: astrologer.sample,
                model_id: ASTROLOGER_TTS.model_id,
                voice_settings: {
                    speed: ASTROLOGER_SPEED,
                    stability: ASTROLOGER_TTS.stability,
                    similarity_boost: ASTROLOGER_TTS.similarity_boost,
                },
            }),
        })

        const preview = {
            audio: data.audio_base64,
            words: data.alignment ? toWords(data.alignment) : [],
        }
        this.previews.set(astrologer.id, preview)
        return preview
    }

    private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const response = await fetch(`${ELEVENLABS_API}${path}`, {
            ...init,
            headers: {
                "xi-api-key": config.ELEVENLABS_API_KEY,
                "content-type": "application/json",
            },
        })

        if (!response.ok) {
            throw createHttpError(
                502,
                `ElevenLabs request failed (${String(response.status)})`,
            )
        }

        return (await response.json()) as T
    }
}

/** Character timings folded into words, so captions can advance word by word. */
export function toWords(alignment: Alignment): SpokenWord[] {
    const words: SpokenWord[] = []
    let current: SpokenWord | null = null
    alignment.characters.forEach((char, i) => {
        if (/\s/.test(char)) {
            current = null
            return
        }
        const start = alignment.character_start_times_seconds[i] ?? 0
        const end = alignment.character_end_times_seconds[i] ?? start
        if (current) {
            current.word += char
            current.end = end
        } else {
            current = { word: char, start, end }
            words.push(current)
        }
    })
    return words
}
