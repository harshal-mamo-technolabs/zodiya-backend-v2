# Pay securely and resolve payment confirmation problems

All app purchases use the checkout page and Stripe card payment forms. Supported payment methods in the implementation are cards; do not promise PayPal, bank transfers or wallet support. The existing legal copy names Visa, Mastercard and American Express, subject to actual Stripe availability.

Review the purchase type, amount due now and any recurring cadence. Complete bank/3-D Secure authentication when requested. Saving a replacement card uses a setup flow and does not itself charge a purchase amount; it does not automatically pay an already failed invoice.

The app asks the backend to synchronize with Stripe after confirmation. If payment succeeded but access or credits are still being confirmed, wait briefly, reopen billing and contact support if unresolved. Do not repeat payment immediately. A bank authorization or a “processing” state alone does not prove that membership access is active.

An abandoned checkout can leave an incomplete subscription. Returning to checkout may replace the incomplete subscription. Support should inspect the actual payment and subscription records before describing charges as duplicates.

Never send full card numbers, CVC/CVV, passwords, secret keys or authentication codes in support chat. Use the account email, purchase type, approximate date, amount/currency, receipt or transaction reference to identify the problem.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Checkout.jsx
zodiya-funnel-v2/src/steps/Pay.jsx
zodiya-backend-v2/src/services/BillingService.ts
-->
