"use client";

import React, { useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";

// Child rigs & components
import CameraController from "./CameraController";
import FogController from "./Fog";
import Lighting from "./Lighting";
import ThemeLighting from "./ThemeLighting";
import ParticleField from "./ParticleField";
import NeuralNetwork from "./NeuralNetwork";
import EnergyRings from "./EnergyRings";
import GlassObjects from "./GlassObjects";
import AIPlanet from "./AIPlanet";

/**
 * SceneInitializer: Compiles WebGL programs/shaders for all objects
 * currently in the scene tree to prevent initial compilation stutters.
 */
function SceneInitializer() {
  const { gl, scene, camera } = useThree();
  const { setSceneReady } = useCygmaWorld();
  const compiledRef = useRef(false);
  const frameCountRef = useRef(0);

  useFrame(() => {
    if (!compiledRef.current) {
      gl.compile(scene, camera);
      compiledRef.current = true;
    }

    if (frameCountRef.current < 3) {
      frameCountRef.current++;
      if (frameCountRef.current === 3) {
        setSceneReady(true);
      }
    }
  });

  return null;
}

/**
 * IntelligenceWorld: The top-level 3D wrapper rendering a persistent Canvas.
 * Anchors the entire website's visual identity.
 */
export default function IntelligenceWorld() {
  const { view, sceneReady } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const { config } = usePerformance();

  const initialFogColor = resolvedTheme === "dark" ? "#020617" : "#c8d7e6";
  const bloomIntensity = view === "success" ? 5.5 : resolvedTheme === "dark" ? 1.25 : 0.65;

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 1.2, 12], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        dpr={config.dpr}
      >
        {/* Force early shader compilation and scene ready synchronizations */}
        <SceneInitializer />

        <fog attach="fog" args={[initialFogColor, 4, 11]} />

        {/* Global Camera interpolation */}
        <CameraController />

        {/* Fog preset interpolation */}
        <FogController />

        {/* Dynamic Light coordinates & materials rigs */}
        <Lighting />
        <ThemeLighting />

        {/* Neural Network Segments Grid */}
        <NeuralNetwork key={`neural-net-${config.neuralNetworkNodeCount}`} nodeCount={config.neuralNetworkNodeCount} />

        {/* 600+ Space dust energy particles */}
        <ParticleField key={`particles-${config.maxParticles}`} count={config.maxParticles} />

        {/* Orbital rings */}
        <EnergyRings />

        {/* Floating crystal dodecahedrons */}
        <GlassObjects key={`glass-objects-${config.glassObjectsCount}`} />

        {/* Core Glass Sphere */}
        <AIPlanet />

        {/* Bloom post-processing */}
        {config.usePostProcessing && (
          <EffectComposer>
            <Bloom
              intensity={bloomIntensity * config.bloomIntensity}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.75}
              mipmapBlur={config.bloomMipmapBlur}
            />
          </EffectComposer>
        )}
      </Canvas>

    </div>
  );
}
