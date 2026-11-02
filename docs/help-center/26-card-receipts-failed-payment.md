# Cards, receipts and failed payments

Open **Plan & billing → Payment method** to see a saved card’s brand, last four digits and expiry. Select **Add card/Replace** and complete the secure form. The server accepts only a successful setup intent belonging to the account before changing the default card.

Use **Receipts → Receipt** to open Stripe’s receipt for an available payment. The app shows amount, date, description and refunded status where supplied by Stripe. It does not implement a separate customer invoice-email sender.

If membership or profile-pack renewal failed, use the corresponding **Pay now** link to settle that open invoice. Replacing a card and paying the outstanding invoice are separate actions. After successful confirmation, allow synchronization to finish.

Only `active` and `trialing` subscription states grant membership access. `past_due`, `unpaid`, incomplete, expired or canceled states do not. A plan can still be active while marked to cancel at period end. Support, account access, billing status and receipts have separate access rules so users can resolve problems without an active plan.

For unrecognized or duplicate charges, provide minimal transaction identification and request human review. Do not label a charge fraudulent, guarantee a refund, or request full card/security details.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/src/routes/billingRouter.ts
zodiya-backend-v2/src/constants/index.ts
zodiya-frontend-v2/src/pages/Billing.jsx
-->
