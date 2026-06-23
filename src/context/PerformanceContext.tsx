"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";

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
const PerformanceFpsContext = createContext<number | undefined>(undefined);

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
  const highFpsCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

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

  const setReduceMotion = useCallback((val: boolean) => {
    setManualReduceMotion(val);
    localStorage.setItem("vanikara_reduce_motion", String(val));
  }, []);

  // Safe Browser Cues detection (DPR and Motion only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cores = navigator.hardwareConcurrency || 8;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memory = (navigator as any).deviceMemory || 8;
    const dpr = window.devicePixelRatio || 1;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setDetectedSpecs({
      cores,
      memory,
      dpr,
      prefersReducedMotion,
      connection: "optimized",
      gpu: "Hardware Accelerated",
    });

    // Grade initial profile grade automatically based on hardware resources to prevent initial WebGL lag spikes
    let initialProfile: PerformanceProfile = "high";

    if (prefersReducedMotion) {
      initialProfile = "battery";
    } else if (isMobile) {
      // Mobile Viewports (highly sensitive to battery and CPU core limits)
      if (cores <= 4 || memory < 4) {
        initialProfile = "battery"; // Low-end CPU/RAM mobile
      } else if (cores <= 6 || memory <= 6) {
        initialProfile = "low";     // Mid-low spec mobile
      } else {
        initialProfile = "medium";  // Modern flagship mobile
      }
    } else {
      // Desktop Viewports
      if (cores <= 4 || memory < 4) {
        initialProfile = "low";     // Legacy desktop/notebook
      } else if (cores >= 12 && memory >= 16) {
        initialProfile = "ultra";   // Workstation or Gaming Desktop
      } else {
        initialProfile = "high";    // Standard modern laptop/desktop
      }
    }

    setAutoProfile(initialProfile);
  }, []);

  // Simple FPS counter loop with dynamic tuning (throttled updates to state)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let animFrameId: number;
    let isRunning = true;
    lastFrameTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();

    startTimeRef.current = performance.now();
    lowFpsCountRef.current = 0;
    highFpsCountRef.current = 0;

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

      // Check every 1 second (1000ms) for adaptive profiling if in "auto" mode
      if (now - lastTimeRef.current >= 1000) {
        lastTimeRef.current = now;
        
        // Update React state at most once per second to prevent 60 FPS re-render storm
        setFps(currentFps);

        if (profileOverride === "auto") {
          // Warm-up phase: Wait 6 seconds before running telemetry profiling adjustments
          if (now - startTimeRef.current >= 6000) {
            // If FPS is critically low (below 38)
            if (currentFps < 38) {
              highFpsCountRef.current = 0; // Reset upgrade counter
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
            } else if (currentFps >= 54) {
              lowFpsCountRef.current = 0; // Reset downgrade counter
              highFpsCountRef.current += 1;
              // Upgrade after 5 seconds of consistently high/stable FPS
              if (highFpsCountRef.current >= 5) {
                highFpsCountRef.current = 0;
                setAutoProfile((prev) => {
                  if (prev === "battery") return "low";
                  if (prev === "low") return "medium";
                  if (prev === "medium") return "high";
                  // Let desktop users auto-upgrade to ultra
                  if (prev === "high" && window.innerWidth >= 768) return "ultra";
                  return prev;
                });
              }
            } else {
              // Stable frame rate in middle range (38 - 53) -> reset both counters
              lowFpsCountRef.current = 0;
              highFpsCountRef.current = 0;
            }
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

  const handleSetProfileOverride = useCallback((prof: PerformanceOverride) => {
    setProfileOverride(prof);
    localStorage.setItem("vanikara_performance_profile", prof);
    if (prof === "battery") {
      setReduceMotion(true);
    }
  }, [setReduceMotion]);

  const contextValue = useMemo(() => ({
    profile: profileOverride,
    currentProfile,
    isBenchmarked: true,
    config: activeConfig,
    setProfileOverride: handleSetProfileOverride,
    reduceMotion,
    setReduceMotion,
    detectedSpecs,
  }), [profileOverride, currentProfile, activeConfig, handleSetProfileOverride, reduceMotion, setReduceMotion, detectedSpecs]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      <PerformanceFpsContext.Provider value={fps}>
        {children}
      </PerformanceFpsContext.Provider>
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

export function usePerformanceFps() {
  const context = useContext(PerformanceFpsContext);
  if (context === undefined) {
    throw new Error("usePerformanceFps must be used within a PerformanceProvider");
  }
  return context;
}

