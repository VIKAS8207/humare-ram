import GalleryTrack from "./gallery-track";
import { GALLERY_HEADER } from "./gallery.data";
import { getGalleryImages } from "./gallery-images";

const MIN_ITEMS = 8; // the loop needs enough items to always fill the screen

export default async function GallerySection() {
  const images = await getGalleryImages();
  if (images.length === 0) return null;

  const copies = Math.ceil(MIN_ITEMS / images.length);
  const looped = Array.from({ length: copies }, () => images).flat();

  return (
    <GalleryTrack
      title={GALLERY_HEADER.title}
      subtitle={GALLERY_HEADER.subtitle}
      images={looped}
    />
  );
}
