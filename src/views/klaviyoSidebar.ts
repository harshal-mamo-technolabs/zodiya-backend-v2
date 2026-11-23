import type { KlaviyoProfile } from "../services/KlaviyoService.ts"
import { sidebarPage, type SidebarContext } from "./helpscoutSidebar.ts"

const escape = (value: string) =>
    value.replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[char] ?? char,
    )

function field(label: string, value: unknown) {
    if (value === undefined || value === null || value === "") return ""
    let display: string
    if (typeof value === "boolean")
        display = `<span class="badge">${value ? "Yes" : "No"}</span>`
    else if (typeof value === "string" && /^https?:\/\//i.test(value)) {
        display = `<details class="profile-url"><summary>View URL</summary><code>${escape(value)}</code></details>`
    } else {
        let text =
            typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : typeof value === "string" || typeof value === "number"
                  ? String(value)
                  : ""
        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value) &&
            !Number.isNaN(Date.parse(value))
        ) {
            text =
                new Date(value).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    ...(value.includes("T")
                        ? { timeStyle: "short" as const }
                        : {}),
                    timeZone: "UTC",
                }) + (value.includes("T") ? " UTC" : "")
        }
        display = escape(text)
    }
    return `<div class="profile-row"><dt>${escape(label)}</dt><dd>${display}</dd></div>`
}

export function renderKlaviyoSidebar(
    profile: KlaviyoProfile | null,
    email: string,
    context: SidebarContext,
    ids: { conversationId: string; customerId: string },
) {
    const refresh = `<form method="post" action="/helpscout/sidebar/klaviyo/context"><input type="hidden" name="token" value="${escape(context.token)}"><input type="hidden" name="conversationId" value="${escape(ids.conversationId)}"><input type="hidden" name="customerId" value="${escape(ids.customerId)}"><button>Refresh profile</button></form>`
    if (!profile)
        return sidebarPage(
            `<p class="customer">${escape(email)}</p><p class="notice">No Klaviyo profile found for this customer.</p>${refresh}`,
            context,
            "klaviyo",
        )
    const a = profile.attributes
    const name = [a.first_name, a.last_name].filter(Boolean).join(" ")
    const groups: Record<
        | "Subscription"
        | "Allowances & usage"
        | "Customer details"
        | "Attribution"
        | "Other properties",
        string[]
    > = {
        Subscription: [],
        "Allowances & usage": [],
        "Customer details": [],
        Attribution: [],
        "Other properties": [],
    }
    groups["Customer details"].push(
        field("Phone", a.phone_number),
        field("Klaviyo profile ID", profile.id),
        field("Created", a.created),
        field("Updated", a.updated),
    )
    for (const [key, value] of Object.entries(a.properties ?? {}).sort(
        ([left], [right]) => left.localeCompare(right),
    )) {
        const clean = key.replace(/^astromeridian:/i, "").replace(/_/g, " ")
        const friendly = clean
            .replace(/^astrologer minutes /i, "AI minutes · ")
            .replace(/^palm readings /i, "Palm readings · ")
        const label = friendly.charAt(0).toUpperCase() + friendly.slice(1)
        const group =
            /minutes|palm|profiles (?:allowed|used)|allowance|credits/i.test(
                clean,
            )
                ? "Allowances & usage"
                : /plan|subscription|trial|cancel/i.test(clean)
                  ? "Subscription"
                  : /utm|campaign|source|medium|landing page/i.test(clean)
                    ? "Attribution"
                    : /^(?:full name|first name|last name|email|phone|gender|dob|birth|city|state|country|lat|lon|created|updated|is user|resume)/i.test(
                            clean,
                        )
                      ? "Customer details"
                      : "Other properties"
        const row = field(label, value)
        if (row) groups[group].push(row)
    }
    const content =
        `<div class="profile-identity">${name ? `<strong>${escape(name)}</strong>` : ""}<p>${escape(a.email ?? email)}</p></div><p class="profile-note">Klaviyo profile data · dates shown in UTC</p>` +
        Object.entries(groups)
            .map(([title, rows]) => {
                const filled = rows.filter(Boolean)
                return filled.length
                    ? `<details class="profile-group${title === "Allowances & usage" ? " usage" : ""}"${["Subscription", "Allowances & usage"].includes(title) ? " open" : ""}><summary>${escape(title)}<span>${String(filled.length)} ${filled.length === 1 ? "field" : "fields"}</span></summary><dl class="profile-fields">${filled.join("")}</dl></details>`
                    : ""
            })
            .join("") +
        refresh
    return sidebarPage(content, context, "klaviyo")
}
