# Share a chart and revoke access

On **Natal chart**, choose **Share this chart** and copy the link. A chart share works without login. Anyone who receives the link can view the shared chart and reading.

The response includes the person’s name, birth date, birth time, city and country. It removes exact coordinate/offset/Julian-day metadata, but the birth information is still personal information. Share only with intended recipients.

The same link is reused while sharing remains enabled. Turn sharing off to revoke the token; the old link then stops working. Creating a new share after revocation produces a new token. Switching a profile off temporarily blocks its link, but that is not permanent revocation.

A deleted/closed account retains its profiles. Account closure does not clear profile share tokens in the reviewed code. If you want a link disabled, revoke it before account closure or ask support for help. Revoking access does not retrieve copies already saved by recipients.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-backend-v2/src/services/ProfileService.ts
zodiya-backend-v2/src/services/UserService.ts
zodiya-backend-v2/src/routes/shareRouter.ts
zodiya-frontend-v2/src/pages/NatalChart.jsx
-->
