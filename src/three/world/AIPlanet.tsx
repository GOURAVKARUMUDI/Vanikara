"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
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
 * AIPlanet: Renders the central Glass Sphere, internal basic glow nodes,
 * and internal refracted points.
 */
export default function AIPlanet() {
  const { resolvedTheme } = useTheme();
  const { view } = useCygmaWorld();
  const { config, currentProfile } = usePerformance();
  const theme = resolvedTheme;
  const isDark = theme === "dark";

  const coreRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const secondaryGlowRef = useRef<THREE.Mesh>(null);
  const innerParticlesRef = useRef<THREE.Points>(null);
  const glassSphereRef = useRef<THREE.Mesh>(null);

  // Dynamic tracking refs for smooth interpolations
  const currentGlassScale = useRef(1.0);
  const currentGlowScale = useRef(1.0);
  const currentParticlesScale = useRef(1.0);
  const currentGlowOpacity = useRef(1.0);
  const currentSecondaryGlowOpacity = useRef(1.0);

  // Generate a cluster of neural particles inside the glass core
  const innerParticleCount = 80;
  const [particlePositions] = useMemo(() => {
    const rand = createSeededRandom(12345);
    const pos = new Float32Array(innerParticleCount * 3);
    for (let i = 0; i < innerParticleCount; i++) {
      const u = rand();
      const v = rand();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(rand()) * 0.78;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, [innerParticleCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // dolly scale logic on start
    let scale = 0;
    if (time > 2.0) {
      const alpha = Math.min(1.0, (time - 2.0) / 2.5);
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const easeOutBack = 1 + c3 * Math.pow(alpha - 1, 3) + c1 * Math.pow(alpha - 1, 2);
      scale = easeOutBack;
    }

    // Shrink scale to fade planet out during camera success pass-through
    if (view === "success") {
      scale = THREE.MathUtils.lerp(scale, 0, 0.035 * Math.min(3.0, delta / 0.0166));
    }

    if (coreRef.current) {
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y = time * 0.08 * config.orbitSpeedMult;
      coreRef.current.rotation.x = 0;
      coreRef.current.position.y = 0.2;
    }

    // Dynamic targets based on active view preset
    let targetGlassScale = 1.0;
    let targetGlowScale = 1.0;
    let targetParticlesScale = 1.0;
    
    const defaultGlowOpacity = isDark ? 0.75 : 0.5;
    const defaultSecondaryOpacity = 0.3;
    let targetGlowOpacity = defaultGlowOpacity;
    let targetSecondaryOpacity = defaultSecondaryOpacity;

    if (view === "success") {
      targetGlassScale = 0.0;
      targetGlowScale = 0.0;
      targetParticlesScale = 0.0;
      targetGlowOpacity = 0.0;
      targetSecondaryOpacity = 0.0;
    } else if (view === "ai") {
      // Scale glass sphere way up to cover camera and prevent near plane clipping
      targetGlassScale = 4.2;
      // Shrink & dim glow meshes so they don't block the screen inside the core
      targetGlowScale = 0.15;
      targetGlowOpacity = 0.01;
      targetSecondaryOpacity = 0.005;
      // Expand neural particle field inside the core to create a floating network room
      targetParticlesScale = 2.4;
    }

    const lerpSpeed = Math.min(1.0, 0.06 * (delta / 0.0166) * config.orbitSpeedMult);
    currentGlassScale.current = THREE.MathUtils.lerp(currentGlassScale.current, targetGlassScale, lerpSpeed);
    currentGlowScale.current = THREE.MathUtils.lerp(currentGlowScale.current, targetGlowScale, lerpSpeed);
    currentParticlesScale.current = THREE.MathUtils.lerp(currentParticlesScale.current, targetParticlesScale, lerpSpeed);
    currentGlowOpacity.current = THREE.MathUtils.lerp(currentGlowOpacity.current, targetGlowOpacity, lerpSpeed);
    currentSecondaryGlowOpacity.current = THREE.MathUtils.lerp(currentSecondaryGlowOpacity.current, targetSecondaryOpacity, lerpSpeed);

    if (glassSphereRef.current) {
      const gs = currentGlassScale.current;
      glassSphereRef.current.scale.set(gs, gs, gs);
    }

    if (glowRef.current) {
      const pulseRate = view === "success" ? 8.0 : 1.8;
      const pulseAmp = view === "success" ? 0.2 : 0.05;
      const pulse = (1.0 + Math.sin(time * pulseRate * config.orbitSpeedMult) * pulseAmp) * currentGlowScale.current;
      glowRef.current.scale.set(pulse, pulse, pulse);
      if (glowRef.current.material && !Array.isArray(glowRef.current.material)) {
        (glowRef.current.material as THREE.Material).opacity = currentGlowOpacity.current;
      }
    }

    if (secondaryGlowRef.current) {
      const s = currentGlowScale.current * 1.05;
      secondaryGlowRef.current.scale.set(s, s, s);
      if (secondaryGlowRef.current.material && !Array.isArray(secondaryGlowRef.current.material)) {
        (secondaryGlowRef.current.material as THREE.Material).opacity = currentSecondaryGlowOpacity.current;
      }
    }

    if (innerParticlesRef.current) {
      const ps = currentParticlesScale.current;
      innerParticlesRef.current.scale.set(ps, ps, ps);
      innerParticlesRef.current.rotation.y = -time * 0.12 * config.orbitSpeedMult;
      innerParticlesRef.current.rotation.x = time * 0.04 * config.orbitSpeedMult;
    }
  });

  const primaryGlowColor = isDark ? "#3b82f6" : "#0284c7"; // Sky blue vs brand blue
  const accentGlowColor = isDark ? "#a855f7" : "#ea580c";  // Purple highlights vs Sunset Orange
  const sphereColor = isDark ? "#1e1b4b" : "#bde0fe";      // Indigo glass core vs Translucent sky-blue glass core

  return (
    <group ref={coreRef}>
      {/* Internal point light inside the crystal sphere */}
      <pointLight 
        color={isDark ? "#60a5fa" : "#e0f2fe"} 
        intensity={isDark ? 2.0 : 1.4} 
        distance={5.0} 
        decay={1.8}
      />

      {/* A. Core Base Glow Node */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color={primaryGlowColor}
          transparent
          opacity={isDark ? 0.75 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* B. Secondary Inner Contrast Glow */}
      <mesh ref={secondaryGlowRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[0.48, 24, 24]} />
        <meshBasicMaterial
          color={accentGlowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* C. Internal Neural Star Particles */}
      <points ref={innerParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={isDark ? "#e2e8f0" : "#0f172a"}
          transparent
          opacity={isDark ? 0.95 : 0.65}
          sizeAttenuation
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* D. Main Glass Core Sphere */}
      <mesh ref={glassSphereRef}>
        <icosahedronGeometry args={[1.22, 3]} />
        <MeshTransmissionMaterial
          transmission={0.98}
          roughness={isDark ? 0.02 : 0.04}
          thickness={isDark ? 0.85 : 1.8}
          distortion={0.12}
          temporalDistortion={0.04}
          chromaticAberration={isDark ? 1.1 : 1.45}
          anisotropicBlur={0.15}
          ior={isDark ? 1.72 : 1.68} // Higher refractive index for rich refractions in both modes
          color={sphereColor}
          backside={true}
          transmissionSampler={true}
        />
      </mesh>
    </group>
  );
}
