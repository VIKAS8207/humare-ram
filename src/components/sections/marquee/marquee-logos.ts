import "server-only";
import { cacheLife } from "next/cache";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";

export type Logo = { src: string; alt: string; width: number; height: number };

const DIR = path.join(process.cwd(), "public", "images", "marquee");
const EXT = /\.(png|jpe?g|webp|avif|svg|gif)$/i;

// Drop image files into public/images/marquee/ — they are picked up automatically
// (sorted by filename). File name becomes the alt text.
export async function getMarqueeLogos(): Promise<Logo[]> {
  "use cache"; // Cache Components: file reads are prerendered/cached with the page
  cacheLife("minutes"); // re-scan the folder regularly so new logos appear without a rebuild
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => EXT.test(f)).sort();
  } catch {
    return [];
  }

  const logos = await Promise.all(
    files.map(async (file) => {
      try {
        const { width, height } = imageSize(await readFile(path.join(DIR, file)));
        if (!width || !height) return null;
        return {
          src: `/images/marquee/${encodeURIComponent(file)}`,
          alt: file.replace(EXT, "").replace(/[-_]+/g, " "),
          width,
          height,
        };
      } catch {
        return null;
      }
    }),
  );
  return logos.filter((l): l is Logo => l !== null);
}
