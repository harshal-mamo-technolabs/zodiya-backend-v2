# AI astrologers, conversations and minutes

## Choose and talk to your AI astrologer

Open **Choose astrologer** (`/choose-astrologer`) and preview a voice or choose a character. The twelve AI characters are Marco (Aries), Elena (Taurus), Theo (Gemini), Clara (Cancer), Margot (Leo), Dev (Virgo), Priya (Libra), Nico (Scorpio), Rafa (Sagittarius), Helena (Capricorn), Walter (Aquarius), and Marina (Pisces).

The widget follows signed-in reading pages and supports voice or text with captions in English/German. Voice use may need microphone permission. You can change speaking speed, voice playback, subtitles, subtitle size, animation, visibility and widget position. These preferences are saved on the device/browser; changing devices may not carry them over.

The AI receives context for the active profile, including chart/readings, current page, names/signs of other saved profiles, and notes from up to two saved palm readings associated with the active profile. The conversation agent gets the palm report notes, not direct photo vision.

The AI can help open supported reading pages and use registered page actions, such as switching profiles and relevant reading controls. These are application actions, not authorization to perform account billing or refund operations. It is an AI character, not a human professional or the customer-support team.

At least ten available seconds are required to open a paid-mode session. Conversations end at the available session allowance. Usage is settled against the provider’s recorded duration; recently closed conversations may still be processing. Thirty new sessions per fifteen minutes are allowed outside tests. For account/payment issues use **Help & support**, not the reading astrologer.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/components/AstrologerWidget.jsx
zodiya-frontend-v2/src/pages/ChooseAstrologer.jsx
zodiya-backend-v2/src/controllers/AstrologerController.ts
zodiya-backend-v2/src/services/AstrologerUsageService.ts
zodiya-backend-v2/src/constants/astrologers.ts
-->

## AI astrologer minutes and top-ups

**Plan & billing → AI astrologer** shows the remaining plan and top-up time. The UI commonly displays whole minutes while the backend records seconds.

Plan time is used first. It resets at each membership billing renewal; unused included time does not roll into the new allowance. Bought top-up time does not expire in the implemented balance and is used after plan time. An active/trialing membership is still required to start a conversation when payments are enabled.

Initial one-time packs are 10 minutes for €6.99, 30 for €14.99, and 60 for €24.99. Verify current catalog values in checkout. Quantity can be selected up to the catalog maximum (initially twenty packs per purchase).

Conversation usage is determined by the provider’s recorded duration, rounded up to seconds, rather than a flat deduction of a displayed whole minute. While a conversation remains open, elapsed time is held against available time. Closing a tab does not guarantee zero usage; pending sessions are settled later.

If a balance looks wrong after a call, allow processing to finish and reopen billing. If still unresolved, send support the approximate session time, character and observed balance. Do not promise that text mode is free: conversations use the same metered session system.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/AstrologerUsageService.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/scripts/seedBilling.ts
zodiya-frontend-v2/src/pages/Billing.jsx
-->
