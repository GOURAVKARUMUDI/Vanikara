import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Hotel Booking | Unified Consumer Ecosystem",
  description:
    "Vanikara is exploring connected accommodation services designed to complement its future travel and consumer ecosystem. Currently in DPR / Planning Stage.",
};

const FEASIBILITY_AREAS = [
  "Hotel & stay discovery",
  "Structured accommodation search",
  "Property listing standards",
  "Room availability synchronization",
  "Reservation management workflows",
  "Verified accommodation partner onboarding",
  "Transparent cancellation & refund workflows",
  "Seamless integration with future travel services",
];

export default async function HotelsBusinessPage() {
  const { portfolio } = await getSiteContent();
  const item = getPortfolioItemById(portfolio, "hotel-booking");

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
              title="Hotel Booking"
              lead="Vanikara is exploring connected accommodation services designed to complement its future travel and consumer ecosystem. Currently in the Detailed Project Report (DPR) and planning stage."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow tone="cool">Feasibility Scope</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Areas under assessment.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                No hotel inventory, room pricing, or reservation functionality is live today. These areas guide our internal feasibility evaluation and future hospitality partner standards.
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
              <h2 className="text-title text-fg">Hospitality partnership enquiry</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Property owners and hospitality groups may connect with our team regarding future ecosystem collaboration.
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
