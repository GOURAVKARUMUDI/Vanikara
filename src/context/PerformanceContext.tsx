"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";

export type PerformanceProfile = "ultra" | "high" | "medium" | "low" | "battery";
export type PerformanceOverride = "auto" | PerformanceProfile;

export interface PerformanceConfig {
  maxParticles: number;
  usePostProcessing: boolean;
  bloomIntensity: number;
  bloomMipmapBlur: boolean;
  useHeavyTransmission: boolean;
  glassObjectsCount: number;
  dpr: number;
  targetFps: number;
  orbitSpeedMult: number;
  neuralNetworkNodeCount: number;
}

interface PerformanceContextType {
  profile: PerformanceOverride;
  currentProfile: PerformanceProfile;
  fps: number;
  isBenchmarked: boolean;
  config: PerformanceConfig;
  setProfileOverride: (prof: PerformanceOverride) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  detectedSpecs: {
    cores: number;
    memory: number;
    dpr: number;
    connection: string;
    prefersReducedMotion: boolean;
    gpu: string;
    batteryLevel?: number;
    isCharging?: boolean;
  };
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [manualReduceMotion, setManualReduceMotion] = useState<boolean>(false);
  const [fps, setFps] = useState(60);

  // Specifications state for telemetry display (statically populated except for layout factors)
  const [detectedSpecs, setDetectedSpecs] = useState<PerformanceContextType["detectedSpecs"]>({
    cores: 8,
    memory: 8,
    dpr: 1,
    connection: "optimized",
    prefersReducedMotion: false,
    gpu: "Hardware Accelerated",
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  // Load manual motion setting on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vanikara_reduce_motion");
      if (stored !== null) {
        setManualReduceMotion(stored === "true");
      }
    }
  }, []);

  const setReduceMotion = (val: boolean) => {
    setManualReduceMotion(val);
    localStorage.setItem("vanikara_reduce_motion", String(val));
  };

  // Safe Browser Cues detection (DPR and Motion only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const dpr = window.devicePixelRatio || 1;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setDetectedSpecs({
      cores: 8,
      memory: 8,
      dpr,
      prefersReducedMotion,
      connection: "optimized",
      gpu: "Hardware Accelerated",
    });
  }, []);

  // Simple FPS counter loop (no benchmarking or dynamic tuning)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let animFrameId: number;
    let isRunning = true;
    lastFrameTimeRef.current = performance.now();

    const checkFrame = () => {
      if (!isRunning) return;

      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (delta > 300) {
        animFrameId = requestAnimationFrame(checkFrame);
        return;
      }

      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      const averageDelta = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const currentFps = Math.round(1000 / averageDelta);
      setFps(currentFps);

      animFrameId = requestAnimationFrame(checkFrame);
    };

    animFrameId = requestAnimationFrame(checkFrame);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const reduceMotion = detectedSpecs.prefersReducedMotion || manualReduceMotion;

  const activeConfig = useMemo<PerformanceConfig>(() => {
    return {
      maxParticles: 12000, // Locked to ultra premium counts
      usePostProcessing: true,
      bloomIntensity: 1.25,
      bloomMipmapBlur: true,
      useHeavyTransmission: true,
      glassObjectsCount: 13,
      dpr: detectedSpecs.dpr,
      targetFps: 60,
      orbitSpeedMult: reduceMotion ? 0.0 : 1.0,
      neuralNetworkNodeCount: 16,
    };
  }, [detectedSpecs.dpr, reduceMotion]);

  // Maintain compatibility with existing code references to profiles
  const profile: PerformanceOverride = reduceMotion ? "battery" : "ultra";
  const currentProfile: PerformanceProfile = reduceMotion ? "battery" : "ultra";
  const setProfileOverride = (prof: PerformanceOverride) => {
    const shouldReduce = prof === "battery" || prof === "low";
    setReduceMotion(shouldReduce);
  };

  return (
    <PerformanceContext.Provider
      value={{
        profile,
        currentProfile,
        fps,
        isBenchmarked: true,
        config: activeConfig,
        setProfileOverride,
        reduceMotion,
        setReduceMotion,
        detectedSpecs,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
