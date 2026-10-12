import OpenAI from "openai"
import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import type { Language } from "../constants/index.ts"
export type HandSide = "left" | "right"

type Confidence = "high" | "medium" | "low" | "not_visible"
export const LINE_KEYS = ["heart", "head", "life", "fate"] as const
export const MOUNTS = [
    "Venus",
    "Jupiter",
    "Saturn",
    "Apollo",
    "Mercury",
    "Luna",
] as const

/** What the model saw before reading anything; the server judges it, not the model. */
export interface PhotoCheck {
    subject:
        | "open_palm"
        | "back_of_hand"
        | "closed_hand"
        | "multiple_hands"
        | "not_a_hand"
    lighting: "good" | "too_dark" | "too_bright" | "uneven_or_glare"
    focus: "sharp" | "slightly_blurry" | "blurry"
    palmInFrame: "full" | "partial" | "none"
}

/** CONTRACT section 3. */
export interface PalmReport {
    photo: PhotoCheck
    ok: boolean
    reason: string
    title: string
    summary: string
    hand: {
        type: string
        element: "Earth" | "Air" | "Fire" | "Water" | "Unknown"
        observation: string
        interpretation: string
        confidence: Confidence
    }
    lines: {
        key: (typeof LINE_KEYS)[number]
        name: string
        visibility: "clear" | "partial" | "faint" | "not_visible"
        observation: string
        quality: string
        strength: number
        confidence: Confidence
        interpretation: string
    }[]
    mounts: {
        name: (typeof MOUNTS)[number]
        prominence: "low" | "even" | "high" | "not_visible"
        observation: string
        interpretation: string
        confidence: Confidence
    }[]
    mountsText: string
    overall: {
        personality: string
        relationships: string
        career: string
        lifeThemes: string
    }
    advice: string
}

const str = { type: "string" }
const CONFIDENCE = {
    type: "string",
    enum: ["high", "medium", "low", "not_visible"],
}

/** Strict mode: every property required, nothing extra allowed. */
function object(properties: Record<string, unknown>) {
    return {
        type: "object",
        properties,
        required: Object.keys(properties),
        additionalProperties: false,
    }
}

export const PALM_REPORT_SCHEMA = object({
    // first, so the model judges the photo before it writes a word of reading
    photo: object({
        subject: {
            type: "string",
            enum: [
                "open_palm",
                "back_of_hand",
                "closed_hand",
                "multiple_hands",
                "not_a_hand",
            ],
        },
        lighting: {
            type: "string",
            enum: ["good", "too_dark", "too_bright", "uneven_or_glare"],
        },
        focus: { type: "string", enum: ["sharp", "slightly_blurry", "blurry"] },
        palmInFrame: { type: "string", enum: ["full", "partial", "none"] },
    }),
    ok: { type: "boolean" },
    reason: str,
    title: str,
    summary: str,
    hand: object({
        type: str,
        element: {
            type: "string",
            enum: ["Earth", "Air", "Fire", "Water", "Unknown"],
        },
        observation: str,
        interpretation: str,
        confidence: CONFIDENCE,
    }),
    lines: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: object({
            key: { type: "string", enum: LINE_KEYS },
            name: str,
            visibility: {
                type: "string",
                enum: ["clear", "partial", "faint", "not_visible"],
            },
            observation: str,
            quality: str,
            strength: { type: "integer", minimum: 0, maximum: 100 },
            confidence: CONFIDENCE,
            interpretation: str,
        }),
    },
    mounts: {
        type: "array",
        minItems: 6,
        maxItems: 6,
        items: object({
            name: { type: "string", enum: MOUNTS },
            prominence: {
                type: "string",
                enum: ["low", "even", "high", "not_visible"],
            },
            observation: str,
            interpretation: str,
            confidence: CONFIDENCE,
        }),
    },
    mountsText: str,
    overall: object({
        personality: str,
        relationships: str,
        career: str,
        lifeThemes: str,
    }),
    advice: str,
})

