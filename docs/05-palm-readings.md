# Palm photos, reports and reading credits

## Take or upload a palm photo

Open **Palm reading** (`/palm-reading`). Select a saved profile or **Someone else** with a name; optional gender and age can be supplied for someone else. Choose left/right hand and the dominant hand.

Take a photo using the camera, or upload from the gallery. The camera requires browser permission; if unavailable or declined, upload a photo instead. Hold the correct palm flat facing the camera, fingers slightly apart, in bright even light, with the whole palm visible.

Accepted uploads are JPEG, PNG or WEBP, one photo at a time, up to 10 MiB (shown as 10 MB). Renaming another format does not convert it. Convert HEIC or other unsupported formats first.

The service checks for a clear palm. A dark, blurry or unsuitable image may be rejected. The server restores the reserved palm credit when no reading is delivered. Outside tests the service limits new reading requests to ten per hour per account.

Each person’s hand can have one saved reading at a time. Open the existing reading, choose the other hand, or delete the saved reading before reading that same hand again. A new delivered reading spends a new credit. Deleting an old reading does not restore its spent credit.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/PalmReading.jsx
zodiya-backend-v2/src/routes/palmRouter.ts
zodiya-backend-v2/src/controllers/PalmController.ts
zodiya-backend-v2/src/services/PalmReportService.ts
-->

## View, download and delete palm readings

The report describes hand shape/element, heart/head/life/fate lines, mounts, a summary and advice. A visibility percentage describes how defined a line looks in the image; it is not a probability that a prediction is true. Invisible lines should not be treated as measured facts.

Use **Draw the lines** to request an AI illustration over the photo. It may not follow every crease exactly. The generated image is saved and reused when available. Drawing has a separate ten-request-per-hour limit. A failed illustration does not necessarily mean the written report failed.

Saved reports and photo views appear in **Your readings**, newest first. Use **Load more** for older entries. **Download report (PDF)** downloads a backend-generated PDF; the PDF endpoint is limited to thirty requests per hour. A photo retrieval failure can produce a PDF without that photo.

Use **Delete reading** and confirm only when you want the saved report and its original/highlighted images removed. This is not reversible through the app. It allows the same hand to be read again but does not refund a used credit.

If the written reading is delivered but storage fails, the response can say it was not saved. The reading still consumes a credit and may not appear in history; contact support rather than assuming it is recoverable. Photo links expire; reopen the saved reading to request fresh links.

Palmistry is for reflection, not diagnosis. It cannot establish medical conditions, life expectancy or certain future events.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/controllers/PalmController.ts
zodiya-backend-v2/src/services/PalmImageService.ts
zodiya-backend-v2/src/services/StorageService.ts
zodiya-frontend-v2/src/pages/PalmReading.jsx
-->

## Palm reading allowances and one-time packs

**Plan & billing → Palm readings** shows plan readings and bought credits. A new delivered report spends one credit. Plan credits are spent first and reset at each membership renewal. Bought readings never expire in the implemented balance and are used after plan credits; membership is still required for palm routes when payments are enabled.

Initial one-time packs are 3 readings for €4.99, 7 for €9.99, and 10 for €12.99. Current catalog values may differ. Quantity limits come from the catalog.

A credit is reserved before AI analysis. If the photo is rejected or a failure occurs before delivery, the backend attempts to restore it. A delivered report that cannot be saved still spends the credit. Deleting a delivered saved report does not restore it. Opening an existing report is not a new reading, and drawing its highlighted lines is a separate request rather than a second palm-credit reservation.

If you receive “all palm readings used,” review the balance and buy a pack if offered. For a missing credit following a failed request, ask support to investigate rather than claiming a cash refund or credit restoration has already occurred.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/controllers/PalmController.ts
zodiya-backend-v2/src/services/BillingService.ts
zodiya-backend-v2/scripts/seedBilling.ts
-->
