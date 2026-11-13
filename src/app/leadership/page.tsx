import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import FounderCard from "@/components/people/FounderCard";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY, FOUNDERS_AND_LEADERSHIP } from "@/data/company";

export const metadata: Metadata = {
  title: "Leadership",
  description: "The leadership of VANIKARA Intelligence Private Limited.",
};

export default function LeadershipPage() {
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Leadership"
          tone="cool"
          title="The people building VANIKARA."
          lead="Working directly on the company's operations, finance, people and culture."
        />
      </section>

      <section aria-labelledby="leadership-heading" className="container-page py-12">
        <h2 id="leadership-heading" className="sr-only">
          Leadership
        </h2>
        <div className="grid max-w-4xl gap-5 sm:grid-cols-2">
          {FOUNDERS_AND_LEADERSHIP.map((person, i) => (
            <FounderCard key={person.id} person={person} index={i} />
          ))}
        </div>
      </section>

      <section aria-labelledby="governance-heading" className="container-page py-16 sm:py-24">
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-5">
            <h2 id="governance-heading" className="text-title text-fg">
              Governance
            </h2>
          </div>
          <div className="space-y-6 lg:col-span-7">
            <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
              {COMPANY_IDENTITY.legalName} is a private limited company incorporated on {COMPANY_IDENTITY.incorporationDate}{" "}
              under the Companies Act, 2013, in Andhra Pradesh.
            </p>
            <p className="text-sm tabular-nums text-fg-subtle">CIN {COMPANY_IDENTITY.cin}</p>
            <Button href="/contact" variant="secondary" arrow>
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
