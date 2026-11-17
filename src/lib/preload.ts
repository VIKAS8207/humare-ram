import { getImageProps } from "next/image";
import { IMAGES } from "@/config/images";

// Shared image configs: the SAME props are used by <Image> in components and by
// the preloader, so the browser caches the exact optimized file that gets shown.
export const LOADER_BG = { ...IMAGES.loaderBg, sizes: "100vw" };

// Transparent cutout (Ravan + Ram). Same file/size in loader and hero so they line up.
export const CHARACTERS = { ...IMAGES.characters, sizes: "100vw" };

export const HERO_LOGO = {
  ...IMAGES.heroLogo,
  sizes: "(min-width: 768px) 40rem, 80vw",
};

// Images the loader waits for before revealing the page.
export const CRITICAL_IMAGES = [LOADER_BG, CHARACTERS, HERO_LOGO];

type Preloadable = {
  src: string;
  width: number;
  height: number;
  sizes: string;
};

export function preloadImages(
  images: Preloadable[],
  onProgress: (ratio: number) => void,
): Promise<HTMLImageElement[]> {
  if (images.length === 0) {
    onProgress(1);
    return Promise.resolve([]);
  }
  let loaded = 0;
  const step = () => onProgress(++loaded / images.length);

  return Promise.all(
    images.map(({ src, width, height, sizes }) => {
      const { props } = getImageProps({ src, width, height, sizes, alt: "" });
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new window.Image();
        // Resolve on error too so one broken file never hangs the loader
        img.onload = img.onerror = () => {
          step();
          resolve(img);
        };
        img.sizes = sizes;
        if (props.srcSet) img.srcset = props.srcSet;
        img.src = props.src;
      });
    }),
  );
}
