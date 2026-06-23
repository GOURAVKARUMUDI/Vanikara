"use client";

import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import { Download, Palette, Type, Shield, Layout } from "lucide-react";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";

const COLOR_SWATCHES = [
  { name: "Brand Blue", hex: "#1E6BD6", usage: "Primary Accent, CTAs, interactive states, digital links" },
  { name: "Brand Orange", hex: "#FF7A00", usage: "Warm highlights, secondary tags, warning banners" },
  { name: "Brand Yellow", hex: "#FFC400", usage: "Glow atmosphere, warnings, special product tags" },
  { name: "Volumetric Indigo", hex: "#8B5CF6", usage: "Volumetric core details, R3F lighting fill" }
];

const THEME_GRADIENTS = [
  { name: "Morning Glow", val: "linear-gradient(135deg, #fefae0 0%, #f7fee7 40%, #e0f2fe 100%)", text: "#0f172a" },
  { name: "Afternoon Glass", val: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 35%, #e0f2fe 100%)", text: "#0f172a" },
  { name: "Evening Aurora", val: "linear-gradient(135deg, #181236 0%, #2f0e3a 50%, #46146e 100%)", text: "#f8fafc" },
  { name: "Night Orbit", val: "linear-gradient(135deg, #060a14 0%, #0a1124 50%, #12182c 100%)", text: "#f8fafc" }
];

export default function BrandPage() {
  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Brand Assets"
        title={<>Identity & <span className="gradient-text">Guidelines</span></>}
        subtitle="Explore official corporate logos, typography scales, atmosphere swatches, and spacing structures for VANIKARA."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-16">
        
        {/* Colors Section */}
        <div className="space-y-6">
          <FadeUp>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--accent-color)]" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                1. Core Palette & Color Swatches
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-2 max-w-3xl">
              Our color system is built to dynamically adapt to atmosphere timelines. Use these specific values to maintain corporate visual consistency.
            </p>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLOR_SWATCHES.map((sw) => (
              <StaggerItem key={sw.name}>
                <Card hover className="h-full overflow-hidden">
                  <div className="h-28 w-full border-b border-[var(--glass-border)]" style={{ backgroundColor: sw.hex }} />
                  <CardBody className="p-4 space-y-2">
                    <h3 className="font-display font-bold text-xs text-[var(--text-primary)]">{sw.name}</h3>
                    <div className="font-mono text-[10px] text-[var(--accent-color)] font-bold">{sw.hex}</div>
                    <p className="text-[10px] text-[var(--text-secondary)] leading-normal">{sw.usage}</p>
                  </CardBody>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Gradients */}
          <div className="space-y-3 pt-4">
            <FadeUp>
              <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider">
                Atmosphere Gradients
              </h3>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEME_GRADIENTS.map((g) => (
                <FadeUp key={g.name}>
                  <div
                    className="p-5 rounded-2xl border border-[var(--glass-border)] shadow-md flex items-center justify-between text-xs font-bold font-mono select-none"
                    style={{ background: g.val, color: g.text }}
                  >
                    <span>{g.name}</span>
                    <span className="opacity-80">CSS Mesh Gradient</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-[var(--glass-border)]">
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-[var(--accent-color)]" />
                <h2 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                  2. Typography System
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                VANIKARA uses two main type families: **Outfit** for structural display headings (representing modern strength and boldness) and **Inter** for descriptions and body texts (representing high readability and screen clarity).
              </p>
            </FadeUp>
          </div>

          <div className="lg:col-span-7">
            <FadeUp delay={0.1}>
              <Card hover>
                <CardBody className="p-6 space-y-4 text-xs">
                  <div className="space-y-1.5 border-b border-[var(--glass-border)] pb-3">
                    <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)]">Display Font</span>
                    <h3 className="font-display font-black text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                      OUTFIT BLACK (A-Z)
                    </h3>
                  </div>
                  <div className="space-y-1.5 border-b border-[var(--glass-border)] pb-3">
                    <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)]">Body Font</span>
                    <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
                      Inter Medium - Used for multi-paragraph layouts, legal contracts, and general dashboard information systems.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)]">Code Monospace</span>
                    <code className="font-mono text-xs text-[var(--accent-color)]">
                      SFMono-Regular, Consolas, Monaco, monospace
                    </code>
                  </div>
                </CardBody>
              </Card>
            </FadeUp>
          </div>
        </div>

        {/* Spacing & Logos download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-[var(--glass-border)]">
          <div className="space-y-4">
            <FadeUp>
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-[var(--accent-color)]" />
                <h2 className="font-display font-black text-xl text-[var(--text-primary)] uppercase tracking-wide">
                  3. Spacing & Structure
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                All coordinates follow strict margins: 24px grid paddings, and card components employ a standard corner radius of <code className="px-1.5 py-0.5 bg-slate-500/10 rounded font-mono text-[10px]">2.5rem</code> (or <code className="px-1.5 py-0.5 bg-slate-500/10 rounded font-mono text-[10px]">40px</code>) to maintain soft, glassmorphic refraction.
              </p>
            </FadeUp>
          </div>

          <div className="space-y-4">
            <FadeUp delay={0.1}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--accent-color)]" />
                <h2 className="font-display font-black text-xl text-[var(--text-primary)] uppercase tracking-wide">
                  4. Logo Resource Downloads
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Refer to our assets folders. Never stretch or distort the symbol.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="/images/vanikara-logo.png"
                  download="vanikara-logo.png"
                  className="relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden transition-all duration-300 active:scale-95 focus:outline-none select-none px-5 py-2 text-xs tracking-wider text-white bg-gradient-to-r from-[#1E6BD6] to-[#1557c0] hover:shadow-lg hover:shadow-blue-500/25 border border-blue-600/20 gap-2 font-bold uppercase cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Logo
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
        </div>

      </div>
    </div>
  );
}
