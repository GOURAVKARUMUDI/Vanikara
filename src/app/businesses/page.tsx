import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Our Businesses | Connected Consumer Services",
  description:
    "Vanikara's long-term Unified Consumer Services Ecosystem progressively integrating Food Services, Travel Booking, Hotel Booking, and Quick Commerce.",
};

const SHARED_CAPABILITIES = [
  { title: "Unified Consumer Accounts", desc: "Single identity across future consumer services under clear privacy controls." },
  { title: "Shared Membership Infrastructure", desc: "Planned cross-service membership passes and eligible service benefits." },
  { title: "Integrated Rewards", desc: "Planned reward coins and transparent coupon redemption across participating services." },
  { title: "Secure Payments", desc: "RBI-compliant digital payment workflows and predictable refund handling." },
  { title: "Service Discovery", desc: "Unified local discovery tailored to Tier-2 and regional Indian markets." },
  { title: "Centralized Customer Support", desc: "Consistent human-backed issue resolution and grievance redressal." },
  { title: "Intelligent Recommendations", desc: "Helpful discovery powered by responsible internal intelligence over time." },
  { title: "Shared Operational Infrastructure", desc: "Common merchant onboarding, dispatch, and settlement foundations." },
];

export default async function BusinessesPage() {
  const { portfolio } = await getSiteContent();
  const eco = getPortfolioItemById(portfolio, "unified-consumer-ecosystem");
  const pillars = [
    getPortfolioItemById(portfolio, "food-services"),
    getPortfolioItemById(portfolio, "travel-booking"),
    getPortfolioItemById(portfolio, "hotel-booking"),
    getPortfolioItemById(portfolio, "quick-commerce"),
  ].filter(Boolean);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow={`Unified Consumer Services Ecosystem · ${eco?.developmentStatus ?? "Planned long-term ecosystem"}`}
            tone="warm"
            title="One connected consumer ecosystem, built step by step."
            lead="Vanikara intends to progressively integrate everyday consumer services into a unified application — starting with Food Services and expanding thoughtfully into Travel Booking, Hotel Booking, and Quick Commerce."
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/food-delivery" arrow>
                Explore Food Services
              </Button>
              <Button href="/contact?topic=partnership" variant="outline">
                Partnership Enquiries
              </Button>
            </div>
          </SectionHeader>
          <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
            <Image
              src="/images/businesses/consumer-ecosystem.webp"
              alt="Connected consumer services ecosystem visual"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Four Consumer Pillars */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="warm">Consumer Initiatives</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Four planned service categories.</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              All initiatives are divisions under VANIKARA INTELLIGENCE PRIVATE LIMITED. Each status below is maintained live through Vanikara Console.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2" data-reveal>
            {pillars.map((item, idx) => (
              <Link
                key={item!.id}
                href={item!.href}
                className="surface card-interactive group flex flex-col justify-between p-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-fg-subtle">0{idx + 1}</span>
                    <span
                      className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                        item!.id === "food-services"
                          ? "bg-ambition/10 text-ambition"
                          : "bg-surface-secondary text-fg-muted"
                      }`}
                    >
                      {item!.developmentStatus}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-fg group-hover:text-intel">
                    {item!.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {item!.shortDescription}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                  Explore {item!.name}
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Planned Shared Capabilities */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Planned Ecosystem Architecture</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Shared infrastructure across services.</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              The capabilities below represent planned architectural foundations for our future consumer application and are not currently live consumer features.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {SHARED_CAPABILITIES.map((cap) => (
              <div key={cap.title} className="surface-muted p-5">
                <h3 className="text-sm font-semibold text-fg">{cap.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-secondary">
        <div className="container-page py-16 text-center" data-reveal>
          <h2 className="text-title text-fg">Interested in partnering with Vanikara?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-fg-muted">
            Restaurants, local merchants, travel operators, and hospitality partners can express early partnership interest.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact?topic=partnership" arrow>
              Business Partnerships
            </Button>
            <Button href="/food-delivery#register" variant="outline">
              Food Services Registration
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
