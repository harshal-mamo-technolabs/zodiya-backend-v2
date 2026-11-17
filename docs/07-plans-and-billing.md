# Plans, trials, payments and subscriptions

## Membership plans, pricing and included allowances

### Check the current offer

Open **Plans** (`/subscription`) or **Plan & billing** (`/billing`) for the current offer and account-specific renewal. Prices and allowances are read from the backend database catalog and may differ from the initial seed values below. Do not treat these examples as verified live prices.

### Initial repository catalog (EUR)

- **Starter:** €34.99 every month; 20 astrologer minutes and 20 palm readings per membership billing cycle; 1 included profile.
- **Premium:** €79.99 every 3 months; 60 minutes and 60 palm readings per billing cycle; 1 included profile.
- **Gold:** €149.99 every 6 months; 120 minutes and 120 palm readings per billing cycle; 1 included profile.
- **Starter trial:** €4.99 for 7 days; 7 minutes and 5 palm readings, then Starter renewal unless canceled beforehand. Available once per account when offered.

Longer plan prices are full period charges, not monthly charges. Included minutes/readings reset at each membership renewal, not every calendar month for all plans. All current plans expose the same main app features.

The frontend labels prices in euro with VAT included. Tax configuration and live final amounts were not verified against Stripe. Read the actual checkout before paying. Subscription renewal, pack charges and a trial fee are different purchase types.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/scripts/seedBilling.ts
zodiya-backend-v2/src/services/CatalogService.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-funnel-v2/src/steps/Plans.jsx
-->

## How the paid trial and automatic renewal work

When offered, the initial catalog gives one seven-day Starter trial for €4.99, including seven AI astrologer minutes and five palm readings. This is a paid trial, not a free trial. Current checkout terms control the actual offer.

Only the catalog’s trial-bearing plan can be purchased as a trial, and the backend allows a trial once per account. After the trial, the regular membership is charged automatically using the subscription card unless renewal has been canceled.

Cancel through **Plan & billing → Cancel plan** before the renewal. If a profile pack is renewing, cancel that pack first. Confirm the membership shows an end date/cancellation state; merely closing a dialog or switching off a saved person does not cancel billing.

Changing membership during a trial ends the trial immediately and starts the selected plan’s new billing period. Cancellation prevents future renewal; it does not automatically refund the initial fee. Refund requests need human review.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/BillingService.ts
zodiya-frontend-v2/src/pages/Billing.jsx
zodiya-frontend-v2/src/pages/Checkout.jsx
-->

## Pay securely and resolve payment confirmation problems

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

## Upgrade or downgrade a membership

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

## Cancel renewal or keep your subscription

1. Open **Plan & billing** (`/billing`).
2. Choose **Cancel plan**.
3. If prompted, select **Cancel extra profiles** first. A profile pack cannot keep renewing after the main membership ends.
4. Choose a cancellation reason. “Other” permits a written reason. The “Would you have stayed” choices are optional survey answers, not real discount or annual-plan offers.
5. Select **Cancel renewal** and check the returned end date.

Access continues until the recorded paid/trial period ends. Canceling during the trial stops it becoming the regular paid plan. Canceling renewal is different from refunding a payment or deleting an account.

Before expiry, **Keep my plan** clears the scheduled cancellation. If keeping a pack while the plan is ending, **Keep plan and pack** resumes both. If the subscription is already ended or no longer active/trialing, a new plan purchase may be needed instead.

If payments failed and cancellation controls are unavailable, contact support for manual help; do not assume hidden controls prove that renewal has stopped. AI support cannot claim cancellation is complete without a confirmed billing result.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Billing.jsx
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/src/routes/billingRouter.ts
-->

## Buy, change or cancel an extra-profile pack

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

## Cards, receipts and failed payments

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

## Why plans or purchases may be unavailable

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
