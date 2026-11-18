import { Suspense } from "react";
import { ADMIN_AUTH_BYPASS } from "@/config/admin";
import { isAuthenticated, isConfigured } from "@/lib/admin-auth";
import AdminNav from "./admin-nav";
import LoginForm from "./login-form";

// Wrap the content of EVERY admin page in <AdminGate>. It shows the login page
// when the visitor isn't signed in, otherwise the admin shell (top bar + page).
// While ADMIN_AUTH_BYPASS is on (development) the login is skipped.
// Reads the session cookie, so it renders per request (inside Suspense).

async function Gate({ children }: { children: React.ReactNode }) {
  if (!ADMIN_AUTH_BYPASS && !(await isAuthenticated())) {
    return <LoginForm configured={isConfigured()} />;
  }
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">{children}</main>
    </div>
  );
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
