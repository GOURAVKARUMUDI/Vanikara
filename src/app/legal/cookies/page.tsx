import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Explanation of cookies, local storage, and telemetry mechanisms utilized by VANIKARA.",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Cookie Governance
        </span>
        <h1 className="text-headline text-fg">
          Cookie Policy
        </h1>
        <p className="text-sm text-fg-subtle">
          Last Reviewed: September 2026 • Compliant with Indian DPDP Standards
        </p>
      </div>

      <div className="legal-prose surface space-y-10 rounded-panel p-6 sm:p-10">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies and browser storage mechanisms (such as localStorage and sessionStorage) are small files placed on your device to enable essential website functionality, store visual theme preferences, and maintain secure user authentication sessions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            2. Categories of Cookies We Use
          </h2>
          <div className="space-y-3">
            <div className="space-y-1 rounded-card border border-line bg-surface-sunken/60 p-4">
              <strong className="block text-fg">Essential & Security Cookies:</strong>
              <p>Necessary for logging into our administrative dashboards, managing cryptographic session tokens via Supabase Auth, and preventing CSRF attacks. These cannot be disabled.</p>
            </div>
            <div className="space-y-1 rounded-card border border-line bg-surface-sunken/60 p-4">
              <strong className="block text-fg">Preference & Interface Cookies:</strong>
              <p>Stores your selected color theme preference (&quot;vanikara-theme&quot;) so you don&apos;t have to re-toggle dark/light mode across page reloads.</p>
            </div>
            <div className="space-y-1 rounded-card border border-line bg-surface-sunken/60 p-4">
              <strong className="block text-fg">Telemetry & Performance:</strong>
              <p>Anonymized Core Web Vitals diagnostic pings to help our engineers optimize page load speed and layout stability. We do not use third-party behavioral advertising cookies.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            3. Managing Your Preferences
          </h2>
          <p>
            You can configure your browser to block or alert you about cookies at any time. However, disabling essential cookies may impact authentication and interactive features on the website.
          </p>
        </section>

      </div>
    </div>
  );
}
