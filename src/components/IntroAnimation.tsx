"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

interface Props {
  onComplete: () => void;
  onExitStart?: () => void;
}

const easeInOutCubic = [0.645, 0.045, 0.355, 1.0] as const;
const easeOutQuart   = [0.25, 1, 0.5, 1]          as const;

/* Static particles positions (25 elements) — avoids hydration mismatch */
const PARTICLES = [
  { x: 12, y: 15, size: 2.2, dur: 5.2, delay: 0.1, color: "rgba(59,130,246,0.3)" },
  { x: 88, y: 22, size: 1.8, dur: 6.5, delay: 0.8, color: "rgba(255,122,0,0.25)" },
  { x: 25, y: 76, size: 2.5, dur: 5.8, delay: 1.2, color: "rgba(255,196,0,0.3)" },
  { x: 70, y: 80, size: 1.5, dur: 7.0, delay: 0.4, color: "rgba(59,130,246,0.25)" },
  { x: 45, y: 18, size: 2.0, dur: 6.2, delay: 1.5, color: "rgba(255,255,255,0.4)" },
  { x: 15, y: 55, size: 1.8, dur: 5.0, delay: 2.0, color: "rgba(255,122,0,0.2)" },
  { x: 82, y: 62, size: 2.2, dur: 5.6, delay: 0.3, color: "rgba(59,130,246,0.35)" },
  { x: 34, y: 38, size: 1.6, dur: 6.8, delay: 2.2, color: "rgba(255,255,255,0.35)" },
  { x: 62, y: 28, size: 2.4, dur: 5.4, delay: 1.0, color: "rgba(255,196,0,0.2)" },
  { x: 92, y: 88, size: 2.0, dur: 6.0, delay: 0.7, color: "rgba(59,130,246,0.25)" },
  { x: 8,  y: 85, size: 1.4, dur: 7.2, delay: 1.7, color: "rgba(255,122,0,0.3)" },
  { x: 52, y: 82, size: 2.6, dur: 5.9, delay: 0.5, color: "rgba(255,255,255,0.45)" },
  { x: 78, y: 12, size: 2.0, dur: 6.1, delay: 1.4, color: "rgba(59,130,246,0.3)" },
  { x: 28, y: 92, size: 1.8, dur: 5.7, delay: 0.9, color: "rgba(255,122,0,0.2)" },
  { x: 66, y: 48, size: 2.2, dur: 6.3, delay: 2.1, color: "rgba(255,196,0,0.25)" },
  { x: 3,  y: 40, size: 1.5, dur: 7.5, delay: 0.2, color: "rgba(59,130,246,0.25)" },
  { x: 97, y: 50, size: 2.1, dur: 5.3, delay: 1.1, color: "rgba(255,122,0,0.3)" },
  { x: 40, y: 65, size: 1.7, dur: 6.7, delay: 1.6, color: "rgba(255,255,255,0.3)" },
  { x: 58, y: 10, size: 2.3, dur: 5.5, delay: 0.6, color: "rgba(59,130,246,0.4)" },
  { x: 19, y: 28, size: 1.9, dur: 6.9, delay: 1.3, color: "rgba(255,122,0,0.2)" },
  { x: 84, y: 40, size: 1.6, dur: 6.4, delay: 2.3, color: "rgba(255,196,0,0.3)" },
  { x: 48, y: 48, size: 2.8, dur: 5.1, delay: 0.0, color: "rgba(255,255,255,0.5)" },
  { x: 73, y: 95, size: 1.5, dur: 7.1, delay: 1.8, color: "rgba(59,130,246,0.2)" },
  { x: 89, y: 74, size: 2.4, dur: 5.7, delay: 1.2, color: "rgba(255,122,0,0.25)" },
  { x: 11, y: 70, size: 2.0, dur: 6.0, delay: 0.5, color: "rgba(255,196,0,0.3)" }
];

/* Static moving rays (Caustics) */
const RAYS = [
  { angle: 35, dur: 18, delay: 0, top: "10%", left: "-15%", width: "130vw", height: "3px", color: "rgba(59,130,246,0.06)", anim: "rayTravel1" },
  { angle: 35, dur: 22, delay: 3, top: "45%", left: "-15%", width: "130vw", height: "2px", color: "rgba(255,122,0,0.05)", anim: "rayTravel2" },
  { angle: 35, dur: 26, delay: 1, top: "75%", left: "-15%", width: "130vw", height: "4px", color: "rgba(255,255,255,0.06)", anim: "rayTravel1" }
];

