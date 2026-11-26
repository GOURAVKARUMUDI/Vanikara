import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

/** Status wording is fixed here so planned work is never presented as operational. */
const PLANNED_BUSINESSES = [
  {
    title: "Travel Booking",
    description: "Exploring connected travel experiences.",
    status: "Planning Stage",
    href: "/businesses/travel",
  },
  {
    title: "Hotel Booking",
    description: "Exploring convenient accommodation discovery and booking.",
    status: "Planning Stage",
    href: "/businesses/hotels",
  },
  {
    title: "Quick Commerce",
    description: "Exploring convenient access to everyday essentials.",
    status: "Future Exploration",
    href: "/businesses/quick-commerce",
  },
];

export default function ProductsSection() {
  return (
    <section aria-labelledby="consumer-businesses-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <Eyebrow tone="warm">Consumer Businesses</Eyebrow>
          <h2 id="consumer-businesses-heading" className="text-headline mt-4 text-fg">
            Connected consumer services.
          </h2>
        </div>

        {/* Food Services: the one photographic showcase in this section */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center" data-reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary lg:col-span-7">
            <Image
              src="/images/businesses/food/food-services-showcase.webp"
              alt="Restaurant dishes prepared for Vanikara Food Services"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
          </div>
          <div className="lg:col-span-5">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ambition">
              Status: In Development
            </span>
            <h3 className="text-title mt-3 text-fg">Food Services</h3>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              Delivery, dine-in and takeaway through a connected restaurant-first ecosystem.
            </p>
            <div className="mt-7">
              <Button href="/food-delivery" variant="outline" arrow>
                Explore Food Services
              </Button>
            </div>
          </div>
        </div>

        {/* Planned businesses: compact, text-led, no imagery */}
        <ul className="mt-14 grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0" data-reveal>
          {PLANNED_BUSINESSES.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group block h-full px-0 py-6 md:px-6">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                  Status: {item.status}
                </span>
                <h3 className="mt-2 text-base font-semibold text-fg transition-colors group-hover:text-intel">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                  Learn more
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
