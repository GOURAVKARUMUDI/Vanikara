"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useTheme } from "@/components/layout/ThemeContext";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * EnergyRings: Renders the three orbital rings encircling the glass core.
 * Each ring spins at distinct speeds, scales, and angles.
 */
export default function EnergyRings() {
  const { resolvedTheme } = useTheme();
  const { view } = useCygmaWorld();

  const ringGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const currentRingScale = useRef(1.0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.22;
      ring1Ref.current.rotation.y = time * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.28;
      ring2Ref.current.rotation.z = time * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.14;
      ring3Ref.current.rotation.z = -time * 0.2;
    }

    // Dynamic ring scaling based on view state
    let targetScale = 1.0;
    if (view === "success") {
      targetScale = 0.0;
    } else if (view === "ai") {
      targetScale = 2.8; // Scale out of camera near-clipping plane
    }

    currentRingScale.current = THREE.MathUtils.lerp(currentRingScale.current, targetScale, 0.06);

    if (ringGroupRef.current) {
      const rs = currentRingScale.current;
      ringGroupRef.current.scale.set(rs, rs, rs);
    }
  });

  const isDark = resolvedTheme === "dark";
  const ring1Color = isDark ? "#6366f1" : "#bae6fd";
  const ring2Color = isDark ? "#f97316" : "#ffedd5";
  const ring3Color = isDark ? "#c084fc" : "#f0fdf4";

  return (
    <group ref={ringGroupRef}>
      {/* Orbital Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.85, 0.012, 16, 128]} />
        <MeshTransmissionMaterial
          transmission={0.96}
          roughness={0.05}
          thickness={0.18}
          chromaticAberration={0.1}
          ior={1.48}
          color={ring1Color}
        />
      </mesh>

      {/* Orbital Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.15, 0.009, 16, 128]} />
        <MeshTransmissionMaterial
          transmission={0.96}
          roughness={0.05}
          thickness={0.18}
          chromaticAberration={0.1}
          ior={1.48}
          color={ring2Color}
        />
      </mesh>

      {/* Orbital Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.45, 0.007, 16, 128]} />
        <MeshTransmissionMaterial
          transmission={0.96}
          roughness={0.06}
          thickness={0.15}
          chromaticAberration={0.1}
          ior={1.48}
          color={ring3Color}
        />
      </mesh>
    </group>
  );
}
