# Privacy, personal data and third-party processing

The current in-app Privacy Policy identifies Comparo Media, Ul. Milutina Barača 7, Rijeka, Croatia, and **support@astromeridian.net** as its privacy contact. The product/legal branding currently says AstroMeridian. Owner confirmation is needed before renaming these details for Zodiya.

The implementation stores account identity, hashed password, profile birth data and derived locations/timezones, settings, billing references and balances, funnel answers/campaign attribution, palm reports/photo keys and AI conversation usage records. Browser storage also retains device preferences and active-profile/funnel state.

Third-party flows visible in code include Stripe for payments; Google Maps/Places for place search/geocoding; ElevenLabs for AI conversations/voice; OpenAI for palm photo analysis and illustrated line overlays; Amazon S3 for original/highlighted palm images; Help Scout for support identity/chat; and Klaviyo for account, funnel, purchase, cancellation and usage-related profile/events when configured.

The AI astrologer can receive birth-chart context, other saved profile names/signs and recent palm-report notes. Palm images are sent for AI processing. Support identity includes name, email and campaign properties when secure identification succeeds. Do not describe these data flows as “birth details are only used to calculate a chart.”

The policy describes privacy rights and a thirty-day account-data deletion statement. Actual account closure retains data and restores accounts on login. Data residency, third-party retention, contracts, consent records and legal compliance cannot be certified from source alone. Ask support for access, correction, erasure, portability, consent or processing objections; do not promise legal outcomes or complete deletion deadlines from the implementation.

S3 objects are uploaded with server-side AES256 encryption and served through one-hour signed URLs. Actual bucket access controls must be verified separately; a signed URL alone does not prove a bucket is private.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/legal-content.js
zodiya-backend-v2/src/models/User.ts
zodiya-backend-v2/src/services/KlaviyoService.ts
zodiya-backend-v2/src/services/StorageService.ts
zodiya-backend-v2/src/controllers/AstrologerController.ts
zodiya-frontend-v2/src/helpscout/SupportBeacon.jsx
-->
