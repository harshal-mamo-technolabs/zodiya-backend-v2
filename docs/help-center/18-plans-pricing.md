# Membership plans, pricing and included allowances

## Check the current offer

Open **Plans** (`/subscription`) or **Plan & billing** (`/billing`) for the current offer and account-specific renewal. Prices and allowances are read from the backend database catalog and may differ from the initial seed values below. Do not treat these examples as verified live prices.

## Initial repository catalog (EUR)

- **Starter:** €14.99 every month; 20 astrologer minutes and 3 palm readings per membership billing cycle; 1 included profile.
- **Premium:** €34.99 every 3 months; 60 minutes and 10 palm readings per billing cycle; 1 included profile.
- **Gold:** €59.99 every 6 months; 120 minutes and 25 palm readings per billing cycle; 1 included profile.
- **Starter trial:** €2.99 for 7 days; 5 minutes and 1 palm reading, then Starter renewal unless canceled beforehand. Available once per account when offered.

Longer plan prices are full period charges, not monthly charges. Included minutes/readings reset at each membership renewal, not every calendar month for all plans. All current plans expose the same main app features.

The frontend labels prices in euro with VAT included. Tax configuration and live final amounts were not verified against Stripe. Read the actual checkout before paying. Subscription renewal, pack charges and a trial fee are different purchase types.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/scripts/seedBilling.ts
zodiya-backend-v2/src/services/CatalogService.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-funnel-v2/src/steps/Plans.jsx
-->
