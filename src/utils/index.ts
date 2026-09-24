import createHttpError from "http-errors"
import type { AuthRequest } from "../types/index.ts"

export function isJwt(token: string | null): boolean {
    if (token === null) {
        return false
    }

    const parts = token.split(".")

    if (parts.length !== 3) {
        return false
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8")
        })
        return true
    } catch {
        return false
    }
}

export function getAuthUserId(req: AuthRequest): string {
    const userId = req.auth?.sub
    if (!userId) {
        throw createHttpError(401, "Unauthorized")
    }
    return userId
}

/** UTC offset in hours for an IANA zone at a given instant. */
export function offsetHours(zone: string, utcMs: number): number {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(new Date(utcMs))

    const field = (type: string) =>
        Number(parts.find((part) => part.type === type)?.value ?? 0)

    // some ICU builds render midnight as hour 24
    const localAsUtc = Date.UTC(
        field("year"),
        field("month") - 1,
        field("day"),
        field("hour") % 24,
        field("minute"),
        field("second"),
    )

    return (localAsUtc - utcMs) / 3_600_000
}

/** The calendar date (YYYY-MM-DD) it is in a zone at a given instant. */
export function localDate(zone: string, utcMs: number): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(utcMs))
}

/** Julian day of a UTC instant. */
export const julianDay = (utcMs: number): number =>
    utcMs / 86_400_000 + 2_440_587.5

const DAY_MS = 86_400_000

/** Julian day of local noon on a calendar date in a zone; two passes so a DST edge does not shift it. */
export function noonJd(date: string, zone: string): number {
    const asUtc = Date.parse(`${date}T12:00:00Z`)
    const firstPass = offsetHours(zone, asUtc)
    const offset = offsetHours(zone, asUtc - firstPass * 3_600_000)
    return julianDay(asUtc - offset * 3_600_000)
}

/** YYYY-MM-DD moved by whole days. */
export function shiftDate(date: string, byDays: number): string {
    return new Date(Date.parse(`${date}T00:00:00Z`) + byDays * DAY_MS)
        .toISOString()
        .slice(0, 10)
}
