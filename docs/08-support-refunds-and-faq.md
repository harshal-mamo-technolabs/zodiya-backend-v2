# Support, refunds and frequently asked questions

> **Existing policy text — review before publishing.** English and German policy/FAQ copies below preserve the current frontend wording. Refund deadlines, account-data retention and some FAQ descriptions conflict with implemented behavior described in these documents. These are archived statements, not newly approved policies. Do not connect conflicting versions to Scout as if they are settled rules.

## Request a refund or billing review

To request a refund, contact **Help & support → Open the chat**, or the address currently stated in the app: **support@astromeridian.net**. Supply the account email, purchase type, date, amount/currency and receipt/transaction reference if available. Do not send full card numbers, CVC/CVV, password or authentication codes.

The app’s existing refund page says a full refund may be requested within thirty days of initial payment for purchases directly through the platform, with exclusions including a fully used paid period, requests after thirty days, fraud or Terms violations. It states approved refunds return to the original payment method within five to ten business days.

The Terms separately refer to fourteen-day withdrawal language, a seven-day technical-issue contact window and no partial refunds for unused periods. These statements are not fully reconciled. A support assistant must not automatically approve/reject requests by selecting one deadline, assert a statutory waiver, or guarantee eligibility. Route conflicting, disputed or account-specific requests to a human.

Cancellation stops future renewal and does not automatically refund past payments. There is no customer refund endpoint or automated refund processor in this backend. The AI must never say a refund was issued unless a real authorized system or human has confirmed it.

The exact existing policies are preserved in the policy archive for owner review; they are not newly drafted legal terms.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/legal-content.js
zodiya-backend-v2/src/routes/billingRouter.ts
zodiya-frontend-v2/src/pages/Support.jsx
-->

## Contact support and troubleshoot common problems

Open **Help & support** (`/support`) and choose **Open the chat**. The Help Scout Beacon is mounted on this page only. The code attempts to identify signed-in users securely; if identification fails, it can continue anonymously. Support access does not require a paid plan.

For help, provide the affected page, action, exact error, approximate time, browser/device and whether it happens after signing in again. For billing include minimal transaction identification. Avoid passwords, codes, full card information and unnecessarily sharing birth details or palm photos.

- **Sent to login:** session refresh failed or authentication is missing; sign in again. Funnel accounts without a known password may need human access recovery.
- **Sent to plans / Choose a plan:** no active/trialing membership when payments are enabled. Check billing/receipt before repurchasing.
- **All profile slots used:** disabled people still count. A larger pack may be needed.
- **No edits left:** profile corrections are lifetime limits. Support review is needed.
- **Birthplace does not save:** choose a suggestion; free text alone is insufficient. Place service failures can require retrying later.
- **Palm photo rejected:** use the selected hand, supported image format, clear even lighting and file-size limit. Rejected analysis should not spend a credit.
- **Palm photo no longer loads:** reopen the saved report for a fresh expiring image link.
- **Globe unavailable:** try a WebGL-capable browser/device.
- **Astrologer cannot hear/speak:** check microphone permission, output volume, voice setting and internet connection; try text/captions.
- **Minutes exhausted:** check plan/top-up balance and pending call settlement.
- **Payment succeeded but still confirming:** wait briefly, reopen billing and ask support before another charge.
- **Chat absent:** script blocking, missing Beacon configuration or network failure can prevent it loading. Use the support address shown in the app if needed.

No support hours, response-time SLA, phone number, refund approval or ability to act on an account is established by this repository.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/Support.jsx
zodiya-frontend-v2/src/helpscout/SupportBeacon.jsx
zodiya-backend-v2/src/routes/helpscoutRouter.ts
zodiya-frontend-v2/src/lib/api.js
-->

## Existing refund text — English

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### ASTROMERIDIAN REFUND POLICY

#### 1. General Policy

We want you to be completely satisfied with your AstroMeridian experience.

If you are not satisfied with your purchase, you may request a refund under the terms outlined below.

#### 2. Eligibility for Refund

You may request a full refund within 30 days from the date of your initial payment.

