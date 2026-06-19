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
 * GlassObjects: Renders dodecahedron glass crystals surrounding the planet.
 * Centrifugal displacement offsets their positions during success passes.
 */
export default function GlassObjects() {
  const { view } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const { config } = usePerformance();
  const fragmentRefs = useRef<THREE.Mesh[]>([]);
  const currentDistanceMult = useRef(1.0);

  // Generate floating crystal polyhedrons based on performance profile
  const fragments = useMemo(() => {
    const rand = createSeededRandom(88888);
    const list = [];
    const count = config.glassObjectsCount;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const r = 1.7 + rand() * 0.9;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const py = (rand() - 0.5) * 1.5;

      list.push({
        id: i,
        pos: new THREE.Vector3(px, py, pz),
        size: 0.04 + rand() * 0.08,
        rotSpeed: new THREE.Vector3(
          (rand() - 0.5) * 1.5,
          (rand() - 0.5) * 1.5,
          (rand() - 0.5) * 1.5
        ),
        orbitSpeed: 0.05 + rand() * 0.12,
        phase: rand() * Math.PI * 2,
      });
    }
    return list;
  }, [config.glassObjectsCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    let targetDistanceMult = 1.0;
    if (view === "ai") {
      targetDistanceMult = 2.5; // Smoothly push fragments outward
    }
    currentDistanceMult.current = THREE.MathUtils.lerp(currentDistanceMult.current, targetDistanceMult, 0.06);

    // Normalize speeds for display refresh rates
    const timeScale = Math.min(3.0, delta / 0.0166) * config.orbitSpeedMult;

    fragments.forEach((frag, idx) => {
      const mesh = fragmentRefs.current[idx];
      if (mesh) {
        // Self rotation
        mesh.rotation.x += frag.rotSpeed.x * 0.012 * timeScale;
        mesh.rotation.y += frag.rotSpeed.y * 0.012 * timeScale;
        mesh.rotation.z += frag.rotSpeed.z * 0.012 * timeScale;

        // Orbit speed multiplier during success passes
        const speedMult = (view === "success" ? 6.0 : 1.0) * timeScale;
        const angle = time * frag.orbitSpeed * speedMult + frag.phase;
        const radius = Math.sqrt(frag.pos.x * frag.pos.x + frag.pos.z * frag.pos.z) * currentDistanceMult.current;

        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = frag.pos.y + Math.sin(time * 0.65 + frag.phase) * 0.12 * timeScale;

        if (view === "success") {
          // Centrifugal displacement: push fragments outward to clear camera view
          mesh.position.x *= 1.15;
          mesh.position.z *= 1.15;
        }
      }
    });
  });

  const isDark = resolvedTheme === "dark";
  const fragColor = isDark ? "#93c5fd" : "#e0f2fe";

  return (
    <>
      {fragments.map((frag, idx) => (
        <mesh
          key={frag.id}
          ref={(el) => {
            if (el) fragmentRefs.current[idx] = el;
          }}
          position={frag.pos}
        >
          <dodecahedronGeometry args={[frag.size]} />
          {config.useHeavyTransmission ? (
            <MeshTransmissionMaterial
              transmission={0.94}
              roughness={0.06}
              thickness={0.35}
              chromaticAberration={0.18}
              ior={1.5}
              color={fragColor}
              backside={true}
            />
          ) : (
            <meshPhysicalMaterial
              transmission={0.8}
              roughness={0.1}
              thickness={0.5}
              ior={1.5}
              color={fragColor}
              transparent
              opacity={0.65}
              depthWrite={false}
            />
          )}
        </mesh>
      ))}
    </>
  );
}
