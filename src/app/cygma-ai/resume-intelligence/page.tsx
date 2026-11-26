import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertTriangle, FileCheck2, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import CygmaRiEnquiryForm from "@/sections/cygma/CygmaRiEnquiryForm";
import CygmaRiInterfacePreview from "@/components/cygma/CygmaRiInterfacePreview";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "CYGMA-RI | AI-Powered Resume Intelligence",
  description:
    "CYGMA-RI is a B2B resume analysis and pre-verification platform powered by CYGMA_AI, designed to support evidence-based recruitment and human-led hiring decisions.",
  alternates: { canonical: "/cygma-ai/resume-intelligence" },
};

const CHALLENGES = [
  "Time-consuming manual resume review across high-volume applicant pools.",
  "Inconsistent or incomplete formatting across candidate documents.",
  "Difficulty cross-checking education and employment claims consistently.",
  "Effort required to review linked technical repositories and project evidence.",
  "Repetitive pre-screening tasks that pull recruiters away from candidate conversations.",
];

const CAPABILITIES = [
  { name: "Batch resume upload", status: "In Development" },
  { name: "Resume information extraction", status: "In Development" },
  { name: "Structured candidate summaries", status: "In Development" },
  { name: "Job requirement matching", status: "In Development" },
  { name: "Education claim cross-checking", status: "Planned" },
  { name: "Employment claim cross-checking", status: "Planned" },
  { name: "Permitted LinkedIn evidence review", status: "Planned" },
  { name: "Permitted GitHub project & skill evidence review", status: "Planned" },
  { name: "Potential inconsistency identification", status: "In Development" },
  { name: "Missing information identification", status: "In Development" },
  { name: "Evidence-based verification reports", status: "In Development" },
  { name: "Recruiter review workflows", status: "Planned" },
];

const WORKFLOW_STEPS = [
  "Company uploads a batch of candidate résumés inside its isolated workspace.",
  "Recruiter supplies the structured job requirements for the role.",
  "CYGMA_AI extracts and structures candidate information from the résumés.",
  "Candidate experience and skills are compared against the job requirements.",
  "Permitted supporting evidence from candidate-provided LinkedIn and GitHub URLs is reviewed.",
  "Potential inconsistencies and missing information are flagged with references.",
  "An evidence-based pre-verification report is generated.",
  "Recruiter reviews the structured summary and evidence references.",
  "Recruiter performs any necessary additional manual verification.",
  "Authorized human personnel make the final recruitment decision.",
];

const EVIDENCE_LABELS = [
  { label: "Supporting Evidence Found", tone: "text-status-success bg-status-success/10", desc: "Claim aligns with permitted supporting evidence." },
  { label: "Partially Supported", tone: "text-intel bg-intel/10", desc: "Some details match; minor fields remain unconfirmed." },
  { label: "Potential Inconsistency", tone: "text-ambition bg-ambition/10", desc: "Difference noted (may reflect outdated profiles or legitimate circumstances — never labeled fraudulent)." },
  { label: "Evidence Unavailable", tone: "text-fg-muted bg-surface-secondary", desc: "No profile URL supplied or public data unavailable." },
  { label: "Manual Verification Required", tone: "text-status-warning bg-status-warning/10", desc: "Flagged for human recruiter follow-up." },
];

const ENTERPRISE_USERS = [
  "Corporate recruitment departments",
  "Human resources teams",
  "Talent acquisition teams",
  "Recruitment agencies",
  "Technical hiring teams",
  "Staffing companies",
  "Organizations processing high resume volumes",
];

