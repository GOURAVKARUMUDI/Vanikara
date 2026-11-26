"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, FileText, Github, Linkedin, UserCheck } from "lucide-react";

interface DemoCandidate {
  id: string;
  name: string;
  role: string;
  alignment: string;
  status: string;
  education: { claim: string; label: string; tone: string };
  employment: { claim: string; label: string; tone: string };
  linkedin: { summary: string; label: string; tone: string };
  github: { summary: string; label: string; tone: string };
  flags: string[];
}

const DEMO_CANDIDATES: DemoCandidate[] = [
  {
    id: "cand-1",
    name: "A. Demo Candidate 01",
    role: "Senior Backend Engineer",
    alignment: "High Requirement Alignment",
    status: "Awaiting Recruiter Review",
    education: {
      claim: "B.Tech in Computer Science (2018–2022)",
      label: "Supporting Evidence Found",
      tone: "text-[#198038] bg-[#198038]/10",
    },
    employment: {
      claim: "Software Engineer · Example Systems (2022–2026)",
      label: "Partially Supported",
      tone: "text-[#0F62FE] bg-[#0F62FE]/10",
    },
    linkedin: {
      summary: "Candidate-provided URL reviewed: degree and role title align; start month differs by 2 months.",
      label: "Potential Inconsistency",
      tone: "text-[#C2410C] bg-[#C2410C]/10",
    },
    github: {
      summary: "Candidate-provided URL reviewed: 14 public TypeScript/Go repositories with recent commit history.",
      label: "Supporting Evidence Found",
      tone: "text-[#198038] bg-[#198038]/10",
    },
    flags: [
      "Confirm exact employment start date during recruiter screening (2-month variance between résumé and LinkedIn).",
    ],
  },
  {
    id: "cand-2",
    name: "B. Demo Candidate 02",
    role: "Full-Stack Engineer",
    alignment: "Moderate Requirement Alignment",
    status: "Manual Verification Required",
    education: {
      claim: "M.Sc. Software Engineering (2020–2022)",
      label: "Supporting Evidence Found",
      tone: "text-[#198038] bg-[#198038]/10",
    },
    employment: {
      claim: "Frontend Developer · Sample Labs (2022–2025)",
      label: "Supporting Evidence Found",
      tone: "text-[#198038] bg-[#198038]/10",
    },
    linkedin: {
      summary: "Candidate-provided URL reviewed: roles and graduation year consistent with résumé.",
      label: "Supporting Evidence Found",
      tone: "text-[#198038] bg-[#198038]/10",
    },
    github: {
      summary: "No GitHub URL supplied in résumé. System does not search or guess external profiles.",
      label: "Evidence Unavailable",
      tone: "text-[#525252] bg-[#E0E0E0]/60",
    },
    flags: [
      "GitHub profile not provided — absence of public repositories is not a negative signal; verify technical samples in interview.",
    ],
  },
];

/**
 * High-resolution conceptual desktop interface preview for CYGMA-RI (Resume Intelligence).
 * Uses fictional demonstration records only; explicitly labeled as an illustrative preview.
 */
