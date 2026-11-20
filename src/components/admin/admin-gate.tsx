import { Suspense } from "react";
import { ADMIN_AUTH_BYPASS } from "@/config/admin";
import { isAuthenticated, isConfigured, isSignedOut } from "@/lib/admin-auth";
import AdminNav from "./admin-nav";
import LoginForm from "./login-form";

// Wrap the content of EVERY admin page in <AdminGate>. It shows the login page
// when the visitor isn't signed in, otherwise the admin shell (top bar + page).
// While ADMIN_AUTH_BYPASS is on (development) the login is skipped.
// Reads the session cookie, so it renders per request (inside Suspense).

async function Gate({
  children,
  slim,
}: {
  children: React.ReactNode;
  slim: boolean;
}) {
  const bypass = ADMIN_AUTH_BYPASS && !(await isSignedOut());
  if (!bypass && !(await isAuthenticated())) {
    return <LoginForm configured={isConfigured()} />;
  }
  return (
    <div className="bk-page-bg min-h-screen text-bk-ink">
      {!slim && <AdminNav />}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">{children}</main>
    </div>
  );
}

// `slim`: no top bar at all (the Booking page is just the booking flow).
export default function AdminGate({
  children,
  slim = false,
}: {
  children: React.ReactNode;
  slim?: boolean;
}) {
  return (
    <Suspense fallback={<div className="bk-page-bg min-h-screen" />}>
      <Gate slim={slim}>{children}</Gate>
    </Suspense>
  );
}
