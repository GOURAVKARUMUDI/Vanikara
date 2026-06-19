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

const CONFIGS: Record<PerformanceProfile, PerformanceConfig> = {
  ultra: {
    maxParticles: 12000,
    usePostProcessing: true,
    bloomIntensity: 1.25,
    bloomMipmapBlur: true,
    useHeavyTransmission: true,
    glassObjectsCount: 13,
    dpr: 2.0,
    targetFps: 120,
    orbitSpeedMult: 1.0,
    neuralNetworkNodeCount: 16,
  },
  high: {
    maxParticles: 7500,
    usePostProcessing: true,
    bloomIntensity: 1.0,
    bloomMipmapBlur: true,
    useHeavyTransmission: true,
    glassObjectsCount: 9,
    dpr: 1.5,
    targetFps: 90,
    orbitSpeedMult: 1.0,
    neuralNetworkNodeCount: 12,
  },
  medium: {
    maxParticles: 4000,
    usePostProcessing: true,
    bloomIntensity: 0.65,
    bloomMipmapBlur: false,
    useHeavyTransmission: false,
    glassObjectsCount: 5,
    dpr: 1.2,
    targetFps: 60,
    orbitSpeedMult: 0.8,
    neuralNetworkNodeCount: 8,
  },
  low: {
    maxParticles: 1500,
    usePostProcessing: false,
    bloomIntensity: 0.0,
    bloomMipmapBlur: false,
    useHeavyTransmission: false,
    glassObjectsCount: 2,
    dpr: 1.0,
    targetFps: 60,
    orbitSpeedMult: 0.6,
    neuralNetworkNodeCount: 5,
  },
  battery: {
    maxParticles: 400,
    usePostProcessing: false,
    bloomIntensity: 0.0,
    bloomMipmapBlur: false,
    useHeavyTransmission: false,
    glassObjectsCount: 0,
    dpr: 0.8,
    targetFps: 30,
    orbitSpeedMult: 0.4,
    neuralNetworkNodeCount: 3,
  },
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PerformanceOverride>("auto");
  const [currentProfile, setCurrentProfile] = useState<PerformanceProfile>("medium");
  const [fps, setFps] = useState(60);
  const [isBenchmarked, setIsBenchmarked] = useState(false);

  // Specifications state for telemetry display
  const [detectedSpecs, setDetectedSpecs] = useState<PerformanceContextType["detectedSpecs"]>({
    cores: 4,
    memory: 4,
    dpr: 1,
    connection: "unknown",
    prefersReducedMotion: false,
    gpu: "unknown",
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const benchmarkCountRef = useRef(0);
  const consecutiveLowFpsRef = useRef(0);
  const profileCooldownRef = useRef(0); // Prevents profile oscillation

  // Load user override on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vanikara_graphics_profile");
      if (stored && ["auto", "ultra", "high", "medium", "low", "battery"].includes(stored)) {
        setProfile(stored as PerformanceOverride);
      }
    }
  }, []);

  // Save user override on change
  const setProfileOverride = (prof: PerformanceOverride) => {
    setProfile(prof);
    localStorage.setItem("vanikara_graphics_profile", prof);
    if (prof !== "auto") {
      setCurrentProfile(prof);
      setIsBenchmarked(true);
    } else {
      // Re-run benchmarking on auto reset
      setIsBenchmarked(false);
      benchmarkCountRef.current = 0;
      frameTimesRef.current = [];
    }
  };

  // Safe Browser Cues detection (static profiles boundaries)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Logic cores
    const cores = navigator.hardwareConcurrency || 4;

    // 2. RAM
    const memory = (navigator as any).deviceMemory || 4;

    // 3. DPR
    const dpr = window.devicePixelRatio || 1;

    // 4. Reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 5. Network Quality
    let connection = "unknown";
    const conn = (navigator as any).connection;
    if (conn) {
      connection = `${conn.effectiveType || "unknown"}${conn.saveData ? " (SaveData)" : ""}`;
    }

    // 6. GPU Check via WebGL unmasked renderer
    let gpu = "unknown";
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "unknown";
        }
      }
    } catch (e) {
      // Ignore
    }

    setDetectedSpecs((prev) => ({
      ...prev,
      cores,
      memory,
      dpr,
      prefersReducedMotion,
      connection,
      gpu,
    }));

    // Optional battery details
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setDetectedSpecs((prev) => ({
            ...prev,
            batteryLevel: battery.level * 100,
            isCharging: battery.charging,
          }));
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      });
    }
  }, []);

  // Benchmarking and Dynamic Monitoring Loop
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

      // Avoid collecting samples when window is inactive
      if (delta > 300) {
        animFrameId = requestAnimationFrame(checkFrame);
        return;
      }

      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate instantaneous FPS
      const averageDelta = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const currentFps = Math.round(1000 / averageDelta);
      setFps(currentFps);

      // Benchmarking phase (first 50 frames collected)
      if (profile === "auto" && !isBenchmarked) {
        benchmarkCountRef.current += 1;
        
        // Skip first 10 compile-heavy frames to avoid compile spikes, then process
        if (benchmarkCountRef.current === 60) {
          const validFrames = frameTimesRef.current.slice(10);
          const avgFrameTime = validFrames.reduce((a, b) => a + b, 0) / validFrames.length;
          const avgFps = 1000 / avgFrameTime;

          // Deduce initial profile
          let resolved: PerformanceProfile = "medium";

          // If low-spec boundaries are triggered, establish ceiling immediately
          if (detectedSpecs.prefersReducedMotion) {
            resolved = "battery";
          } else if (detectedSpecs.memory <= 2 || detectedSpecs.cores <= 2) {
            resolved = "low";
          } else if (detectedSpecs.memory <= 4 || detectedSpecs.cores <= 4) {
            resolved = "medium";
          } else {
            // Apply benchmark metrics
            if (avgFps >= 85) {
              // High refresh rate screens
              resolved = "ultra";
            } else if (avgFps >= 55) {
              resolved = "high";
            } else if (avgFps >= 40) {
              resolved = "medium";
            } else {
              resolved = "low";
            }
          }

          // Integrated GPU limits
          const isIntegrated = /Intel|Iris|HD Graphics|UHD Graphics|Microsoft Basic/i.test(detectedSpecs.gpu);
          if (isIntegrated && resolved === "ultra") {
            resolved = "high";
          }

          setCurrentProfile(resolved);
          setIsBenchmarked(true);
        }
      }

      animFrameId = requestAnimationFrame(checkFrame);
    };

    animFrameId = requestAnimationFrame(checkFrame);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
  }, [profile, isBenchmarked, detectedSpecs]);

  // Dynamic Quality Auto-tuner (every 4 seconds)
  useEffect(() => {
    if (profile !== "auto" || !isBenchmarked) return;

    const interval = setInterval(() => {
      // Cooldown timer to prevent rapid oscillations
      if (profileCooldownRef.current > 0) {
        profileCooldownRef.current -= 1;
        return;
      }

      // Check battery level to auto-trigger battery saver
      if (detectedSpecs.batteryLevel !== undefined && 
          detectedSpecs.batteryLevel <= 20 && 
          !detectedSpecs.isCharging) {
        if (currentProfile !== "battery") {
          setCurrentProfile("battery");
          profileCooldownRef.current = 4; // 16-second cooldown
        }
        return;
      }

      const targetProfileFps = CONFIGS[currentProfile].targetFps;
      
      // Throttling logic
      if (fps < targetProfileFps * 0.82) {
        consecutiveLowFpsRef.current += 1;
        if (consecutiveLowFpsRef.current >= 3) {
          // Demote quality
          const profiles: PerformanceProfile[] = ["battery", "low", "medium", "high", "ultra"];
          const currentIndex = profiles.indexOf(currentProfile);
          if (currentIndex > 0) {
            const nextProfile = profiles[currentIndex - 1];
            setCurrentProfile(nextProfile);
            profileCooldownRef.current = 5; // 20-second cooldown after downgrade
          }
          consecutiveLowFpsRef.current = 0;
        }
      } else {
        consecutiveLowFpsRef.current = 0;
        
        // Promotion logic (if performance is flawless and hardware concurrency supports it)
        if (fps >= targetProfileFps * 0.95) {
          const profiles: PerformanceProfile[] = ["battery", "low", "medium", "high", "ultra"];
          const currentIndex = profiles.indexOf(currentProfile);
          if (currentIndex < profiles.length - 1) {
            // Memory and cores rules for promotions
            const nextProfile = profiles[currentIndex + 1];
            const nextConfig = CONFIGS[nextProfile];

            let canPromote = true;
            if (nextProfile === "ultra" && (detectedSpecs.memory < 8 || detectedSpecs.cores < 8)) {
              canPromote = false;
            }
            if (nextProfile === "high" && (detectedSpecs.memory < 6 || detectedSpecs.cores < 4)) {
              canPromote = false;
            }

            if (canPromote) {
              setCurrentProfile(nextProfile);
              profileCooldownRef.current = 10; // High cooldown (40s) for promotion to stay conservative
            }
          }
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [profile, isBenchmarked, fps, currentProfile, detectedSpecs]);

  const activeConfig = useMemo(() => CONFIGS[currentProfile], [currentProfile]);

  return (
    <PerformanceContext.Provider
      value={{
        profile,
        currentProfile,
        fps,
        isBenchmarked,
        config: activeConfig,
        setProfileOverride,
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