/* Diagonal glass waves */
const GLASS_WAVES = [
  { top: "15%", rotate: -25, dur: 24, delay: 0, height: "130px", opacity: 0.07, anim: "floatWave1" },
  { top: "42%", rotate: -23, dur: 30, delay: 4, height: "180px", opacity: 0.05, anim: "floatWave2" },
  { top: "68%", rotate: -27, dur: 27, delay: 2, height: "110px", opacity: 0.04, anim: "floatWave3" }
];

export default function IntroAnimation({ onComplete, onExitStart }: Props) {
  const { sceneReady } = useCygmaWorld();
  const [phase, setPhase] = useState<"playing" | "exiting" | "done">("playing");
  const [minPlayDone, setMinPlayDone] = useState(false);
  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Guarantee a minimum display duration of 1 second for visual polish
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinPlayDone(true);
    }, reducedMotion ? 400 : 1000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Transition to exiting when both minimum duration is met AND Three.js is fully ready
  useEffect(() => {
    if (minPlayDone && sceneReady && phase === "playing") {
      setPhase("exiting");
      if (onExitStart) onExitStart();

      const timer = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, reducedMotion ? 300 : 900);
      return () => clearTimeout(timer);
    }
  }, [minPlayDone, sceneReady, phase, onComplete, onExitStart, reducedMotion]);

  if (phase === "done") return null;

  if (reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={phase === "exiting" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={FULL_SCREEN_STYLE}
      >
        <img src="/logo.png" alt="VANIKARA" style={{ width: 80, height: "auto" }} />
        <p style={{ color: "#1B2A4A", fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "0.28em", marginTop: 20 }}>
          VANIKARA INTELLIGENCE
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.0 }}
      animate={phase === "exiting"
        ? { opacity: 0, scale: 1.06, filter: "blur(18px)" }
        : { opacity: 1, scale: 1.0 }}
      transition={phase === "exiting"
        ? { duration: 0.9, ease: easeInOutCubic }
        : { opacity: { duration: 0.8, ease: easeOutQuart } }}
      style={FULL_SCREEN_STYLE}
    >
      {/* CSS Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes morphHalo1 {
          0%, 100% { border-radius: 48% 52% 54% 46% / 50% 48% 52% 50%; }
          33% { border-radius: 52% 48% 46% 54% / 46% 52% 50% 48%; }
          66% { border-radius: 50% 50% 52% 48% / 54% 46% 48% 52%; }
        }
        @keyframes morphHalo2 {
          0%, 100% { border-radius: 50% 50% 48% 52% / 48% 52% 52% 48%; }
          50% { border-radius: 46% 54% 52% 48% / 52% 48% 50% 52%; }
        }
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slowRotateCounter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
        @keyframes floatWave1 {
          0% { transform: translate(-8%, -8%) rotate(-25deg); }
          50% { transform: translate(8%, 8%) rotate(-23deg); }
          100% { transform: translate(-8%, -8%) rotate(-25deg); }
        }
        @keyframes floatWave2 {
          0% { transform: translate(8%, -4%) rotate(-23deg); }
          50% { transform: translate(-8%, 4%) rotate(-25deg); }
          100% { transform: translate(8%, -4%) rotate(-23deg); }
        }
        @keyframes floatWave3 {
          0% { transform: translate(-4%, 8%) rotate(-27deg); }
          50% { transform: translate(4%, -4%) rotate(-25deg); }
          100% { transform: translate(-4%, 8%) rotate(-27deg); }
        }
        @keyframes driftParticle {
          0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0.15; }
          50% { transform: translateY(-25px) scale(1.2); opacity: 0.75; }
        }
        @keyframes rayTravel1 {
          0% { transform: translate(-15vw, -15vh) rotate(35deg); }
          100% { transform: translate(15vw, 15vh) rotate(35deg); }
        }
        @keyframes rayTravel2 {
          0% { transform: translate(10vw, 10vh) rotate(35deg); }
          100% { transform: translate(-10vw, -10vh) rotate(35deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 4px 10px rgba(59,130,246,0.25)) drop-shadow(0 2px 4px rgba(255,122,0,0.12)); }
          50% { filter: drop-shadow(0 6px 28px rgba(59,130,246,0.45)) drop-shadow(0 3px 14px rgba(255,122,0,0.25)); }
        }
        @keyframes travelDot {
          0% { transform: translateX(0px); }
          100% { transform: translateX(152px); }
        }
        @keyframes driftMesh1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4vw, -4vh) scale(1.08); }
        }
        @keyframes driftMesh2 {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-4vw, 4vh) scale(0.96); }
        }
        @keyframes filmGrain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-0.5%, -0.5%); }
          20% { transform: translate(-1%, 0.5%); }
          30% { transform: translate(0.5%, -1%); }
          40% { transform: translate(-0.5%, 1.5%); }
          50% { transform: translate(-1%, 0.5%); }
          60% { transform: translate(1.5%, -0.5%); }
          70% { transform: translate(1%, 0.5%); }
          80% { transform: translate(-1.5%, -1%); }
          90% { transform: translate(0.5%, 1%); }
        }
      ` }} />

      {/* ── LAYER 1: Base Pearl Gradient & Animated Mesh Gradients ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 90% 80% at 50% 45%, #FCFDFF 0%, #F3F8FF 40%, #F0F6FF 70%, #FAF5FF 100%)",
      }} />

      {/* Blue mesh gradient sphere */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%", width: "70vw", height: "70vh",
        background: "radial-gradient(circle, rgba(230,242,255,0.85) 0%, rgba(200,225,255,0.3) 50%, transparent 100%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 1,
        animation: "driftMesh1 25s ease-in-out infinite alternate",
      }} />

      {/* Soft electric blue mesh blob */}
      <div style={{
        position: "absolute", bottom: "-15%", right: "-15%", width: "65vw", height: "65vh",
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 65%, transparent 100%)",
        filter: "blur(50px)", pointerEvents: "none", zIndex: 1,
        animation: "driftMesh2 28s ease-in-out infinite alternate",
      }} />

      {/* Soft orange mesh blob */}
      <div style={{
        position: "absolute", top: "35%", right: "-20%", width: "60vw", height: "60vh",
        background: "radial-gradient(circle, rgba(255,122,0,0.06) 0%, rgba(255,122,0,0.01) 60%, transparent 100%)",
        filter: "blur(55px)", pointerEvents: "none", zIndex: 1,
        animation: "driftMesh1 32s ease-in-out infinite alternate-reverse",
      }} />

      {/* ── LAYER 2: Translucent Diagonal Glass Waves ── */}
      {GLASS_WAVES.map((wave, i) => (
        <div
          key={`wave-${i}`}
          style={{
            position: "absolute", zIndex: 2,
            top: wave.top, left: "-30vw",
            width: "160vw", height: wave.height,
            background: "linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: "1.5px solid rgba(255,255,255,0.22)",
            borderBottom: "1.5px solid rgba(255,255,255,0.22)",
            opacity: wave.opacity,
            animation: `${wave.anim} ${wave.dur}s ease-in-out infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── LAYER 3: Huge Blurred Glass Shapes ── */}
      <div style={{
        position: "absolute", top: "5%", right: "8%", width: "38vw", height: "38vw",
        borderRadius: "50%", background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.15)",
        filter: "blur(40px)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 3, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "8%", left: "5%", width: "42vw", height: "42vw",
        borderRadius: "50%", background: "rgba(255,255,255,0.01)",
        border: "1px solid rgba(255,255,255,0.1)",
        filter: "blur(40px)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 3, pointerEvents: "none",
      }} />

      {/* ── LAYER 4: Volumetric Lighting ── */}
      {/* Top Left Cool Blue Light */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "60vw", height: "60vh",
        background: "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.22) 0%, rgba(30,107,214,0.06) 50%, transparent 100%)",
        zIndex: 4, pointerEvents: "none",
      }} />

      {/* Bottom Right Warm Orange Light */}
      <div style={{
        position: "absolute", bottom: 0, right: 0, width: "55vw", height: "55vh",
        background: "radial-gradient(circle at 100% 100%, rgba(255,122,0,0.16) 0%, rgba(255,196,0,0.03) 50%, transparent 100%)",
        zIndex: 4, pointerEvents: "none",
      }} />

      {/* Center White Glow directly behind the halo */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "min(650px, 90vw)", height: "min(650px, 90vw)",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(243,248,255,0.4) 40%, transparent 70%)",
        zIndex: 4, pointerEvents: "none",
      }} />

      {/* ── LAYER 5: Moving Light Rays (Caustics) ── */}
      {RAYS.map((ray, i) => (
        <div
          key={`ray-${i}`}
          style={{
            position: "absolute", zIndex: 5,
            top: ray.top, left: ray.left,
            width: ray.width, height: ray.height,
            background: `linear-gradient(90deg, transparent 0%, ${ray.color} 30%, rgba(255,255,255,0.15) 50%, ${ray.color} 70%, transparent 100%)`,
            filter: "blur(2px)",
            opacity: 0.8,
            animation: `${ray.anim} ${ray.dur}s linear infinite`,
            animationDelay: `${ray.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── LAYER 6: Soft Particle System ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
        {PARTICLES.map((pt, i) => (
          <div
            key={`pt-${i}`}
            style={{
              position: "absolute", left: `${pt.x}%`, top: `${pt.y}%`,
              width: pt.size, height: pt.size, borderRadius: "50%",
              backgroundColor: pt.color,
              boxShadow: `0 0 6px ${pt.color}`,
              animation: `driftParticle ${pt.dur}s ease-in-out infinite`,
              animationDelay: `${pt.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── LAYER 7: Subtle Futuristic Grid ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(to right, rgba(30, 107, 214, 0.022) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(30, 107, 214, 0.022) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* ── LAYER 8: Reflection Layer & Mirror Overlay ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to top, rgba(255,255,255,0.16) 0%, rgba(240,246,255,0.06) 50%, transparent 100%)",
        pointerEvents: "none", zIndex: 8,
      }} />

      {/* Mirror Reflection Shimmer Line */}
      <div style={{
        position: "absolute", bottom: "35%", left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 25%, rgba(255,255,255,0.75) 50%, rgba(255,122,0,0.3) 75%, transparent 100%)",
        filter: "blur(0.5px)",
        opacity: 0.65, zIndex: 8, pointerEvents: "none",
      }} />

      {/* Organic Film Grain Texture Overlay */}
      <div style={{
        position: "absolute", inset: "-10%", zIndex: 9, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.015,
        animation: "filmGrain 8s steps(10) infinite",
      }} />

      {/* ══════════════════════════════════════════════════════
          GLASS HALO + CONTENT — perfectly centered as one unit
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", zIndex: 10,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>

        {/* The Glass Halo (Massive liquid glass sphere) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 1.0, ease: easeOutQuart }}
          style={{
            position: "absolute",
            width: "clamp(300px, 45vw, 600px)",
            height: "clamp(300px, 45vw, 600px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "breathe 8s ease-in-out infinite",
          }}
        >
          {/* Surface 1: Base Liquid Glass with chromatic reflections */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22) 0%, rgba(243,248,255,0.06) 60%, rgba(255,122,0,0.02) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.45)",
            boxShadow: "inset 0 10px 30px rgba(255,255,255,0.35), inset -10px -10px 25px rgba(59,130,246,0.1), 0 20px 50px rgba(30,107,214,0.12)",
            animation: "morphHalo1 16s ease-in-out infinite, slowRotate 45s linear infinite",
          }} />

          {/* Surface 2: Overlapping secondary glass layer */}
          <div style={{
            position: "absolute", inset: "8%",
            background: "radial-gradient(circle at 70% 70%, rgba(59,130,246,0.05) 0%, rgba(255,122,0,0.04) 50%, rgba(255,255,255,0.12) 100%)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "inset 0 -5px 15px rgba(255,122,0,0.08), inset 5px 5px 15px rgba(59,130,246,0.08), 0 10px 25px rgba(30,107,214,0.05)",
            animation: "morphHalo2 12s ease-in-out infinite, slowRotateCounter 30s linear infinite",
          }} />

          {/* Surface 3: Caustics / Highlight Sphere */}
          <div style={{
            position: "absolute", inset: "16%",
            background: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 60%)",
            opacity: 0.85, filter: "blur(4px)",
            animation: "morphHalo1 20s ease-in-out infinite alternate",
            pointerEvents: "none",
          }} />

          {/* Chromatic edges (gradient mask border ring) */}
          <div style={{
            position: "absolute", inset: "-1px", borderRadius: "50%",
            border: "1px solid transparent",
            backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.45) 0%, rgba(255,122,0,0.35) 100%)",
            backgroundOrigin: "border-box", backgroundClip: "border-box",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px) 100%)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px) 100%)",
            opacity: 0.6,
            animation: "slowRotate 20s linear infinite",
          }} />
        </motion.div>

        {/* Centered Content Column */}
        <div style={{
          position: "relative", zIndex: 11,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "0 40px",
          maxWidth: "clamp(300px, 42vw, 520px)",
        }}>
          {/* Logo Presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 2.0, ease: easeOutQuart }}
            style={{
              height: "12vh", maxHeight: "90px",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "24px",
              position: "relative",
            }}
          >
            {/* Chromatic rim shadow blur */}
            <div style={{
              position: "absolute", inset: -15, borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(59,130,246,0.22) 0%, rgba(255,122,0,0.11) 60%, transparent 80%)",
              filter: "blur(14px)",
              opacity: 0.8,
            }} />
            <img
              src="/logo.png"
              alt="VANIKARA Intelligence Logo"
              style={{
                height: "100%", width: "auto",
                position: "relative", zIndex: 1,
                animation: "pulseGlow 4s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* Typography - Company Name */}
          <div style={{ overflow: "hidden", marginBottom: 12 }}>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5, ease: easeOutQuart }}
              style={{
                display: "flex", alignItems: "baseline",
                gap: "0.45em", flexWrap: "nowrap",
                fontFamily: "'Outfit','Inter',system-ui,sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
              }}
            >
              <span style={{ color: "#1B2A4A", fontWeight: 900, fontSize: "clamp(0.95rem, 2.5vw, 1.65rem)", lineHeight: 1 }}>
                VANIKARA
              </span>
              <span style={{ color: "#2C3F6A", fontWeight: 300, fontSize: "clamp(0.95rem, 2.5vw, 1.65rem)", lineHeight: 1 }}>
                INTELLIGENCE
              </span>
            </motion.div>
          </div>

          {/* Micro Detail: Accent Line & Pulsing Dot */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.7, ease: easeOutQuart }}
            style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: 16, transformOrigin: "center" }}
          >
            <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.35))" }} />
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#3B82F6",
              boxShadow: "0 0 10px rgba(59,130,246,0.85)",
            }} />
            <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,0.35), transparent)" }} />
          </motion.div>

          {/* Tagline */}
          <div style={{ overflow: "hidden" }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, delay: 3.0, ease: easeOutQuart }}
              style={{
                color: "#1E293B",
                fontFamily: "'Inter',system-ui,sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              BUILDING INTELLIGENT DIGITAL EXPERIENCES
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Footer: Loading experience progress and track ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          position: "absolute", zIndex: 12,
          bottom: "8%", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 11,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        <p style={{
          color: "#2C3F6A",
          opacity: 0.45,
          fontFamily: "'Inter',system-ui,sans-serif",
          fontWeight: 400,
          fontSize: "clamp(0.48rem, 1.0vw, 0.60rem)",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          margin: 0,
        }}>
          INITIALIZING EXPERIENCE...
        </p>

        {/* Track + Travelling Dot */}
        <div style={{
          position: "relative", width: 160, height: 2, borderRadius: 999,
          background: "rgba(59,130,246,0.12)",
        }}>
          <div
            style={{
              position: "absolute", top: -3, left: 0,
              width: 8, height: 8, borderRadius: "50%",
              background: "radial-gradient(circle, #72B0FF, #3B82F6)",
              boxShadow: "0 0 10px rgba(59,130,246,0.9), 0 0 4px rgba(3B,130,246,1)",
              animation: "travelDot 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </motion.div>

    </motion.div>
  );
}

/* ── Shared style for full-screen overlay ── */
const FULL_SCREEN_STYLE: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 9999,
  overflow: "hidden",
  pointerEvents: "none", cursor: "default", userSelect: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "#FCFDFF",
};

