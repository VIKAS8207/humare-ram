import { Eyebrow, SectionHeader, StageSection } from "@/components/ui";
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
    <StageSection id="cast">
      <Mandala className="-right-72 -top-40" size="46rem" duration={300} />
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:gap-28">
        {/* Header */}
        <SectionHeader
          eyebrow={CAST_CREW_HEADER.eyebrow}
          title={CAST_CREW_HEADER.title}
          subtitle={CAST_CREW_HEADER.subtitle}
        />

        {/* Cast */}
        <div className="flex flex-col gap-5 md:gap-8">
          <Eyebrow tone="gold" className="rv text-center md:text-left">
            Cast
          </Eyebrow>
          <div className="rv-grid grid grid-cols-4 gap-2 sm:gap-4 lg:grid-cols-6">
            {CAST.map((m) => (
              <CastCard
                key={m.slug}
                name={m.name}
                role={m.role}
                image={
                  castPhotos[m.slug] ?? m.image?.src ?? singerPhotos[m.slug]
                }
              />
            ))}
          </div>
        </div>

        {/* Crew — credits list */}
        <div className="flex flex-col gap-5 md:gap-8">
          <Eyebrow tone="gold" className="rv text-center md:text-left">
            Crew
          </Eyebrow>
          <dl className="rv border-t border-gold/15">
            {CREW.map((c) => (
              <div
                key={c.role}
                className="grid gap-1 border-b border-gold/15 py-4 text-center md:text-left md:grid-cols-[1fr_2fr] md:items-baseline md:gap-10 md:py-6"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.3em] text-ember">
                  {c.role}
                </dt>
                <dd className="text-base font-medium text-white md:text-2xl">
                  {c.names}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </StageSection>
  );
}
