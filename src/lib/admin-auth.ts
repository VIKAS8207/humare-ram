import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Admin authentication (server only).
//
// Credentials live in environment variables, never in the code:
//   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET (32+ random characters)
// See .env.example. Without them nobody can sign in.
//
// A successful login sets an httpOnly, SameSite=Strict cookie holding an
// expiry time signed with HMAC-SHA256. The cookie cannot be read by page
// scripts and cannot be forged without ADMIN_SESSION_SECRET.
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "hr_admin";
const SESSION_SECONDS = 60 * 60 * 8; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const config = () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !password || !secret || secret.length < 32) return null;
  return { email, password, secret };
};

export const isConfigured = () => config() !== null;

// Constant-time comparison (hashing first makes both sides the same length)
const sha = (s: string) => createHash("sha256").update(s).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));
const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function checkCredentials(email: string, password: string) {
  const c = config();
  if (!c) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), c.email.toLowerCase());
  const passwordOk = safeEqual(password, c.password);
  return emailOk && passwordOk;
}

export async function startSession() {
  const c = config();
  if (!c) throw new Error("Admin auth is not configured");
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  (await cookies()).set(
    SESSION_COOKIE,
    `${expires}.${sign(expires, c.secret)}`,
    {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  );
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  const c = config();
  if (!c) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(expires, c.secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return false;
  // Reading the clock must happen at request time, never while prerendering
  await connection();
  return Number(expires) > Date.now() / 1000;
}

// ── Brute-force protection: 5 wrong attempts per IP => 15 minute lockout ─────
// In-memory, so it resets when the server restarts and is per server instance.
// Use a shared store (Redis etc.) if you run several instances.

const failures = new Map<string, { count: number; until: number }>();

const clientKey = async () => {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
};

export async function isLockedOut() {
  const rec = failures.get(await clientKey());
  return Boolean(
    rec && rec.count >= MAX_FAILED_ATTEMPTS && rec.until > Date.now(),
  );
}

export async function recordFailure() {
  const key = await clientKey();
  const now = Date.now();
  const rec = failures.get(key);
  const fresh = !rec || rec.until <= now;
  const count = fresh ? 1 : rec.count + 1;
  failures.set(key, { count, until: now + LOCKOUT_MS });
}

export async function clearFailures() {
  failures.delete(await clientKey());
}

/**
 * Name shown as "Processed by" on admin actions. Set ADMIN_NAME in .env.local;
 * otherwise it is built from the ADMIN_EMAIL (before the @), or "Admin".
 * The backend developer should return the real logged-in user's name here.
 */
export function getAdminName(): string {
  const named = process.env.ADMIN_NAME?.trim();
  if (named) return named;
  const email = process.env.ADMIN_EMAIL?.trim();
  if (email) {
    const local = email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim();
    if (local) return local.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Admin";
}
