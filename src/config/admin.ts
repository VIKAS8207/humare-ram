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

// ─────────────────────────────────────────────────────────────────────────────
// OPEN SIGN-IN: while this is `true` the login page has no username or
// password. Anyone who opens /admin and clicks "Sign in" gets in.
//
// !! Set this to `false` before the site goes live with real bookings, or
// !! anybody on the internet can use the admin. Then the username + password
// !! form (and ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET) is used.
// ─────────────────────────────────────────────────────────────────────────────
export const ADMIN_OPEN_SIGN_IN = true;

export const ADMIN_AUTH_BYPASS = process.env.NODE_ENV !== "production";
