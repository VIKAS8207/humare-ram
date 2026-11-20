import Image from "next/image";
import RevealSection from "@/components/ui/reveal-section";
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
    <RevealSection className="relative w-full overflow-hidden bg-neutral-950 px-6 py-16 text-white md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:gap-16">
        <p className="rv text-xs font-medium uppercase tracking-[0.4em] text-orange-400">
          Our Partners
        </p>

        {/* Tiers side by side (they wrap onto a new line on small screens) */}
        <div className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-10 md:gap-x-8">
          {TIERS.map((tier) => {
            const items = placed.filter((l) => l.tier === tier.id);
            if (items.length === 0) return null;
            return (
              <div key={tier.id} className="flex flex-col items-center gap-5">
                <h2
                  className={`rv text-[0.7rem] font-semibold uppercase tracking-[0.35em] ${tier.label_class}`}
                >
                  {tier.label}
                </h2>
                <ul className="flex flex-wrap justify-center gap-4">
                  {items.map((logo) => (
                    <li
                      key={logo.src}
                      className={`rv grid h-28 w-56 place-content-center rounded-2xl border px-6 transition-colors md:h-32 md:w-60 ${tier.card}`}
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
