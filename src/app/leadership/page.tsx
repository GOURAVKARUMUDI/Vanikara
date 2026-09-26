import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import FounderCard from "@/components/people/FounderCard";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY, FOUNDERS_AND_LEADERSHIP } from "@/data/company";

export const metadata: Metadata = {
  title: "Leadership",
  description: "The founders and leadership of VANIKARA Intelligence Private Limited.",
};

export default function LeadershipPage() {
  const founders = FOUNDERS_AND_LEADERSHIP.filter((p) => p.isFounder);
  const leadership = FOUNDERS_AND_LEADERSHIP.filter((p) => !p.isFounder);

  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Leadership"
          tone="cool"
          title="The people building VANIKARA."
          lead="Three founders and a people lead, working directly on the company's products, operations and culture."
        />
      </section>

      <section aria-labelledby="founders-heading" className="container-page py-12">
        <h2 id="founders-heading" className="sr-only">
          Founders
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((person, i) => (
            <FounderCard key={person.id} person={person} index={i} detailed />
          ))}
        </div>
      </section>

      {leadership.length > 0 && (
        <section aria-labelledby="people-heading" className="container-page py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div data-reveal>
              <Eyebrow>People and culture</Eyebrow>
              <h2 id="people-heading" className="text-title mt-4 text-fg">
                Building the team VANIKARA will grow with.
              </h2>
            </div>
            {leadership.map((person, i) => (
              <FounderCard key={person.id} person={person} index={i + founders.length} detailed />
            ))}
          </div>
        </section>
      )}

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
              under the Companies Act, 2013, in Andhra Pradesh. The three founders serve as its directors.
            </p>
            <p className="text-sm tabular-nums text-fg-subtle">CIN {COMPANY_IDENTITY.cin}</p>
            <Button href="/contact" variant="secondary" arrow>
              Contact the founders
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
