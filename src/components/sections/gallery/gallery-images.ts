import "server-only";
import { cacheLife } from "next/cache";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type GalleryImage = { src: string; alt: string };

const DIR = path.join(process.cwd(), "public", "images", "gallery");
const EXT = /\.(png|jpe?g|webp|avif|svg)$/i;

// Every image in public/images/gallery/, sorted by filename.
export async function getGalleryImages(): Promise<GalleryImage[]> {
  "use cache";
  cacheLife("minutes");
  try {
    return (await readdir(DIR))
      .filter((f) => EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f, i) => ({
        src: `/images/gallery/${encodeURIComponent(f)}`,
        alt: `Humare Ram gallery image ${i + 1}`,
      }));
  } catch {
    return [];
  }
}
