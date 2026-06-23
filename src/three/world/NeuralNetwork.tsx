"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";

// Seeded random number generator for stability across re-renders
function createSeededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface ConstellationNode {
  type: "primary" | "secondary" | "micro";
  basePosition: THREE.Vector3;
  phase: number;
  speed: number;
  orbitRadius: number;
  size: number;
  opacity: number;
}

/**
 * NeuralNetwork: A premium, cinematic AI intelligence field.
 * Organized into three hierarchical depth layers (Primary, Secondary, Micro)
 * with a stable nearest-neighbor network topology, organic noise drift,
 * global breathing, and camera parallax.
 */
export default function NeuralNetwork({ nodeCount = 24 }) {
  const { resolvedTheme } = useTheme();
  const { view, sceneReady } = useCygmaWorld();
  const { config } = usePerformance();
  const isDark = resolvedTheme === "dark";
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

  const primaryPointsRef = useRef<THREE.Points>(null);
  const secondaryPointsRef = useRef<THREE.Points>(null);
  const microPointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  // 1. Generate node data structure and precalculated stable connections in a single block
  const { allNodes, uniqueConnections, primaryCount, secondaryCount, microCount } = useMemo(() => {
    const rand = createSeededRandom(44444);
    const items: ConstellationNode[] = [];
    const centerX = 0;
    const centerY = 0.2;
    const centerZ = 0.0; // Concentric with the central glass planet core [0, 0.2, 0]

    // Scale node counts dynamically using active performance limits (range ~4 to 16)
    const scaleMult = nodeCount / 16;
    const pCount = Math.max(4, Math.round(10 * scaleMult));    // Primary: 8-12 base
    const sCount = Math.max(12, Math.round(50 * scaleMult));   // Secondary: 40-60 base
    const mCount = Math.max(24, Math.round(120 * scaleMult));  // Micro: 100-150 base

    // Layer 1: Primary Nodes (Core, closest, largest)
    for (let i = 0; i < pCount; i++) {
      const r = 2.4 + rand() * 0.4; // Shell radius: [2.4, 2.8] (outside the 1.22 radius core)
      const theta = rand() * Math.PI * 2.0;
      const cosPhi = -rand(); // Uniform hemispherical distribution (Z <= 0)
      const sinPhi = Math.sqrt(1.0 - cosPhi * cosPhi);

      const bx = r * sinPhi * Math.cos(theta) + centerX;
      const by = r * sinPhi * Math.sin(theta) + centerY;
      const bz = r * cosPhi + centerZ;

      items.push({
        type: "primary",
        basePosition: new THREE.Vector3(bx, by, bz),
        phase: rand() * Math.PI * 2.0,
        speed: 0.05 + rand() * 0.03,
        orbitRadius: 0.16 + rand() * 0.06,
        size: 0.22 + rand() * 0.04,
        opacity: 0.85 + rand() * 0.1,
      });
    }

    // Layer 2: Secondary Nodes (Middle grid, medium)
    for (let i = 0; i < sCount; i++) {
      const r = 2.9 + rand() * 0.9; // Shell radius: [2.9, 3.8]
      const theta = rand() * Math.PI * 2.0;
      const cosPhi = -rand();
      const sinPhi = Math.sqrt(1.0 - cosPhi * cosPhi);

      const bx = r * sinPhi * Math.cos(theta) + centerX;
      const by = r * sinPhi * Math.sin(theta) + centerY;
      const bz = r * cosPhi + centerZ;

      items.push({
        type: "secondary",
        basePosition: new THREE.Vector3(bx, by, bz),
        phase: rand() * Math.PI * 2.0,
        speed: 0.08 + rand() * 0.05,
        orbitRadius: 0.28 + rand() * 0.08,
        size: 0.09 + rand() * 0.02,
        opacity: 0.5 + rand() * 0.12,
      });
    }

    // Layer 3: Micro Nodes (Outer backdrop, details)
    for (let i = 0; i < mCount; i++) {
      const r = 3.9 + rand() * 1.3; // Shell radius: [3.9, 5.2]
      const theta = rand() * Math.PI * 2.0;
      const cosPhi = -rand();
      const sinPhi = Math.sqrt(1.0 - cosPhi * cosPhi);

      const bx = r * sinPhi * Math.cos(theta) + centerX;
      const by = r * sinPhi * Math.sin(theta) + centerY;
      const bz = r * cosPhi + centerZ;

      items.push({
        type: "micro",
        basePosition: new THREE.Vector3(bx, by, bz),
        phase: rand() * Math.PI * 2.0,
        speed: 0.03 + rand() * 0.02,
        orbitRadius: 0.1 + rand() * 0.04,
        size: 0.03 + rand() * 0.015,
        opacity: 0.2 + rand() * 0.1,
      });
    }

    // Find nearest neighbors relative to base coordinates
    const connections: { from: number; to: number }[] = [];

    const getNearestNeighbors = (
      nodeIndex: number,
      targetType: "primary" | "secondary" | "micro" | "all",
      maxConnections: number
    ) => {
      const node = items[nodeIndex];
      const candidates: { index: number; dist: number }[] = [];

      items.forEach((otherNode, idx) => {
        if (idx === nodeIndex) return;
        if (targetType !== "all" && otherNode.type !== targetType) return;

        const dist = node.basePosition.distanceTo(otherNode.basePosition);
        candidates.push({ index: idx, dist });
      });

      candidates.sort((a, b) => a.dist - b.dist);
      return candidates.slice(0, maxConnections).map((c) => c.index);
    };

    items.forEach((node, idx) => {
      if (node.type === "primary") {
        // Connect primary to 3-4 nearby secondary nodes
        const numConn = 3 + Math.floor(rand() * 2);
        const neighbors = getNearestNeighbors(idx, "secondary", numConn);
        neighbors.forEach((n) => connections.push({ from: idx, to: n }));
      } else if (node.type === "secondary") {
        // Connect secondary to 2 nearby secondary/primary nodes
        const numConn = 2;
        const neighbors = getNearestNeighbors(idx, "all", numConn).filter(
          (n) => items[n].type === "secondary" || items[n].type === "primary"
        );
        neighbors.slice(0, numConn).forEach((n) => connections.push({ from: idx, to: n }));
      } else if (node.type === "micro") {
        // Connect micro to 1 nearby micro/secondary node
        const numConn = 1;
        const neighbors = getNearestNeighbors(idx, "all", numConn).filter(
          (n) => items[n].type === "micro" || items[n].type === "secondary"
        );
        neighbors.slice(0, numConn).forEach((n) => connections.push({ from: idx, to: n }));
      }
    });

    // Remove bidirectional overlaps to optimize line draw calls
    const uniqueConnections: { from: number; to: number }[] = [];
    const seen = new Set<string>();

    connections.forEach((conn) => {
      const key = conn.from < conn.to ? `${conn.from}_${conn.to}` : `${conn.to}_${conn.from}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueConnections.push(conn);
      }
    });

    return {
      allNodes: items,
      uniqueConnections,
      primaryCount: pCount,
      secondaryCount: sCount,
      microCount: mCount,
    };
  }, [nodeCount]);

  // 2. Pre-allocate typed arrays to prevent memory garbage collection overhead inside rendering loops
  const primaryPositions = useMemo(() => new Float32Array(primaryCount * 3), [primaryCount]);
  const secondaryPositions = useMemo(() => new Float32Array(secondaryCount * 3), [secondaryCount]);
  const microPositions = useMemo(() => new Float32Array(microCount * 3), [microCount]);

  const maxLineVertices = uniqueConnections.length * 2;
  const linePositions = useMemo(() => new Float32Array(maxLineVertices * 3), [uniqueConnections, maxLineVertices]);
  const lineColors = useMemo(() => new Float32Array(maxLineVertices * 3), [uniqueConnections, maxLineVertices]);

  const themeColor = useMemo(() => {
    return new THREE.Color(isDark ? "#4f46e5" : "#60a5fa");
  }, [isDark]);

  const activeCoords = useMemo(() => {
    return allNodes.map(() => new THREE.Vector3());
  }, [allNodes]);

  // 3. Render soft radial gradient textures for organic glowing nodes
  const circularTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    return () => {
      if (circularTexture) {
        circularTexture.dispose();
      }
    };
  }, [circularTexture]);

  const throttleClock = useRef(0);

  useFrame((state, delta) => {
    // A. Apply dynamic opacity checks and lock nodes before sceneReady compiles
    if (!sceneReady) {
      if (primaryPointsRef.current && primaryPointsRef.current.material && !Array.isArray(primaryPointsRef.current.material)) {
        (primaryPointsRef.current.material as THREE.Material).opacity = 0;
      }
      if (secondaryPointsRef.current && secondaryPointsRef.current.material && !Array.isArray(secondaryPointsRef.current.material)) {
        (secondaryPointsRef.current.material as THREE.Material).opacity = 0;
      }
      if (microPointsRef.current && microPointsRef.current.material && !Array.isArray(microPointsRef.current.material)) {
        (microPointsRef.current.material as THREE.Material).opacity = 0;
      }
      revealProgress.current = 0;
      return;
    }

    const targetFps = config.targetFps || 60;
    const fpsLimit = 1 / targetFps;
    throttleClock.current += delta;
    if (throttleClock.current < fpsLimit) return;
    const throttledDelta = throttleClock.current;
    throttleClock.current = throttleClock.current % fpsLimit;

    // Advance reveal progress (over 3.0s total, fading in over first 1.5s)
    if (revealProgress.current < 3.0) {
      revealProgress.current = Math.min(3.0, revealProgress.current + throttledDelta);
    }
    const timeSinceReady = revealProgress.current;
    const revealOpacity = Math.min(1.0, timeSinceReady / 1.5);

    // Active movement time only ticks after revealOpacity completes (1.5s) and user has interacted on mobile
    if (timeSinceReady >= 1.5 && interactedRef.current) {
      activeTimeRef.current += throttledDelta;
    }
    const activeTime = activeTimeRef.current;

    const pointer = state.pointer; // Mouse coords: [-1, 1]

    // B. Apply organic pseudo-noise drift, global breathing, and layer-based cursor parallax
    allNodes.forEach((node, i) => {
      const t = activeTime * node.speed * config.orbitSpeedMult * 0.5; // Slower orbital speed

      // Coherent slow floating displacement (organic noise)
      const dx = (Math.sin(t + node.phase) * 0.55 + Math.cos(t * 0.4 + node.phase * 2.3) * 0.45) * node.orbitRadius;
      const dy = (Math.cos(t * 0.6 + node.phase) * 0.55 + Math.sin(t * 0.3 + node.phase * 1.7) * 0.45) * node.orbitRadius;
      const dz = (Math.sin(t * 0.7 + node.phase * 1.5) * 0.55 + Math.cos(t * 0.5 + node.phase * 3.1) * 0.45) * node.orbitRadius;

      const currentPos = activeCoords[i];
      currentPos.set(
        node.basePosition.x + dx,
        node.basePosition.y + dy,
        node.basePosition.z + dz
      );

      // Global slow breathing cycle
      const breathTime = activeTime * 0.15;
      const breathScale = 1.0 + Math.sin(breathTime) * 0.035;
      currentPos.multiplyScalar(breathScale);

      // Parallax shifts based on node type depth (active only after push-in complete)
      if (timeSinceReady >= 3.0) {
        let parallaxFactor = 0.05;
        if (node.type === "primary") parallaxFactor = 0.03;
        else if (node.type === "secondary") parallaxFactor = 0.08;
        else if (node.type === "micro") parallaxFactor = 0.16;

        currentPos.x += pointer.x * parallaxFactor;
        currentPos.y += pointer.y * parallaxFactor;
      }
    });

    // C. Save displacements to flat buffer arrays grouped by hierarchical category
    let pIdx = 0;
    let sIdx = 0;
    let mIdx = 0;

    allNodes.forEach((node, i) => {
      const pos = activeCoords[i];
      if (node.type === "primary") {
        primaryPositions[pIdx * 3] = pos.x;
        primaryPositions[pIdx * 3 + 1] = pos.y;
        primaryPositions[pIdx * 3 + 2] = pos.z;
        pIdx++;
      } else if (node.type === "secondary") {
        secondaryPositions[sIdx * 3] = pos.x;
        secondaryPositions[sIdx * 3 + 1] = pos.y;
        secondaryPositions[sIdx * 3 + 2] = pos.z;
        sIdx++;
      } else if (node.type === "micro") {
        microPositions[mIdx * 3] = pos.x;
        microPositions[mIdx * 3 + 1] = pos.y;
        microPositions[mIdx * 3 + 2] = pos.z;
        mIdx++;
      }
    });

    // D. Trigger GPU attribute buffer updates safely
    if (primaryPointsRef.current && primaryPointsRef.current.geometry.attributes.position) {
      primaryPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (secondaryPointsRef.current && secondaryPointsRef.current.geometry.attributes.position) {
      secondaryPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (microPointsRef.current && microPointsRef.current.geometry.attributes.position) {
      microPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // E. Dynamically update point material opacities based on reveal progress
    if (primaryPointsRef.current && primaryPointsRef.current.material && !Array.isArray(primaryPointsRef.current.material)) {
      (primaryPointsRef.current.material as THREE.Material).opacity = (isDark ? 0.85 : 0.95) * revealOpacity;
    }
    if (secondaryPointsRef.current && secondaryPointsRef.current.material && !Array.isArray(secondaryPointsRef.current.material)) {
      (secondaryPointsRef.current.material as THREE.Material).opacity = (isDark ? 0.55 : 0.7) * revealOpacity;
    }
    if (microPointsRef.current && microPointsRef.current.material && !Array.isArray(microPointsRef.current.material)) {
      (microPointsRef.current.material as THREE.Material).opacity = (isDark ? 0.3 : 0.45) * revealOpacity;
    }

    // F. Compute connection segments using distance-based fading and animated flow intensity pulse
    const threshold = 4.2;
    let lineIdx = 0;

    uniqueConnections.forEach((conn) => {
      const posA = activeCoords[conn.from];
      const posB = activeCoords[conn.to];
      const dist = posA.distanceTo(posB);

      const nodeA = allNodes[conn.from];
      const nodeB = allNodes[conn.to];

      // Base line opacity matches the connection endpoints
      const baseOpacity = Math.min(nodeA.opacity, nodeB.opacity) * 0.4;
      const linePulse = 0.85 + Math.sin(activeTime * 1.8 + conn.from) * 0.15; // Animated flow energy
      const alpha = Math.max(0.0, 1.0 - dist / threshold) * baseOpacity * linePulse * revealOpacity;

      const rVal = themeColor.r * alpha;
      const gVal = themeColor.g * alpha;
      const bVal = themeColor.b * alpha;

      linePositions[lineIdx] = posA.x;
      linePositions[lineIdx + 1] = posA.y;
      linePositions[lineIdx + 2] = posA.z;
      lineColors[lineIdx] = rVal;
      lineColors[lineIdx + 1] = gVal;
      lineColors[lineIdx + 2] = bVal;

      linePositions[lineIdx + 3] = posB.x;
      linePositions[lineIdx + 4] = posB.y;
      linePositions[lineIdx + 5] = posB.z;
      lineColors[lineIdx + 3] = rVal;
      lineColors[lineIdx + 4] = gVal;
      lineColors[lineIdx + 5] = bVal;

      lineIdx += 6;
    });

    if (lineRef.current) {
      const geometry = lineRef.current.geometry;
      geometry.setDrawRange(0, lineIdx / 3);
      if (geometry.attributes.position) {
        geometry.attributes.position.needsUpdate = true;
      }
      if (geometry.attributes.color) {
        geometry.attributes.color.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* 1. Layer 1: Primary Nodes (Large Core Glowing Hubs) */}
      <points ref={primaryPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[primaryPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
          color={isDark ? "#818cf8" : "#3b82f6"}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          map={circularTexture || undefined}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* 2. Layer 2: Secondary Nodes (Interconnected Network Grid) */}
      <points ref={secondaryPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[secondaryPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color={isDark ? "#6366f1" : "#2563eb"}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          map={circularTexture || undefined}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* 3. Layer 3: Micro Nodes (Tiny Atmospheric Details) */}
      <points ref={microPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[microPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={isDark ? "#4f46e5" : "#60a5fa"}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          map={circularTexture || undefined}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* 4. Fine Connection Segments (Pulsing Energy Flow) */}
      {view !== "success" && (
        <lineSegments ref={lineRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[lineColors, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors={true}
            transparent
            opacity={0}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}
