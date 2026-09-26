import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions governing the use of VANIKARA's websites and software platforms.",
};

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Terms of Service
        </span>
        <h1 className="text-headline text-fg">
          Terms & Conditions
        </h1>
        <p className="text-sm text-fg-subtle">
          Last Updated: September 2026 • Governing Law: Jurisdiction of Guntur, Andhra Pradesh, India
        </p>
      </div>

      <div className="legal-prose surface space-y-10 rounded-panel p-6 sm:p-10">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the website, applications, APIs, or digital products provided by {COMPANY_IDENTITY.legalName} (&quot;VANIKARA&quot;), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please refrain from using our platforms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            2. Platform Status & Development Notice
          </h2>
          <p>
            VANIKARA&apos;s primary software project (Food Delivery Platform) is currently in active development with a target launch in November 2026 starting in Guntur, Andhra Pradesh. Features, interface mockups, and operational mechanics described on this website are subject to refinement and change prior to formal public release.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            3. Intellectual Property Rights
          </h2>
          <p>
            All content, brand assets, source codes, logos, visual diagrams, and platform concepts displayed on this website are the proprietary property of {COMPANY_IDENTITY.legalName}. Unauthorized copying, redistribution, reverse engineering, or scraping of these assets without written authorization is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            4. User Conduct & Acceptable Use
          </h2>
          <p>Users agree not to:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li>Submit false, misleading, or abusive inquiries through our contact systems.</li>
            <li>Attempt to probe, scan, or breach our security firewalls or access unauthorized admin routes.</li>
            <li>Introduce malicious code, worms, automated DDoS requests, or spam bots.</li>
            <li>Misrepresent an affiliation with VANIKARA or its founding directors.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable Indian law, VANIKARA and its directors shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our websites or pre-release platforms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            6. Governing Law & Dispute Resolution
          </h2>
          <p>
            These terms are governed by the laws of India. Any legal dispute or controversy arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts in Guntur, Andhra Pradesh, India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            7. Contact Information
          </h2>
          <p>
            For legal notices or contractual inquiries, email: <a href={`mailto:${COMPANY_IDENTITY.officialEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.officialEmail}</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
