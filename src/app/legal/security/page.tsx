import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Security & Responsible Disclosure",
  description: "Platform security principles and vulnerability disclosure guidelines for VANIKARA.",
};

export default function SecurityDisclosurePage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Platform Security
        </span>
        <h1 className="text-headline text-fg">
          Security & Responsible Disclosure
        </h1>
        <p className="text-sm text-fg-subtle">
          Published: September 2026 • Security Team: {COMPANY_IDENTITY.legalName}
        </p>
      </div>

      <div className="legal-prose surface space-y-10 rounded-panel p-6 sm:p-10">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            1. Our Security Philosophy
          </h2>
          <p>
            Security is not an afterthought at VANIKARA; it is an architectural baseline. We enforce strict database row-level security, environment variable hygiene, server-side data sanitization, cryptographic session tokens, and hardened HTTP response headers (CSP, HSTS, X-Frame-Options) across our web apps.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            2. Responsible Vulnerability Disclosure Program
          </h2>
          <p>
            We welcome responsible security researchers who assist us in maintaining the integrity of our software. If you identify a potential security vulnerability in our public endpoints, applications, or systems, please notify us immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            3. Reporting Guidelines
          </h2>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li>Email technical findings directly to: <a href={`mailto:${COMPANY_IDENTITY.supportEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.supportEmail}</a> or <a href={`mailto:${COMPANY_IDENTITY.officialEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.officialEmail}</a>.</li>
            <li>Include reproducible steps, target URI, payload samples, and potential business impact.</li>
            <li>Allow our engineering team reasonable time to investigate and remediate the issue prior to public disclosure.</li>
            <li>Do NOT access, alter, delete, or exfiltrate private customer or merchant data.</li>
            <li>Do NOT execute automated Denial of Service (DDoS) attacks, brute-force spamming, or physical social engineering.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            4. Our Commitment
          </h2>
          <p>
            For valid vulnerability submissions that follow these responsible disclosure principles, we commit to acknowledging reports within 48 business hours, keeping you updated on remediation progress, and recognizing your contribution.
          </p>
        </section>

      </div>
    </div>
  );
}
