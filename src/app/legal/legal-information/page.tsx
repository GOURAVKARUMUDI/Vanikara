import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Statutory & Corporate Registry Information",
  description: "Official legal identity, incorporation details, CIN, and registered office for VANIKARA Intelligence Private Limited.",
};

export default function LegalInformationPage() {
  const details = [
    { label: "Full Legal Entity Name", val: COMPANY_IDENTITY.legalName },
    { label: "Brand Name", val: COMPANY_IDENTITY.brandName },
    { label: "Corporate Identity Number (CIN)", val: COMPANY_IDENTITY.cin },
    { label: "Founding Date", val: COMPANY_IDENTITY.foundingDate },
    { label: "Incorporation Date", val: COMPANY_IDENTITY.incorporationDate },
    { label: "Entity Classification", val: "Private Limited Company (Non-Government)" },
    { label: "Governing Statute", val: "Companies Act, 2013 (Ministry of Corporate Affairs, India)" },
    { label: "State of Jurisdiction", val: COMPANY_IDENTITY.state },
    { label: "Country of Incorporation", val: COMPANY_IDENTITY.country },
    { label: "Operational Location", val: COMPANY_IDENTITY.operationalLocation },
    { label: "Official Email Address", val: COMPANY_IDENTITY.officialEmail },
    { label: "Support Email Address", val: COMPANY_IDENTITY.supportEmail }
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Statutory Disclosure
        </span>
        <h1 className="text-headline text-fg">
          Legal Information & Registry
        </h1>
        <p className="text-sm text-fg-subtle">
          Verified Company Incorporation Records
        </p>
      </div>

      {/* Registry Table Card */}
      <div className="legal-prose surface space-y-8 rounded-panel p-6 sm:p-10">
        
        <div className="flex items-center gap-3 border-b border-line pb-5">
          <Scale className="h-5 w-5 text-intel" />
          <h2 className="text-lg font-bold text-fg">
            MCA Registered Company Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {details.map((item, idx) => (
            <div key={idx} className="space-y-1 rounded-card border border-line bg-surface-sunken/60 p-4">
              <span className="block text-[0.8125rem] font-semibold text-fg-subtle">
                {item.label}
              </span>
              <span className="text-[0.9375rem] font-bold text-fg">
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* Registered Office Full Box */}
        <div className="space-y-1 rounded-card border border-intel/20 bg-intel/5 p-4">
          <span className="block text-[0.8125rem] font-semibold text-fg-subtle">
            Registered Office Address
          </span>
          <p className="text-[0.9375rem] font-medium leading-relaxed text-fg">
            {COMPANY_IDENTITY.registeredOffice}
          </p>
        </div>

        <div className="border-t border-line pt-4 text-sm text-fg-subtle">
          This registry record is published in accordance with the regulatory transparency provisions of the Companies Act, 2013 and Ministry of Corporate Affairs, Government of India.
        </div>

      </div>

    </div>
  );
}
