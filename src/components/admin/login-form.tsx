"use client";

import { useActionState, useState } from "react";
import { ADMIN_OPEN_SIGN_IN } from "@/config/admin";
import Image from "next/image";
import { IMAGES } from "@/config/images";
import { login, type LoginState } from "@/app/admin/actions";
import { Button, Field, TextInput } from "@/components/ui";

const initial: LoginState = {};

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, initial);
  const [show, setShow] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center paper-page-bg px-6 py-16 text-ink">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <Image
            src={IMAGES.heroLogo.src}
            alt="Humare Ram"
            width={IMAGES.heroLogo.width}
            height={IMAGES.heroLogo.height}
            sizes="160px"
            priority
            className="h-auto w-36 select-none"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin sign in
            </h1>
            <p className="text-sm text-ink-muted">
              {ADMIN_OPEN_SIGN_IN
                ? "Click Sign in to open the admin."
                : "Authorised staff only."}
            </p>
          </div>
        </div>

        <form
          action={action}
          className="flex flex-col gap-5 rounded-2xl border border-line bg-paper-raised p-6"
        >
          {!ADMIN_OPEN_SIGN_IN && (
            <>
              <Field label="Username">
                <TextInput
                  name="email"
                  type="text"
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="Username"
                  disabled={pending}
                />
              </Field>

              <Field label="Password">
                <span className="relative block">
                  <TextInput
                    name="password"
                    type={show ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-16"
                    disabled={pending}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-ink"
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </span>
              </Field>
            </>
          )}

          {state.error && (
            <p role="alert" className="text-sm text-danger-strong">
              {state.error}
            </p>
          )}
          {!ADMIN_OPEN_SIGN_IN && !configured && !state.error && (
            <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs text-gold-pale/80">
              Sign-in isn&apos;t configured on this server yet (missing admin
              environment variables).
            </p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
