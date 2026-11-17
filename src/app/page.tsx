import Loader from "@/components/loader";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/sections/hero";
import MarqueeSection from "@/components/sections/marquee";
import StatsSection from "@/components/sections/stats";
import CastCrewSection from "@/components/sections/cast-crew";
import GallerySection from "@/components/sections/gallery";
import MusicSection from "@/components/sections/music";
import SpotlightSection, { RAM, RAVAN } from "@/components/sections/spotlight";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <SpotlightSection {...RAVAN} />
        <SpotlightSection {...RAM} reverse />
        <StatsSection />
        <CastCrewSection />
        <MusicSection />
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}
