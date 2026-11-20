import Image from "next/image";
import { Eyebrow, RevealSection } from "@/components/ui";
import { getMarqueeLogos } from "./marquee-logos";
import { TIERS, tierOf } from "./partner-tiers";

// Partners grouped by tier (Powered by, Diamond, Platinum, Gold, Media), every
// logo visible at once (no scrolling marquee). Add logos in
// public/images/marquee/ and set their tier in partner-tiers.ts.
export default async function MarqueeSection() {
  const logos = await getMarqueeLogos();
  if (logos.length === 0) return null;

  const placed = logos.map((l) => ({ ...l, ...tierOf(l) }));

  return (
    <RevealSection className="relative w-full overflow-hidden bg-stage px-4 py-12 text-white md:px-6 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 md:gap-16">
        <Eyebrow className="rv">Our Partners</Eyebrow>

        {/* Tiers side by side (they wrap onto a new line on small screens) */}
        <div className="grid w-full grid-cols-2 items-start gap-x-3 gap-y-6 md:flex md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-10">
          {TIERS.map((tier) => {
            const items = placed.filter((l) => l.tier === tier.id);
            if (items.length === 0) return null;
            return (
              <div
                key={tier.id}
                className="flex flex-col items-center gap-3 md:gap-5"
              >
                <h2
                  className={`rv text-[0.55rem] font-semibold uppercase tracking-[0.2em] md:text-[0.7rem] md:tracking-[0.35em] ${tier.label_class}`}
                >
                  {tier.label}
                </h2>
                <ul className="flex w-full flex-wrap justify-center gap-4 md:w-auto">
                  {items.map((logo) => (
                    <li
                      key={logo.src}
                      className={`rv grid h-20 w-full place-content-center rounded-xl border px-4 transition-colors md:h-32 md:w-60 md:rounded-2xl md:px-6 ${tier.card}`}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        sizes="240px"
                        className={`w-auto max-w-full select-none opacity-90 brightness-0 invert ${tier.logo}`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
