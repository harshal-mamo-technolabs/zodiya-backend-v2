# Getting started with AstroMeridian

This collection contains exactly ten Markdown documents. It combines the existing AstroMeridian help articles and policy archives without removing their topic coverage. Operational guidance is in documents 01–09; existing policy and FAQ text is explicitly labeled where included.

## Document index

- [Getting started with AstroMeridian](01-getting-started.md)
- [Profiles, birth details and account management](02-profiles-and-account.md)
- [Natal charts, sharing, horoscopes, transits and synastry](03-astrology-readings.md)
- [Numerology, tarot and astrocartography](04-numerology-tarot-and-astrocartography.md)
- [Palm photos, reports and reading credits](05-palm-readings.md)
- [AI astrologers, conversations and minutes](06-ai-astrologer.md)
- [Plans, trials, payments and subscriptions](07-plans-and-billing.md)
- [Support, refunds and frequently asked questions](08-support-refunds-and-faq.md)
- [Privacy and personal data](09-privacy-and-data.md)
- [Terms and policy publication notes](10-terms-and-policy-notes.md)

## What is AstroMeridian and what is included?

AstroMeridian is the application name used throughout this documentation.

The app provides a dashboard, natal birth charts and PDF exports, daily/weekly/yearly sun-sign horoscopes, personal transits, synastry comparisons, numerology, tarot, astrocartography, palm readings, and AI astrologer conversations by voice or text. English and German are supported.

All main reading pages require a signed-in account and, when payments are enabled, an active or trialing membership. Account management and support remain accessible without an active membership. Public chart links can be viewed without signing in.

Every current plan opens the same app features. Plans differ in billing period and included AI astrologer minutes and palm readings. Extra profile slots are a separate monthly subscription; minute and palm packs are one-time purchases.

Readings are for entertainment, information and reflection. They are not professional medical, legal or financial advice, diagnoses, or guaranteed predictions.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/App.jsx
zodiya-funnel-v2/src/steps/Plans.jsx
zodiya-backend-v2/src/middlewares/requirePlan.ts
-->

## Create an account, sign in and recover access

### Create an account directly

Open `/signup`, enter first name, last name, email and password, and choose **Create account**. Follow the membership and birth-details steps. The first profile created is your primary profile.

The backend requires a password of at least eight characters, while the signup screen says “10+ characters.” Use ten or more characters to meet both descriptions. An email already on an account cannot be registered again.

### Sign in and sign out

Open `/login`, use the account email and password, and select **Log in**. Use **Account → Log out** to leave the account. Expired sessions may refresh automatically; if that fails, sign in again. Too many credential attempts can temporarily block further attempts; wait before retrying.

### Forgotten password

The current **Forgotten password** form is incomplete: its “Link sent” message does not send an email or contact a password-reset API. Do not keep requesting links or tell a customer that a link was delivered. Contact support for access problems. There is no implemented self-service password or email change in the reviewed API.

### Signup through the separate funnel

The onboarding funnel creates an account without asking for a password and transfers the session into the main app using a one-use link. That link expires after two minutes. The funnel-generated password is not known to the customer, and a password-setting/reset flow is not implemented. If the handoff fails or access is lost, ask support for help; do not promise that ordinary password login will work for such an account.

A closed account can reopen when the correct existing password is used. Reopening does not automatically resume a canceled subscription.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/SignIn.jsx
zodiya-backend-v2/src/controllers/AuthController.ts
zodiya-backend-v2/src/controllers/FunnelController.ts
zodiya-backend-v2/src/validators/registerValidator.ts
-->

## Complete the onboarding funnel

The separate funnel walks through an introduction, your name and gender, optional portrait, birth date/time, birthplace, interests, account email, plan selection, payment, and dashboard handoff.

1. Enter first and last names. The funnel currently offers female or male gender values and twelve optional built-in portraits.
2. Enter birth date as DD / MM / YYYY and birth time as HH : MM. If time is unknown, select the unknown-time option. Omitted time becomes midnight (00:00); this is an approximation, especially for rising sign and houses.
3. Type a birthplace and select a result from the suggestions. Typing text alone does not complete the place selection.
4. Choose one to three areas of interest. These are stored as funnel interests; they do not currently change the app’s reading algorithms.
5. Enter email to create the account. Existing accounts are directed to login rather than signed in automatically.
6. Select a currently available plan and review trial, amount due today, renewal amount and cadence before payment.
7. Complete Stripe payment and any bank authentication. Wait for confirmation, then use the dashboard redirect.

Funnel answers and campaign attribution are recorded incrementally. An earlier unpaid funnel account may be removed when starting over with the same email; this is different from ordinary account closure. If payment is confirmed but access has not appeared, wait briefly and contact support before trying to pay again.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-funnel-v2/src/App.jsx
zodiya-funnel-v2/src/steps/Account.jsx
zodiya-funnel-v2/src/steps/Focus.jsx
zodiya-funnel-v2/src/steps/Pay.jsx
zodiya-backend-v2/src/controllers/FunnelController.ts
-->

## Use your dashboard

The dashboard (`/dashboard`) summarizes the active person’s readings and provides links to the complete pages: natal chart, current influences and coming transits, horoscope, numerology, synastry, tarot and the AI astrologer.

Choose the intended person in the profile menu before interpreting a reading. The dashboard can show a natal summary, life path/personal year and current sky information. Some cards depend on saved birth details or another saved person.

If there are no birth details, create the primary profile first. If synastry has no second person, add another profile. A redirect to plans usually means there is no active or trialing membership when payments are enabled; a login redirect means the session needs renewal.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Dashboard.jsx
zodiya-frontend-v2/src/App.jsx
-->