export default function CygmaRiInterfacePreview({ compact = false }: { compact?: boolean }) {
  const [selectedId, setSelectedId] = useState(DEMO_CANDIDATES[0].id);
  const candidate = DEMO_CANDIDATES.find((c) => c.id === selectedId) ?? DEMO_CANDIDATES[0];

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E0E0E0] bg-white text-[#111111] shadow-[0_20px_50px_rgba(16,28,48,0.10)]">
      {/* Desktop Application Chrome */}
      <div className="flex items-center justify-between border-b border-[#E0E0E0] bg-[#F5F5F7] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#D4D4D8]" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#D4D4D8]" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#D4D4D8]" />
          <span className="ml-2 font-mono text-[11px] font-medium text-[#525252]">
            CYGMA-RI · Pre-Verification Workspace
          </span>
        </div>
        <span className="rounded bg-[#0F62FE]/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-[#0F62FE]">
          Illustrative Product Interface
        </span>
      </div>

      {/* Workspace Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar: Batch Candidates */}
        <div className="border-b border-[#E0E0E0] bg-[#FAFAFB] p-3 lg:col-span-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F6F6F]">
              Batch Queue (Demo Data)
            </span>
            <span className="font-mono text-[10px] text-[#0F62FE]">2 of 24</span>
          </div>
          <div className="space-y-1.5">
            {DEMO_CANDIDATES.map((c) => {
              const active = c.id === candidate.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full rounded-[6px] border p-3 text-left transition-colors ${
                    active
                      ? "border-[#0F62FE] bg-white shadow-xs"
                      : "border-transparent bg-transparent hover:border-[#E0E0E0] hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#111111]">{c.name}</span>
                    <FileText className="h-3.5 w-3.5 shrink-0 text-[#6F6F6F]" />
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#525252]">{c.role}</p>
                  <p className="mt-1.5 font-mono text-[10px] text-[#0F62FE]">{c.alignment}</p>
                </button>
              );
            })}
          </div>

          {!compact && (
            <div className="mt-4 rounded-[6px] border border-[#E0E0E0] bg-white p-3">
              <p className="font-mono text-[10px] font-semibold uppercase text-[#6F6F6F]">Human Review Control</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#525252]">
                No automated hiring or rejection actions exist. Recruiter sign-off is required.
              </p>
            </div>
          )}
        </div>

        {/* Right Pane: Structured Evidence Report */}
        <div className="p-4 sm:p-5 lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E0E0E0] pb-3">
            <div>
              <h4 className="text-sm font-bold text-[#111111]">{candidate.name}</h4>
              <p className="text-xs text-[#525252]">{candidate.role} · Fictional Demonstration Record</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded bg-[#F0F2F5] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#101C30]">
              <UserCheck className="h-3 w-3 text-[#0F62FE]" />
              {candidate.status}
            </span>
          </div>

          {/* Education & Employment Cross-Check */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-[6px] border border-[#E0E0E0] p-3">
              <p className="font-mono text-[10px] uppercase text-[#6F6F6F]">Education Claim</p>
              <p className="mt-1 text-xs font-medium text-[#111111]">{candidate.education.claim}</p>
              <span className={`mt-2 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-medium ${candidate.education.tone}`}>
                {candidate.education.label}
              </span>
            </div>
            <div className="rounded-[6px] border border-[#E0E0E0] p-3">
              <p className="font-mono text-[10px] uppercase text-[#6F6F6F]">Employment Claim</p>
              <p className="mt-1 text-xs font-medium text-[#111111]">{candidate.employment.claim}</p>
              <span className={`mt-2 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-medium ${candidate.employment.tone}`}>
                {candidate.employment.label}
              </span>
            </div>
          </div>

          {/* Permitted External Evidence: LinkedIn & GitHub */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-[6px] border border-[#E0E0E0] bg-[#FAFAFB] p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111111]">
                  <Linkedin className="h-3.5 w-3.5 text-[#0F62FE]" />
                  LinkedIn Evidence
                </span>
                <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium ${candidate.linkedin.tone}`}>
                  {candidate.linkedin.label}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#525252]">{candidate.linkedin.summary}</p>
            </div>
            <div className="rounded-[6px] border border-[#E0E0E0] bg-[#FAFAFB] p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111111]">
                  <Github className="h-3.5 w-3.5 text-[#111111]" />
                  GitHub Evidence
                </span>
                <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium ${candidate.github.tone}`}>
                  {candidate.github.label}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#525252]">{candidate.github.summary}</p>
            </div>
          </div>

          {/* Manual Verification Flags */}
          <div className="rounded-[6px] border border-[#C2410C]/25 bg-[#C2410C]/5 p-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase text-[#C2410C]">
              <AlertTriangle className="h-3.5 w-3.5" />
              Items Flagged for Manual Recruiter Verification
            </p>
            <ul className="mt-1.5 space-y-1 text-[11px] text-[#525252]">
              {candidate.flags.map((flag) => (
                <li key={flag}>• {flag}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-[#E0E0E0] pt-2.5 text-[10px] text-[#6F6F6F]">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-[#198038]" />
              Evidence-traced report · Zero protected attributes evaluated
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <HelpCircle className="h-3 w-3" />
              Illustrative Demo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
