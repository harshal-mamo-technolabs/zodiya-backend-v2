# Complete the onboarding funnel

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
