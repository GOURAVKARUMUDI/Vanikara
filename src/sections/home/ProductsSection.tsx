import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export default async function ProductsSection() {
  const { portfolio } = await getSiteContent();

  const foodDelItem = getPortfolioItemById(portfolio, "food-delivery");
  const travelItem = getPortfolioItemById(portfolio, "travel-booking");
  const hotelItem = getPortfolioItemById(portfolio, "hotel-booking");
  const quickItem = getPortfolioItemById(portfolio, "quick-commerce");

  const PORTFOLIO_CARDS = [
    {
      id: "travel-booking",
      title: "Travel Booking",
      desc: "Exploring more connected travel experiences.",
      status: travelItem?.developmentStatus ?? "DPR / Planning Stage",
      href: "/businesses/travel",
      image: "/images/businesses/travel/travel-booking.webp",
      alt: "Airplane wing above soft clouds in clear daylight representing future connected travel services",
    },
    {
      id: "hotel-booking",
      title: "Hotel Booking",
      desc: "Exploring seamless accommodation discovery and booking experiences.",
      status: hotelItem?.developmentStatus ?? "DPR / Planning Stage",
      href: "/businesses/hotels",
      image: "/images/businesses/hospitality/hotel-booking.webp",
      alt: "Modern sunlit contemporary hotel guest room representing planned hospitality discovery",
    },
    {
      id: "quick-commerce",
      title: "Quick Commerce",
      desc: "Exploring convenient access to everyday essentials.",
      status: quickItem?.developmentStatus ?? "Future Exploration",
      href: "/businesses/quick-commerce",
      image: "/images/businesses/quick-commerce/everyday-essentials.webp",
      alt: "Fresh produce and everyday grocery essentials representing future quick commerce exploration",
    },
  ];

  return (
    <section aria-labelledby="connected-services-heading" className="border-b border-line bg-surface">
      <div className="container-page py-24 sm:py-32">
        {/* Section 8: Connected Consumer Ecosystem Introduction */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div className="max-w-3xl">
            <Eyebrow tone="warm">01 / Connected Consumer Services</Eyebrow>
            <h2 id="connected-services-heading" className="text-headline mt-4 text-fg">
              One ecosystem. Endless possibilities.
            </h2>
            <p className="text-lead mt-4 max-w-2xl">
              A connected vision for food services, travel, hospitality and everyday essentials.
            </p>
          </div>
          <Button href="/businesses" variant="outline" arrow>
            Ecosystem Overview
          </Button>
        </div>

        {/* Section 9: Food Services — Large Premium Editorial Showcase */}
        <div className="mt-14 overflow-hidden rounded-[8px] border border-line bg-[#F5F5F7] dark:bg-surface-secondary" data-reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9]">
            <Image
              src="/images/businesses/food/food-services-showcase.webp"
              alt="Editorial photograph of Indian restaurant dishes representing Vanikara Food Services"
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ambition">
                  Primary Consumer Initiative
                </span>
                <span className="rounded bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-fg-muted border border-line">
                  Food Delivery: {foodDelItem?.developmentStatus ?? "In Development"}
                </span>
              </div>
              <h3 className="text-headline mt-3 text-fg">Reimagining food services.</h3>
              <p className="mt-2 font-display text-lg font-medium text-fg-muted">
                Delivery. Dine-in. Takeaway.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">
                Building a restaurant-first food ecosystem designed around convenience, transparency and sustainable business relationships — targeting initial Tier-2 rollout in Guntur in 2027.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Button href="/food-delivery" size="lg" arrow>
                Explore Food Services
              </Button>
              <Button href="/food-delivery#register" variant="outline" size="lg">
                Register Interest
              </Button>
            </div>
          </div>
        </div>

        {/* Section 10: Travel, Hospitality & Quick Commerce 3-Col Photographic Portfolio */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3" data-reveal>
          {PORTFOLIO_CARDS.map((card) => (
            <Link key={card.id} href={card.href} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-line bg-surface-secondary">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                  {card.status}
                </span>
                <h3 className="mt-1.5 text-xl font-semibold text-fg group-hover:text-intel transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                  Learn more
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
