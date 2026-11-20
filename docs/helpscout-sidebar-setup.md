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
