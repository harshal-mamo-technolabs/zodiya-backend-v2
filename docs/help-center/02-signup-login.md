# Create an account, sign in and recover access

## Create an account directly

Open `/signup`, enter first name, last name, email and password, and choose **Create account**. Follow the membership and birth-details steps. The first profile created is your primary profile.

The backend requires a password of at least eight characters, while the signup screen says “10+ characters.” Use ten or more characters to meet both descriptions. An email already on an account cannot be registered again.

## Sign in and sign out

Open `/login`, use the account email and password, and select **Log in**. Use **Account → Log out** to leave the account. Expired sessions may refresh automatically; if that fails, sign in again. Too many credential attempts can temporarily block further attempts; wait before retrying.

## Forgotten password

The current **Forgotten password** form is incomplete: its “Link sent” message does not send an email or contact a password-reset API. Do not keep requesting links or tell a customer that a link was delivered. Contact support for access problems. There is no implemented self-service password or email change in the reviewed API.

## Signup through the separate funnel

The onboarding funnel creates an account without asking for a password and transfers the session into the main app using a one-use link. That link expires after two minutes. The funnel-generated password is not known to the customer, and a password-setting/reset flow is not implemented. If the handoff fails or access is lost, ask support for help; do not promise that ordinary password login will work for such an account.

A closed account can reopen when the correct existing password is used. Reopening does not automatically resume a canceled subscription.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/pages/SignIn.jsx
zodiya-backend-v2/src/controllers/AuthController.ts
zodiya-backend-v2/src/controllers/FunnelController.ts
zodiya-backend-v2/src/validators/registerValidator.ts
-->
