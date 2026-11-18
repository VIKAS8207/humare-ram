import Image from "next/image";
import MarqueeRow from "./marquee-row";
import { getMarqueeLogos } from "./marquee-logos";

const MIN_ITEMS = 10; // repeat logos so one group always overfills the screen

export default async function MarqueeSection() {
  const logos = await getMarqueeLogos();
  if (logos.length === 0) return null;

  const copies = Math.ceil(MIN_ITEMS / logos.length);
  const items = Array.from({ length: copies }, () => logos).flat();

  return (
    <section
      aria-label="Partners"
      className="relative w-full overflow-hidden bg-neutral-950 py-12 md:py-16"
    >
      <MarqueeRow direction={1} speed={50}>
        {items.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex shrink-0 items-center px-8 md:px-14"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              sizes="200px"
              className="h-8 w-auto max-w-none select-none opacity-70 brightness-0 invert md:h-12"
            />
          </div>
        ))}
      </MarqueeRow>
    </section>
  );
}
