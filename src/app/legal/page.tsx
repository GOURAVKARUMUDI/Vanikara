import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

import { LEGAL_DOCUMENTS } from "@/data/legal";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Terms, privacy, refund, delivery and cookie policies, pricing and company information for VANIKARA Intelligence Private Limited.",
  alternates: { canonical: "/legal" },
};

export default async function LegalHubPage() {
  const { identity: COMPANY_IDENTITY, legal: { grievanceOfficer: GRIEVANCE_OFFICER, effectiveDate: LEGAL_EFFECTIVE_DATE } } = await getSiteContent();
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Legal"
          tone="cool"
          title="Policies and company information."
          lead={`Terms, privacy and registration details for ${COMPANY_IDENTITY.legalName}.`}
        />
      </section>

      <section aria-labelledby="documents-title" className="container-page py-12">
        <h2 id="documents-title" className="sr-only">
          Documents
        </h2>
        <ul className="border-t border-line">
          {LEGAL_DOCUMENTS.map((doc, i) => (
            <li key={doc.href} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link
                href={doc.href}
                className="group grid gap-2 border-b border-line py-7 transition-colors sm:grid-cols-[1fr_1.4fr_auto] sm:items-center sm:gap-8"
              >
                <span className="text-lg font-semibold text-fg transition-colors group-hover:text-intel">{doc.title}</span>
                <span className="text-[0.9375rem] leading-relaxed text-fg-muted">{doc.desc}</span>
                <ArrowRight aria-hidden="true" className="arrow-nudge hidden h-5 w-5 text-fg-subtle group-hover:text-intel sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="registry-title" className="container-page py-16 sm:py-20">
        <div className="surface rounded-panel p-7 sm:p-10" data-reveal>
          <h2 id="registry-title" className="text-title text-fg">
            Registration
          </h2>
          <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-[0.8125rem] text-fg-subtle">Legal name</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-semibold text-fg">{COMPANY_IDENTITY.legalName}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-fg-subtle">CIN</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-semibold tabular-nums text-fg">{COMPANY_IDENTITY.cin}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-fg-subtle">Incorporated</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-semibold text-fg">{COMPANY_IDENTITY.incorporationDate}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-fg-subtle">Operations</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-semibold text-fg">{COMPANY_IDENTITY.operationalLocation}</dd>
            </div>
          </dl>
          <p className="mt-8 border-t border-line pt-6 text-sm text-fg-subtle">
            All policies effective {LEGAL_EFFECTIVE_DATE}. Grievance Officer: {GRIEVANCE_OFFICER.name},{" "}
            <a href={`mailto:${GRIEVANCE_OFFICER.email}?subject=Grievance`} className="font-semibold text-intel">
              {GRIEVANCE_OFFICER.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
