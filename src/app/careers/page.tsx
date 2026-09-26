import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "VANIKARA is an early-stage company. Opportunities across technology, product, operations, design and business will grow with it.",
};

const AREAS = ["Engineering", "Product & design", "Operations", "Business & partnerships"];

export default function CareersPage() {
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Careers"
          title="Build with us."
          lead="VANIKARA is an early-stage company. As it grows, opportunities across technology, product, operations, design and business will grow with it."
        />
      </section>

      <section aria-labelledby="careers-now" className="container-page py-12 sm:py-20">
        <div className="grid gap-12 border-t border-line pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6" data-reveal>
            <h2 id="careers-now" className="text-title text-fg">
              No open roles are listed right now.
            </h2>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">
              We would still like to hear from people who care about practical execution and long-term ambition.
              Conversations happen directly with the founders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" arrow>
                Get in touch
              </Button>
              <Button href={`mailto:${COMPANY_IDENTITY.officialEmail}`} variant="secondary">
                {COMPANY_IDENTITY.officialEmail}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <p className="text-[0.8125rem] font-semibold text-fg">Areas we expect to grow in</p>
            <ul className="mt-5 border-t border-line">
              {AREAS.map((area) => (
                <li key={area} className="border-b border-line py-4 text-lg font-semibold text-fg">
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-fg-subtle">Based in {COMPANY_IDENTITY.operationalLocation}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
