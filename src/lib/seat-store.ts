"use client";

import { useSyncExternalStore } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Admin seat records: Block, Hold and Reserve.
//
//   block    payment received (offline) - seats sold to a named person
//   hold     payment NOT received yet   - seats parked until the money arrives,
//                                         then moved to "block" from the dashboard
//   reserve  no payment needed          - seats kept back for VVIPs
//
// !! TEMPORARY STORAGE: records live in this browser's localStorage, so they
// only exist on this computer and are NOT shared with other admins or with the
// public site visitors. The backend developer replaces `readAll` / `writeAll`
// (and the add/update/remove helpers) with real API calls. The shape of
// SeatRecord is what the API should store.
// ─────────────────────────────────────────────────────────────────────────────

export type SeatRecordType = "block" | "hold" | "reserve";

export type SeatRecord = {
  id: string;
  type: SeatRecordType;
  venueId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  seats: string[];
  person: { name: string; phone: string; email?: string; note?: string };
  /** INR value of the seats (received for block, still due for hold, 0 for reserve) */
  amount: number;
  /** How the money was received (block only) */
  paymentMode?: string;
  /** Logged-in admin who created / last changed it */
  adminName: string;
  createdAt: number; // ms since epoch
  /** Set when a hold was converted into a block */
  convertedAt?: number;
};

const KEY = "hr:seat-records";
const EMPTY: SeatRecord[] = [];

let cache: SeatRecord[] | null = null;
const listeners = new Set<() => void>();

function readAll(): SeatRecord[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SeatRecord[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeAll(records: SeatRecord[]) {
  cache = records;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* storage full or blocked: keep the in-memory copy */
  }
  listeners.forEach((l) => l());
}

const getSnapshot = () => (cache ??= readAll());
const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the records
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Live list of all records (newest first). Empty on the server. */
export function useSeatRecords(): SeatRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addSeatRecord(
  input: Omit<SeatRecord, "id" | "createdAt">,
): SeatRecord {
  const record: SeatRecord = {
    ...input,
    id: `${input.type.slice(0, 1).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    createdAt: Date.now(),
  };
  writeAll([record, ...getSnapshot()]);
  return record;
}

export function updateSeatRecord(id: string, patch: Partial<SeatRecord>) {
  writeAll(getSnapshot().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

export function removeSeatRecord(id: string) {
  writeAll(getSnapshot().filter((r) => r.id !== id));
}

/** Seats of one show that are taken by any record (block, hold or reserve). */
export function takenSeatsForShow(
  records: SeatRecord[],
  venueId: string | null,
  date: string | null,
  time: string | null,
): Set<string> {
  const set = new Set<string>();
  if (!venueId || !date || !time) return set;
  for (const r of records) {
    if (r.venueId === venueId && r.date === date && r.time === time) {
      r.seats.forEach((s) => set.add(s));
    }
  }
  return set;
}
