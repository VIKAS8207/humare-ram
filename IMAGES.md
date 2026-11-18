# Where to put images

All images live in `public/images/`. A file at `public/images/foo/bar.png` is served at `/images/foo/bar.png`.
Fixed image paths are listed in one file: [`src/config/images.ts`](src/config/images.ts).

| Folder | What goes here | How it works |
| --- | --- | --- |
| `loader/` | Loading-screen background (`loader-bg.png`) and the two-characters cutout (`humareRanlogofacing.png`) | Fixed names. Overwrite the file, keep the name. |
| `hero/` | Main logo (`humareRanlogo.png`) and sponsor logo (`sriramjewelleers.png`, white on transparent) and Rotary logo (`rotary.png`) | Fixed names. Overwrite the file, keep the name. |
| `spotlight/` | Ravan (`ravan.png`) and Ram (`ram.png`) cutouts | Fixed names. Overwrite the file, keep the name. |
| `marquee/` | Partner logos | **Automatic.** Drop files in; shown in filename order as light-grey silhouettes (works for dark or coloured logos on a transparent background). |
| `singers/` | Singer photos | **Automatic.** Name the file after the singer: `shankar-mahadevan.jpg`, `sonu-nigam.jpg`, `kailash-kher.jpg`. Without a photo a monogram is shown. |
| `cast/` | Cast photos | **Automatic.** Name the file after the person: `rahul-bhuchar.jpg`, `ashutosh-rana.jpg`, … (the `slug` in `cast-crew.data.ts`). Ram and Ravan use their cutouts from `spotlight/` by default. Without a photo a monogram is shown. |
| `gallery/` | Carousel photos (landscape works best) | **Automatic.** Drop files in; shown in filename order. |

## Notes

- **Formats:** PNG, JPG, WebP, AVIF (SVG too for marquee and gallery). Cutouts need a transparent background, so use PNG, WebP or AVIF.
- **Replacing a fixed image with a different shape:** update its `width`/`height` in `src/config/images.ts` to match the new aspect ratio.
- **Adding a new singer:** add an entry in `src/components/sections/music/music.data.ts`, then drop `<slug>.jpg` into `singers/`.
- **Auto folders** are re-scanned every few minutes in production (instantly in dev). A restart or rebuild shows changes immediately.
- **Dummy files:** anything named `dummy-*` in `marquee/` and `gallery/` is a placeholder. Delete them once you add real images.
- **Size:** images are optimized by Next.js automatically, but keep sources reasonable (under about 5 MB) for faster builds.