const INSTRUCTIONS = `You are a warm, experienced reader of traditional palmistry (chiromancy). You look at one photo of a palm and write a reading addressed directly to the person ("you").

Check the photo first and fill "photo" honestly, before anything else:
- subject: open_palm only when the main subject is one real human hand with the inside of the palm facing the camera and the fingers open. back_of_hand when the back of the hand faces the camera. closed_hand for a fist or curled fingers hiding the palm. multiple_hands when more than one hand is in view. not_a_hand for anything else: no hand, a face, body or other object as the subject, an animal, a drawing, a printout or a screen showing a hand.
- lighting: good when the palm is evenly lit and its creases are visible; too_dark, too_bright (washed out, overexposed) or uneven_or_glare (strong shadows, flash glare or bright spots over the palm).
- focus: sharp, slightly_blurry (creases still readable) or blurry (creases cannot be followed).
- palmInFrame: full when the whole palm from the wrist to the base of the fingers is in the photo; partial when part of the palm is cut off by the frame or covered; none when no palm is visible.

How to read:
- Separate what you physically see from what tradition says about it. "observation" fields describe only what is visible in the photo: palm shape, finger proportions, length, depth, curve, breaks, forks, islands, chains, branches, mount fullness. "interpretation" fields give the traditional palmistry meaning of that observation.
- Be honest about the photo. Set "confidence" per item: high when it is clearly visible, medium or low when it is partly visible, not_visible when you cannot see it. If a line or mount cannot be seen, say so: visibility/prominence "not_visible", strength 0, and an observation that says it is not visible. Never invent a feature.
- lines: exactly four, in this order: heart, head, life, fate. strength is 0-100 for how pronounced the line is (0 = not visible). quality is 3-5 words.
- mounts: exactly six, in this order: Venus, Jupiter, Saturn, Apollo, Mercury, Luna.
- hand.element follows the traditional hand types (Earth: square palm, short fingers; Air: square palm, long fingers; Fire: long palm, short fingers; Water: long palm, long fingers); use Unknown when you cannot tell.
- title: 4-7 words. summary: 2 sentences. mountsText: 2 sentences. advice: one imperative sentence. Line interpretations: 2-3 sentences.

Boundaries:
- Palmistry here is cultural interpretation and entertainment, meant for reflection. Never predict lifespan, death, illness, accidents, health conditions, pregnancy or guaranteed future events, and never give medical, legal or financial advice. Speak about tendencies, strengths and themes, not certainties. A short or broken life line is about energy and life changes, never about length of life.
- Do not comment on skin colour, age, gender, jewellery, nails or anything else about the person beyond palmistry features.

If the photo does not clearly show the inside of an open hand (no hand, back of the hand, a fist, far too dark or blurry, mostly covered), set ok to false, put in reason one short friendly sentence telling the person what to fix when they retake the photo, and fill every other field with empty strings, "not_visible"/"Unknown" values, strength 0 and the required keys and names.
Otherwise set ok to true and reason to "".`

const LANGUAGE: Record<Language, string> = {
    en: "Write every text field in English.",
    de: 'Write every text field in German, addressing the person with the informal "du". Keep every enum value (keys, visibility, confidence, prominence, element, mount names) exactly in English as in the schema.',
}

/** Whose palm it is. */
export interface PalmSubject {
    name: string
    gender: string | null
    age: number | null
}

export interface PalmReportInput {
    photo: { buffer: Buffer; mimetype: string }
    hand: HandSide
    dominant: boolean
    lang: Language
    subject: PalmSubject
}

/** Who the reading is for; gender and age only as quiet context. */
export function subjectInstructions(subject: PalmSubject): string {
    const firstName = subject.name.split(/\s+/)[0] ?? subject.name
    const context = [
        subject.gender && `gender: ${subject.gender}`,
        subject.age && `age: ${String(subject.age)}`,
    ].filter(Boolean)
    return `This reading is for ${subject.name}. Address them as "you" and use their first name, ${firstName}, naturally once or twice (for example in the summary or the advice), not in every field.${
        context.length
            ? ` Context only (${context.join(", ")}): never speculate about their age and never use gendered stereotypes.`
            : ""
    }`
}

// `upstream` is for our logs only; the error handler renders msg and code
/** Why a photo cannot be read, in the words the person sees; null when it can. */
export const PHOTO_PROBLEMS = {
    not_a_hand:
        "This photo doesn't show a hand. Take a photo of just your open palm.",
    back_of_hand:
        "This looks like the back of your hand. Turn it over so your palm faces the camera.",
    closed_hand:
        "Your hand looks closed. Open it flat with your fingers a little apart.",
    multiple_hands:
        "There is more than one hand in the photo. Photograph one palm at a time.",
    poor_light:
        "The lines aren't clear in this light. Retake the photo in bright, even daylight, without flash.",
    blurry: "The photo is blurry. Hold the camera steady and let it focus on your palm.",
    palm_cropped:
        "Part of your palm is out of the frame. Fit your whole palm, from wrist to fingers, in the photo.",
    palm_unclear:
        "The palm is not clear enough to read. Retake the photo with your open palm in good light.",
} as const
export type PhotoProblem = keyof typeof PHOTO_PROBLEMS

