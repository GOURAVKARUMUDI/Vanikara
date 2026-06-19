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

  const maxPairs = (nodeCount * (nodeCount - 1)) / 2;
  const maxFloatCount = maxPairs * 6; // 2 vertices * 3 coordinates
  const positionsArray = useMemo(() => new Float32Array(maxFloatCount), [nodeCount]);

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

  useFrame((state, delta) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();

    const activeCoords = nodes.map((node) => {
      const offset = Math.sin(time * node.speed * config.orbitSpeedMult + node.phase) * 0.15;
      return new THREE.Vector3(
        node.position.x,
        node.position.y + offset,
        node.position.z
      );
    });

    const threshold = 4.2;
    let idx = 0;
    
    // Normalize time scales and orbit speeds for connection checks
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = activeCoords[i].distanceTo(activeCoords[j]);
        if (dist < threshold && idx < maxFloatCount - 5) {
          positionsArray[idx++] = activeCoords[i].x;
          positionsArray[idx++] = activeCoords[i].y;
          positionsArray[idx++] = activeCoords[i].z;
          positionsArray[idx++] = activeCoords[j].x;
          positionsArray[idx++] = activeCoords[j].y;
          positionsArray[idx++] = activeCoords[j].z;
        }
      }
    }

    const geometry = lineRef.current.geometry;
    geometry.setDrawRange(0, idx / 3);
    geometry.attributes.position.needsUpdate = true;
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
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positionsArray, 3]}
            />
          </bufferGeometry>
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
