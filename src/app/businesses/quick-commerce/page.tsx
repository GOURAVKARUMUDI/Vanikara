import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Quick Commerce | Unified Consumer Ecosystem",
  description:
    "Vanikara intends to explore convenient access to everyday essentials as part of its long-term consumer ecosystem. Currently in Future Exploration.",
};

const RESEARCH_AREAS = [
  "Grocery and everyday essentials access",
  "Local merchant integration models",
  "Inventory management & catalog accuracy",
  "Practical fulfilment models",
  "Shared delivery infrastructure",
  "Sustainable unit economics",
];

export default async function QuickCommercePage() {
  const { portfolio } = await getSiteContent();
  const item = getPortfolioItemById(portfolio, "quick-commerce");

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
              eyebrow={`Unified Consumer Ecosystem · ${item?.developmentStatus ?? "Future Exploration"}`}
              tone="cool"
              title="Quick Commerce"
              lead="Vanikara intends to explore convenient access to everyday essentials as part of its long-term consumer ecosystem. This initiative has not yet entered finalized planning."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow tone="cool">Long-Term Research</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Future areas of exploration.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                We do not publish guaranteed delivery windows, warehouse commitments, or launch timelines for Quick Commerce while the initiative remains in early exploration.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
              {RESEARCH_AREAS.map((area, idx) => (
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
              <h2 className="text-title text-fg">General partnership enquiries</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Reach out to our team for long-term retail or distribution discussions.
              </p>
            </div>
            <Button href="/contact?topic=partnership" variant="outline" arrow>
              Contact Vanikara
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
