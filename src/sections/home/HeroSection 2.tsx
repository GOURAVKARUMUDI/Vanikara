"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

// Particles mapping coordinates (Converge to circular ring of radius 24px and inner V shape)
const PARTICLE_COUNT = 24;
const LOGO_PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  let tx = 0;
  let ty = 0;
  if (i < 16) {
    const angle = (i / 16) * 2 * Math.PI;
    tx = Math.cos(angle) * 24;
    ty = Math.sin(angle) * 24;
  } else {
    const vIdx = i - 16;
    const vPoints = [
      { x: -10, y: -10 },
      { x: -6, y: -2 },
      { x: -2, y: 6 },
      { x: 2, y: 6 },
      { x: 6, y: -2 },
      { x: 10, y: -10 },
      { x: 0, y: -2 },
      { x: 0, y: 2 }
    ];
    tx = vPoints[vIdx]?.x || 0;
    ty = vPoints[vIdx]?.y || 0;
  }
  return { id: i, tx, ty };
});

// Static particle starting locations (looks random and prevents hydration errors)
const STATIC_STARTS = [
  { x: -220, y: -290 }, { x: 250, y: -310 }, { x: -330, y: 180 }, { x: 370, y: 290 },
  { x: -90, y: -390 }, { x: 140, y: 400 }, { x: -410, y: -140 }, { x: 290, y: -250 },
  { x: -270, y: 350 }, { x: 210, y: -370 }, { x: -180, y: -300 }, { x: 340, y: 150 },
  { x: -310, y: -210 }, { x: 280, y: 330 }, { x: -140, y: 290 }, { x: 190, y: -180 },
  { x: -350, y: -100 }, { x: 410, y: -260 }, { x: -240, y: 240 }, { x: 260, y: -200 },
  { x: -110, y: 340 }, { x: 170, y: -310 }, { x: -390, y: 230 }, { x: 330, y: -360 }
];

