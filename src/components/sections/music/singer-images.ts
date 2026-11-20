import "server-only";
import { getSlugImages } from "@/lib/slug-images";

// slug -> photo for the singers. The cast photos (public/images/cast/) are used
// first; public/images/singers/ is only a fallback.
export async function getSingerImages(): Promise<Record<string, string>> {
  const [cast, singers] = await Promise.all([
    getSlugImages("cast"),
    getSlugImages("singers"),
  ]);
  return { ...singers, ...cast };
}
