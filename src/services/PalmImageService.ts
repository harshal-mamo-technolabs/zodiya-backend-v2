import OpenAI, { toFile } from "openai"
import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import type { LINE_KEYS } from "./PalmReportService.ts"

export type LineKey = (typeof LINE_KEYS)[number]

/** The same colours the page's legend shows. */
export const LINE_COLORS: Record<LineKey, string> = {
    heart: "red #E5484D",
    head: "blue #3E8BFF",
    life: "green #3DBE6B",
    fate: "gold #E3B64B",
}

const WHERE: Record<LineKey, string> = {
    heart: "the heart line: the highest main crease, running across the palm just below the four fingers",
    head: "the head line: the crease below the heart line, running across the middle of the palm from the thumb side",
    life: "the life line: the crease curving around the base of the thumb toward the wrist",
    fate: "the fate line: the vertical crease running up the centre of the palm toward the middle finger",
}

export function highlightPrompt(skip: LineKey[]): string {
    const draw = (Object.keys(WHERE) as LineKey[]).filter(
        (k) => !skip.includes(k),
    )
    return `This is a photo of a person's open palm. Keep the photo itself unchanged: the same hand, skin, pose, framing, background and lighting. Do not redraw, retouch or beautify the hand.

First work out where the fingers and the thumb are, whichever way the hand points in the frame, and find the creases relative to them. Then, on top of the photo, trace these palm creases where they actually appear, as thin, smooth, softly glowing marker lines that follow each crease exactly:
${draw.map((k) => `- ${WHERE[k]}: ${LINE_COLORS[k]}`).join("\n")}

Only trace a crease that is really in the photo; if one cannot be found, leave it out. Draw nothing else: no other lines, text, labels, arrows, legends or marks.`
}

const failed = (upstream: string) =>
    createHttpError(
        502,
        "The lines could not be drawn right now. Please try again.",
        { code: "ai_failed", upstream },
    )

/**
 * Redraws the palm photo with its principal lines highlighted, using an
 * OpenAI image-edit model. An illustration: the model places the lines by
 * eye, so they can drift from the real creases. Returns the JPEG.
 */
export class PalmImageService {
    async highlight(input: {
        photo: { buffer: Buffer; mimetype: string }
        skip: LineKey[]
    }): Promise<Buffer> {
        if (!config.OPENAI_API_KEY) {
            throw createHttpError(
                503,
                "Palm reading is not configured: OPENAI_API_KEY is missing on the server.",
                { code: "ai_not_configured" },
            )
        }
        const client = new OpenAI({
            apiKey: config.OPENAI_API_KEY,
            timeout: config.OPENAI_IMAGE_TIMEOUT_MS,
            maxRetries: 1,
        })

        let b64: string | undefined
        try {
            const response = await client.images.edit({
                model: config.OPENAI_IMAGE_MODEL,
                image: await toFile(input.photo.buffer, "palm", {
                    type: input.photo.mimetype,
                }),
                prompt: highlightPrompt(input.skip),
                quality: config.OPENAI_IMAGE_QUALITY as
                    "low" | "medium" | "high",
                size: "auto",
                output_format: "jpeg",
                output_compression: 85,
            })
            b64 = response.data?.[0]?.b64_json
        } catch (e) {
            if (e instanceof OpenAI.AuthenticationError) {
                throw createHttpError(
                    503,
                    "Palm reading is not configured correctly on the server.",
                    { code: "ai_not_configured" },
                )
            }
            // the safety system turned the photo down
            if (
                e instanceof OpenAI.BadRequestError &&
                /moderation|safety/i.test(e.message)
            ) {
                throw createHttpError(
                    422,
                    "This photo could not be used for drawing the lines. Try another photo of your open palm.",
                    { code: "image_refused" },
                )
            }
            throw failed(
                e instanceof OpenAI.APIError
                    ? `${e.name} ${String(e.status ?? "")}`
                    : "request_failed",
            )
        }
        if (!b64) {
            throw failed("no_image")
        }
        return Buffer.from(b64, "base64")
    }
}
