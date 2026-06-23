"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme, AtmosphereMode } from "./ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
}

export default function BackgroundSystem() {
  const { atmosphere } = useTheme();
  const { currentProfile, reduceMotion } = usePerformance();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Disable 2D particles/glow dynamically on low performance presets, reduced motion, or mobile viewports
  const isPerformanceLow = currentProfile === "low" || currentProfile === "battery" || reduceMotion || isMobile;

  // Get particle color based on active atmosphere
  const getParticleColor = (mode: AtmosphereMode): string => {
    switch (mode) {
      case "morning":
        return "251, 191, 36"; // Gold
      case "evening":
        return "244, 63, 94";  // Sunset Rose
      case "night":
        return "129, 140, 248"; // Indigo Light
      case "afternoon":
      default:
        return "30, 107, 214"; // Brand Blue
    }
  };

  const checkLowPerf = () => {
    const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;
    return isPerformanceLow || isMobileViewport;
  };

  useEffect(() => {
    if (checkLowPerf()) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPerformanceLow]);

  useEffect(() => {
    if (checkLowPerf()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initial particles creation
    const particleCount = 25;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5,
        targetAlpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const colorString = getParticleColor(atmosphere);

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Slowly twinkle alpha
        p.alpha += (p.targetAlpha - p.alpha) * 0.01;
        if (Math.abs(p.alpha - p.targetAlpha) < 0.05) {
          p.targetAlpha = Math.random() * 0.5 + 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorString}, ${p.alpha})`;
        ctx.fill();
      });

      // Slowly draw connections if particles are close
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.strokeStyle = `rgba(${colorString}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atmosphere, isPerformanceLow]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 select-none">
      {/* Layer 1: Ambient Atmosphere Background Gradient (Controlled by body css transitions) */}

      {/* Layer 2: Moving Light Orbs / Blurs (Bypassed on low-end and mobile devices to prevent rendering lag) */}
      {!isPerformanceLow && (
        <>
          <div 
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] rounded-full filter blur-[120px] transition-[opacity] duration-1000 animate-orb"
            style={{
              background: `radial-gradient(circle, var(--orb-1), transparent 70%)`,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              mixBlendMode: "var(--orb-blend)" as any,
              opacity: "var(--orb-opacity)",
            }}
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] rounded-full filter blur-[140px] transition-[opacity] duration-1000 animate-orb-slow"
            style={{
              background: `radial-gradient(circle, var(--orb-2), transparent 70%)`,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              mixBlendMode: "var(--orb-blend)" as any,
              opacity: "var(--orb-opacity)",
            }}
          />
        </>
      )}

      {/* Layer 3: Interactive Canvas Particles */}
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 w-full h-full opacity-60 transition-opacity duration-500 hidden md:block ${
          isPerformanceLow ? "opacity-0 pointer-events-none" : ""
        }`} 
      />

      {/* Layer 4: Interactive cursor glow effect */}
      {!isPerformanceLow && (
        <div
          className="absolute w-[350px] h-[350px] rounded-full filter blur-[100px] transition-transform duration-300 ease-out pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(circle, var(--accent-color), transparent 75%)`,
            transform: `translate3d(${mousePos.x - 175}px, ${mousePos.y - 175}px, 0)`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mixBlendMode: "var(--orb-blend)" as any,
            opacity: "calc(var(--orb-opacity) * 0.6)",
          }}
        />
      )}

      {/* Layer 5: Film Grain Noise Overlay */}
      {!isPerformanceLow && (
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
}
