# View, download and delete palm readings

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
