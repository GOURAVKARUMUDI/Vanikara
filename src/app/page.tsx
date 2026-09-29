import HeroSection from "@/sections/home/HeroSection";
import MarqueeSection from "@/sections/home/MarqueeSection";
import StorySection from "@/sections/home/StorySection";
import ProductsSection from "@/sections/home/ProductsSection";
import CygmaSection from "@/sections/home/CygmaSection";
import PrinciplesSection from "@/sections/home/PrinciplesSection";
import TimelineSection from "@/sections/home/TimelineSection";
import FoundersSection from "@/sections/home/FoundersSection";
import ClosingSection from "@/sections/home/ClosingSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <StorySection />
      <ProductsSection />
      <CygmaSection />
      <PrinciplesSection />
      <TimelineSection />
      <FoundersSection />
      <ClosingSection />
    </>
  );
}
