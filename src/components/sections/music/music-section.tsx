import MusicReveal from "./music-reveal";
import Mandala from "@/components/effects/mandala";
import SingerCard from "./singer-card";
import { MUSIC_EP, MUSIC_HEADER, SINGERS } from "./music.data";
import { getSingerImages } from "./singer-images";

// Thin gold rule with a centred diamond — ornamental divider
function Ornament() {
  return (
    <div
      aria-hidden
      className="m-reveal flex items-center justify-center gap-4 text-amber-300/70"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/60 md:w-28" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 0l7 7-7 7-7-7z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/60 md:w-28" />
    </div>
  );
}

export default async function MusicSection() {
  const images = await getSingerImages();

  return (
    <MusicReveal
      id="music"
      className="relative isolate w-full overflow-hidden bg-neutral-950 bg-[radial-gradient(ellipse_at_top,rgba(190,95,20,0.18),transparent_60%)] px-4 py-16 text-white md:px-6 md:py-36"
    >
      <Mandala
        className="-left-72 top-24"
        size="46rem"
        reverse
        duration={320}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:gap-20">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 text-center md:gap-6">
          <p className="m-reveal text-xs font-medium uppercase tracking-[0.4em] text-orange-400">
            {MUSIC_HEADER.eyebrow}
          </p>
          <h2 className="m-reveal text-[clamp(1.9rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-amber-100">
            {MUSIC_HEADER.title}
          </h2>
          <p className="m-reveal max-w-xl text-sm text-white/60 md:text-lg">
            {MUSIC_HEADER.subtitle}
          </p>
          <Ornament />
        </header>

        {/* EP details */}
        <div className="m-reveal grid w-full max-w-4xl gap-6 border-y border-amber-300/15 py-8 md:grid-cols-[1.4fr_1fr] md:gap-14 md:py-12">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
              {MUSIC_EP.label} <span className="mx-2 text-white/30">·</span>{" "}
              {MUSIC_EP.label2}
            </p>
            <p className="text-sm leading-relaxed text-white/75 md:text-lg">
              {MUSIC_EP.intro}
            </p>
          </div>
          <dl className="flex flex-col gap-6 md:border-l md:border-amber-300/15 md:pl-14">
            {MUSIC_EP.credits.map((c) => (
              <div key={c.role} className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-[0.3em] text-amber-300/70">
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
