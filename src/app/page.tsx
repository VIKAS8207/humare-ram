import Loader, { MobileLoader } from "@/components/site/loader";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import HeroSection from "@/components/sections/hero";
import ShowStripSection from "@/components/sections/show-strip";
import MarqueeSection from "@/components/sections/marquee";
import StatsSection from "@/components/sections/stats";
import CastCrewSection from "@/components/sections/cast-crew";
import GallerySection from "@/components/sections/gallery";
import EventDetailsSection from "@/components/sections/event-details";
import MusicSection from "@/components/sections/music";
import SpotlightSection, { RAM, RAVAN } from "@/components/sections/spotlight";

export default function Home() {
  return (
    <>
      <Loader />
      <MobileLoader />
      <Navbar />
      <main>
        <HeroSection />
        <ShowStripSection />
        <MarqueeSection />
        <SpotlightSection {...RAVAN} />
        <SpotlightSection {...RAM} reverse />
        <StatsSection />
        <CastCrewSection />
        <MusicSection />
        <GallerySection />
        <EventDetailsSection />
      </main>
      <Footer />
    </>
  );
}
