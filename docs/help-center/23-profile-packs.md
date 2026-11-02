# Buy, change or cancel an extra-profile pack

Profile packs are separate monthly recurring subscriptions. They add capacity for saved people beyond the profile included in membership. One pack can be held at a time.

Initial seed prices are €2.99/month for 1 extra profile, €6.99/month for 3 extra profiles, or €11.99/month for 6 extra profiles. Verify the actual current offer in **Plan & billing → Profiles**.

Choose a pack or select **Upgrade/Downgrade**, review checkout and complete any payment. A pack switch charges or credits the prorated difference and retains the pack billing date. A smaller pack must cover every saved profile, including switched-off people; hiding people does not free their slots.

A pack cannot be bought or resumed while the main plan is scheduled to end; keep the main plan first. Canceling only the profile pack leaves the main membership running. You retain its slots until the pack’s recorded period end. Main plan termination can also terminate the pack server-side.

Saved people are retained, not deleted, when a pack ends. The implementation does not establish a per-profile read cutoff for existing enabled profiles merely because capacity later drops. Do not promise deletion or exact post-expiry per-person access rules beyond the app’s actual behavior.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/scripts/seedBilling.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-frontend-v2/src/pages/Billing.jsx
zodiya-backend-v2/src/services/ProfileService.ts
-->
