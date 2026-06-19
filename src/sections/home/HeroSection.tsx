"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTheme } from "@/components/layout/ThemeContext";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeOutQuart = [0.25, 1, 0.5, 1] as const;

import HeroScene from "@/components/hero/HeroScene";


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
  const [phase, setPhase] = useState<number>(0); // 0: init/dolly (0-2s), 1: converge (2-4.5s), 2: flash (4.5-4.8s), 3: slide-up/reveal (4.8-8s), 4: complete (8s+)
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    // Coordinated opening sequence timeline
    const t1 = setTimeout(() => setPhase(1), 2000); // 0-2s dolly-in complete, start logo assembly
    const t2 = setTimeout(() => setPhase(2), 4500); // 2-4.5s assembly complete, trigger flash
    const t3 = setTimeout(() => setPhase(3), 4800); // 4.5-4.8s flash complete, slide up / fade UI
    const t4 = setTimeout(() => setPhase(4), 5500); // 5.5s layout complete, show scroll indicator

    // Scroll to hero on page load if hash matches
    if (typeof window !== "undefined" && window.location.hash === "#hero") {
      setTimeout(() => {
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);



  if (!mounted) return null;

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden bg-transparent pt-32 pb-24 px-6"
    >
      {/* Coordinates 3D Scene states and scroll tracking */}
      <HeroScene />

      {/* 2. Soft atmospheric noise overlay (photographic grain) */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Volumetric Radial Aurora Glow (Centered behind Core) */}
      <div 
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[700px] rounded-full filter blur-[130px] pointer-events-none animate-orb-slow" 
        style={{
          background: `radial-gradient(circle, var(--accent-color), transparent 70%)`,
          mixBlendMode: "var(--orb-blend)" as any,
          opacity: "calc(var(--orb-opacity) * 0.7)",
        }}
      />

      {/* Main UI layout container */}
      <div className="max-w-[750px] w-full mx-auto relative z-20 flex flex-col items-center text-center">
        
        {/* ==========================================
            LOGO ASSEMBLY & COMPANY BADGE
            ========================================== */}
        <motion.div
          layout
          className={`relative flex flex-col items-center select-none ${
            phase >= 3 ? "mb-6 scale-90" : "my-12 scale-125"
          }`}
          transition={{ duration: 1.0, ease: easeOutExpo }}
        >
          {/* Logo assembly particles (visible only during converge phase) */}
          <AnimatePresence>
            {phase === 1 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                {LOGO_PARTICLES.map((p, idx) => {
                  const start = STATIC_STARTS[idx] || { x: 0, y: 0 };
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ x: start.x, y: start.y, opacity: 0, scale: 1.8 }}
                      animate={{ 
                        x: p.tx, 
                        y: p.ty, 
                        opacity: [0, 0.9, 0.9, 0], 
                        scale: [1.8, 1.2, 0.4, 0] 
                      }}
                      transition={{
                        duration: 2.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute w-2 h-2 rounded-full bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]"
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Convergence flash overlay */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 2.0, 3.2], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute w-24 h-24 rounded-full bg-radial from-white via-[var(--accent-color)]/30 to-transparent pointer-events-none z-30 mix-blend-screen"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -48,
                  marginTop: -48,
                }}
              />
            )}
          </AnimatePresence>

          {/* Central Logo Image / Shape */}
          <div className="w-16 h-16 relative flex items-center justify-center mb-3">
            {/* Soft inner glow behind shape */}
            {phase >= 2 && (
              <div className="absolute inset-0 bg-[var(--accent-color)]/10 blur-xl rounded-full animate-pulse pointer-events-none" />
            )}
            
            <AnimatePresence mode="wait">
              {phase < 3 ? (
                <motion.svg
                  key="assembling-logo"
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-14 h-14 text-[var(--accent-color)]"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  {/* Outer boundary circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="2.0"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={phase >= 1 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
                  />
                  {/* Inner V logic shape */}
                  <motion.path
                    d="M32 38 L50 66 L68 38"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={phase >= 1 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 2.0, delay: 0.5, ease: "easeInOut" }}
                  />
                  {/* Glowing core dot */}
                  {phase >= 2 && (
                    <motion.circle
                      cx="50"
                      cy="46"
                      r="4.5"
                      fill="currentColor"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="shadow-sm shadow-blue-500"
                    />
                  )}
                </motion.svg>
              ) : (
                <motion.div
                  key="final-logo"
                  initial={{ scale: 0.4, opacity: 0, filter: "blur(5px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-md backdrop-blur-md relative"
                >
                  {/* Top specular reflection highlight */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <img src="/logo.png" alt="Vanikara Logo" className="w-8.5 h-auto" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company identity label */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full shadow-sm"
            >
              <span className="font-display font-black text-[9px] tracking-widest text-[var(--text-primary)] uppercase">
                VANIKARA INTELLIGENCE
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* ==========================================
            HEADLINE, DESCRIPTION, CTAS & SPACER
            ========================================== */}
        <AnimatePresence>
          {phase >= 3 && (
            <div className="flex flex-col items-center w-full">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
                className="font-display font-black leading-[1.1] tracking-tight mb-5 text-[var(--text-primary)] uppercase text-balance max-w-[700px] w-full"
                style={{ fontSize: "clamp(1.8rem, 4.2vw, 3.2rem)" }}
              >
                Engineering Tomorrow&apos;s <br />
                <span className="gradient-text">Intelligent Digital Experiences</span>
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: easeOutQuart }}
                className="text-[var(--text-secondary)] w-full max-w-[620px] mx-auto mb-8 leading-relaxed font-semibold"
                style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
              >
                VANIKARA Intelligence Private Limited is an incorporated Indian technology company engineering high-performance AI layers, unified student systems, and secure cloud platforms.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75, ease: easeOutQuart }}
                className="flex flex-col sm:flex-row gap-3.5 justify-center items-center w-full sm:w-auto"
              >
                <Button 
                  href="/projects" 
                  variant="primary" 
                  size="md" 
                  className="w-full sm:w-auto" 
                  magnetic
                >
                  Explore Products
                </Button>
                <Button 
                  href="/ai" 
                  variant="secondary" 
                  size="md" 
                  className="w-full sm:w-auto" 
                  magnetic
                >
                  Meet CYGMA AI
                </Button>
              </motion.div>

            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          SCROLL INDICATOR (Fades in at 8.0s)
          ========================================== */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 0.6, 
              y: [0, 8, 0] 
            }}
            transition={{
              opacity: { duration: 0.6 },
              y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
            onClick={() => {
              document.getElementById("our-vision")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-[8px] font-black uppercase tracking-widest font-mono">SCROLL</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}