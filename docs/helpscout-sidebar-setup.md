# AstroMeridian cancellation panel in Help Scout

The panel lives in the conversation sidebar for **zodiya Inbox** (numeric inbox ID `350186`). It matches a ticket's primary customer email, or the selected live-chat customer's verified Help Scout emails, to an AstroMeridian account. Agents can cancel membership renewal (Starter, Premium, Gold and trials) and profile add-on renewal. Access lasts until the existing period end. Cancel the profile add-on first when both subscriptions are renewing.

Membership cancellation uses the same English reasons and optional retention survey answers as the web app. The existing billing service writes the answers to Stripe and synchronizes cancellation state and Klaviyo. Minute and palm top-ups are one-time purchases, so they have no subscription to cancel.

## Deploy the backend

Deploy this repository's backend changes as usual. Configure these runtime environment variables before restarting:

- `HELPSCOUT_SIDEBAR_SECRET`: the new 40-character sidebar signing key, separate from `HELPSCOUT_SECURE_MODE_KEY`.
- `HELPSCOUT_INBOX_ID=350186`.
- `HELPSCOUT_MAILBOX_APP_ID` and `HELPSCOUT_MAILBOX_APP_SECRET`: existing Help Scout Inbox API application credentials. These must be present on the deployed server, not only in local `.env` files.

Local setup values were saved in the gitignored `logs/helpscout-sidebar.env` file and appended to `.env.development` and `.env.production`. Transfer the sidebar secret through your deployment's environment settings. Never commit these values or put them in a URL. The existing Beacon key stays unchanged.

The callback is:

`https://api.astromeridian.net/helpscout/sidebar`

A direct unsigned browser request should return HTTP 401 with “Open this app from a Help Scout conversation.” HTTP 404 means the route is not deployed; HTTP 503 means the sidebar environment variables are missing. Unsigned requests must never reveal customer information.

Deploy the updated `conf/nginx/default.conf` as well. It omits `X-Frame-Options` only for `/helpscout/sidebar` and its subroutes; Express's `Content-Security-Policy` permits embedding only by Help Scout. Other API routes retain `SAMEORIGIN`. Rebuild the Docker image to include this configuration. If a hosting-panel proxy also injects `X-Frame-Options`, apply the same path-specific exception there; a global `SAMEORIGIN` header blocks the panel even when the backend returns HTTP 200.

## Install the Help Scout app

In Help Scout, open **Settings → Workspace → Apps → Create → Create App**:

1. App name: **AstroMeridian**.
2. Content URL: `https://api.astromeridian.net/helpscout/sidebar` (no extra query parameters).
3. Content signature key: the exact value of `HELPSCOUT_SIDEBAR_SECRET` from the backend environment.
4. Leave Side Panel URLs empty; this app uses the conversation sidebar directly.
5. Save, then select only **zodiya Inbox** in the app's inbox settings and save.
6. Open an existing conversation for an AstroMeridian account and find **AstroMeridian** in the sidebar. Move it beside Stripe if desired.

Creating the app grants agents in the selected inbox access to subscription status and cancellation controls. Complete this installation as the Help Scout administrator after deploying the backend.

## Verify after deployment

Use a designated test account and Stripe test-mode subscriptions. Check both an open live chat and an ordinary ticket, and switch between customers to confirm the panel follows the selection. Confirm the sidebar shows the correct customer, plan/trial, profile add-on and dates. Cancel only a test account's renewal when explicitly authorized. Check the resulting end state in the sidebar, the app and Stripe. Trial cancellation must prevent paid conversion. An active profile add-on must be scheduled to stop before membership cancellation succeeds.

Do not test cancellation against a real customer's subscription without their request. Automated tests mock external Help Scout and Stripe operations; no real customer subscription was cancelled while implementing the panel.

## Authorization and audit behavior

Live chat callbacks may contain a signed agent ID but no conversation ID. The bundled Help Scout JavaScript SDK supplies the selected customer context. The backend verifies the signed agent belongs to zodiya Inbox through the Inbox API, excludes light users, and fetches the contact's emails from Help Scout. Browser-supplied email addresses and agent IDs are ignored. If a contact matches multiple AstroMeridian accounts, the panel refuses to pick one automatically. SDK context changes clear the old panel before loading the next customer.

The callback validates Help Scout's HMAC-SHA1 signature using the [documented signing protocol](https://developer.helpscout.com/apps/guides/signature-validation/). It reads the customer and inbox from the [Inbox API conversation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/get/), not from browser-supplied email or account IDs. It uses server-held [client credentials](https://developer.helpscout.com/mailbox-api/overview/authentication/) and cached OAuth tokens.

Forms carry a 15-minute signed token scoped to the customer, conversation and displayed subscription IDs. Every action rechecks the ticket's inbox and customer, or the live-chat agent's inbox permission and contact's verified account match. A replacement subscription requires refreshing the panel. Confirmation and survey validation run server-side. No customer login cookie or Beacon signature grants agent access.

Responses disable caching and referrers and permit embedding only by `https://secure.helpscout.net`. Audit logs record the account, conversation or Help Scout customer ID, signed Help Scout `user-id` when supplied, subscription ID, purchase kind and cancellation reason. If Help Scout omits `user-id`, the audit entry states that the agent ID was not supplied; it does not infer an actor from the conversation assignee.

Help Scout callback signatures have no documented expiry. Treat signed callback URLs and form tokens as sensitive; do not share them. Only enable this app in the intended inbox.


## Klaviyo Profile in the current AstroMeridian backend

The replacement profile panel is served by this repository at:

`https://api.astromeridian.net/helpscout/sidebar/klaviyo`

It uses the same bundled Help Scout SDK and frame policy as the subscription panel. It reads the selected customer through the Help Scout Inbox API, verifies the agent has access to the AstroMeridian inbox, and performs a server-side Klaviyo lookup. There is no dependency on the old `zodiya.net` API, nor a requirement for a local user account (Klaviyo leads can be shown). Profile context tokens cannot call billing endpoints.

Deploy the backend first (`npm run build` includes the browser bundle). Retain the existing Help Scout environment variables and configure `KLAVIYO_PRIVATE_API_KEY` with `profiles:read` permission. If reusing the existing Klaviyo Profile app, set `HELPSCOUT_PROFILE_SIDEBAR_SECRET` to its existing Content signature key; a local, gitignored deployment snippet is in `logs/helpscout-klaviyo.env`. The optional setting falls back to `HELPSCOUT_SIDEBAR_SECRET` for a new app using the cancellation app's signing configuration. All credentials stay on the server.

After deploying, an unsigned request to the new callback should return **401**, rather than 404. In the AstroMeridian Klaviyo Profile app's **App Information**, replace the old Content URL (`https://zodiya.net/api/helpscout/sidebar`) with the new URL above. Retain the existing app name, signing key and inbox assignment; clear the old Side Panel URLs entry since the replacement does not use a separate side panel. Reusing the installation replaces the old sidebar without creating a duplicate. Do not change the Bazzingo/Testbrain Klaviyo Profile installation.

The old callback should remain connected until the replacement is deployed. The profile view groups subscription, balances, contact details, attribution and other properties, retains zero and false values, formats dates in UTC, and expands long URLs on demand. Refresh profile and SDK context changes recheck the current Help Scout customer. Contacts with multiple emails require a conversation with the intended primary email; the panel does not guess an account.
