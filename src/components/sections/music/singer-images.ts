import "server-only";
import { cacheLife } from "next/cache";
import { readdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "images", "singers");
const EXT = /\.(png|jpe?g|webp|avif)$/i;

// slug -> public URL for every photo present in public/images/singers/
export async function getSingerImages(): Promise<Record<string, string>> {
  "use cache";
  cacheLife("minutes");
  try {
    const files = await readdir(DIR);
    return Object.fromEntries(
      files
        .filter((f) => EXT.test(f))
        .map((f) => [f.replace(EXT, "").toLowerCase(), `/images/singers/${encodeURIComponent(f)}`]),
    );
  } catch {
    return {};
  }
}
