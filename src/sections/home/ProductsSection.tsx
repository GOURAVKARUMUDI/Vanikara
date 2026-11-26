import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export default async function ProductsSection() {
  const { initiatives, portfolio } = await getSiteContent();
  const { foodDelivery } = initiatives;

  const foodServices = getPortfolioItemById(portfolio, "food-services");
  const foodDelItem = getPortfolioItemById(portfolio, "food-delivery");
  const travelItem = getPortfolioItemById(portfolio, "travel-booking");
  const hotelItem = getPortfolioItemById(portfolio, "hotel-booking");
  const quickItem = getPortfolioItemById(portfolio, "quick-commerce");

  const futurePillars = [travelItem, hotelItem, quickItem].filter(Boolean);

  return (
    <section aria-labelledby="connected-services-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div className="max-w-3xl">
            <Eyebrow tone="warm">Unified Consumer Services Ecosystem</Eyebrow>
            <h2 id="connected-services-heading" className="text-headline mt-4 text-fg">
              Building the Next Generation of Connected Services.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              A unified consumer ecosystem designed to progressively bring everyday services together — starting with Food Services and expanding thoughtfully into Travel, Hotels, and Quick Commerce.
            </p>
          </div>
          <Button href="/businesses" variant="outline" arrow>
            Ecosystem Overview
          </Button>
        </div>

        {/* Primary Consumer Priority: Food Services */}
        <div className="surface-muted mt-12 p-7 sm:p-10" data-reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
                <span className="rounded bg-ambition/10 px-2.5 py-1 font-mono font-semibold text-ambition">
                  {foodServices?.developmentStatus ?? "Primary consumer initiative"}
                </span>
                <span className="rounded border border-line bg-surface px-2.5 py-1 font-mono text-fg-muted">
                  Food Delivery: {foodDelItem?.developmentStatus ?? "In Development"}
                </span>
              </div>
              <h3 className="text-headline mt-4 text-fg">Food Services</h3>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                {foodDelivery.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-fg-muted">
                <span className="inline-flex items-center gap-1.5 rounded-compact border border-line bg-surface px-3 py-1.5">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ambition" />
                  Initial Roadmap Market: {foodDelivery.initialMarket}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-compact border border-line bg-surface px-3 py-1.5">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-fg-subtle" />
                  Target {foodDelivery.targetLaunch}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/food-delivery" arrow>
                  Explore Food Services
                </Button>
                <Button href="/food-delivery#register" variant="outline">
                  Register Early Interest
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
              {[
                { name: "Food Delivery", status: "In Development", desc: "Restaurant-first delivery economics & transparent pricing." },
                { name: "Dine-in", status: "Planned", desc: "Discovery, digital menu access, and dining experience." },
                { name: "Takeaway", status: "Planned", desc: "Advance ordering and coordinated pickup notifications." },
                { name: "AI Telephone Ordering", status: "Proposed", desc: "App-free voice-assisted ordering with human fallback." },
              ].map((sub) => (
                <div key={sub.name} className="surface p-4">
                  <span className="font-mono text-[10px] font-medium uppercase text-ambition">{sub.status}</span>
                  <h4 className="mt-1 text-sm font-semibold text-fg">{sub.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-fg-muted">{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future Consumer Initiatives */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" data-reveal>
          {futurePillars.map((item) => (
            <Link
              key={item!.id}
              href={item!.href}
              className="surface card-interactive group flex flex-col justify-between p-6"
            >
              <div>
                <span className="inline-block rounded bg-surface-secondary px-2.5 py-1 font-mono text-[11px] font-medium text-fg-muted">
                  {item!.developmentStatus}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-fg group-hover:text-intel">
                  {item!.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item!.shortDescription}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                View initiative scope
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
