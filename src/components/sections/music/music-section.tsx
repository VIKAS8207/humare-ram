import MusicReveal from "./music-reveal";
import { SectionHeader, stageSectionClass } from "@/components/ui";
import Mandala from "@/components/effects/mandala";
import SingerCard from "./singer-card";
import { MUSIC_EP, MUSIC_HEADER, SINGERS } from "./music.data";
import { getSingerImages } from "./singer-images";

// Thin gold rule with a centred diamond — ornamental divider
function Ornament() {
  return (
    <div
      aria-hidden
      className="m-reveal flex items-center justify-center gap-4 text-gold/70"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60 md:w-28" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 0l7 7-7 7-7-7z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60 md:w-28" />
    </div>
  );
}

export default async function MusicSection() {
  const images = await getSingerImages();

  return (
    <MusicReveal id="music" className={stageSectionClass("top")}>
      <Mandala
        className="-left-72 top-24"
        size="46rem"
        reverse
        duration={320}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:gap-20">
        {/* Header */}
        <SectionHeader
          reveal="m-reveal"
          eyebrow={MUSIC_HEADER.eyebrow}
          title={MUSIC_HEADER.title}
          subtitle={MUSIC_HEADER.subtitle}
          titleClass="text-gold-pale"
        >
          <Ornament />
        </SectionHeader>

        {/* EP details */}
        <div className="m-reveal grid w-full max-w-4xl gap-6 border-y border-gold/15 py-8 md:grid-cols-[1.4fr_1fr] md:gap-14 md:py-12">
          <div className="flex flex-col gap-4">
            {/* Two lines, centred on phones; one line on larger screens */}
            <p className="flex flex-col items-center gap-1 text-center text-xs font-medium uppercase tracking-[0.3em] text-ember md:flex-row md:items-baseline md:gap-0 md:text-left">
              <span>{MUSIC_EP.label}</span>
              <span aria-hidden className="mx-2 hidden text-white/30 md:inline">
                ·
              </span>
              <span>{MUSIC_EP.label2}</span>
            </p>
            <p className="text-sm leading-relaxed text-white/75 md:text-lg">
              {MUSIC_EP.intro}
            </p>
          </div>
          <dl className="flex flex-col gap-6 md:border-l md:border-gold/15 md:pl-14">
            {MUSIC_EP.credits.map((c) => (
              <div key={c.role} className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-[0.3em] text-gold/70">
                  {c.role}
                </dt>
                <dd className="text-sm font-medium text-white md:text-base">
                  {c.names}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Singers */}
        <div className="m-grid grid w-full grid-cols-3 justify-items-center gap-2 sm:gap-8 lg:gap-14">
          {SINGERS.map((s) => (
            <SingerCard key={s.slug} {...s} image={images[s.slug]} />
          ))}
        </div>
      </div>
    </MusicReveal>
  );
}
