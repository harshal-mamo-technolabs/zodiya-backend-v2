# Privacy and personal data

> **Existing policy text — review before publishing.** English and German policy/FAQ copies below preserve the current frontend wording. Refund deadlines, account-data retention and some FAQ descriptions conflict with implemented behavior described in these documents. These are archived statements, not newly approved policies. Do not connect conflicting versions to Scout as if they are settled rules.

## Privacy, personal data and third-party processing

The current in-app Privacy Policy identifies Comparo Media, Ul. Milutina Barača 7, Rijeka, Croatia, and **support@astromeridian.net** as its privacy contact. The application and legal pages use the AstroMeridian name.

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

## Existing privacy text — English

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### ASTROMERIDIAN PRIVACY POLICY

Effective Date: 1.7.2025

At AstroMeridian, operated by Comparo Media (Ul. Milutina Barača 7, Rijeka, Croatia), we are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information in compliance with the EU General Data Protection Regulation (GDPR), the Swiss Federal Act on Data Protection (FADP), the California Consumer Privacy Act (CCPA), and other applicable data protection laws.

#### 1. DATA CONTROLLER

The data controller responsible for processing your personal data is Comparo Media, Ul. Milutina Barača 7, Rijeka, Croatia. For any data protection inquiries, please contact our Data Protection Officer at support@astromeridian.net.

#### 2. DATA WE COLLECT

We collect the following categories of personal data:

- Personal Information: Name, date of birth, place of birth, and email address.
- Account Information: Profile preferences, subscription status, and account settings.
- Usage Data: Information about how you interact with our platform, including pages visited, features used, and session duration.
- Payment Information: Payments are processed securely by Stripe. We do not store, process, or have access to your full credit card number, CVV, or expiration date. Stripe is PCI DSS Level 1 certified. For details, see Stripe's privacy policy at stripe.com/privacy.
- Cookies & Tracking Data: Data collected through cookies, web beacons, and similar technologies for analytics, functionality, and marketing purposes.

#### 3. PURPOSE OF DATA COLLECTION

We process your personal data for the following purposes:

- Service Delivery: To generate and deliver personalized astrology reports, birth charts, and compatibility analyses.
- Account Management: To create, maintain, and secure your user account.
- Payment Processing: To process subscription payments and manage billing through Stripe.
- Customer Support: To respond to your inquiries and resolve issues.
- Marketing & Communication: To send newsletters, promotional offers, and service updates (only with your explicit consent; you may opt out at any time).
- Analytics & Improvement: To analyze usage patterns and improve our Services.

#### 4. LEGAL BASIS FOR PROCESSING (GDPR Art. 6)

We process personal data based on the following legal grounds:

- Consent (Art. 6(1)(a)): When you voluntarily provide data or opt in to marketing communications.
- Contractual Necessity (Art. 6(1)(b)): To fulfill our obligations under your subscription agreement.
- Legal Obligation (Art. 6(1)(c)): To comply with applicable laws, tax requirements, and regulations.
- Legitimate Interests (Art. 6(1)(f)): To improve our services, prevent fraud, and ensure platform security, balanced against your rights and freedoms.

#### 5. DATA STORAGE, RETENTION & SECURITY

Personal data is stored on secure servers with industry-standard encryption (TLS 1.2+) and access controls.

For EU users, data is processed within the European Economic Area (EEA). Where data is transferred outside the EEA, we ensure appropriate safeguards (e.g., Standard Contractual Clauses) are in place.

We retain personal data only as long as necessary for the purposes outlined in this policy or as required by law. Account data is deleted within 30 days of account closure, unless retention is legally required.

#### 6. THIRD-PARTY DATA SHARING

We do not sell, rent, or trade your personal data. We may share data with the following categories of service providers:

- Payment Processor: Stripe, Inc. — for secure credit/debit card payment processing (PCI DSS Level 1 compliant).
- Email Service Providers: For transactional emails and marketing communications (with consent).
- Analytics Services: To understand usage patterns and improve user experience.
- Legal Authorities: When required by law, court order, or to protect our legal rights.

