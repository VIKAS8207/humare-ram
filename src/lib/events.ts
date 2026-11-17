// Window events shared between components (keeps components independent).
export const LOADER_DONE_EVENT = "loader:done";

// Remembers that the loader already played in this browser tab. Needed because
// Next.js (Cache Components) keeps a visited page alive in the background and
// re-runs its effects when you come back, e.g. /book -> Back to site. The
// loader does not replay then, so anything waiting for LOADER_DONE_EVENT must
// check this instead of waiting forever.
const FLAG = "__hrLoaderDone";

export const markLoaderDone = () => {
  (window as unknown as Record<string, boolean>)[FLAG] = true;
};

export const isLoaderDone = () =>
  typeof window !== "undefined" &&
  (window as unknown as Record<string, boolean>)[FLAG] === true;
