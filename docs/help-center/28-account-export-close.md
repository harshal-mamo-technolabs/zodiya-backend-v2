# Manage, export, close and reopen your account

Open **Account** (`/account`) to edit the account first/last name, inspect birth details and saved people, view the plan, sign out, export data or close the account.

**Export data** downloads a JSON file named `astromeridian-export.json` containing the account response, loaded profile list and export time. It is not a complete export of billing history, AI conversations, all palm reports/photos or third-party data. Ask support for a broader privacy access request.

Before **Delete account**, cancel all renewing main/profile subscriptions. The API rejects closure while an entitled main plan or profile pack is still renewing when payments are enabled. A canceled-but-still-active subscription can remain usable until its end date before closure.

The implemented action is **account closure/soft deletion**. It marks the account deleted, revokes refresh/handoff records, blocks authenticated access and clears browser cookies. It keeps account records, charts, saved people, palm readings/photos and billing data. Logging in again with the existing valid password reopens it. It does not resume canceled renewals automatically.

This is not irreversible erasure. For deletion of retained personal data or other privacy rights, contact support. Do not promise that closing the account purges all data or disables existing public chart links. Revoke chart shares first if required.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Account.jsx
zodiya-backend-v2/src/controllers/AuthController.ts
zodiya-backend-v2/src/services/UserService.ts
zodiya-backend-v2/src/services/ProfileService.ts
-->
