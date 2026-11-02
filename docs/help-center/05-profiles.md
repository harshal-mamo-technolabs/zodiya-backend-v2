# Add, switch and hide saved people

Use the portrait/profile menu to switch the active person or **Add someone**. Pages reload for the selected profile. Additional people can be assigned a built-in portrait and relationship such as partner, spouse, parent, child, sibling, friend or other.

Every seeded membership includes one profile: your own. Extra slots require a monthly profile pack when payments are enabled. Both enabled and switched-off profiles count toward the slot total.

Saved people cannot be deleted through the profile API. Open **Account → Saved people → Switch off** to hide a person from readings and comparisons. Their record and slot remain. Use **Switch on** to restore access to that person. The primary profile cannot be switched off.

Switching a person off also makes their public chart link unavailable while disabled. It does not revoke the token permanently: switching the person on can make the same link work again. To permanently invalidate a shared link, use the chart sharing revocation control.

If all slots are used, open **Plan & billing → Profiles** for a larger pack. Buying a smaller pack is blocked if its capacity is below the total saved people, including disabled people. Switching people off does not free capacity.

<!-- Maintainer evidence; remove this block when copying into a customer article.
Reviewed: 2026-11-03. Local source behavior, not a live-production guarantee.
zodiya-frontend-v2/src/components/NavMenu.jsx
zodiya-frontend-v2/src/pages/Account.jsx
zodiya-backend-v2/src/services/ProfileService.ts
zodiya-backend-v2/src/middlewares/requirePlan.ts
-->
