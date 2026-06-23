"use client";

import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import { Download, Mail, Calendar, Globe } from "lucide-react";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";

const RELEASES = [
  {
    date: "April 17, 2026",
    title: "VANIKARA Intelligence Private Limited Officially Incorporates in India",
    desc: "Formed to engineer next-generation artificial intelligence routing, roommate discovery, and campus resource distribution workflows."
  },
  {
    date: "May 10, 2026",
    title: "Launch of Cygma AI Core Engine Public Beta Sandbox",
    desc: "Unveiling the lightweight chat workspace allowing unauthenticated student users to stream prompts and resolve thesis topics."
  }
];

const FACTS = [
  { label: "Company Type", val: "Private Limited Company" },
  { label: "Country", val: "India" },
  { label: "Incorporation Date", val: "17 April 2026" },
  { label: "CIN", val: "U47912AP2026PTC125340" }
];

export default function PressPage() {
  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Press Room"
        title={<>Press & <span className="gradient-text">Media kit</span></>}
        subtitle="Access official corporate details, press releases, company facts, and downloadable branding kits."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-16">
        
        {/* Top: Overview & Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Overview */}
          <div className="lg:col-span-8 space-y-6">
            <FadeUp>
              <h2 className="font-display font-black text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                Company Overview
              </h2>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 font-medium">
                <p>
                  VANIKARA Intelligence Private Limited is an incorporated Indian technology company focusing on building highly scalable software platforms, student exchange networks, and artificial intelligence workspaces.
                </p>
                <p>
                  We aim to remove the friction from student lifestyles by engineering platforms like Vanik (for book trades and thesis binding) and FriskFree (for verified housing locator parameters) powered by our central routing node, CYGMA AI.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Facts Panel */}
          <div className="lg:col-span-4">
            <FadeUp delay={0.1}>
              <Card hover>
                <CardBody className="space-y-4 p-6">
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-2">
                    Quick Company Facts
                  </h3>
                  <div className="space-y-3">
                    {FACTS.map((f) => (
                      <div key={f.label} className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-secondary)]">{f.label}</span>
                        <span className="text-[var(--text-primary)]">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </FadeUp>
          </div>
        </div>

        {/* Middle: Press Releases */}
        <div className="space-y-6">
          <FadeUp>
            <h2 className="font-display font-black text-2xl text-[var(--text-primary)] uppercase tracking-wide">
              Press Releases
            </h2>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RELEASES.map((rel) => (
              <StaggerItem key={rel.title}>
                <Card hover className="h-full flex flex-col justify-between">
                  <CardBody className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        {rel.date}
                      </div>
                      <h3 className="font-display font-black text-base text-[var(--text-primary)] leading-snug">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {rel.desc}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        {/* Bottom: Downloads & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-[var(--glass-border)]">
          {/* Media Kit Download */}
          <div className="space-y-4">
            <FadeUp>
              <h2 className="font-display font-black text-xl text-[var(--text-primary)] uppercase tracking-wide">
                Brand Assets Kit
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Download official vector logos, company icons, and high-fidelity symbols for media features.
              </p>
              <div className="pt-2 flex gap-3">
                <a
                  href="/images/vanikara-logo.png"
                  download="vanikara-logo.png"
                  className="relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden transition-all duration-300 active:scale-95 focus:outline-none select-none px-5 py-2 text-xs tracking-wider text-white bg-gradient-to-r from-[#1E6BD6] to-[#1557c0] hover:shadow-lg hover:shadow-blue-500/25 border border-blue-600/20 gap-2 font-bold uppercase cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Logo Pack
                </a>
                <a
                  href="/images/vanikara-symbol.png"
                  download="vanikara-symbol.png"
                  className="relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden transition-all duration-300 active:scale-95 focus:outline-none select-none px-5 py-2 text-xs tracking-wider bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-white/10 backdrop-blur-md shadow-sm gap-2 font-bold uppercase cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Symbol
                </a>
              </div>
            </FadeUp>
          </div>

          {/* Media Contacts */}
          <div className="space-y-4">
            <FadeUp delay={0.1}>
              <h2 className="font-display font-black text-xl text-[var(--text-primary)] uppercase tracking-wide">
                Media Relations Contact
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                For media inquiries, interview requests with the founders, or data validation queries.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 text-xs text-[var(--text-secondary)] font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Email: <a href="mailto:vanikara26@gmail.com" className="text-[var(--accent-color)] hover:underline">vanikara26@gmail.com</a></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Business Hours: Mon-Fri, 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

      </div>
    </div>
  );
}
