import HeroSection from "@/sections/home/HeroSection";
import ProductsSection from "@/sections/home/ProductsSection";
import CygmaSection from "@/sections/home/CygmaSection";
import CygmaRiHomeSection from "@/sections/home/CygmaRiHomeSection";
import PrinciplesSection from "@/sections/home/PrinciplesSection";
import TimelineSection from "@/sections/home/TimelineSection";
import FoundersSection from "@/sections/home/FoundersSection";
import ClosingSection from "@/sections/home/ClosingSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <CygmaSection />
      <CygmaRiHomeSection />
      <PrinciplesSection />
      <TimelineSection />
      <FoundersSection />
      <ClosingSection />
    </>
  );
}
