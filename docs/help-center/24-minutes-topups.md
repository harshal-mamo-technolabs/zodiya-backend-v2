# AI astrologer minutes and top-ups

**Plan & billing → AI astrologer** shows the remaining plan and top-up time. The UI commonly displays whole minutes while the backend records seconds.

Plan time is used first. It resets at each membership billing renewal; unused included time does not roll into the new allowance. Bought top-up time does not expire in the implemented balance and is used after plan time. An active/trialing membership is still required to start a conversation when payments are enabled.

Initial one-time packs are 10 minutes for €4.99, 30 for €11.99, and 60 for €19.99. Verify current catalog values in checkout. Quantity can be selected up to the catalog maximum (initially twenty packs per purchase).

Conversation usage is determined by the provider’s recorded duration, rounded up to seconds, rather than a flat deduction of a displayed whole minute. While a conversation remains open, elapsed time is held against available time. Closing a tab does not guarantee zero usage; pending sessions are settled later.

If a balance looks wrong after a call, allow processing to finish and reopen billing. If still unresolved, send support the approximate session time, character and observed balance. Do not promise that text mode is free: conversations use the same metered session system.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/AstrologerUsageService.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/scripts/seedBilling.ts
zodiya-frontend-v2/src/pages/Billing.jsx
-->
