# Take or upload a palm photo

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
