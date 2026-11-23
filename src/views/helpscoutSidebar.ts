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

export interface SidebarContext {
    token: string
    contextId: string
}

export function sidebarPage(
    content: string,
    context?: SidebarContext,
    view: "subscriptions" | "klaviyo" = "subscriptions",
) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AstroMeridian · ${view === "klaviyo" ? "Klaviyo Profile" : "Subscriptions"}</title><style>
:root{color-scheme:light;--ink:#19253a;--muted:#59677a;--line:#dfe5ed;--red:#b42332;--navy:#19253a}
*{box-sizing:border-box}html{height:auto}body{margin:0;padding:12px;font:14px/1.5 system-ui,sans-serif;color:var(--ink);background:#fff;overflow-wrap:anywhere}
header{padding:0 0 12px;border-bottom:1px solid var(--line);margin-bottom:14px}h1{font-size:18px;line-height:1.3;margin:3px 0 0;letter-spacing:-.3px}header small{font-size:10px;letter-spacing:1.4px;color:#75602e;font-weight:700}
small,.muted{color:var(--muted)}small{font-size:12px}h2{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin:0 0 12px}p{margin:8px 0}section{border:1px solid var(--line);border-radius:10px;padding:14px;margin:12px 0;box-shadow:0 2px 4px #19253a04}.plan-heading{display:flex;align-items:center;justify-content:space-between;gap:8px}.plan-heading strong{font-size:17px;line-height:1.3}.badge{display:inline-block;flex-shrink:0;background:#eaf5ee;color:#236442;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600}.badge.ending{background:#fff3df;color:#805719}.period{font-size:12px;color:var(--muted);margin:7px 0 12px}
button,select,textarea{font:inherit;width:100%;border:1px solid #cdd5e0;border-radius:6px;padding:10px;background:#fff;color:var(--ink);min-width:0}button{min-height:42px;cursor:pointer;font-weight:600;margin-top:10px}button.danger{color:white;background:var(--red);border-color:var(--red)}button:hover{background:#f3f5f8}button.danger:hover{background:#951d2a}button:disabled{cursor:wait;opacity:.6}button:focus-visible,select:focus-visible,textarea:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
label{display:block;font-size:13px;font-weight:500;margin:14px 0 6px}fieldset{border:0;border-top:1px solid var(--line);padding:14px 0 0;margin:16px 0}legend{font-size:13px;font-weight:600;padding:0 0 4px}input[type=checkbox]{flex:0 0 16px;width:16px;height:16px;margin:3px 9px 0 0;accent-color:var(--navy)}.check{display:flex;align-items:flex-start;min-height:38px;padding:8px 0;margin:0;font-size:13px;font-weight:400}.confirm{background:#f6f8fb;border-radius:6px;padding:10px;margin-top:14px}.notice,.error{border-radius:6px;padding:10px 12px;font-size:13px}.notice{background:#edf7f1;color:#236442}.error{background:#fff1f2;color:var(--red)}
details{border-top:1px solid var(--line);margin-top:12px}summary{cursor:pointer;min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--red);font-size:13px;font-weight:600;list-style:none}summary::-webkit-details-marker{display:none}summary::after{content:'+';font-size:20px;font-weight:400}details[open]>summary::after{content:'−'}details[open]>summary{margin-bottom:6px}textarea{resize:vertical;min-height:80px}form{margin:0}.customer{font-size:12px;color:var(--muted);margin:0 0 12px}.footnote{font-size:12px;color:var(--muted);margin:14px 0 0}[hidden]{display:none!important}
.profile-identity{padding:0 0 14px}.profile-identity strong{display:block;font-size:18px;margin-bottom:3px}.profile-identity p{font-size:13px;color:var(--muted);margin:0}.profile-group{border:1px solid var(--line);border-radius:9px;margin:10px 0;padding:0 12px}.profile-group>summary{color:var(--ink);font-size:13px}.profile-group>summary span{font-size:11px;color:var(--muted);margin-left:auto}.profile-fields{margin:0 0 8px}.profile-row{border-top:1px solid #edf0f4;padding:9px 0}.profile-row dt{font-size:12px;color:var(--muted);margin-bottom:3px}.profile-row dd{margin:0;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.profile-row .badge{background:#eef2f6;color:var(--ink)}.profile-url{margin:0;border:0}.profile-url>summary{font-size:12px;color:#285a9a;min-height:32px}.profile-url code{display:block;font-size:11px;white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f7fa;padding:8px;border-radius:5px}.profile-note{font-size:12px;color:var(--muted)}
.profile-group.usage .profile-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:4px 0 12px}.usage .profile-row{border:0;background:#f6f8fb;border-radius:6px;padding:9px}.usage .profile-row dd{font-size:19px;font-weight:600}.usage .profile-row dt{line-height:1.4}
</style></head><body><header><small>ASTROMERIDIAN</small><h1>${view === "klaviyo" ? "Customer profile" : "Subscriptions"}</h1></header><main id="sidebar-panel">${content}</main>${context ? `<div hidden id="sidebar-config" data-token="${escape(context.token)}" data-context-id="${escape(context.contextId)}" data-endpoint="/helpscout/sidebar/${view === "klaviyo" ? "klaviyo/context" : "context"}" data-view="${view}"></div><script src="/helpscout/sidebar/client.js" defer></script>` : ""}</body></html>`
}

export function sidebarMessage(
    message: string,
    view: "subscriptions" | "klaviyo" = "subscriptions",
) {
    return sidebarPage(
        `<p role="alert">${escape(message)}</p>`,
        undefined,
        view,
    )
}

export function renderSidebar(
    email: string,
    token: string,
    status: BillingStatus,
    message = "",
    error = "",
    context?: SidebarContext,
) {
    const hidden = `<input type="hidden" name="token" value="${escape(token)}">`
    const refresh = `<form method="post" action="/helpscout/sidebar/refresh">${hidden}<button>Refresh subscriptions</button></form>`
    const plan = status.plan
    const profiles = status.profiles
    const profilesFirst = active(profiles.status) && !profiles.cancelAtPeriodEnd
    const survey = `<details><summary>Cancel membership renewal</summary><form method="post" action="/helpscout/sidebar/cancel">${hidden}<input type="hidden" name="kind" value="plan">
<p>Access continues until ${escape(date(plan?.currentPeriodEnd ?? null))}.${plan?.trial ? " The trial will not convert to a paid plan." : ""}</p>
<label for="reason">Why is the customer cancelling? *</label><select id="reason" name="reason" required><option value="">Select a reason</option>${CANCEL_REASONS.map((r) => `<option>${escape(r)}</option>`).join("")}</select>
<div id="other-details" hidden><label for="other">Details for “Other” (optional)</label><textarea id="other" name="other" maxlength="500" disabled></textarea></div>
<fieldset><legend>Would they have stayed if offered?</legend><small>Optional survey; this does not apply an offer.</small>${STAY_OPTIONS.map((o) => `<label class="check"><input type="checkbox" name="stayIfOffered" value="${escape(o)}">${escape(o)}</label>`).join("")}</fieldset>
<label class="check confirm"><input type="checkbox" name="confirmed" value="yes" required>Confirm cancellation of membership renewal</label><button class="danger">Cancel membership renewal</button></form></details>`
    return sidebarPage(
        `<p class="customer">${escape(email)}</p>${message ? `<p class="notice" role="status">${escape(message)}</p>` : ""}${error ? `<p class="error" role="alert">${escape(error)}</p>` : ""}
<section><h2>Membership</h2>${plan ? `<div class="plan-heading"><strong>${escape(plan.name)}${plan.trial ? " trial" : ""}</strong><span class="badge${plan.cancelAtPeriodEnd ? " ending" : ""}">${plan.cancelAtPeriodEnd ? "Ending" : plan.status === "trialing" ? "Trial" : escape(plan.status.charAt(0).toUpperCase() + plan.status.slice(1))}</span></div><p class="period">${plan.cancelAtPeriodEnd ? "Ends" : "Current period ends"} ${escape(date(plan.currentPeriodEnd))}</p>${plan.cancelAtPeriodEnd ? '<p class="notice">Renewal already cancelled.</p>' : active(plan.status) ? (profilesFirst ? "<p>Cancel the profile add-on below first, then cancel membership renewal.</p>" : survey) : '<p class="muted">No active membership to cancel.</p>'}` : '<p class="muted">No membership found.</p>'}</section>
<section><h2>Profile add-on</h2>${active(profiles.status) ? `<div class="plan-heading"><strong>${String(profiles.extra)} extra profiles</strong><span class="badge${profiles.cancelAtPeriodEnd ? " ending" : ""}">${profiles.cancelAtPeriodEnd ? "Ending" : "Active"}</span></div><p class="period">${profiles.cancelAtPeriodEnd ? "Ends" : "Current period ends"} ${escape(date(profiles.currentPeriodEnd))}</p>${profiles.cancelAtPeriodEnd ? '<p class="notice">Renewal already cancelled.</p>' : `<details><summary>Cancel profile add-on renewal</summary><p>Profile slots remain until the period ends. Membership stays active.</p><form method="post" action="/helpscout/sidebar/cancel">${hidden}<input type="hidden" name="kind" value="profiles"><label class="check confirm"><input type="checkbox" name="confirmed" value="yes" required>Confirm cancellation of profile add-on renewal</label><button class="danger">Cancel profile add-on renewal</button></form></details>`}` : '<p class="muted">No active profile add-on.</p>'}</section>
<p class="footnote">Cancellation stops future renewals and keeps access until the period ends.</p>${refresh}`,
        context,
    )
}
