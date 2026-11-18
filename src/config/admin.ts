// ─────────────────────────────────────────────────────────────────────────────
// Admin sign-in switch.
//
// While building, /admin opens straight to the dashboard (no login).
// In production builds the login is ALWAYS required, so the admin can never be
// left open by accident.
//
// For the backend developer: the login page, the server actions and the
// session/cookie code are all still in place and ready —
//   src/components/admin/login-form.tsx   the login form
//   src/app/admin/actions.ts              login / logout
//   src/lib/admin-auth.ts                 session cookie + credential check
// Swap `checkCredentials` in admin-auth.ts for a real user lookup, then set
// ADMIN_AUTH_BYPASS to `false` to turn the login on in development too.
// ─────────────────────────────────────────────────────────────────────────────
export const ADMIN_AUTH_BYPASS = process.env.NODE_ENV !== "production";
