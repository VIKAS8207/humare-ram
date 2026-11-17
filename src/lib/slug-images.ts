import "server-only";
import { cacheLife } from "next/cache";
import { readdir } from "node:fs/promises";
import path from "node:path";

const EXT = /\.(png|jpe?g|webp|avif)$/i;

// slug -> public URL for every photo in public/images/<folder>/
// (file name without extension, lower-case, is the slug)
export async function getSlugImages(
  folder: string,
): Promise<Record<string, string>> {
  "use cache";
  cacheLife("minutes");
  try {
    const files = await readdir(
      path.join(process.cwd(), "public", "images", folder),
    );
    return Object.fromEntries(
      files
        .filter((f) => EXT.test(f))
        .map((f) => [
          f.replace(EXT, "").toLowerCase(),
          `/images/${folder}/${encodeURIComponent(f)}`,
        ]),
    );
  } catch {
    return {};
  }
}
