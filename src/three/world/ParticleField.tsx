"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";

// Seeded random number generator
function createSeededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * ParticleField: Handles the 3D background floating particles.
 * Velocities scale up during auth success or dashboard view changes to simulate camera movement.
 */
export default function ParticleField({ count = 650 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { resolvedTheme } = useTheme();
  const { view, sceneReady } = useCygmaWorld();
  const { config } = usePerformance();

  const revealProgress = useRef(0);
  const activeTimeRef = useRef(0);
  const interactedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      interactedRef.current = true;
      return;
    }
    const handleInteraction = () => {
      interactedRef.current = true;
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
    window.addEventListener("pointerdown", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Generate deterministic coordinates
  const [positions, _speeds] = useMemo(() => {
    const rand = createSeededRandom(11111);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 16;
      pos[i * 3 + 1] = (rand() - 0.5) * 11;
      pos[i * 3 + 2] = (rand() - 0.5) * 10 - 2;

      // Slow drift along the Z-axis
      spd[i * 3] = (rand() - 0.5) * 0.003;
      spd[i * 3 + 1] = (rand() - 0.5) * 0.003;
      spd[i * 3 + 2] = (rand() - 0.5) * 0.003 - 0.002;
    }
    return [pos, spd];
  }, [count]);

  const throttleClock = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    if (!sceneReady) {
      revealProgress.current = 0;
      if (pointsRef.current.material && !Array.isArray(pointsRef.current.material)) {
        (pointsRef.current.material as THREE.Material).opacity = 0;
      }
      return;
    }

    const targetFps = config.targetFps || 60;
    const fpsLimit = 1 / targetFps;
    throttleClock.current += delta;
    if (throttleClock.current < fpsLimit) return;
    const throttledDelta = throttleClock.current;
    throttleClock.current = throttleClock.current % fpsLimit;

    if (revealProgress.current < 3.0) {
      revealProgress.current = Math.min(3.0, revealProgress.current + throttledDelta);
    }
    const timeSinceReady = revealProgress.current;
    const revealOpacity = Math.min(1.0, timeSinceReady / 1.5);

    if (timeSinceReady >= 1.5 && interactedRef.current) {
      activeTimeRef.current += throttledDelta;
    }
    const activeTime = activeTimeRef.current;

    // Warp factors: speeds multiply dynamically on success
    const warpMult = view === "success" ? 15.0 : 1.0;

    // Apply organic flow to the entire particle field
    pointsRef.current.rotation.y = activeTime * 0.015 * warpMult * config.orbitSpeedMult;
    pointsRef.current.rotation.x = activeTime * 0.005 * warpMult * config.orbitSpeedMult;
    
    // Subtle organic positional drift
    const driftX = Math.sin(activeTime * 0.2) * 0.15;
    const driftY = Math.cos(activeTime * 0.15) * 0.15;
    pointsRef.current.position.x = driftX;
    pointsRef.current.position.y = driftY;

    if (pointsRef.current.material && !Array.isArray(pointsRef.current.material)) {
      const baseOpacity = isDark ? 0.45 : 0.6;
      (pointsRef.current.material as THREE.Material).opacity = baseOpacity * revealOpacity;
    }
  });

  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? "#a5b4fc" : "#475569"; // Light lavender vs steel blue

  // Create a high-quality soft circular texture for rounded particles
  const circleTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      // Soft radial gradient for a beautiful glow effect
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.85)");
      gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.35)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      if (circleTexture) {
        circleTexture.dispose();
      }
    };
  }, [circleTexture]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={particleColor}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        map={circleTexture || undefined}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
