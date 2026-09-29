import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY, FOUNDERS_AND_LEADERSHIP } from "@/data/company";
import { GrievanceCard } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Company Information",
  description: "Registered name, CIN, registered office, directors and grievance officer of VANIKARA Intelligence Private Limited.",
  alternates: { canonical: "/legal/legal-information" },
};

const C = COMPANY_IDENTITY;

const DETAILS = [
  { label: "Registered name", val: C.legalName },
  { label: "Brand name", val: C.brandName },
  { label: "Corporate Identity Number (CIN)", val: C.cin },
  { label: "Company type", val: "Private limited company, limited by shares" },
  { label: "Incorporated under", val: "Companies Act, 2013 (Ministry of Corporate Affairs)" },
  { label: "Date of incorporation", val: C.incorporationDate },
  { label: "State", val: `${C.state}, ${C.country}` },
  { label: "Business email", val: C.officialEmail },
  { label: "Customer support", val: C.supportEmail },
];

const DIRECTORS = FOUNDERS_AND_LEADERSHIP.filter((p) => p.isDirector);

export default function LegalInformationPage() {
  return (
    <div className="container-page pb-16 pt-10 sm:pt-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Legal
        </Link>

        <header className="rise-in mt-6">
          <span className="eyebrow">
            <span aria-hidden="true" className="eyebrow-dot" data-tone="cool" />
            Company
          </span>
          <h1 className="text-headline mt-4 text-fg">Company Information</h1>
          <p className="text-lead mt-5 max-w-2xl">
            Official details of the company that operates this website and provides our services.
          </p>
        </header>

        <section aria-labelledby="registry-title" className="surface mt-8 overflow-hidden rounded-panel">
          <h2 id="registry-title" className="border-b border-line px-6 py-4 text-sm font-bold text-fg sm:px-8">
            Registration
          </h2>
          <dl className="divide-y divide-[var(--border-subtle)]">
            {DETAILS.map((item) => (
              <div key={item.label} className="grid gap-1 px-6 py-3.5 text-sm sm:grid-cols-[14rem_1fr] sm:px-8">
                <dt className="text-fg-subtle">{item.label}</dt>
                <dd className="font-semibold text-fg">{item.val}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-6 py-3.5 text-sm sm:grid-cols-[14rem_1fr] sm:px-8">
              <dt className="text-fg-subtle">Registered office</dt>
              <dd className="font-semibold text-fg">{C.registeredOffice}</dd>
            </div>
            <div className="grid gap-1 px-6 py-3.5 text-sm sm:grid-cols-[14rem_1fr] sm:px-8">
              <dt className="text-fg-subtle">Directors</dt>
              <dd className="font-semibold text-fg">{DIRECTORS.map((d) => d.fullName).join(", ")}</dd>
            </div>
          </dl>
        </section>

        <GrievanceCard />

        <p className="mt-6 text-xs text-fg-subtle">
          Company records can be verified on the Ministry of Corporate Affairs portal (mca.gov.in) using the CIN above.
        </p>
      </div>
    </div>
  );
}