/** The rules for turning a photo away, decided here rather than by the model. */
export function photoProblem(report: PalmReport): PhotoProblem | null {
    const { subject, lighting, focus, palmInFrame } = report.photo
    if (subject !== "open_palm") {
        return subject
    }
    if (lighting === "too_dark" || lighting === "too_bright") {
        return "poor_light"
    }
    if (focus === "blurry") {
        return "blurry"
    }
    if (palmInFrame !== "full") {
        return "palm_cropped"
    }
    // the three main lines all out of sight: the light is hiding them
    const main = report.lines.filter((l) => l.key !== "fate")
    if (main.every((l) => l.visibility === "not_visible")) {
        return "poor_light"
    }
    return report.ok ? null : "palm_unclear"
}

const aiFailed = (upstream: string) =>
    createHttpError(
        502,
        "The palm reading could not be written right now. Please try again.",
        { code: "ai_failed", upstream },
    )

/** Fixes what the schema cannot guarantee; rejects what cannot be fixed. */
export function checkReport(value: unknown): PalmReport | null {
    const report = value as PalmReport | null
    if (typeof report?.ok !== "boolean" || !Array.isArray(report.lines)) {
        return null
    }
    if (typeof report.photo !== "object") {
        return null
    }
    if (!report.ok) {
        return report
    }
    const lines = LINE_KEYS.map((key) =>
        report.lines.find((l) => l.key === key),
    ).filter((l) => l !== undefined)
    if (
        lines.length !== LINE_KEYS.length ||
        !Array.isArray(report.mounts) ||
        typeof report.hand !== "object" ||
        typeof report.overall !== "object"
    ) {
        return null
    }
    return {
        ...report,
        lines: lines.map((line) => {
            // model output: typed by the schema, but checked anyway
            const raw: unknown = line.strength
            const strength = typeof raw === "number" ? Math.round(raw) : 0
            return {
                ...line,
                strength: Math.min(100, Math.max(0, strength)),
            }
        }),
    }
}

/** Writes the palmistry reading with OpenAI (Responses API, strict structured output). */
export class PalmReportService {
    async write(input: PalmReportInput): Promise<PalmReport> {
        if (!config.OPENAI_API_KEY) {
            throw createHttpError(
                503,
                "Palm reading is not configured: OPENAI_API_KEY is missing on the server.",
                { code: "ai_not_configured" },
            )
        }
        // built per call so a key rotated in config is picked up; construction is cheap
        const client = new OpenAI({
            apiKey: config.OPENAI_API_KEY,
            timeout: config.OPENAI_TIMEOUT_MS,
            maxRetries: 1,
        })

        let text: string
        try {
            const response = await client.responses.create({
                model: config.OPENAI_VISION_MODEL,
                instructions: `${INSTRUCTIONS}\n\n${subjectInstructions(input.subject)}\n\n${LANGUAGE[input.lang]}`,
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: `This is ${input.subject.name}'s ${input.hand} hand, their ${input.dominant ? "dominant" : "non-dominant"} one. Read this palm.`,
                            },
                            {
                                type: "input_image",
                                image_url: `data:${input.photo.mimetype};base64,${input.photo.buffer.toString("base64")}`,
                                detail: "high",
                            },
                        ],
                    },
                ],
                text: {
                    format: {
                        type: "json_schema",
                        name: "palm_report",
                        strict: true,
                        schema: PALM_REPORT_SCHEMA,
                    },
                },
                reasoning: { effort: "low" },
                // counts reasoning tokens too, so leave room above the JSON itself
                max_output_tokens: 6000,
                store: false,
            })
            text = response.output_text
        } catch (e) {
            // a rejected key is our misconfiguration, not a passing failure
            if (e instanceof OpenAI.AuthenticationError) {
                throw createHttpError(
                    503,
                    "Palm reading is not configured correctly on the server.",
                    { code: "ai_not_configured" },
                )
            }
            throw aiFailed(
                e instanceof OpenAI.APIError
                    ? `${e.name} ${String(e.status ?? "")}`
                    : "request_failed",
            )
        }

        let parsed: unknown
        try {
            // empty on a refusal or a cut-off answer
            parsed = JSON.parse(text)
        } catch {
            throw aiFailed("invalid_json")
        }
        const report = checkReport(parsed)
        if (!report) {
            throw aiFailed("invalid_report")
        }
        return report
    }
}
