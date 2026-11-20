import "server-only";
import { cacheLife } from "next/cache";
import { readdir } from "node:fs/promises";
import path from "node:path";

const EXT = /\.(png|jpe?g|webp|avif)$/i;

// A few photo files are named slightly differently from the person's slug.
// slug -> the file name (without extension, lower-case) to use for it.
const ALIASES: Record<string, string> = {
  "shankar-mahadevan": "shankar-mahadev",
  "ashutosh-rana": "ashuthosh-rana",
};

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
    const map: Record<string, string> = Object.fromEntries(
      files
        .filter((f) => EXT.test(f))
        .map((f) => [
          f.replace(EXT, "").toLowerCase(),
          `/images/${folder}/${encodeURIComponent(f)}`,
        ]),
    );
    for (const [slug, file] of Object.entries(ALIASES)) {
      if (!map[slug] && map[file]) map[slug] = map[file];
    }
    return map;
  } catch {
    return {};
  }
}
