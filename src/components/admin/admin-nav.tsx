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

// Admin top bar:  logo · Dashboard · Tickets ▾ (Block, Hold, Reserve, Cancel Ticket) ······ Logout
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
    <header className="relative z-20 border-b border-white/10 bg-neutral-950 text-white">
      <nav
        aria-label="Admin"
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-3 px-6 py-3"
      >
        <Link
          href="/admin"
          aria-label="Admin dashboard"
          className="mr-4 flex items-center gap-3"
        >
          <Image
            src={IMAGES.heroLogo.src}
            alt="Humare Ram"
            width={IMAGES.heroLogo.width}
            height={IMAGES.heroLogo.height}
            sizes="96px"
            className="h-9 w-auto select-none"
          />
          <span className="rounded-full border border-orange-400/50 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-orange-300">
            Admin
          </span>
        </Link>

        {/* Dashboard: always one click away */}
        <Link
          href="/admin"
          aria-current={onDashboard ? "page" : undefined}
          className={`${pill} ${
            onDashboard
              ? "bg-orange-400 text-black"
              : "text-white/70 hover:bg-white/10 hover:text-white"
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
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
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
              className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl shadow-black/60"
            >
              {TICKET_ACTIONS.map((a, i) => {
                const active = pathname === `/admin/tickets/${a.slug}`;
                return (
                  <li key={a.slug} role="none">
                    {/* Cancel Ticket is the destructive one: separate it visually */}
                    {a.slug === "cancel" && i > 0 && (
                      <div className="my-1.5 h-px bg-white/10" />
                    )}
                    <Link
                      role="menuitem"
                      href={`/admin/tickets/${a.slug}`}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-orange-400 text-black"
                          : a.slug === "cancel"
                            ? "text-red-300 hover:bg-red-400/10"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
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

        {/* Logout on the right */}
        <form action={logout} className="ml-auto">
          <button
            type="submit"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition-colors hover:border-white/50"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
