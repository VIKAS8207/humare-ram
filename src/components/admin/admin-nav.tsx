"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IMAGES } from "@/config/images";
import { logout } from "@/app/admin/actions";
import { TICKET_ACTIONS } from "./tickets.data";

const pill =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";

// Admin top bar:  logo · Dashboard · Tickets ▾ (Booking, Cancel) ······ Logout
export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const onDashboard = pathname === "/admin";
  const onTickets = pathname.startsWith("/admin/tickets");

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="relative z-20 border-b border-line bg-paper text-ink">
      <nav
        aria-label="Admin"
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-3 px-6 py-3 md:grid md:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/admin"
          aria-label="Admin dashboard"
          className="mr-4 flex items-center gap-3 md:mr-0 md:justify-self-start"
        >
          <Image
            src={IMAGES.heroLogo.src}
            alt="Humare Ram"
            width={IMAGES.heroLogo.width}
            height={IMAGES.heroLogo.height}
            sizes="96px"
            className="h-9 w-auto select-none"
          />
          <span className="rounded-full border border-accent/50 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-accent">
            Admin
          </span>
        </Link>

        {/* Dashboard + Tickets, centred in the bar */}
        <div className="flex items-center gap-2">
          {/* Dashboard: always one click away */}
          <Link
            href="/admin"
            aria-current={onDashboard ? "page" : undefined}
            className={`${pill} ${
              onDashboard
                ? "bg-accent text-accent-ink"
                : "text-ink-muted hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Dashboard
          </Link>

          {/* Tickets dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`${pill} ${
                onTickets || open
                  ? "bg-ink/5 text-ink"
                  : "text-ink-muted hover:bg-ink/5 hover:text-ink"
              }`}
            >
              Tickets
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              >
                <path d="M1.5 3.5L5 7l3.5-3.5" />
              </svg>
            </button>

            {open && (
              <ul
                role="menu"
                aria-label="Tickets"
                className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-paper-raised p-1.5 shadow-2xl shadow-ink/20"
              >
                {TICKET_ACTIONS.map((a, i) => {
                  const active = pathname === `/admin/tickets/${a.slug}`;
                  return (
                    <li key={a.slug} role="none">
                      {/* Cancel Ticket is the destructive one: separate it visually */}
                      {a.slug === "cancel" && i > 0 && (
                        <div className="my-1.5 h-px bg-ink/5" />
                      )}
                      <Link
                        role="menuitem"
                        href={`/admin/tickets/${a.slug}`}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-accent text-accent-ink"
                            : a.slug === "cancel"
                              ? "text-danger-strong hover:bg-danger/10"
                              : "text-ink/80 hover:bg-ink/5 hover:text-ink"
                        }`}
                      >
                        {a.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Logout on the right */}
        <form action={logout} className="ml-auto md:ml-0 md:justify-self-end">
          <button
            type="submit"
            className="rounded-full border border-line px-5 py-2 text-sm font-medium transition-colors hover:border-ink"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
