"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearFailures,
  endSession,
  isConfigured,
  isLockedOut,
  recordFailure,
  startSession,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isConfigured()) {
    return { error: "Admin sign-in is not set up on this server yet." };
  }
  if (await isLockedOut()) {
    return {
      error: "Too many failed attempts. Please try again in 15 minutes.",
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await new Promise((r) => setTimeout(r, 400)); // slows down guessing

  if (!checkCredentials(email, password)) {
    await recordFailure();
    // Same message whichever field was wrong
    return { error: "Incorrect email or password." };
  }

  await clearFailures();
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}
