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
  const { view, sceneReady } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const { config } = usePerformance();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const currentDistanceMult = useRef(1.0);
  
  const revealProgress = useRef(0);
  const activeTimeRef = useRef(0);

  // Temporary Object3D for instanced transforms calculation
  const tempObject = useMemo(() => new THREE.Object3D(), []);

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
    const instancedMesh = instancedMeshRef.current;
    if (!instancedMesh) return;

    if (!sceneReady) {
      revealProgress.current = 0;
      // Set all instance matrices scale to 0
      for (let i = 0; i < fragments.length; i++) {
        tempObject.position.set(0, 0, 0);
        tempObject.scale.set(0, 0, 0);
        tempObject.updateMatrix();
        instancedMesh.setMatrixAt(i, tempObject.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.material && !Array.isArray(instancedMesh.material)) {
        (instancedMesh.material as THREE.Material).opacity = 0;
      }
      return;
    }

    if (revealProgress.current < 3.0) {
      revealProgress.current = Math.min(3.0, revealProgress.current + delta);
    }
    const timeSinceReady = revealProgress.current;
    const revealOpacity = Math.min(1.0, timeSinceReady / 1.5);

    if (timeSinceReady >= 1.5) {
      activeTimeRef.current += delta;
    }
    const activeTime = activeTimeRef.current;

    let targetDistanceMult = 1.0;
    if (view === "ai") {
      targetDistanceMult = 2.5; // Smoothly push fragments outward
    }
    currentDistanceMult.current = THREE.MathUtils.lerp(currentDistanceMult.current, targetDistanceMult, 0.06);

    fragments.forEach((frag, idx) => {
      // Orbit speed multiplier during success passes, supporting prefers-reduced-motion
      const orbitSpeed = frag.orbitSpeed * 10 * config.orbitSpeedMult;
      const speedMult = view === "success" ? 6.0 : 1.0;
      const angle = activeTime * orbitSpeed * speedMult + frag.phase;
      const radius = Math.sqrt(frag.pos.x * frag.pos.x + frag.pos.z * frag.pos.z) * currentDistanceMult.current;

      let posX = Math.cos(angle) * radius;
      let posZ = Math.sin(angle) * radius;
      const posY = frag.pos.y;

      if (view === "success") {
        // Centrifugal displacement: push fragments outward to clear camera view
        posX *= 1.15;
        posZ *= 1.15;
      }

      tempObject.position.set(posX, posY, posZ);
      
      const sVal = frag.size * revealOpacity;
      tempObject.scale.set(sVal, sVal, sVal);

      // Self rotation
      tempObject.rotation.set(
        activeTime * frag.rotSpeed.x * 0.12 * config.orbitSpeedMult,
        activeTime * frag.rotSpeed.y * 0.12 * config.orbitSpeedMult,
        activeTime * frag.rotSpeed.z * 0.12 * config.orbitSpeedMult
      );

      tempObject.updateMatrix();
      instancedMesh.setMatrixAt(idx, tempObject.matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;

    // Set opacity of mesh material
    if (instancedMesh.material && !Array.isArray(instancedMesh.material)) {
      const mat = instancedMesh.material as THREE.Material;
      mat.transparent = true;
      mat.opacity = revealOpacity;
    }
  });

  const isDark = resolvedTheme === "dark";
  const fragColor = isDark ? "#93c5fd" : "#e0f2fe";

  return (
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={instancedMeshRef} args={[null as any, null as any, fragments.length]}>
      <dodecahedronGeometry args={[1]} />
      {config.useHeavyTransmission ? (
        <MeshTransmissionMaterial
          transmission={0.94}
          roughness={0.06}
          thickness={0.35}
          chromaticAberration={0.18}
          ior={1.5}
          color={fragColor}
          backside={true}
          transparent
          opacity={0}
        />
      ) : (
        <meshPhysicalMaterial
          transmission={0.85}
          roughness={0.1}
          thickness={0.35}
          ior={1.4}
          color={fragColor}
          transparent
          opacity={0}
          depthWrite={false}
        />
      )}
    </instancedMesh>
  );
}
