// ─────────────────────────────────────────────────────────────────────────────
// ONE place for every image path on the site.
//
// Folder map (all under public/images/, URL = /images/...):
//   loader/     loading screen background + the two-characters cutout
//   hero/       main logo + sponsor logo
//   spotlight/  Ravan and Ram cutouts
//   marquee/    logo strip         ← AUTO: just drop files in, no code change
//   singers/    singer photos      ← AUTO: name the file after the singer slug
//   gallery/    carousel photos    ← AUTO: just drop files in, no code change
//   footer/     footer backdrop    ← drop `footer-bg.png` (or .jpg/.webp) in; shows automatically
//
// To REPLACE a fixed image below, overwrite the file keeping the same name
// (or change `src` here). width/height only need to match the file's aspect
// ratio — they are used for layout, not to resize anything.
// See IMAGES.md for details.
// ─────────────────────────────────────────────────────────────────────────────

export type ImageAsset = { src: string; width: number; height: number };

export const IMAGES = {
  // Loading screen
  loaderBg: { src: "/images/loader/loader-bg.png", width: 2752, height: 1536 },
  // Transparent cutout of both characters (loader + hero)
  characters: {
    src: "/images/loader/humareRanlogofacing.png",
    width: 2752,
    height: 1536,
  },

  // Hero
  heroLogo: {
    src: "/images/hero/humareRanlogo.png",
    width: 2485,
    height: 1316,
  },
  // Sponsor ("Presented by") logo: white on transparent, Shri Ram Jewellers
  sponsor: {
    src: "/images/hero/sriramjewelleers.png",
    width: 7756,
    height: 6616,
  },
  // Rotary partner logo (dark-blue artwork, brightened in CSS for the dark hero)
  rotary: { src: "/images/hero/rotary.png", width: 524, height: 99 },

  // Spotlight sections
  ravan: { src: "/images/spotlight/ravan.png", width: 1353, height: 2314 },
  ram: { src: "/images/spotlight/ram.png", width: 1412, height: 2292 },
} satisfies Record<string, ImageAsset>;