#### 7. YOUR RIGHTS

Depending on your location, you have the following data protection rights:

##### EU/EEA Users (GDPR):

- Right to Access — obtain a copy of your personal data
- Right to Rectification — correct inaccurate data
- Right to Erasure — request deletion of your data
- Right to Restrict Processing — limit how we use your data
- Right to Data Portability — receive your data in a structured format
- Right to Object — object to processing based on legitimate interests
- Right to Withdraw Consent — withdraw consent at any time without affecting prior processing

##### US Users (California - CCPA/CPRA):

- Right to Know — what personal information is collected and how it is used
- Right to Delete — request deletion of personal information
- Right to Opt-Out — of the sale of personal information (we do not sell your data)
- Right to Non-Discrimination — for exercising your privacy rights

To exercise any of these rights, contact us at support@astromeridian.net. We will respond within 30 days (or as required by applicable law).

#### 8. COOKIES & TRACKING TECHNOLOGIES

We use cookies and similar technologies to provide functionality, analyze traffic, and personalize content. You can manage your cookie preferences through your browser settings. Essential cookies required for service functionality cannot be disabled. For detailed information, see our cookie preferences on the platform.

#### 9. INTERNATIONAL DATA TRANSFERS

Your data may be transferred to and processed in countries outside your country of residence. For transfers from the EU/EEA to third countries, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission, or other legally recognized transfer mechanisms, to ensure an adequate level of data protection.

#### 10. CHILDREN'S PRIVACY

AstroMeridian is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If we become aware that we have collected data from a person under 18, we will promptly delete such data and terminate the associated account.

#### 11. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. Material changes will be communicated via email or prominent notice on the platform at least 30 days before taking effect. Continued use of the Services after changes constitutes acceptance of the updated policy.

#### 12. CONTACT INFORMATION & COMPLAINTS

For any privacy-related inquiries or to exercise your rights, contact:

Comparo Media — Data Protection Officer

Ul. Milutina Barača 7, Rijeka, Croatia

Email: support@astromeridian.net

Website: https://astromeridian.net

EU users have the right to lodge a complaint with their local Data Protection Authority (DPA). A list of DPAs is available at https://edpb.europa.eu/about-edpb/about-edpb/members_en.

By using AstroMeridian, you acknowledge that you have read, understood, and agreed to this Privacy Policy.

## Existing privacy text — German

<!-- ARCHIVE: existing frontend text, not newly approved policy. Do not connect to Scout until conflicts in 08-support-refunds-and-faq.md are resolved. Source: zodiya-frontend-v2/src/pages/legal-content.js. Extracted 2026-11-03. -->

### ASTROMERIDIAN DATENSCHUTZRICHTLINIE

Gültig ab: 1.7.2025

Bei AstroMeridian, betrieben von der Comparo Media (Ul. Milutina Barača 7, Rijeka, Kroatien), setzen wir uns zum Schutz Ihrer personenbezogenen Daten ein. Diese Datenschutzrichtlinie erläutert, wie wir Ihre Informationen gemäß der EU-Datenschutz-Grundverordnung (DSGVO), dem Schweizer Bundesgesetz über den Datenschutz (FADP), dem California Consumer Privacy Act (CCPA) und sonstigen anwendbaren Datenschutzgesetzen erheben, nutzen, speichern und schützen.

#### 1. VERANTWORTLICHER FUER DIE DATENVERARBEITUNG

Verantwortlicher für die Verarbeitung Ihrer personenbezogenen Daten ist die Comparo Media, Ul. Milutina Barača 7, Rijeka, Kroatien. Bei Datenschutzanfragen wenden Sie sich bitte an unseren Datenschutzbeauftragten unter support@astromeridian.net.

#### 2. ERHOBENE DATEN

Wir erheben folgende Kategorien personenbezogener Daten:

