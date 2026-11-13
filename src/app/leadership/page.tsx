import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import FounderCard from "@/components/people/FounderCard";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leadership",
  description: "The leadership of VANIKARA Intelligence Private Limited.",
};

export default async function LeadershipPage() {
  const { identity: COMPANY_IDENTITY, people: FOUNDERS_AND_LEADERSHIP } = await getSiteContent();
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Leadership"
          tone="cool"
          title="The people building VANIKARA."
          lead="Leading VANIKARA's administration, technology, operations and finance, alongside its people, culture and marketing."
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
