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
  const fragmentRefs = useRef<THREE.Group[]>([]);
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
        size: 0.012 + rand() * 0.02,
        rotSpeed: new THREE.Vector3(
          (rand() - 0.5) * 1.5,
          (rand() - 0.5) * 1.5,
          (rand() - 0.5) * 1.5
        ),
        orbitSpeed: 0.005 + rand() * 0.01,
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
      const group = fragmentRefs.current[idx];
      if (group) {
        // Self rotation of the group
        group.rotation.x += frag.rotSpeed.x * 0.002 * timeScale;
        group.rotation.y += frag.rotSpeed.y * 0.002 * timeScale;
        group.rotation.z += frag.rotSpeed.z * 0.002 * timeScale;

        // Orbit speed multiplier during success passes
        const speedMult = (view === "success" ? 6.0 : 1.0) * timeScale;
        const angle = time * frag.orbitSpeed * speedMult + frag.phase;
        const radius = Math.sqrt(frag.pos.x * frag.pos.x + frag.pos.z * frag.pos.z) * currentDistanceMult.current;

        group.position.x = Math.cos(angle) * radius;
        group.position.z = Math.sin(angle) * radius;
        group.position.y = frag.pos.y + Math.sin(time * 0.65 + frag.phase) * 0.12 * timeScale;

        if (view === "success") {
          // Centrifugal displacement: push fragments outward to clear camera view
          group.position.x *= 1.15;
          group.position.z *= 1.15;
        }
      }
    });
  });

  const isDark = resolvedTheme === "dark";
  const fragColor = isDark ? "#93c5fd" : "#e0f2fe";
  const lightColor = isDark ? "#38bdf8" : "#f97316";
  const lightIntensity = isDark ? 0.75 : 0.45;

  return (
    <>
      {fragments.map((frag, idx) => (
        <group
          key={frag.id}
          ref={(el) => {
            if (el) fragmentRefs.current[idx] = el;
          }}
          position={frag.pos}
        >
          <mesh>
            <dodecahedronGeometry args={[frag.size]} />
            <MeshTransmissionMaterial
              transmission={0.94}
              roughness={0.06}
              thickness={0.35}
              chromaticAberration={0.18}
              ior={1.5}
              color={fragColor}
              backside={true}
            />
          </mesh>
          <pointLight
            color={lightColor}
            intensity={lightIntensity}
            distance={2.0}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}
