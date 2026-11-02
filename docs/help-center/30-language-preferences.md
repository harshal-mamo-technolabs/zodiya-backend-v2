# Language, notifications and device preferences

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
