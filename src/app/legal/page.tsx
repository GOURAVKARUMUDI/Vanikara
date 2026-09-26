import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Statutory corporate details, legal documentation, privacy policies, terms, and compliance disclosures for VANIKARA Intelligence Private Limited.",
};

const LEGAL_DOCUMENTS = [
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    desc: "How we collect, safeguard, and process user information across our applications and platforms."
  },
  {
    title: "Terms & Conditions",
    href: "/legal/terms",
    desc: "The legal terms, service conditions, and acceptable use guidelines governing all VANIKARA products."
  },
  {
    title: "Cookie Policy",
    href: "/legal/cookies",
    desc: "Explanation of session cookies, local storage tokens, and performance telemetry mechanisms."
  },
  {
    title: "Refund Policy",
    href: "/legal/refund",
    desc: "Guidelines regarding order cancellations, platform billing, merchant payouts, and dispute resolutions."
  },
  {
    title: "Security & Responsible Disclosure",
    href: "/legal/security",
    desc: "Our vulnerability disclosure program, reporting protocols, and platform security standards."
  },
  {
    title: "Statutory & Corporate Registry Information",
    href: "/legal/legal-information",
    desc: "Official incorporation registry, CIN, registered office location, and statutory filing details."
  }
];

export default function LegalHubPage() {
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
            <div className="sm:col-span-2 lg:col-span-4">
              <dt className="text-[0.8125rem] text-fg-subtle">Registered office</dt>
              <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-fg">{COMPANY_IDENTITY.registeredOffice}</dd>
            </div>
          </dl>
          <p className="mt-8 border-t border-line pt-6 text-sm text-fg-subtle">
            Policies are published for transparency and are reviewed as the company and its products develop.
          </p>
        </div>
      </section>
    </>
  );
}
