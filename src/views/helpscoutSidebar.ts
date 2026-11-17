import type { BillingStatus } from "../services/BillingService.ts"

// Keep the English survey values aligned with the web app's Billing.jsx.
export const CANCEL_REASONS = [
    "I wasn't using it often enough",
    "Too expensive.",
    "Didn't find the value worth the cost.",
    "It didn't meet my needs or expectations.",
    "Features I needed were unavailable.",
    "Readings or insights were too basic.",
    "I encountered technical problems.",
    "Poor app performance or usability issues.",
    "Information was repetitive or unhelpful.",
    "Other",
]
export const STAY_OPTIONS = [
    "Lower-cost subscription",
    "Annual discounted rates",
    "Additional Premium content",
]

const escape = (s: string) =>
    s.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c] ?? c,
    )
const date = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
          })
        : "the current period end"
const active = (status: string | null) =>
    status === "active" || status === "trialing"

export function sidebarPage(content: string) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AstroMeridian · Subscriptions</title><style>
:root{color-scheme:light;--ink:#19253a;--muted:#526174;--line:#dce2e9;--red:#a52a32;--navy:#19253a}*{box-sizing:border-box}body{margin:0;padding:14px;font:14px/1.5 system-ui,sans-serif;color:var(--ink);background:#fff;overflow-wrap:anywhere}header{border-bottom:2px solid #b4933f;padding-bottom:12px;margin-bottom:16px}h1{font:600 21px/1.2 Georgia,serif;margin:0}small,.muted{color:var(--muted)}small{font-size:12px}h2{font-size:15px;margin:0 0 8px}p{margin:8px 0}section{border:1px solid var(--line);border-radius:6px;padding:12px;margin:12px 0}.badge{display:inline-block;background:#eef2f6;padding:2px 7px;border-radius:4px;font-size:12px}button,select,textarea{font:inherit;width:100%;border:1px solid var(--line);border-radius:4px;padding:10px;background:#fff;color:var(--ink)}button{min-height:44px;cursor:pointer;margin-top:10px}button.danger{color:var(--red);border-color:var(--red)}button:hover{background:#f3f5f8}button:focus-visible,select:focus-visible,textarea:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #2563eb;outline-offset:2px}label{display:block;margin:10px 0 5px}fieldset{border:0;padding:0;margin:16px 0 0}legend{font-weight:600}input[type=checkbox]{margin-right:8px;accent-color:var(--navy)}.check{display:flex;align-items:center;min-height:44px;margin:0;font-size:13px}.notice{background:#edf7f1;border-left:3px solid #237047;padding:10px}.error{background:#fff1f2;border-left:3px solid var(--red);padding:10px}summary{cursor:pointer;min-height:44px;display:flex;align-items:center;color:var(--red)}textarea{resize:vertical;min-height:80px}form{margin:0}
</style></head><body><header><small>SUPPORT BILLING</small><h1>AstroMeridian</h1></header>${content}</body></html>`
}

export function sidebarMessage(message: string) {
    return sidebarPage(`<p role="alert">${escape(message)}</p>`)
}

export function renderSidebar(
    email: string,
    token: string,
    status: BillingStatus,
    message = "",
    error = "",
) {
    const hidden = `<input type="hidden" name="token" value="${escape(token)}">`
    const refresh = `<form method="post" action="/helpscout/sidebar/refresh">${hidden}<button>Refresh subscriptions</button></form>`
    const plan = status.plan
    const profiles = status.profiles
    const profilesFirst = active(profiles.status) && !profiles.cancelAtPeriodEnd
    const survey = `<details><summary>Cancel membership renewal</summary><form method="post" action="/helpscout/sidebar/cancel">${hidden}<input type="hidden" name="kind" value="plan">
<p>Access continues until ${escape(date(plan?.currentPeriodEnd ?? null))}.${plan?.trial ? " The trial will not convert to a paid plan." : ""}</p>
<label for="reason">Why is the customer cancelling? *</label><select id="reason" name="reason" required><option value="">Select a reason</option>${CANCEL_REASONS.map((r) => `<option>${escape(r)}</option>`).join("")}</select>
<label for="other">Details for “Other” (optional)</label><textarea id="other" name="other" maxlength="500"></textarea>
<fieldset><legend>Would they have stayed if offered?</legend><small>Optional survey; this does not apply an offer.</small>${STAY_OPTIONS.map((o) => `<label class="check"><input type="checkbox" name="stayIfOffered" value="${escape(o)}">${escape(o)}</label>`).join("")}</fieldset>
<label class="check"><input type="checkbox" name="confirmed" value="yes" required>Confirm cancellation of membership renewal</label><button class="danger">Cancel membership renewal</button></form></details>`
    return sidebarPage(`<p class="muted">${escape(email)}</p>${message ? `<p class="notice" role="status">${escape(message)}</p>` : ""}${error ? `<p class="error" role="alert">${escape(error)}</p>` : ""}
<section><h2>Membership</h2>${plan ? `<strong>${escape(plan.name)}${plan.trial ? " trial" : ""}</strong> <span class="badge">${escape(plan.status)}</span><p>${plan.cancelAtPeriodEnd ? "Ends" : "Current period ends"} ${escape(date(plan.currentPeriodEnd))}</p>${plan.cancelAtPeriodEnd ? '<p class="notice">Renewal already cancelled.</p>' : active(plan.status) ? (profilesFirst ? "<p>Cancel the profile add-on below first, then cancel membership renewal.</p>" : survey) : '<p class="muted">No active membership to cancel.</p>'}` : '<p class="muted">No membership found.</p>'}</section>
<section><h2>Profile add-on</h2>${active(profiles.status) ? `<strong>${String(profiles.extra)} extra profiles</strong><p>${profiles.cancelAtPeriodEnd ? "Ends" : "Current period ends"} ${escape(date(profiles.currentPeriodEnd))}</p>${profiles.cancelAtPeriodEnd ? '<p class="notice">Renewal already cancelled.</p>' : `<details><summary>Cancel profile add-on renewal</summary><p>Profile slots remain until the period ends. Membership stays active.</p><form method="post" action="/helpscout/sidebar/cancel">${hidden}<input type="hidden" name="kind" value="profiles"><label class="check"><input type="checkbox" name="confirmed" value="yes" required>Confirm cancellation of profile add-on renewal</label><button class="danger">Cancel profile add-on renewal</button></form></details>`}` : '<p class="muted">No active profile add-on.</p>'}</section>
<p class="muted">Cancellation stops future renewals and keeps access until the period ends.</p>${refresh}`)
}
