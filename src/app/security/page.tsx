"use client";

import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { Key, Mail, HeartHandshake } from "lucide-react";
import { FadeUp } from "@/components/Animate";

export default function SecurityPage() {
  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Security Center"
        title={<>System <span className="gradient-text">Security</span></>}
        subtitle="Learn about VANIKARA's commitment to secure data isolation, cryptographic keys, and responsible vulnerability reporting."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        
        <FadeUp>
          <div className="p-6 rounded-2xl text-xs sm:text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent-color)] font-semibold backdrop-blur-md shadow-sm">
            🛡️ VANIKARA Intelligence is committed to security and data privacy. If you believe you discovered a system security vulnerability, please review our disclosure protocols below.
          </div>
        </FadeUp>

        <div className="space-y-10">
          
          {/* Section 1 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <Key className="w-5 h-5 text-[var(--accent-color)]" />
                1. Data Isolation & Cryptography
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  We store user data using strict **Row-Level Security (RLS)** schemas hosted on Supabase clusters. This prevents any visitor nodes from accessing data profiles belonging to other tenants.
                </p>
                <p>
                  All database connections and API payload requests are encrypted in transit using **TLS 1.3** transport layers, and passwords/auth keys use cryptographically secure hashing functions.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Section 2 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[var(--accent-color)]" />
                2. Responsible Disclosure Program
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  We welcome reports from independent security researchers. If you identify a potential security issue (e.g. cross-site scripting, authentication bypass, data exposure), please report it to our engineering staff.
                </p>
                <p>
                  **Guidelines:**
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
                  <li>Provide detailed reproduction logs, request headers, or steps to verify the vulnerability.</li>
                  <li>Avoid actions that disrupt node performances (such as denial-of-service tests or bulk scanning).</li>
                  <li>Give our engineering team reasonable time (at least 14 days) to analyze and resolve the issue before publishing details.</li>
                </ul>
              </div>
            </div>
          </FadeUp>

          {/* Section 3 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--accent-color)]" />
                3. Vulnerability Reporting Contact
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  Reports should be dispatched to: <a href="mailto:vanikara26@gmail.com" className="text-[var(--accent-color)] font-bold hover:underline">vanikara26@gmail.com</a>.
                </p>
                <p>
                  For sensitive reports, you may request our pgp key or submit reports using encrypted email clients. Our team acknowledges reports within **48 hours** and schedules security patches immediately.
                </p>
              </div>
            </div>
          </FadeUp>

        </div>

        {/* Bottom Contact CTA */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-wrap gap-3">
          <Button href="/contact?subject=Security Report" variant="primary" className="gap-1.5 font-bold text-xs uppercase tracking-wide">
            <Mail className="w-4 h-4" /> Submit Security Report
          </Button>
          <Button href="/privacy" variant="ghost" className="font-bold text-xs uppercase tracking-wide">
            View Privacy Policy
          </Button>
        </div>

      </div>
    </div>
  );
}