Refunds are available only for payments made directly through the AstroMeridian platform (https://astromeridian.net).

Refunds are not applicable in the following cases:

- If more than 30 days have passed since your initial payment.
- If the subscription has been fully used for the paid period without cancellation.
- If the user violated our Terms of Use or engaged in fraudulent activity.

#### 3. Refund Procedure

To request a refund, please contact our support team at support@astromeridian.net with your payment details (email, transaction ID, or card reference).

Once approved, the refund will be processed within 5–10 business days to your original payment method.

#### 4. Subscription Cancellations

You can cancel your subscription at any time through your AstroMeridian account settings.

Canceling a subscription prevents future charges but does not automatically trigger a refund for past payments.

#### 5. Additional Information

Comparo Media d.o.o. reserves the right to deny refund requests that do not meet the conditions above.

By purchasing or subscribing to AstroMeridian, you acknowledge and agree to this Refund Policy.

#### Company Information

Comparo Media d.o.o.

Ul. Milutina Barača 7, Rijeka, Croatia

Email: support@astromeridian.net

By using AstroMeridian, you acknowledge that you have read, understood, and agreed to this Refund Policy.

## Existing refund text — German

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### ASTROMERIDIAN RÜCKERSTATTUNGSRICHTLINIE

#### 1. Allgemeines

Wir möchten, dass Sie mit AstroMeridian rundum zufrieden sind.

Wenn Sie mit Ihrem Kauf nicht zufrieden sind, können Sie zu den unten genannten Bedingungen eine Rückerstattung beantragen.

#### 2. Anspruch auf Rückerstattung

Sie können innerhalb von 30 Tagen ab dem Datum Ihrer ersten Zahlung eine volle Rückerstattung beantragen.

Rückerstattungen sind nur für Zahlungen möglich, die direkt über die AstroMeridian-Plattform (https://astromeridian.net) erfolgt sind.

In folgenden Fällen ist keine Rückerstattung möglich:

- Wenn seit Ihrer ersten Zahlung mehr als 30 Tage vergangen sind.
- Wenn das Abonnement für den bezahlten Zeitraum ohne Kündigung vollständig genutzt wurde.
- Wenn der Nutzer gegen unsere Nutzungsbedingungen verstoßen oder betrügerisch gehandelt hat.

#### 3. Ablauf der Rückerstattung

Um eine Rückerstattung zu beantragen, wenden Sie sich bitte mit Ihren Zahlungsdaten (E-Mail, Transaktions-ID oder Kartenreferenz) an unser Support-Team unter support@astromeridian.net.

Nach Genehmigung wird die Rückerstattung innerhalb von 5–10 Werktagen auf Ihre ursprüngliche Zahlungsmethode veranlasst.

#### 4. Kündigung von Abonnements

Sie können Ihr Abonnement jederzeit in Ihren AstroMeridian-Kontoeinstellungen kündigen.

Die Kündigung verhindert künftige Belastungen, löst jedoch nicht automatisch eine Rückerstattung bereits geleisteter Zahlungen aus.

#### 5. Weitere Informationen

Comparo Media d.o.o. behält sich das Recht vor, Rückerstattungsanträge abzulehnen, die die oben genannten Bedingungen nicht erfüllen.

Mit dem Kauf oder Abschluss eines Abonnements bei AstroMeridian erkennen Sie diese Rückerstattungsrichtlinie an und stimmen ihr zu.

#### Unternehmensangaben

Comparo Media d.o.o.

Ul. Milutina Barača 7, Rijeka, Kroatien

E-Mail: support@astromeridian.net

Durch die Nutzung von AstroMeridian bestätigen Sie, dass Sie diese Rückerstattungsrichtlinie gelesen, verstanden und akzeptiert haben.

## Existing faq text — English

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### Frequently Asked Questions (FAQ)

#### What is included in my AstroMeridian subscription?

Depending on your plan, you get access to personalized natal chart reports, daily transit charts, synastry (compatibility) reports, daily tarot readings, and numerology insights. Premium and Gold plans include more comprehensive analyses.

#### How does the 7-day trial work?

The trial gives you full Starter-level access for 7 days. After the trial period, your subscription automatically renews at the standard monthly rate unless you cancel before the trial ends.

#### How do I cancel my subscription?

You can cancel your subscription at any time via the Plans section in your account settings. Upon cancellation, your access will remain active until the end of your current billing period. If you have an active Profile Plan, it will also be canceled and all additional profiles will be removed.

#### How accurate are the horoscope readings?

Our reports are generated using precise astronomical calculations based on your birth date, time, and place. However, all content is for entertainment and informational purposes only and does not constitute professional advice.

#### Is my personal data safe?

Yes. We comply with GDPR, Swiss FADP, and CCPA. Payments are processed securely via Stripe (PCI DSS Level 1). We never store your full card details. See our [Privacy Policy](/privacy) for full details.

#### What payment methods do you accept?

We accept Visa, Mastercard, and American Express credit and debit cards. All transactions are processed through Stripe with 3D Secure authentication for your protection.

#### Can I change my plan after subscribing?

Yes, you can upgrade or downgrade your plan at any time by contacting support@astromeridian.net. Changes take effect at the start of your next billing cycle.

#### What languages are supported?

AstroMeridian is currently available in English and German. We plan to add more languages in the future.

For any additional questions, contact us at support@astromeridian.net.

AstroMeridian Support — we're here to help.

## Existing faq text — German

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### Häufig gestellte Fragen (FAQ)

#### Was ist in meinem AstroMeridian-Abonnement enthalten?

Je nach Tarif erhalten Sie Zugang zu personalisierten Geburtshoroskop-Berichten, täglichen Transitcharts, Synastrie-(Kompatibilitäts-)Berichten, täglichen Tarot-Lesungen und Numerologie-Einblicken. Premium- und Gold-Tarife umfassen umfassendere Analysen.

#### Wie funktioniert die 7-Tage-Testphase?

Die Testphase gewährt Ihnen 7 Tage lang vollen Zugang auf Starter-Niveau. Danach verlängert sich Ihr Abonnement automatisch zum üblichen Monatspreis, sofern Sie nicht vor Ende der Testphase kündigen.

#### Wie kündige ich mein Abonnement?

Sie können Ihr Abonnement jederzeit im Bereich Pläne in Ihren Kontoeinstellungen kündigen. Nach der Kündigung bleibt Ihr Zugang bis zum Ende der laufenden Abrechnungsperiode aktiv. Wenn Sie einen aktiven Profil-Plan haben, wird dieser ebenfalls gekündigt und alle zusätzlichen Profile werden entfernt.

#### Wie genau sind die Horoskop-Deutungen?

Unsere Berichte basieren auf präzisen astronomischen Berechnungen aus Datum, Uhrzeit und Ort Ihrer Geburt. Alle Inhalte dienen jedoch nur der Unterhaltung und Information und stellen keine professionelle Beratung dar.

#### Sind meine personenbezogenen Daten sicher?

Ja. Wir halten uns an DSGVO, schweizerisches FADP und CCPA. Zahlungen werden sicher über Stripe abgewickelt (PCI DSS Level 1). Wir speichern niemals Ihre vollständigen Kartendaten. Weitere Informationen finden Sie in unserer [Datenschutzrichtlinie](/privacy).

#### Welche Zahlungsmethoden akzeptieren Sie?

Wir akzeptieren Visa-, Mastercard- und American-Express-Kredit- und Debitkarten. Alle Transaktionen laufen über Stripe mit 3D-Secure-Authentifizierung zum Schutz Ihrer Daten.

#### Kann ich meinen Tarif nach dem Abschluss ändern?

Ja, Sie können Ihren Tarif jederzeit per E-Mail an support@astromeridian.net upgraden oder downgraden. Änderungen werden zu Beginn Ihres nächsten Abrechnungszyklus wirksam.

#### Welche Sprachen werden unterstützt?

AstroMeridian ist derzeit auf Englisch und Deutsch verfügbar. Weitere Sprachen sind geplant.

Bei weiteren Fragen erreichen Sie uns unter support@astromeridian.net.

AstroMeridian Support — wir helfen gerne.
