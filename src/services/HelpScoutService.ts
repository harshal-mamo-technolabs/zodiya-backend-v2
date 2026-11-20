import createHttpError from "http-errors"
import { config } from "../config/index.ts"

interface Conversation {
    id: number
    mailboxId: number
    primaryCustomer: { email: string }
}

/** Inbox API credentials stay on the server; the sidebar receives no API keys. */
export class HelpScoutService {
    private token: { value: string; expires: number } | null = null

    async conversation(id: string): Promise<Conversation> {
        const response = await fetch(
            `https://api.helpscout.net/v2/conversations/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${await this.accessToken()}`,
                },
                signal: AbortSignal.timeout(10000),
                redirect: "error",
            },
        )
        if (response.status === 401) this.token = null
        if (!response.ok)
            throw createHttpError(
                502,
                "Could not verify the Help Scout conversation. Reload and try again.",
            )
        const data = (await response.json()) as Partial<Conversation>
        if (
            data.id !== Number(id) ||
            !Number.isSafeInteger(data.mailboxId) ||
            typeof data.primaryCustomer?.email !== "string"
        ) {
            throw createHttpError(
                502,
                "Help Scout returned an incomplete conversation.",
            )
        }
        return data as Conversation
    }

    /** A signed sidebar actor must actually have access to this product's inbox. */
    async authorizeAgent(agentId: string) {
        for (let page = 1; ; page++) {
            const data = (await this.read(
                `users?mailbox=${config.HELPSCOUT_INBOX_ID}&page=${String(page)}`,
            )) as {
                _embedded?: {
                    users?: { id: number; role: string; type: string }[]
                }
                page?: { totalPages?: number }
            }
            const users = data._embedded?.users
            if (!Array.isArray(users))
                throw createHttpError(
                    502,
                    "Could not verify Help Scout inbox access.",
                )
            if (
                users.some(
                    (u) =>
                        String(u.id) === agentId &&
                        u.type === "user" &&
                        ["owner", "admin", "user"].includes(u.role),
                )
            )
                return
            const pages = data.page?.totalPages ?? 1
            if (!Number.isSafeInteger(pages) || page >= pages) break
        }
        throw createHttpError(
            403,
            "This agent does not have access to the zodiya inbox.",
        )
    }

    async customerEmails(id: string) {
        const data = (await this.read(`customers/${id}`)) as {
            id?: number
            _embedded?: { emails?: { value?: string }[] }
        }
        if (data.id !== Number(id) || !Array.isArray(data._embedded?.emails)) {
            throw createHttpError(
                502,
                "Help Scout returned an incomplete customer.",
            )
        }
        const emails = data._embedded.emails
            .map((e) => e.value?.trim().toLowerCase())
            .filter((e): e is string => !!e)
        if (!emails.length)
            throw createHttpError(
                404,
                "This Help Scout customer has no email address. Add their account email in Help Scout, then refresh.",
            )
        return emails
    }

    private async read(resource: string): Promise<unknown> {
        const response = await fetch(
            `https://api.helpscout.net/v2/${resource}`,
            {
                headers: {
                    Authorization: `Bearer ${await this.accessToken()}`,
                },
                signal: AbortSignal.timeout(10000),
                redirect: "error",
            },
        )
        if (response.status === 401) this.token = null
        if (!response.ok)
            throw createHttpError(
                502,
                "Could not verify the Help Scout customer or inbox access. Reload and try again.",
            )
        return response.json()
    }

    private async accessToken() {
        if (this.token && this.token.expires > Date.now())
            return this.token.value
        if (
            !config.HELPSCOUT_MAILBOX_APP_ID ||
            !config.HELPSCOUT_MAILBOX_APP_SECRET
        ) {
            throw createHttpError(
                503,
                "Help Scout Inbox API credentials are not configured.",
            )
        }
        const response = await fetch(
            "https://api.helpscout.net/v2/oauth2/token",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grant_type: "client_credentials",
                    client_id: config.HELPSCOUT_MAILBOX_APP_ID,
                    client_secret: config.HELPSCOUT_MAILBOX_APP_SECRET,
                }),
                signal: AbortSignal.timeout(10000),
                redirect: "error",
            },
        )
        if (!response.ok)
            throw createHttpError(
                502,
                "Could not authenticate with Help Scout.",
            )
        const data = (await response.json()) as {
            access_token?: string
            expires_in?: number
        }
        if (!data.access_token || !data.expires_in)
            throw createHttpError(
                502,
                "Help Scout authentication response was incomplete.",
            )
        this.token = {
            value: data.access_token,
            expires: Date.now() + (data.expires_in - 60) * 1000,
        }
        return this.token.value
    }
}

export const helpScout = new HelpScoutService()
