"use client";

import Link from "next/link";
import { FadeUp } from "@/components/Animate";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileProductShowcase from "@/components/mobile/MobileProductShowcase";
import Card, { CardBody } from "@/components/ui/Card";
import { Sparkles, Home, Shield, Cpu, Code2, Play } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

interface ProductShowcaseItem {
  title: string;
  category: string;
  desc: string;
  features: string[];
  tech: string[];
  availability: string;
  mockupUrl?: string;
  icon: React.ReactNode;
  exploreHref: string;
}

const PRODUCTS: ProductShowcaseItem[] = [
  {
    title: "CYGMA AI Engine",
    category: "Intelligent Automation & Routing",
    desc: "The core intelligence layer powering discovery, query indexing, and recommendation engines across all VANIKARA services.",
    features: [
      "Real-time token and chat generation streaming",
      "Contextual user grounding through files indexers",
      "Unified serverless routing node controllers"
    ],
    tech: ["GPT-4o API", "LangChain", "Vector Indexes", "Node.js"],
    availability: "Public Sandbox Mode Active",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    exploreHref: "/ai"
  },
  {
    title: "FriskFree Locator",
    category: "Housing Discovery & Verification",
    desc: "A safe, verified portal connecting college students to nearby PGs and hostels without high brokerage fees.",
    features: [
      "Direct host verification and geolocational mapping",
      "Brokers-free direct lease reservation pipelines",
      "Amenity, genders, and proximity walking maps"
    ],
    tech: ["React Native", "Google Maps SDK", "AWS S3", "Express"],
    availability: "Architecture & Schema Drafting",
    mockupUrl: "/images/friskfree_mockup.png",
    icon: <Home className="w-5 h-5 text-blue-500" />,
    exploreHref: "/contact?project=FriskFree"
  }
];

export default function ProductShowcase() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <SectionContainer id="product-showcase" className="border-t border-[var(--glass-border)]">
      <ContentContainer>
        
        <FadeUp>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              PRODUCT ECOSYSTEM
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] mt-1 uppercase">
              Our Active Development Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              Explore the supporting AI and utility modules that form our integrated student platform.
            </p>
          </div>
        </FadeUp>

        <div className="space-y-16">
          {isMobile ? (
            <MobileProductShowcase products={PRODUCTS} />
          ) : (
            PRODUCTS.map((prod, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <FadeUp key={prod.title} delay={idx * 0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 shadow-xl relative overflow-hidden group">
                    {/* Decorative atmosphere bubble */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-color)]/5 blur-[50px] rounded-full pointer-events-none -mr-16 -mt-16" />

                    {/* Left Column: Descriptions */}
                    <div className={`lg:col-span-7 space-y-6 ${isEven ? "" : "lg:order-2"}`}>
                      <div className="space-y-2">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-500/5 rounded-xl">
                            {prod.icon}
                          </div>
                          <h3 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)]">
                            {prod.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                          {prod.desc}
                        </p>
                      </div>

                      {/* Features list */}
                      <div className="space-y-2 border-l border-[var(--glass-border)] pl-4">
                        {prod.features.map((feat, fIdx) => (
                          <div key={fIdx} className="text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                            {feat}
                          </div>
                        ))}
                      </div>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-2">
                        {prod.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-extrabold px-3 py-1 rounded-full bg-slate-500/5 border border-[var(--glass-border)] text-[var(--text-secondary)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-2 flex flex-wrap gap-6 items-center">
                        <Link
                          href={prod.exploreHref}
                          className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/95 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                        >
                          Explore <Play className="w-3 h-3 fill-current" />
                        </Link>
                        <div className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {prod.availability}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visual Mockup or Code Window */}
                    <div className={`lg:col-span-5 flex justify-center ${isEven ? "" : "lg:order-1"}`}>
                      {prod.mockupUrl ? (
                        <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-lg w-full max-w-sm hover:scale-[1.01] transition-transform duration-500">
                          <img
                            src={prod.mockupUrl}
                            alt={`${prod.title} Mockup`}
                            className="w-full h-auto rounded-xl object-cover"
                            width={500}
                            height={380}
                          />
                        </div>
                      ) : (
                        /* Interactive Code Terminal representation */
                        <div className="w-full max-w-sm aspect-video rounded-2xl border border-white/5 bg-[#070b16] p-4 shadow-lg relative overflow-hidden flex flex-col justify-between font-mono text-[9px] sm:text-xs text-indigo-400 select-none">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-500/80" />
                              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                              <span className="w-2 h-2 rounded-full bg-green-500/80" />
                            </span>
                            <span className="text-[8px] text-slate-600 uppercase tracking-widest">cygma-brain-v1</span>
                          </div>
                          <div className="space-y-1.5 py-3 flex-grow text-[9px]">
                            <p className="text-slate-600">&gt; fetch("/api/ai/stream")</p>
                            <p className="text-emerald-500">✔ Connected to local gateway node</p>
                            <p className="text-indigo-300">&gt; Response status: 200 OK</p>
                            <p className="text-amber-500">&gt; Stream chunk index: #0492</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </FadeUp>
              );
            })
          )}
        </div>

      </ContentContainer>
    </SectionContainer>
  );
}
