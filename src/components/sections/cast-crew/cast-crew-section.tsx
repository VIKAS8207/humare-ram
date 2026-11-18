import RevealSection from "@/components/ui/reveal-section";
import Mandala from "@/components/effects/mandala";
import { getSlugImages } from "@/lib/slug-images";
import CastCard from "./cast-card";
import { CAST, CAST_CREW_HEADER, CREW } from "./cast-crew.data";

export default async function CastCrewSection() {
  // cast/ photos first; singers/ photos are reused for the singers
  const [castPhotos, singerPhotos] = await Promise.all([
    getSlugImages("cast"),
    getSlugImages("singers"),
  ]);

  return (
    <RevealSection
      id="cast"
      className="relative isolate w-full overflow-hidden bg-neutral-950 px-6 py-24 text-white md:py-36"
    >
      <Mandala className="-right-72 -top-40" size="46rem" duration={300} />
      <div className="mx-auto flex max-w-6xl flex-col gap-20 md:gap-28">
        {/* Header */}
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="rv text-xs font-medium uppercase tracking-[0.4em] text-orange-400">
            {CAST_CREW_HEADER.eyebrow}
          </p>
          <h2 className="rv text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-white">
            {CAST_CREW_HEADER.title}
          </h2>
          <p className="rv max-w-xl text-base text-white/60 md:text-lg">
            {CAST_CREW_HEADER.subtitle}
          </p>
        </header>

        {/* Cast */}
        <div className="flex flex-col gap-8">
          <h3 className="rv text-xs font-medium uppercase tracking-[0.4em] text-amber-300/80">
            Cast
          </h3>
          <div className="rv-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {CAST.map((m) => (
              <CastCard
                key={m.slug}
                name={m.name}
                role={m.role}
                image={
                  m.image?.src ?? castPhotos[m.slug] ?? singerPhotos[m.slug]
                }
              />
            ))}
          </div>
        </div>

        {/* Crew — credits list */}
        <div className="flex flex-col gap-8">
          <h3 className="rv text-xs font-medium uppercase tracking-[0.4em] text-amber-300/80">
            Crew
          </h3>
          <dl className="rv border-t border-amber-300/15">
            {CREW.map((c) => (
              <div
                key={c.role}
                className="grid gap-1 border-b border-amber-300/15 py-5 md:grid-cols-[1fr_2fr] md:items-baseline md:gap-10 md:py-6"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
                  {c.role}
                </dt>
                <dd className="text-lg font-medium text-white md:text-2xl">
                  {c.names}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </RevealSection>
  );
}
