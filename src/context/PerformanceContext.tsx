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

const PROFILE_CONFIGS: Record<PerformanceProfile, Omit<PerformanceConfig, "orbitSpeedMult" | "dpr">> = {
  ultra: {
    maxParticles: 660,
    usePostProcessing: true,
    bloomIntensity: 1.25,
    bloomMipmapBlur: true,
    useHeavyTransmission: true,
    glassObjectsCount: 25,
    targetFps: 60,
    neuralNetworkNodeCount: 16,
  },
  high: {
    maxParticles: 400,
    usePostProcessing: true,
    bloomIntensity: 1.0,
    bloomMipmapBlur: true,
    useHeavyTransmission: true,
    glassObjectsCount: 15,
    targetFps: 60,
    neuralNetworkNodeCount: 12,
  },
  medium: {
    maxParticles: 200,
    usePostProcessing: true,
    bloomIntensity: 0.75,
    bloomMipmapBlur: false,
    useHeavyTransmission: true,
    glassObjectsCount: 8,
    targetFps: 60,
    neuralNetworkNodeCount: 8,
  },
  low: {
    maxParticles: 80,
    usePostProcessing: false,
    bloomIntensity: 0.0,
    bloomMipmapBlur: false,
    useHeavyTransmission: false,
    glassObjectsCount: 4,
    targetFps: 30,
    neuralNetworkNodeCount: 6,
  },
  battery: {
    maxParticles: 20,
    usePostProcessing: false,
    bloomIntensity: 0.0,
    bloomMipmapBlur: false,
    useHeavyTransmission: false,
    glassObjectsCount: 2,
    targetFps: 30,
    neuralNetworkNodeCount: 4,
  },
};

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [manualReduceMotion, setManualReduceMotion] = useState<boolean>(false);
  const [profileOverride, setProfileOverride] = useState<PerformanceOverride>("auto");
  const [autoProfile, setAutoProfile] = useState<PerformanceProfile>("high");
  const [fps, setFps] = useState(60);

  // Specifications state for telemetry display
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
  const lowFpsCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Load manual settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMotion = localStorage.getItem("vanikara_reduce_motion");
      if (storedMotion !== null) {
        setManualReduceMotion(storedMotion === "true");
      }
      const storedProfile = localStorage.getItem("vanikara_performance_profile");
      if (storedProfile !== null) {
        setProfileOverride(storedProfile as PerformanceOverride);
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

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    setDetectedSpecs({
      cores: navigator.hardwareConcurrency || 8,
      memory: (navigator as any).deviceMemory || 8,
      dpr,
      prefersReducedMotion,
      connection: "optimized",
      gpu: "Hardware Accelerated",
    });

    // Start all viewports at high to ensure identical immersive visuals on load,
    // allowing the adaptive FPS feedback loop to downgrade performance dynamically if needed.
    setAutoProfile("high");
  }, []);

  // Simple FPS counter loop with dynamic tuning
  useEffect(() => {
    if (typeof window === "undefined") return;

    let animFrameId: number;
    let isRunning = true;
    lastFrameTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();

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

      // Check every 1 second (1000ms) for adaptive profiling if in "auto" mode
      if (now - lastTimeRef.current >= 1000) {
        lastTimeRef.current = now;

        if (profileOverride === "auto") {
          // If FPS is critically low (below 38)
          if (currentFps < 38) {
            lowFpsCountRef.current += 1;
            // Downgrade after 3 seconds of consistently low FPS
            if (lowFpsCountRef.current >= 3) {
              lowFpsCountRef.current = 0;
              setAutoProfile((prev) => {
                if (prev === "ultra") return "high";
                if (prev === "high") return "medium";
                if (prev === "medium") return "low";
                if (prev === "low") return "battery";
                return prev;
              });
            }
          } else {
            // Reset counter if FPS is stable
            lowFpsCountRef.current = 0;
          }
        }
      }

      animFrameId = requestAnimationFrame(checkFrame);
    };

    animFrameId = requestAnimationFrame(checkFrame);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
  }, [profileOverride]);

  const reduceMotion = detectedSpecs.prefersReducedMotion || manualReduceMotion;

  const currentProfile: PerformanceProfile = useMemo(() => {
    if (reduceMotion) return "battery";
    if (profileOverride === "auto") return autoProfile;
    return profileOverride;
  }, [reduceMotion, profileOverride, autoProfile]);

  const activeConfig = useMemo<PerformanceConfig>(() => {
    const base = PROFILE_CONFIGS[currentProfile];
    
    // Determine target DPR based on profile
    let targetDpr = base.targetFps === 30 ? 1.0 : detectedSpecs.dpr;
    if (currentProfile === "ultra") targetDpr = Math.min(2.0, detectedSpecs.dpr);
    else if (currentProfile === "high") targetDpr = Math.min(1.5, detectedSpecs.dpr);
    else if (currentProfile === "medium") targetDpr = Math.min(1.2, detectedSpecs.dpr);
    else targetDpr = 1.0;

    return {
      maxParticles: base.maxParticles,
      usePostProcessing: base.usePostProcessing,
      bloomIntensity: base.bloomIntensity,
      bloomMipmapBlur: base.bloomMipmapBlur,
      useHeavyTransmission: base.useHeavyTransmission,
      glassObjectsCount: base.glassObjectsCount,
      targetFps: base.targetFps,
      neuralNetworkNodeCount: base.neuralNetworkNodeCount,
      dpr: targetDpr,
      orbitSpeedMult: reduceMotion ? 0.0 : (currentProfile === "low" ? 0.8 : 1.0),
    };
  }, [currentProfile, detectedSpecs.dpr, reduceMotion]);

  const handleSetProfileOverride = (prof: PerformanceOverride) => {
    setProfileOverride(prof);
    localStorage.setItem("vanikara_performance_profile", prof);
    if (prof === "battery") {
      setReduceMotion(true);
    }
  };

  return (
    <PerformanceContext.Provider
      value={{
        profile: profileOverride,
        currentProfile,
        fps,
        isBenchmarked: true,
        config: activeConfig,
        setProfileOverride: handleSetProfileOverride,
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

