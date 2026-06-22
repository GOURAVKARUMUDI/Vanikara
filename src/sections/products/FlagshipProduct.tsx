"use client";

import Link from "next/link";
import { FadeUp } from "@/components/Animate";
import Badge from "@/components/ui/Badge";
import Card, { CardBody } from "@/components/ui/Card";
import { CheckCircle2, Server, Globe, Key, ShoppingBag, ArrowRight } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

export default function FlagshipProduct() {
  const features = [
    "Peer-to-peer student textbook trading bypasses offline brokers.",
    "Integrated custom thesis printing and binding logistics pipelines.",
    "Automated scheduling and local campus collection networks.",
    "Real-time instant message routing between student nodes."
  ];

  const techStack = [
    { name: "Next.js", desc: "React Server Components", icon: <Globe className="w-4 h-4 text-blue-500" /> },
    { name: "Supabase RLS", desc: "Row-Level Security Controls", icon: <Key className="w-4 h-4 text-emerald-500" /> },
    { name: "PostgreSQL", desc: "High Density Structured Data", icon: <Server className="w-4 h-4 text-indigo-500" /> },
    { name: "Razorpay APIs", desc: "Secure Local Transaction Routing", icon: <ShoppingBag className="w-4 h-4 text-amber-500" /> }
  ];

  return (
    <SectionContainer id="flagship-product" className="overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent-color)]/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />

      <ContentContainer>
        <FadeUp>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)] bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3.5 py-1.5 rounded-full">
              FLAGSHIP PLATFORM
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] mt-6 uppercase">
              Vanik Marketplace
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              Core campus student exchange and custom printing logistics ecosystem.
            </p>
          </div>
        </FadeUp>

        {/* Flagship Apple-style Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Info details */}
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="orange">Core Platform</Badge>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-500/10 text-[var(--text-secondary)] border border-[var(--glass-border)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Beta Testing
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  Student Logistics Reimagined
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                  Vanik bridges the gap between affordable textbook procurement and custom thesis binding. Students upload PDFs directly to local partner print nodes and list used books in a zero-commission catalog.
                </p>
              </div>

              {/* Bullet Features list */}
              <div className="space-y-3 pt-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-semibold">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact?project=Vanik"
                  className="px-7 py-3 rounded-full font-semibold bg-[var(--accent-color)] text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all text-xs tracking-wider uppercase"
                >
                  Request Demo
                </Link>
                <Link
                  href="/projects"
                  className="px-7 py-3 rounded-full font-semibold border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] hover:bg-white/10 transition-all text-xs tracking-wider uppercase inline-flex items-center gap-1.5"
                >
                  Explore Showcase <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Right Column: High Fidelity Mockup & Technical Spec */}
          <div className="lg:col-span-7 space-y-6">
            <FadeUp delay={0.15}>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 shadow-2xl backdrop-blur-md">
                <img
                  src="/images/vanik_mockup.png"
                  alt="Vanik App Showcase"
                  className="w-full h-auto rounded-[2rem] object-cover"
                  width={640}
                  height={400}
                />
              </div>
            </FadeUp>

            {/* Structured Tech Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech, idx) => (
                <FadeUp key={tech.name} delay={0.08 * (idx + 1)}>
                  <Card hover className="h-full">
                    <CardBody className="p-4 flex items-start gap-3">
                      <div className="p-2 bg-slate-500/5 rounded-xl shrink-0">
                        {tech.icon}
                      </div>
                      <div className="min-w-0 text-xs">
                        <div className="font-extrabold text-[var(--text-primary)]">{tech.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-semibold leading-normal mt-0.5">
                          {tech.desc}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </FadeUp>
              ))}
            </div>
          </div>

        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