- Personenbezogene Daten: Name, Geburtsdatum, Geburtsort und E-Mail-Adresse.
- Kontoinformationen: Profileinstellungen, Abonnementstatus und Kontoeinstellungen.
- Nutzungsdaten: Informationen darüber, wie Sie mit unserer Plattform interagieren, einschließlich besuchter Seiten, genutzter Funktionen und Sitzungsdauer.
- Zahlungsdaten: Zahlungen werden sicher über Stripe abgewickelt. Wir speichern, verarbeiten oder haben keinen Zugriff auf Ihre vollständige Kreditkartennummer, CVV oder das Ablaufdatum. Stripe ist PCI DSS Level 1 zertifiziert. Details finden Sie in der Datenschutzerklärung von Stripe unter stripe.com/privacy.
- Cookies und Tracking-Daten: Über Cookies, Web Beacons und ähnliche Technologien erhobene Daten zu Analyse-, Funktions- und Marketingzwecken.

#### 3. ZWECK DER DATENERHEBUNG

Wir verarbeiten Ihre personenbezogenen Daten zu folgenden Zwecken:

- Erbringung der Dienste: Erstellung und Bereitstellung personalisierter Astrologie-Berichte, Geburtshoroskope und Kompatibilitätsanalysen.
- Kontoverwaltung: Erstellung, Pflege und Sicherung Ihres Nutzerkontos.
- Zahlungsabwicklung: Abwicklung von Abonnementzahlungen und Rechnungsstellung über Stripe.
- Kundensupport: Beantwortung Ihrer Anfragen und Behebung von Problemen.
- Marketing und Kommunikation: Versand von Newslettern, Werbeangeboten und Service-Updates (nur mit Ihrer ausdrücklichen Einwilligung; Sie können sich jederzeit abmelden).
- Analyse und Verbesserung: Auswertung von Nutzungsmustern und Verbesserung unserer Dienste.

#### 4. RECHTSGRUNDLAGE DER VERARBEITUNG (DSGVO Art. 6)

Wir verarbeiten personenbezogene Daten auf folgenden Rechtsgrundlagen:

- Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): Wenn Sie Daten freiwillig bereitstellen oder dem Marketing zustimmen.
- Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Zur Erfüllung unserer Pflichten aus Ihrem Abonnementvertrag.
- Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO): Zur Einhaltung geltender Gesetze, steuerlicher Anforderungen und Vorschriften.
- Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO): Zur Verbesserung unserer Dienste, Betrugsprävention und Sicherstellung der Plattformsicherheit, abgewogen gegen Ihre Rechte und Freiheiten.

#### 5. SPEICHERUNG, AUFBEWAHRUNG UND SICHERHEIT

Personenbezogene Daten werden auf sicheren Servern mit branchenüblicher Verschlüsselung (TLS 1.2+) und Zugriffskontrollen gespeichert.

Für EU-Nutzer werden Daten innerhalb des Europäischen Wirtschaftsraums (EWR) verarbeitet. Bei Übermittlungen außerhalb des EWR stellen wir geeignete Garantien (z. B. Standardvertragsklauseln) sicher.

Wir bewahren personenbezogene Daten nur so lange auf, wie es für die in dieser Richtlinie genannten Zwecke oder gesetzlich erforderlich ist. Kontodaten werden innerhalb von 30 Tagen nach Kontoschließung gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.

#### 6. WEITERGABE AN DRITTE

Wir verkaufen, vermieten oder handeln nicht mit Ihren personenbezogenen Daten. Wir können Daten an folgende Kategorien von Dienstleistern weitergeben:

- Zahlungsdienstleister: Stripe, Inc. — zur sicheren Kredit- und Debitkartenzahlung (PCI DSS Level 1 konform).
- E-Mail-Dienstleister: Für transaktionale E-Mails und Marketing-Kommunikation (mit Einwilligung).
- Analyse-Dienste: Zur Erfassung von Nutzungsmustern und Verbesserung der Nutzererfahrung.
- Behörden: Wenn dies gesetzlich vorgeschrieben ist, per Gerichtsbeschluss oder zum Schutz unserer Rechte.

