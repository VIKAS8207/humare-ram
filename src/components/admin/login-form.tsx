"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/config/images";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, initial);
  const [show, setShow] = useState(false);

  const input =
    "w-full rounded-xl border border-bk-line bg-bk-surface px-4 py-3 text-base text-bk-ink outline-none transition-colors placeholder:text-bk-muted/60 focus:border-bk-accent";

  return (
    <main className="grid min-h-screen place-items-center bk-page-bg px-6 py-16 text-bk-ink">
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
            <p className="text-sm text-bk-muted">Authorised staff only.</p>
          </div>
        </div>

        <form
          action={action}
          className="flex flex-col gap-5 rounded-2xl border border-bk-line bg-bk-surface p-6"
        >
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-bk-muted">Username</span>
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              autoFocus
              placeholder="Username"
              className={input}
              disabled={pending}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-bk-muted">Password</span>
            <span className="relative block">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${input} pr-16`}
                disabled={pending}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.15em] text-bk-muted transition-colors hover:text-bk-ink"
              >
                {show ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {state.error && (
            <p role="alert" className="text-sm text-red-700">
              {state.error}
            </p>
          )}
          {!configured && !state.error && (
            <p className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-100/80">
              Sign-in isn&apos;t configured on this server yet (missing admin
              environment variables).
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-bk-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
