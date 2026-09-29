"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SilkCanvas from "./SilkCanvas";

export type PageAtmosphere = "home" | "product" | "about" | "contact" | "dashboard" | "minimal";

function resolveAtmosphere(pathname: string): PageAtmosphere {
  if (pathname === "/") return "home";
  if (
    pathname.startsWith("/what-we-build") ||
    pathname.startsWith("/food-delivery") ||
    pathname.startsWith("/cygma") ||
    pathname.startsWith("/technology")
  ) {
    return "product";
  }
  if (
    pathname.startsWith("/about") ||
    pathname.startsWith("/leadership") ||
    pathname.startsWith("/careers")
  ) {
    return "about";
  }
  if (pathname.startsWith("/contact")) {
    return "contact";
  }
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth")
  ) {
    return "dashboard";
  }
  return "minimal";
}

/**
 * SiteBackground: Multi-layered, page-aware, interactive ambient light system.
 *
 * Inspired by the VANIKARA dual-wing aerodynamic logo:
 * - Layer 1: Base canvas wash with calibrated WCAG contrast
 * - Layer 2: Dual-wing ambient gradient fields (warm kinetic wing left, cool intelligence wing right)
 * - Layer 3: Signature Effect: Geometric Light (precision aerodynamic airfoil vectors & orbital arcs)
 * - Layer 4: Filmic micro-grain texture & optical center vignette
 * - Layer 5: Specular traveling sheen & slow organic ambient motion
 * - Layer 6: Interpolated (lerp) pointer atmosphere for desktop fine-pointers
 * - Liquid silk (WebGL): when available, replaces layers 1–2 with a living,
 *   time-of-day aware fabric of light (see SilkCanvas). Layers 1–2 remain
 *   the fallback.
 * - Daypart tint, light rays and a pointer-revealed dot matrix add depth.
 */
export default function SiteBackground() {
  const pathname = usePathname();
  const atmosphere = resolveAtmosphere(pathname);
  const bgRef = useRef<HTMLDivElement>(null);
  const [silk, setSilk] = useState(false);

  // Smooth lerp-interpolated interactive pointer atmosphere (Desktop fine-pointers only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let targetX = 50;
    let targetY = 35;
    let currentX = 50;
    let currentY = 35;
    let animId = 0;
    let isRunning = false;

    // Organic fluid damping factor
    const lerp = 0.055;

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * lerp;
      currentY += dy * lerp;

      if (bgRef.current) {
        bgRef.current.style.setProperty("--pointer-x", `${currentX.toFixed(2)}%`);
        bgRef.current.style.setProperty("--pointer-y", `${currentY.toFixed(2)}%`);
      }

      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
        animId = requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;

      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={bgRef}
      aria-hidden="true"
      className={`site-bg ${silk ? "site-bg--gl" : ""}`}
      data-atmosphere={atmosphere}
    >
      {/* Layer 1 — Base Canvas Wash */}
      <div className="site-bg__base" />

      {/* Layer 2 — Ambient Soft Radial Gradients (Dual-Wing Light Fields) */}
      <div className="site-bg__ambient">
        <div className="site-bg__glow site-bg__glow--cool" />
        <div className="site-bg__glow site-bg__glow--warm" />
        <div className="site-bg__glow site-bg__glow--apex" />
      </div>

      {/* Liquid silk (WebGL) — fades in over layers 1–2 once the first frame is drawn */}
      <SilkCanvas atmosphere={atmosphere} onReady={setSilk} />

      {/* Time-of-day tint (dawn / day / dusk / night, set on <html>) */}
      <div className="site-bg__daypart" />

      {/* Soft light rays from above */}
      <div className="site-bg__rays" />

      {/* Layer 3 — Signature Effect: Geometric Light (Aerodynamic Vector Airfoils & Orbital Arcs) */}
      <svg
        className="site-bg__geometry"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Cool wing vector gradient (Electric Cyan -> Blue -> Transparent) */}
          <linearGradient id="geom-wing-cool" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--brand-primary)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
          </linearGradient>

          {/* Warm wing vector gradient (Warm Gold -> Orange -> Transparent) */}
          <linearGradient id="geom-wing-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-accent-warm)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--brand-secondary)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0" />
          </linearGradient>

          {/* Central delta apex gradient */}
          <linearGradient id="geom-apex" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brand-accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--brand-accent-warm)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dual-wing aerodynamic flow vectors */}
        <g className="site-bg__vectors">
          {/* Cool wing contour arcs (Right) */}
          <path
            d="M 1540 -40 C 1220 120, 990 380, 780 580 S 734 840, 738 960"
            stroke="url(#geom-wing-cool)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="6 10"
          />
          <path
            d="M 1420 100 C 1160 250, 940 470, 805 670 S 742 860, 745 960"
            stroke="url(#geom-wing-cool)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M 1280 220 C 1080 370, 890 560, 790 730 S 746 880, 748 970"
            stroke="url(#geom-wing-cool)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Warm wing contour arcs (Left) */}
          <path
            d="M -100 20 C 220 160, 450 380, 660 580 S 706 840, 702 960"
            stroke="url(#geom-wing-warm)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="6 10"
          />
          <path
            d="M 20 160 C 280 290, 500 480, 635 670 S 698 860, 695 960"
            stroke="url(#geom-wing-warm)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M 160 280 C 360 410, 550 580, 650 730 S 694 880, 692 970"
            stroke="url(#geom-wing-warm)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Subtle aerospace orbital guide rings */}
          <circle cx="720" cy="540" r="440" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 9" />
          <circle cx="720" cy="540" r="280" stroke="currentColor" strokeOpacity="0.04" />

          {/* Central delta aerodynamic trajectory */}
          <line
            x1="720"
            y1="280"
            x2="720"
            y2="880"
            stroke="url(#geom-apex)"
            strokeWidth="1.5"
            strokeDasharray="4 12"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Layer 5 — Signature Travelling Sheen (Subtle faceted specular reflection) */}
      <div className="site-bg__sheen" />

      {/* Layer 4 — Tactile Filmic Micro-Grain & Optical Center Vignette */}
      <div className="site-bg__grain" />
      <div className="site-bg__vignette" />

      {/* Interactive Pointer Light Field (Desktop fine-pointers only, lerp-interpolated) */}
      <div className="site-bg__pointer" />

      {/* Precision dot matrix, revealed only around the pointer */}
      <div className="site-bg__dots" />
    </div>
  );
}
