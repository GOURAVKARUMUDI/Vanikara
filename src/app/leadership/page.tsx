import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import FounderCard from "@/components/people/FounderCard";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Founders, directors, and corporate governance of VANIKARA Intelligence Private Limited.",
};

export default async function LeadershipPage() {
  const { identity, people } = await getSiteContent();

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="Leadership & Governance"
            tone="cool"
            title="The people building VANIKARA."
            lead={`${identity.legalName} is led by its founders and board of directors in ${identity.operationalLocation}.`}
          />
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2" data-reveal>
            {people.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="surface p-6 sm:p-10" data-reveal>
            <Eyebrow tone="cool">Corporate Governance</Eyebrow>
            <h2 className="text-title mt-3 text-fg">Accountability & statutory compliance</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              Registered under the Companies Act, 2013 (CIN <span className="font-mono">{identity.cin}</span>). All statutory disclosures, grievance officer contacts, and legal policies are maintained transparently in our Legal Hub.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/legal/legal-information" variant="outline" arrow>
                Company Information
              </Button>
              <Button href="/contact" variant="ghost">
                Contact Leadership
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
