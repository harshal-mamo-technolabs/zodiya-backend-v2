# Draw and interpret tarot cards

Open **Tarot** (`/tarot`), choose a single-card, three-card or yes/no spread, and turn the cards to reveal them. **Shuffle a new spread** draws again.

The server draws distinct cards within a spread using a cryptographic random generator. Cards may be upright or reversed, with different authored interpretations for each orientation and spread position. A yes/no spread maps its drawn orientation to the supplied verdict wording; it is not evidence about a future outcome.

There is no one-draw-per-day restriction or saved tarot-history endpoint in the reviewed service. Do not promise that an old draw can be recovered after it is replaced or the page is reloaded. The text is supplied in English or German and is intended for reflection.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Tarot.jsx
zodiya-backend-v2/src/services/TarotService.ts
zodiya-backend-v2/src/routes/tarotRouter.ts
-->
