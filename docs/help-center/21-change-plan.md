# Upgrade or downgrade a membership

Open **Plan & billing → Change plan**, choose an available different plan and review the checkout.

The implemented membership switch happens now, starts a new billing period today and applies Stripe proration for the unused part of the old plan. A paid invoice may be required before a pending change applies. Changing during a trial ends the trial immediately.

Used astrologer minutes and palm readings remain counted on a subscription-update invoice; changing back and forth does not refill them. The new plan supplies the allowance against which existing usage is counted.

Switching a plan previously marked to end clears its scheduled cancellation in the backend. Treat a switch as a decision to keep a renewing membership and review the resulting renewal state.

The existing FAQ says changes happen next cycle through support; that differs from the implemented checkout. For this app’s self-service behavior, use the steps above and escalate disputed billing rather than promising a future-dated change.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/BillingService.ts
zodiya-frontend-v2/src/pages/Checkout.jsx
zodiya-frontend-v2/src/pages/legal-content.js
-->
