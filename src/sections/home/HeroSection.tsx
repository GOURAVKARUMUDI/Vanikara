import Image from "next/image";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";

export default async function HeroSection() {
  const { identity } = await getSiteContent();

  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <div className="grid min-h-[560px] grid-cols-1 items-center gap-10 lg:min-h-[680px] lg:grid-cols-12 lg:gap-8">
          {/* ~43% text column */}
          <div className="rise-in lg:col-span-5">
            <Eyebrow tone="cool">{identity.brandName} · Enterprise Technology</Eyebrow>
            <h1 className="text-display mt-5 text-fg">
              Intelligence meets possibility.
            </h1>
            <p className="text-lead mt-6 max-w-lg">
              Building intelligent systems and connected services for a better everyday experience.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/businesses" size="lg" arrow>
                Explore Our Businesses
              </Button>
              <Button href="/about" variant="outline" size="lg">
                Discover Vanikara
              </Button>
            </div>
          </div>

          {/* ~57% integrated sculptural visual */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-surface">
              <Image
                src="/images/hero/vanikara-connected-intelligence.webp"
                alt="Precision-engineered metallic corporate technology sculpture representing connected intelligence"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
