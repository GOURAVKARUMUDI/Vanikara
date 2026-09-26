import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data governance practices of VANIKARA Intelligence Private Limited.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      {/* Back Link */}
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Privacy Policy
        </span>
        <h1 className="text-headline text-fg">
          Privacy Policy
        </h1>
        <p className="text-sm text-fg-subtle">
          Effective Date: 17 April 2026 • Last Reviewed: September 2026
        </p>
      </div>

      <div className="legal-prose surface space-y-10 rounded-panel p-6 sm:p-10">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            1. Introduction & Company Identity
          </h2>
          <p>
            {COMPANY_IDENTITY.legalName} (&quot;VANIKARA&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of individuals who interact with our websites, software products, and platforms. This Privacy Policy outlines our standards regarding data collection, processing, and storage in compliance with the Digital Personal Data Protection Act, 2023 (DPDP) and applicable Indian laws.
          </p>
          <p>
            Registered Office: {COMPANY_IDENTITY.registeredOffice} (CIN: {COMPANY_IDENTITY.cin}).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            2. Data We Collect
          </h2>
          <p>We only collect information necessary to provide our digital services, including:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li><strong>Contact Submissions:</strong> Name, email address, optional phone number, organization name, and inquiry text submitted via our web forms.</li>
            <li><strong>Platform Onboarding (When Active):</strong> Customer profiles, delivery addresses, telephone numbers, and order histories required for dispatch operations.</li>
            <li><strong>Merchant Information:</strong> Business registration proof, KYC documents, banking settlement details, and restaurant menu metadata.</li>
            <li><strong>Delivery Partner Data:</strong> Driving licences, vehicle registration, KYC records, and real-time GPS telemetry during active delivery shifts.</li>
            <li><strong>Technical Diagnostics:</strong> IP address, browser headers, and session tokens utilized strictly for authentication, rate-limiting, and fraud prevention.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            3. Purpose of Processing
          </h2>
          <p>Collected data is used strictly for:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li>Operating, testing, and improving our food delivery ecosystem and digital applications.</li>
            <li>Responding to customer and merchant partnership inquiries.</li>
            <li>Financial reconciliation and compliance under statutory Indian accounting regulations.</li>
            <li>Preventing fraudulent access, malicious bot traffic, and unauthorized platform misuse.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            4. Internal AI & CYGMA Privacy Guarantee
          </h2>
          <p>
            VANIKARA does NOT sell customer personal data to third-party data brokers. Data processed within our internal CYGMA AI initiative is strictly isolated within our secure infrastructure and is never submitted to public consumer AI training corpora.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            5. Data Security & Storage
          </h2>
          <p>
            We implement strict database row-level security (RLS), transport-layer encryption (HTTPS/TLS 1.3), and credential hashing. Access to transactional records is restricted to authorized personnel with logged audit trails.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            6. Contact & Grievance Officer
          </h2>
          <p>
            For privacy inquiries, data deletion requests, or compliance concerns, contact:
          </p>
          <div className="rounded-card border border-line bg-surface-sunken/60 p-4 tabular-nums">
            Email: <a href={`mailto:${COMPANY_IDENTITY.officialEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.officialEmail}</a> / <a href={`mailto:${COMPANY_IDENTITY.supportEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.supportEmail}</a><br />
            Address: {COMPANY_IDENTITY.registeredOffice}
          </div>
        </section>

      </div>
    </div>
  );
}
