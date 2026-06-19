"use client";

import React, { useRef, useMemo } from "react";
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
 * NeuralNetwork: Draws connecting nodes and dynamic line segments.
 */
export default function NeuralNetwork({ nodeCount = 14 }) {
  const { resolvedTheme } = useTheme();
  const { view } = useCygmaWorld();
  const { config } = usePerformance();
  const lineRef = useRef<THREE.LineSegments>(null);

  const nodes = useMemo(() => {
    const rand = createSeededRandom(22222);
    const items = [];
    for (let i = 0; i < nodeCount; i++) {
      items.push({
        position: new THREE.Vector3(
          (rand() - 0.5) * 11,
          (rand() - 0.5) * 9,
          (rand() - 0.5) * 4 - 1
        ),
        phase: rand() * Math.PI * 2,
        speed: 0.12 + rand() * 0.18,
      });
    }
    return items;
  }, [nodeCount]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions: number[] = [];

    const activeCoords = nodes.map((node) => {
      const offset = Math.sin(time * node.speed * config.orbitSpeedMult + node.phase) * 0.15;
      return new THREE.Vector3(
        node.position.x,
        node.position.y + offset,
        node.position.z
      );
    });

    const threshold = 4.2;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = activeCoords[i].distanceTo(activeCoords[j]);
        if (dist < threshold) {
          positions.push(activeCoords[i].x, activeCoords[i].y, activeCoords[i].z);
          positions.push(activeCoords[j].x, activeCoords[j].y, activeCoords[j].z);
        }
      }
    }

    lineRef.current.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const isDark = resolvedTheme === "dark";
  const lineColor = isDark ? "#4f46e5" : "#60a5fa"; // Indigo vs sky blue

  return (
    <group>
      {nodes.map((node, idx) => (
        <mesh key={idx} position={node.position}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial 
            color={lineColor} 
            transparent 
            opacity={isDark ? 0.35 : 0.5} 
          />
        </mesh>
      ))}

      {/* Network Lines (disappear during success pass-through) */}
      {view !== "success" && (
        <lineSegments ref={lineRef}>
          <bufferGeometry />
          <lineBasicMaterial
            color={lineColor}
            transparent
            opacity={isDark ? 0.12 : 0.22}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}
