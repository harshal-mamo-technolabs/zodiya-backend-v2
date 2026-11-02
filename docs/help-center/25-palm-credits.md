# Palm reading allowances and one-time packs

**Plan & billing → Palm readings** shows plan readings and bought credits. A new delivered report spends one credit. Plan credits are spent first and reset at each membership renewal. Bought readings never expire in the implemented balance and are used after plan credits; membership is still required for palm routes when payments are enabled.

Initial one-time packs are 3 readings for €4.99, 7 for €9.99, and 10 for €12.99. Current catalog values may differ. Quantity limits come from the catalog.

A credit is reserved before AI analysis. If the photo is rejected or a failure occurs before delivery, the backend attempts to restore it. A delivered report that cannot be saved still spends the credit. Deleting a delivered saved report does not restore it. Opening an existing report is not a new reading, and drawing its highlighted lines is a separate request rather than a second palm-credit reservation.

If you receive “all palm readings used,” review the balance and buy a pack if offered. For a missing credit following a failed request, ask support to investigate rather than claiming a cash refund or credit restoration has already occurred.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/controllers/PalmController.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/scripts/seedBilling.ts
-->
