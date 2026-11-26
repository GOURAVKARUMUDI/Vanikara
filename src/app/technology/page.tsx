import type { Metadata } from "next";
import { ShieldCheck, Database, Cpu, Lock, CheckCircle2, Layers } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Technology & Engineering",
  description:
    "How Vanikara approaches software architecture, cybersecurity, data management, privacy by design, reliability, and testing.",
};

const ARCHITECTURE_DOMAINS = [
  {
    icon: Layers,
    title: "Modular Monolith First",
    status: "Current Implementation",
    desc: "Clean service boundaries inside a unified Next.js and PostgreSQL deployment. We avoid premature microservices until operational scale demands separation.",
  },
  {
    icon: Database,
    title: "Structured Data Management",
    status: "Current Implementation",
    desc: "Relational schemas in PostgreSQL with strict foreign keys, Zod runtime validation, and versioned SQL migrations.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Perimeter Defense",
    status: "Current Implementation",
    desc: "Strict Content Security Policy, HSTS, HttpOnly HMAC-signed sessions, scrypt password hashing, rate limiting, and origin validation.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    status: "Current Implementation",
    desc: "Consent-gated optional analytics, private encrypted résumé storage with short-lived signed URLs, and structured data access workflows.",
  },
  {
    icon: CheckCircle2,
    title: "Automated Verification & QA",
    status: "Current Implementation",
    desc: "TypeScript strict checks, ESLint static analysis, unit tests, and Playwright end-to-end security regression suites.",
  },
  {
    icon: Cpu,
    title: "Internal Operational Intelligence",
    status: "Future Engineering Goal",
    desc: "Carefully structured operational telemetry designed to support CYGMA internal decision-support workflows as products launch.",
  },
];

const STACK = [
  { layer: "Application", tech: "Next.js (App Router), React, TypeScript" },
  { layer: "Design System", tech: "Tailwind CSS, CSS Custom Properties, Accessible HTML" },
  { layer: "Data & Storage", tech: "PostgreSQL (Supabase), Row-Level Security, Private Buckets" },
  { layer: "Security & Auth", tech: "Scrypt, Web Crypto HMAC-SHA256, Firebase Auth, Zod, DOMPurify" },
  { layer: "Operations", tech: "Zoho SMTP, Upstash Redis Rate Limiting, Playwright, Vercel" },
];

export default function TechnologyPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="Technology & Engineering"
            tone="cool"
            title="How we intend to build."
            lead="Our engineering standards emphasize clarity, security in the data layer, and honest separation between what is operational today and what is planned."
          />
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal>
            {ARCHITECTURE_DOMAINS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Icon aria-hidden="true" className="h-5 w-5 text-intel" />
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${
                        item.status === "Current Implementation"
                          ? "bg-status-success/10 text-status-success"
                          : "bg-intel/10 text-intel"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-fg">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section id="security" className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-5">
              <Eyebrow tone="cool">Security Architecture</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Defense in depth across every layer.</h2>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                Authorization is enforced on the server for every protected API route and database record — never solely in the browser interface.
              </p>
              <div className="mt-6">
                <Button href="/legal/security" variant="outline" arrow>
                  Read Security Policy
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="surface overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
                    <tr>
                      <th className="px-5 py-3">Layer</th>
                      <th className="px-5 py-3">Core Technologies & Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {STACK.map((row) => (
                      <tr key={row.layer}>
                        <td className="px-5 py-3.5 font-semibold text-fg">{row.layer}</td>
                        <td className="px-5 py-3.5 text-fg-muted">{row.tech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
