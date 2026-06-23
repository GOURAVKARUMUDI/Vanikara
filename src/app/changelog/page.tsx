"use client";

import React from "react";
import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Tag, Calendar, ChevronRight, ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/Animate";

interface ChangelogEntry {
  version: string;
  title: string;
  date: string;
  type: "Major" | "Minor" | "Hotfix";
  changes: string[];
}

export default function ChangelogPage() {
  const logs: ChangelogEntry[] = [
    {
      version: "v1.2.0",
      title: "Consent Management & Adaptive Performance Engine",
      date: "June 2026",
      type: "Major",
      changes: [
        "Implemented professional Consent Management Platform (CMP) with granular categories (Essential, Preferences, Analytics, Marketing).",
        "Developed custom browser-native Adaptive Performance Engine to dynamically scale WebGL graphics settings based on hardware cues (cores, RAM, battery, motion preferences).",
        "Refactored Three.js R3F Canvas and material shaders (substituting MeshTransmissionMaterial under lower quality constraints).",
        "Integrated live rendering telemetry and user profile settings inside a unified liquid glass preferences modal.",
        "Launched Admin Portal > Privacy Control center detailing aggregate visitor choices anonymously."
      ]
    },
    {
      version: "v1.1.0",
      title: "CYGMA AI grounding context and PDF indexers",
      date: "May 2026",
      type: "Minor",
      changes: [
        "Integrated Retrieval-Augmented Generation (RAG) capabilities in the CYGMA AI Workspace.",
        "Created Context grounding panels supporting secure client document uploads and vector index mapping.",
        "Optimized client sidebar displaying persistent chat history nodes linked directly to Supabase clusters.",
        "Enforced dynamic token usage controls and usage quotas for guest users (50 prompts ceiling)."
      ]
    },
    {
      version: "v1.0.0",
      title: "Company launch & thesis print-binding logistics nodes",
      date: "April 2026",
      type: "Major",
      changes: [
        "Established VANIKARA Intelligence Private Limited legal guidelines, sitemaps, and terms specifications.",
        "Deployed core landing pages (About, journey, press media kits, brand guides, investor coordinates).",
        "Implemented thesis logistics routing flows (binding config, order inputs, and Stripe gateway checkouts).",
        "Configured secure user authentication gateways and Super Admin CRM control panels."
      ]
    }
  ];

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Company Releases"
        title={<>Product <span className="gradient-text">Changelog</span></>}
        subtitle="Chronological release logs tracking system upgrades, features deployments, and performance optimization sprints."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 relative">
        {/* Timeline trace line */}
        <div className="absolute left-6 sm:left-[3.25rem] top-4 bottom-4 w-[1px] bg-slate-500/10 dark:bg-white/5 pointer-events-none" />

        <div className="space-y-12">
          {logs.map((log, idx) => (
            <FadeUp key={log.version} delay={idx * 0.1}>
              <div className="relative pl-12 sm:pl-20">
                {/* Timeline node dot */}
                <div className="absolute left-3 sm:left-[2.5rem] top-1.5 w-6 h-6 rounded-full border-4 border-[var(--glass-bg)] bg-[var(--accent-color)] shadow-md flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 select-none">
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-[var(--accent-color)] tracking-wider px-2 py-0.5 rounded bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20">
                      <Tag className="w-3 h-3" /> {log.version}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      log.type === "Major"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {log.type}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" /> {log.date}
                    </span>
                  </div>

                  <Card>
                    <CardBody className="p-6 sm:p-7 space-y-4">
                      <h4 className="font-display font-black text-base text-[var(--text-primary)] uppercase tracking-wide">
                        {log.title}
                      </h4>

                      <ul className="space-y-2.5 list-none p-0 m-0 text-xs sm:text-sm text-[var(--text-secondary)] font-semibold leading-relaxed">
                        {log.changes.map((change, cIdx) => (
                          <li key={cIdx} className="flex gap-2.5 items-start pl-0">
                            <ChevronRight className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="pt-16 border-t border-[var(--glass-border)] flex flex-wrap gap-4 items-center justify-between pl-12 sm:pl-20 mt-12">
          <div className="text-xs text-[var(--text-secondary)] font-semibold">
            Want to review our dynamic codebase changes directly?
          </div>
          <Button href="/admin?tab=overview" variant="ghost" className="gap-1 text-xs uppercase font-bold tracking-wider">
            Admin console <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
