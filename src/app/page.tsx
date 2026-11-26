import HeroSection from "@/sections/home/HeroSection";
import StorySection from "@/sections/home/StorySection";
import ProductsSection from "@/sections/home/ProductsSection";
import CygmaSection from "@/sections/home/CygmaSection";
import CygmaRiHomeSection from "@/sections/home/CygmaRiHomeSection";
import PrinciplesSection from "@/sections/home/PrinciplesSection";
import CareersPartnershipsSection from "@/sections/home/CareersPartnershipsSection";

/** Homepage sequence: hero, introduction, consumer businesses, CYGMA_AI, CYGMA-RI, engineering, careers and partnerships. The footer follows in the layout. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <ProductsSection />
      <CygmaSection />
      <CygmaRiHomeSection />
      <PrinciplesSection />
      <CareersPartnershipsSection />
    </>
  );
}
