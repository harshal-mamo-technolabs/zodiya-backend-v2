# Profiles, birth details and account management

## Enter and correct birth details

Open **Birth details** (`/birth-details`) to create a profile or edit an existing person; your primary birth entry can also be edited in **Account**.

Provide first and last name, birth date, birth time, and city/state/country through the place picker. Birth dates must be real dates from 1900 through today. Times use a 24-hour clock. Select a birthplace suggestion and check the saved details before saving.

The server geocodes the birthplace and resolves the historical timezone and daylight-saving offset for the birth instant. These determine the chart. A cusp Sun sign is computed from the actual solar position rather than a fixed calendar range.

Each primary profile has **three lifetime corrections**; each additional saved person has **one**. A save changing previously populated name or birth fields consumes one correction, even if several fields change together. A no-change save does not. Avatar and relationship changes do not consume corrections. First-time entry of an absent birth name does not consume one; later changes can.

When corrections are exhausted, contact support. The customer interface does not reset the allowance. Disabled profiles must be switched back on before editing. Changes to birth data recalculate the geographical information and subsequent readings. Account display name and profile name are separate fields.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/BirthDetails.jsx
zodiya-frontend-v2/src/pages/Account.jsx
zodiya-backend-v2/src/services/ProfileService.ts
zodiya-backend-v2/src/services/GeoService.ts
zodiya-backend-v2/src/constants/index.ts
-->

## Add, switch and hide saved people

Use the portrait/profile menu to switch the active person or **Add someone**. Pages reload for the selected profile. Additional people can be assigned a built-in portrait and relationship such as partner, spouse, parent, child, sibling, friend or other.

Every seeded membership includes one profile: your own. Extra slots require a monthly profile pack when payments are enabled. Both enabled and switched-off profiles count toward the slot total.

Saved people cannot be deleted through the profile API. Open **Account → Saved people → Switch off** to hide a person from readings and comparisons. Their record and slot remain. Use **Switch on** to restore access to that person. The primary profile cannot be switched off.

Switching a person off also makes their public chart link unavailable while disabled. It does not revoke the token permanently: switching the person on can make the same link work again. To permanently invalidate a shared link, use the chart sharing revocation control.

If all slots are used, open **Plan & billing → Profiles** for a larger pack. Buying a smaller pack is blocked if its capacity is below the total saved people, including disabled people. Switching people off does not free capacity.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/components/NavMenu.jsx
zodiya-frontend-v2/src/pages/Account.jsx
zodiya-backend-v2/src/services/ProfileService.ts
zodiya-backend-v2/src/middlewares/requirePlan.ts
-->

## Manage, export, close and reopen your account

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

## Language, notifications and device preferences

Use the language switch to choose English or German. Reading requests and AI astrologer speech follow the selected language; changing it remounts/reloads app content. Saved palm reports keep the language in which they were created rather than being automatically retranslated.

Astrologer character/settings, active-person selection, language, widget position and globe guidance can be saved in browser storage. They may differ between browsers/devices and may reset if browser data is cleared.

The backend can store notification preferences for daily messages, transits, retrogrades and a 24-hour delivery time. Defaults are daily/transits on, retrogrades off and 07:30. However, the reviewed project does not implement the scheduled notification sender, and the current account page does not expose a complete notifications editor. Do not promise daily email delivery merely because a preference exists.

Animation supports a reduced-motion preference; captions can be enabled and resized for astrologer conversations. Voice can be turned off while captions/text remain useful.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/i18n/index.js
zodiya-frontend-v2/src/pages/ChooseAstrologer.jsx
zodiya-backend-v2/src/models/User.ts
zodiya-backend-v2/src/validators/accountValidator.ts
-->
