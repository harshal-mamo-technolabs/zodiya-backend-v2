# Why plans or purchases may be unavailable

Some deployments run with payments disabled. In that mode signed-in users can use the main app without a membership, profile-slot billing checks are bypassed, and purchases are refused. Plan, checkout and billing pages redirect to the dashboard.

Astrologer calls are not deducted from a balance in this mode, but each conversation has a one-hour session limit. Palm credits are not charged, although upload checks, provider availability, saved-hand rules and request rate limits still apply. Lifetime profile-edit rules are not removed by the payment switch.

This is deployment behavior, not a promise that the public service is permanently free. The setting is not a customer preference, and turning it off does not itself cancel existing Stripe subscriptions. Contact support if the visible offer or billing behavior is unclear.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/config/index.ts
zodiya-backend-v2/src/middlewares/requirePlan.ts
zodiya-backend-v2/src/services/AstrologerUsageService.ts
zodiya-frontend-v2/src/App.jsx
-->
