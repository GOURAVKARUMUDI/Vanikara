"use client";

import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import { Scale, FileText, ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/Animate";

export default function LegalPage() {
  const legalDetails = [
    { label: "Company Legal Name", val: "VANIKARA Intelligence Private Limited" },
    { label: "Date of Incorporation", val: "17 April 2026" },
    { label: "Corporate Identity Number (CIN)", val: "U47912AP2026PTC125340" },
    { label: "Country of Origin", val: "India" },
    { label: "Legal Entity Type", val: "Private Limited Company" },
    { label: "Registered under", val: "The Companies Act, 2013" }
  ];

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Corporate Registry"
        title={<>Legal <span className="gradient-text">Information</span></>}
        subtitle="Official legal status, incorporation details, and trademark notices for VANIKARA Intelligence Private Limited."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        
        {/* Registry Card */}
        <FadeUp>
          <Card hover>
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[var(--glass-border)] pb-4 select-none">
                <Scale className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)]">
                  Incorporation Registry Logs
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {legalDetails.map((item) => (
                  <div key={item.label} className="text-xs space-y-1">
                    <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)]">{item.label}</span>
                    <span className="text-[var(--text-primary)] font-bold text-sm">{item.val}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </FadeUp>

        {/* IP and Trademarks */}
        <FadeUp>
          <div className="space-y-4">
            <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide">
              Intellectual Property & Trademarks
            </h2>
            <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
              <p>
                The terms &quot;VANIKARA&quot;, &quot;CYGMA AI&quot;, &quot;Vanik&quot;, &quot;FriskFree&quot;, and their associated symbols, logotypes, and assets are registered trademark holdings of VANIKARA Intelligence Private Limited.
              </p>
              <p>
                All software source codes, WebGL configurations, mesh gradient shaders, and database schemas are the copyright property of the company. Accessing or browsing our platforms does not transfer intellectual property rights.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Legal Notices */}
        <FadeUp>
          <div className="space-y-4">
            <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide">
              Legal Policy Documents
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Refer to our specific compliance and governance documents:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Refund Policy", href: "/refund" }
              ].map((policy) => (
                <a
                  key={policy.label}
                  href={policy.href}
                  className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-color)] text-xs text-[var(--text-primary)] font-extrabold flex justify-between items-center group transition-all hover:scale-[1.01]"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--accent-color)]" />
                    {policy.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
