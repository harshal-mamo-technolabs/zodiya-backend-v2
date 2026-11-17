# Numerology, tarot and astrocartography

## Understand your numerology reading

Open **Numerology** (`/numerology`). It uses the active profile’s birth date and full birth name; enter the birth name if it is not yet saved.

The Pythagorean calculation displays its working and five core numbers: Life Path, Birth, Destiny, Soul Urge and Personality. It also derives personal year, life chapters/pinnacles and challenges, karmic lessons and hidden passion, with interpretive material such as lucky numbers and favourable days.

Letters A–I map to 1–9 and the sequence repeats. Accents are folded; supported variants such as ß become their ordinary Latin spellings. Spaces and punctuation do not contribute. A name must contain at least one A–Z letter. Y counts as a consonant. Core reductions preserve master numbers 11, 22 and 33; personal year reduces to a single digit.

Filling a previously absent birth name does not use a profile correction; changing an existing birth name can. This explains why different spellings or numerology conventions can produce different results. Numbers are reflective interpretations, not measured personal abilities.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Numerology.jsx
zodiya-backend-v2/src/services/NumerologyService.ts
zodiya-backend-v2/src/services/NumerologyReadingService.ts
zodiya-backend-v2/src/services/ProfileService.ts
-->

## Draw and interpret tarot cards

Open **Tarot** (`/tarot`), choose a single-card, three-card or yes/no spread, and turn the cards to reveal them. **Shuffle a new spread** draws again.

The server draws distinct cards within a spread using a cryptographic random generator. Cards may be upright or reversed, with different authored interpretations for each orientation and spread position. A yes/no spread maps its drawn orientation to the supplied verdict wording; it is not evidence about a future outcome.

There is no one-draw-per-day restriction or saved tarot-history endpoint in the reviewed service. Do not promise that an old draw can be recovered after it is replaced or the page is reloaded. The text is supplied in English or German and is intended for reflection.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Tarot.jsx
zodiya-backend-v2/src/services/TarotService.ts
zodiya-backend-v2/src/routes/tarotRouter.ts
-->

## Explore astrocartography and destinations

Open **Astrocartography** (`/astrocartography`). Drag the globe to rotate, scroll/pinch or use +/− to zoom, and tap a place or search for a destination. Use **Back to birthplace** to return.

Lines represent where planets were rising (AC), setting (DC), overhead/culminating (MC), or underfoot/nadir (IC) at birth. The page uses the active natal chart, not a live GPS location. Planet filters hide/show lines. “Best places” relates selected themes to a fixed list of major cities, rather than searching every place worldwide.

Readings use an 800 km nearby-line range and weaken with distance. “Open sky” means no included line is within that range; it does not mean a destination is unsafe or unsuitable. The outer planets start hidden in the globe but can still matter in the backend astrologer context.

The interactive globe requires WebGL. If it is unavailable, try a browser/device with WebGL and working graphics support. Astrology does not establish travel safety, visa eligibility, employment prospects or guaranteed life outcomes.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Astrocartography.jsx
zodiya-frontend-v2/src/lib/astromap.js
zodiya-frontend-v2/src/lib/globe.js
zodiya-backend-v2/src/services/AstrocartographyService.ts
-->
