# Enter and correct birth details

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