#### 7. IHRE RECHTE

Je nach Standort haben Sie folgende Datenschutzrechte:

##### Nutzer in der EU/dem EWR (DSGVO):

- Auskunftsrecht — Erhalt einer Kopie Ihrer personenbezogenen Daten
- Recht auf Berichtigung — Berichtigung unrichtiger Daten
- Recht auf Löschung — Verlangen der Löschung Ihrer Daten
- Recht auf Einschränkung der Verarbeitung — Einschränkung der Nutzung Ihrer Daten
- Recht auf Datenübertragbarkeit — Erhalt Ihrer Daten in strukturierter Form
- Widerspruchsrecht — Widerspruch gegen Verarbeitung aufgrund berechtigter Interessen
- Widerruf der Einwilligung — jederzeitiger Widerruf ohne Beeinträchtigung der bis dahin rechtmäßigen Verarbeitung

##### Nutzer in den USA (Kalifornien - CCPA/CPRA):

- Recht auf Auskunft — welche personenbezogenen Daten erhoben werden und wie sie genutzt werden
- Recht auf Löschung — Verlangen der Löschung personenbezogener Daten
- Opt-out-Recht — vom Verkauf personenbezogener Daten (wir verkaufen Ihre Daten nicht)
- Recht auf Nicht-Diskriminierung — bei Ausübung Ihrer Datenschutzrechte

Zur Ausübung dieser Rechte kontaktieren Sie uns unter support@astromeridian.net. Wir antworten innerhalb von 30 Tagen (oder wie gesetzlich vorgeschrieben).

#### 8. COOKIES UND TRACKING-TECHNOLOGIEN

Wir verwenden Cookies und ähnliche Technologien für Funktionen, Traffic-Analysen und Personalisierung. Cookie-Einstellungen können Sie in Ihrem Browser verwalten. Wesentliche Cookies für den Betrieb der Dienste können nicht deaktiviert werden. Weitere Informationen finden Sie in den Cookie-Einstellungen auf der Plattform.

#### 9. INTERNATIONALE DATENUEBERMITTLUNGEN

Ihre Daten können in Länder außerhalb Ihres Wohnsitzstaates übermittelt und dort verarbeitet werden. Für Übermittlungen aus der EU/dem EWR in Drittstaaten stützen wir uns auf von der EU-Kommission genehmigte Standardvertragsklauseln (SCC) oder andere rechtlich anerkannte Übermittlungsmechanismen, um ein angemessenes Datenschutzniveau zu gewährleisten.

#### 10. DATENSCHUTZ FUER KINDER

AstroMeridian richtet sich nicht an Personen unter 18 Jahren. Wir erheben wissentlich keine personenbezogenen Daten von Minderjährigen. Wenn uns bekannt wird, dass wir Daten von einer Person unter 18 erhoben haben, löschen wir diese umgehend und beenden das zugehörige Konto.

#### 11. AENDERUNGEN DIESER RICHTLINIE

Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wesentliche Änderungen teilen wir per E-Mail oder durch gut sichtbaren Hinweis auf der Plattform mindestens 30 Tage vor Inkrafttreten mit. Die weitere Nutzung der Dienste nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.

#### 12. KONTAKT UND BESCHWERDEN

Für datenschutzbezogene Anfragen oder zur Ausübung Ihrer Rechte kontaktieren Sie:

Comparo Media — Datenschutzbeauftragter

Ul. Milutina Barača 7, Rijeka, Kroatien

E-Mail: support@astromeridian.net

Website: https://astromeridian.net

EU-Nutzer können Beschwerde bei ihrer zuständigen Datenschutzbehörde einreichen. Eine Liste der Behörden finden Sie unter https://edpb.europa.eu/about-edpb/about-edpb/members_en.

Durch die Nutzung von AstroMeridian bestätigen Sie, dass Sie diese Datenschutzrichtlinie gelesen, verstanden und akzeptiert haben.
