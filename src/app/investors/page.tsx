"use client";

import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Building2, TrendingUp, Compass } from "lucide-react";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";

const METADATA = [
  { label: "Company Legal Name", val: "VANIKARA Intelligence Private Limited" },
  { label: "Entity Incorporation Date", val: "17 April 2026" },
  { label: "Corporate Identity Number (CIN)", val: "U47912AP2026PTC125340" },
  { label: "Registered Country", val: "India" },
  { label: "Governing Law / Registrar", val: "RoC Vijayawada, Companies Act, 2013" }
];

export default function InvestorsPage() {
  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Investor Center"
        title={<>Investor <span className="gradient-text">Relations</span></>}
        subtitle="Review official corporate incorporation details, leadership roadmap, and growth structures for VANIKARA Intelligence."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-16">
        
        {/* Top: Incorporation details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Business Overview */}
          <div className="lg:col-span-7 space-y-6">
            <FadeUp>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[var(--accent-color)]" />
                <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                  Corporate Incorporation & Strategy
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 font-medium">
                <p>
                  VANIKARA Intelligence Private Limited is an incorporated Indian Private Limited Company registered under the Companies Act, 2013. We are engineered to architect and deploy practical consumer-facing utility applications, student services, and central AI routing algorithms.
                </p>
                <p>
                  By creating a balanced ecosystem of student services (Vanik Marketplace, thesis printing distribution routes, and FriskFree verified rental indexes), we establish continuous, sustainable local network loops that bootstrap users into our platform.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Legal Registry Data */}
          <div className="lg:col-span-5">
            <FadeUp delay={0.1}>
              <Card hover>
                <CardBody className="p-6 space-y-4">
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-2 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[var(--accent-color)]" /> Statutory Registry Registry
                  </h3>
                  <div className="space-y-3">
                    {METADATA.map((meta) => (
                      <div key={meta.label} className="text-xs space-y-0.5">
                        <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)]">{meta.label}</span>
                        <span className="text-[var(--text-primary)] font-bold">{meta.val}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </FadeUp>
          </div>
        </div>

        {/* Growth Strategy Grid */}
        <div className="space-y-6">
          <FadeUp>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--accent-color)]" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                Growth Pillars & Strategy
              </h2>
            </div>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Bootstrap Local Campus Hubs",
                desc: "We focus on universities. Onboarding student printing loops and bookstore vendors constructs high-frequency daily engagement loops."
              },
              {
                title: "Scale CYGMA AI Routings",
                desc: "Every query routed through our sandbox logs user intent parameters. The intelligence layer coordinates search queries contextually."
              },
              {
                title: "Asset-Light Model Scaling",
                desc: "Our architecture utilizes local service nodes (local printers, housing operators) keeping operational expenditures exceptionally low."
              }
            ].map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Card hover className="h-full">
                  <CardBody className="p-6 sm:p-8 space-y-3">
                    <h3 className="font-display font-black text-base text-[var(--text-primary)] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                      {pillar.desc}
                    </p>
                  </CardBody>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        {/* Bottom Contact CTA */}
        <div className="pt-8 border-t border-[var(--glass-border)] text-center">
          <FadeUp>
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">
                Interested in Collaboration?
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                Connect with our founders for pitch decks, financial structures, or institutional investor requests.
              </p>
              <div className="pt-2">
                <Button href="/contact?subject=Investor Inquiry" variant="primary" className="font-bold text-xs uppercase tracking-wide">
                  Contact Financial Relations
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>

      </div>
    </div>
  );
}
