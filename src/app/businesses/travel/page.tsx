import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Travel Booking | Unified Consumer Ecosystem",
  description:
    "Vanikara is exploring connected travel services as part of its long-term unified consumer ecosystem. Currently in DPR / Planning Stage.",
};

const FEASIBILITY_AREAS = [
  "Flight booking feasibility",
  "Bus booking workflows",
  "Railway booking research",
  "Multi-modal travel discovery",
  "Unified itinerary management",
  "Centralized booking support",
  "Transparent cancellation & refund management",
  "Future integration with accommodation services",
];

export default async function TravelBusinessPage() {
  const { portfolio } = await getSiteContent();
  const item = getPortfolioItemById(portfolio, "travel-booking");

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <Link href="/businesses" className="inline-flex items-center gap-1.5 text-sm font-medium text-intel hover:underline">
            <ArrowLeft className="h-4 w-4" />
            All Consumer Businesses
          </Link>
          <div className="mt-6">
            <SectionHeader
              as="h1"
              eyebrow={`Unified Consumer Ecosystem · ${item?.developmentStatus ?? "DPR / Planning Stage"}`}
              tone="cool"
              title="Travel Booking"
              lead="Vanikara is exploring connected travel services as part of its long-term unified consumer ecosystem. This initiative is currently in the Detailed Project Report (DPR) and planning stage."
            />
          </div>
          <div className="relative mt-10 aspect-[21/9] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
            <Image
              src="/images/businesses/travel/travel-booking.webp"
              alt="Airplane wing above soft clouds in clear daylight"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow tone="cool">Feasibility Scope</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Potential research areas.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                The areas listed here represent potential feasibility assessments under our DPR planning phase, not live booking services, confirmed airline or carrier partnerships, or finalized launch dates.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
              {FEASIBILITY_AREAS.map((area, idx) => (
                <div key={area} className="surface p-4">
                  <span className="font-mono text-xs text-fg-subtle">0{idx + 1}</span>
                  <p className="mt-1 text-sm font-medium text-fg">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-16">
          <div className="surface-muted flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-title text-fg">Travel technology or operator partnership enquiry</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Connect with our corporate planning team regarding future ecosystem partnerships.
              </p>
            </div>
            <Button href="/contact?topic=partnership" arrow>
              Partnership Enquiry
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