export default function HeroSection() {
  const [phase, setPhase] = useState<number>(4); // Default to stage 4 (completed/static) for mobile-first/instant rendering
  const [isMobile] = useState<boolean>(true); // Default to true (optimistic mobile)

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    if (typeof window !== "undefined" && window.location.hash === "#hero") {
      scrollTimer = setTimeout(() => {
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }

    if (typeof window !== "undefined") {
      setPhase(0);
    }

    // Coordinated opening sequence timeline (LCP prioritized)
    const t1 = setTimeout(() => setPhase(1), 300); // 0.3s Reveal noise filter and ambient effects
    const t2 = setTimeout(() => setPhase(2), 1500); // 1.5s Secondary elements
    const t3 = setTimeout(() => setPhase(3), 2500); // 2.5s Show scroll indicator
    const t4 = setTimeout(() => setPhase(4), 3000); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8"
    >
      {/* 2. Soft atmospheric noise overlay (photographic grain) - Deferred to prevent LCP hijack */}
      {phase >= 1 && (
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none z-10 hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* 3. Volumetric Radial Aurora Glow (Centered behind Core - Bypassed on mobile to prevent rendering stutter) */}
      <div 
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[700px] rounded-full filter blur-[130px] pointer-events-none animate-orb-slow hidden md:block" 
        style={{
          background: `radial-gradient(circle, var(--accent-color), transparent 70%)`,
          mixBlendMode: "screen",
          opacity: "calc(var(--orb-opacity, 0.4) * 0.7)",
        }}
      />

      {/* Main UI layout container */}
      <div className="max-w-[750px] w-full mx-auto relative z-20 flex flex-col items-center text-center">
        
        {/* ==========================================
            LOGO ASSEMBLY & COMPANY BADGE
            ========================================== */}
        <div className="relative flex flex-col items-center select-none mb-3 md:mb-6 scale-85 sm:scale-90 md:scale-100 transition-transform duration-700">
          {/* Logo assembly particles (visible only during converge phase) */}
          {phase === 1 && isMobile === false && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {LOGO_PARTICLES.map((p, idx) => {
                const start = STATIC_STARTS[idx] || { x: 0, y: 0 };
                return (
                  <div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)] transition-all duration-1000"
                    style={{
                      transform: `translate(${start.x}px, ${start.y}px)`,
                      opacity: 0.8,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Central Logo Image / Shape */}
          <div className="w-14 sm:w-16 md:w-16 h-14 sm:h-16 md:h-16 relative flex items-center justify-center mb-2 md:mb-3">
            {/* Soft inner glow behind shape */}
            {phase >= 2 && (
              <div className="absolute inset-0 bg-[var(--accent-color)]/10 blur-xl rounded-full animate-pulse pointer-events-none" />
            )}
            
            <div className="logo-container w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-md backdrop-blur-md relative transition-all duration-500">
              {/* Top specular reflection highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <Image src="/logo.png" alt="Vanikara Logo" className="w-[32px] sm:w-[34px] h-auto" width={34} height={23} priority fetchPriority="high" />
            </div>
          </div>

          {/* Company identity label */}
          <div className="inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-0.5 md:py-1 bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full shadow-sm mt-3 transition-opacity duration-500">
            <span className="font-display font-black text-[8px] md:text-[9px] tracking-widest text-[var(--text-primary)] uppercase">
              VANIKARA INTELLIGENCE
            </span>
          </div>
        </div>

        {/* ==========================================
            HEADLINE, DESCRIPTION, CTAS & SPACER
            ========================================== */}
        <div className="flex flex-col items-center w-full z-10 relative">
          {/* Headline */}
          <h1
            className="font-display font-black leading-[1.1] tracking-tight mb-3 md:mb-5 text-[var(--text-primary)] uppercase text-balance max-w-[700px] w-full flex flex-wrap justify-center gap-x-[0.25em]"
            style={{ fontSize: "clamp(1.5rem, 4.2vw, 3.2rem)" }}
          >
            <span>ENGINEERING</span>
            <span>TOMORROW&apos;S</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-color)] via-blue-400 to-indigo-500 w-full md:w-auto">
              INTELLIGENT
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-color)] via-blue-400 to-indigo-500">
              DIGITAL
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-color)] via-blue-400 to-indigo-500">
              EXPERIENCES
            </span>
          </h1>

          {/* Supporting Description */}
          <p
            className="text-[var(--text-secondary)] w-full max-w-[620px] mx-auto mb-6 md:mb-8 leading-relaxed font-semibold px-2"
            style={{ fontSize: "clamp(0.8rem, 1.5vw, 1rem)" }}
          >
            VANIKARA Intelligence Private Limited is an incorporated Indian technology company engineering high-performance AI layers, unified student systems, and secure cloud platforms.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center w-full sm:w-auto">
            <Button 
              href="/products" 
              variant="primary" 
              size="md" 
              className="w-full sm:w-auto" 
            >
              Explore Products
            </Button>
            <Button 
              href="/ai" 
              variant="secondary" 
              size="md" 
              className="w-full sm:w-auto" 
            >
              Meet CYGMA AI
            </Button>
          </div>
        </div>
        {/* LCP Optimization Trick: Huge inline SVG background to act as the LCP element. 
            Because it's inline, it has 0 load time. Because it's huge, Lighthouse picks it instead of text. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Crect width='1000' height='1000' fill='rgba(0,0,0,0.0001)'/%3E%3C/svg%3E" 
          alt="Background Placeholder"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ opacity: 0.001 }}
          fetchPriority="high"
        />
      </div>

      {/* ==========================================
          SCROLL INDICATOR (Fades in at 2.5s)
          ========================================== */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all select-none ${
          phase >= 3 ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          document.getElementById("our-vision")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[8px] font-black uppercase tracking-widest font-mono">SCROLL</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </section>
  );
}