export default async function CygmaRiProductPage() {
  const { portfolio } = await getSiteContent();
  const cygmaRi = getPortfolioItemById(portfolio, "cygma-ri");

  return (
    <>
      {/* Section 1: Light Enterprise Product Hero contrasting with dark CYGMA_AI */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <Link href="/cygma-ai" className="inline-flex items-center gap-1.5 text-sm font-medium text-intel hover:underline">
            <ArrowLeft className="h-4 w-4" />
            CYGMA_AI Ecosystem
          </Link>

          <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="rise-in lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <span className="font-semibold text-intel">CYGMA-RI (RESUME INTELLIGENCE)</span>
                <span className="rounded bg-intel/10 px-2.5 py-0.5 text-intel">
                  {cygmaRi?.developmentStatus ?? "In Development"}
                </span>
              </div>
              <h1 className="text-page-title mt-4 text-fg">
                Less Manual Verification. More Informed Recruitment.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-fg-muted">
                CYGMA-RI (Resume Intelligence) is a B2B resume analysis and pre-verification platform powered by CYGMA_AI — Vanikara Intelligence. It helps companies and recruiters analyse resumes, match job requirements, identify inconsistencies, and review permitted supporting evidence from LinkedIn and GitHub while keeping final hiring decisions entirely in human hands.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#early-access" size="lg" arrow>
                  Request Early Access
                </Button>
                <Button href="#how-it-works" variant="outline" size="lg">
                  Explore How It Works
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <CygmaRiInterfacePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Recruitment Challenges */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-5">
              <Eyebrow tone="cool">The Problem Space</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Why pre-verification slows hiring teams down.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                While every hiring organization operates differently, high-volume recruitment teams frequently encounter repetitive manual screening bottlenecks.
              </p>
            </div>
            <ul className="space-y-3 lg:col-span-7">
              {CHALLENGES.map((item, idx) => (
                <li key={item} className="surface-muted flex items-start gap-3 p-4 text-sm text-fg">
                  <span className="font-mono text-xs font-semibold text-intel">0{idx + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Core Capabilities */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Core Capabilities</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Structured analysis and evidence review.</h2>
            <p className="mt-3 text-sm text-fg-muted">
              Capabilities are labeled transparently to distinguish active development from planned features.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {CAPABILITIES.map((cap) => (
              <div key={cap.name} className="surface flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-medium text-fg">{cap.name}</span>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${
                    cap.status === "In Development"
                      ? "bg-intel/10 text-intel"
                      : "bg-surface-secondary text-fg-subtle"
                  }`}
                >
                  {cap.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How CYGMA-RI Works */}
      <section id="how-it-works" className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Intended Workflow</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">How CYGMA-RI works.</h2>
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2" data-reveal>
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="surface-muted flex items-start gap-3.5 p-5 text-sm text-fg">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-intel text-xs font-mono font-semibold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 5 & 6: Illustrative Recruiter Report & Efficiency Objective */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="space-y-6 lg:col-span-7">
              <div>
                <Eyebrow tone="cool">Recruiter Reports · Illustrative Concept</Eyebrow>
                <h2 className="text-headline mt-3 text-fg">Evidence classification, not opaque scores.</h2>
                <p className="mt-2 text-sm text-fg-muted">
                  Reports organize candidate summaries, education, employment, skills, job requirement alignment, and permitted LinkedIn/GitHub evidence using clear status labels.
                </p>
              </div>

              <div className="surface p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-fg">
                    <FileCheck2 className="h-4 w-4 text-intel" />
                    Illustrative Evidence Classification Key
                  </span>
                  <span className="rounded bg-surface-secondary px-2 py-0.5 font-mono text-[10px] uppercase text-fg-subtle">
                    Conceptual Preview
                  </span>
                </div>
                {EVIDENCE_LABELS.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 border-b border-line pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className={`inline-block w-fit rounded px-2.5 py-1 font-mono text-xs font-medium ${item.tone}`}>
                      {item.label}
                    </span>
                    <span className="text-xs text-fg-muted sm:max-w-sm sm:text-right">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="surface p-6 sm:p-8">
                <p className="font-mono text-xs uppercase text-intel">Efficiency Objective (Target Workflow)</p>
                <h3 className="mt-2 text-xl font-semibold text-fg">Designed to reduce manual effort.</h3>
                <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-fg-muted">Illustrative manual review baseline</dt>
                    <dd className="font-mono font-semibold text-fg">~10 min / resume</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-fg-muted">Target AI-assisted report generation</dt>
                    <dd className="font-mono font-semibold text-intel">~1 min</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-fg-muted">Target recruiter summary review</dt>
                    <dd className="font-mono font-semibold text-intel">~1 min</dd>
                  </div>
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-fg-subtle">
                  These figures represent our intended product workflow objective, not a verified production benchmark or guaranteed processing time.
                </p>
              </div>

              <div className="surface p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <Users className="h-4 w-4 text-intel" />
                  Intended Enterprise Users
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-fg-muted">
                  {ENTERPRISE_USERS.map((u) => (
                    <li key={u}>• {u}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7 & 8: LinkedIn/GitHub Boundaries, Privacy, Fairness & Human Oversight */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="mb-10 rounded-card border border-intel/30 bg-intel/5 p-6 sm:p-8" data-reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-intel">Human Oversight Principle</p>
            <h2 className="text-headline mt-2 text-fg">Intelligence supports the decision. Humans make it.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">
              CYGMA-RI assists recruitment teams with information analysis and pre-verification. It does not make final hiring, rejection, or employment decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" data-reveal>
            <div className="surface p-6 space-y-2.5">
              <CheckCircle2 className="h-5 w-5 text-intel" />
              <h3 className="text-base font-semibold text-fg">Permitted LinkedIn &amp; GitHub Review</h3>
              <p className="text-xs leading-relaxed text-fg-muted">
                Only candidate-provided URLs are reviewed within platform terms and permissions. Absence of public GitHub repositories is never treated as a negative signal.
              </p>
            </div>
            <div className="surface p-6 space-y-2.5">
              <AlertTriangle className="h-5 w-5 text-ambition" />
              <h3 className="text-base font-semibold text-fg">Missing Links &amp; Non-Guessing Rule</h3>
              <p className="text-xs leading-relaxed text-fg-muted">
                If a résumé omits LinkedIn or GitHub URLs, evidence is marked unavailable for manual follow-up. CYGMA-RI never searches for profiles, guesses identity, or auto-rejects candidates.
              </p>
            </div>
            <div className="surface p-6 space-y-2.5">
              <ShieldCheck className="h-5 w-5 text-status-success" />
              <h3 className="text-base font-semibold text-fg">Fairness, Privacy &amp; Security</h3>
              <p className="text-xs leading-relaxed text-fg-muted">
                Designed for tenant isolation, prompt-injection defense on untrusted résumé/repo text, zero use of protected attributes (photo, religion, caste, ethnicity, gender, disability), and zero unauthorized model training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Enterprise B2B Early Access Form */}
      <section id="early-access" className="bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <Eyebrow tone="cool">Enterprise Interest</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Request CYGMA-RI Early Access.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Connect with our team for early access notifications, enterprise partnerships, or product information. Enquiries are routed directly to Vanikara Console CRM.
              </p>
            </div>
            <div className="lg:col-span-8">
              <CygmaRiEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
