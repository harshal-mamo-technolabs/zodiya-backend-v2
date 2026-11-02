# Explore your personal transits

Open **Transits** (`/transits`) with the intended active profile. The timeline compares current planetary positions with that person’s natal planets and angles.

The implemented window is fourteen days: four days before today and nine days after today. “Today” follows the saved profile timezone. Drag/scrub the timeline or tap a marker; use **Back to today** to reset. Select an event to see transiting body, aspect, natal point, exact date, active span and interpretation.

The interface ranks influences by significance and distinguishes flowing and hard aspects, faster inner planets, slower outer planets and lunations. An event can be outside the selected day’s orb while still appearing in the wider timeline. An exact date outside the visible portion may still be used in event details.

Check the active person and birth time if transits seem wrong. Interpretations are authored text assembled from computed events, and are not guaranteed predictions.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Transits.jsx
zodiya-backend-v2/src/services/TransitService.ts
zodiya-backend-v2/src/services/TransitReadingService.ts
-->
