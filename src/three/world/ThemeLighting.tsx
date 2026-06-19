"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";

/**
 * ThemeLighting: Dynamically interpolates scene light colors and intensities
 * between Light and Dark mode presets and contextual route views.
 */
export default function ThemeLighting() {
  const { view } = useCygmaWorld();
  const { resolvedTheme } = useTheme();

  // Preset configuration parameters for Light vs Dark modes
  const themePresets = {
    dark: {
      ambientColor: new THREE.Color("#050814"), // Deep space navy
      ambientIntensity: 0.35,
      dirColor: new THREE.Color("#3b82f6"), // Electric blue rim light
      dirIntensity: 4.2,
      fillColor: new THREE.Color("#8b5cf6"), // Cybernetic purple point light
      fillIntensity: 2.4,
      spotColor: new THREE.Color("#f97316"), // Neon orange highlights
      spotIntensity: 4.5,
    },
    light: {
      ambientColor: new THREE.Color("#94a3b8"), // Soft slate-blue ambient for shadows
      ambientIntensity: 0.42,
      dirColor: new THREE.Color("#0284c7"), // Vibrant sky blue directional light
      dirIntensity: 3.5,
      fillColor: new THREE.Color("#e0f2fe"), // Light pearl fill
      fillIntensity: 1.8,
      spotColor: new THREE.Color("#ea580c"), // Sunset orange specular highlights
      spotIntensity: 4.8,
    },
  };

  useFrame((state) => {
    const isDark = resolvedTheme === "dark";
    const activePreset = isDark ? themePresets.dark : themePresets.light;

    // 1. Compute view-based lighting multipliers
    let modifier = 1.0;
    let spotModifier = 1.0;

    if (view === "login") {
      modifier = isDark ? 0.7 : 0.8; // More intimate and shadow-heavy
    } else if (view === "ai") {
      modifier = 1.15; // Brighter digital focus
      spotModifier = 1.4; // Exaggerated point highlights
    } else if (view === "success") {
      modifier = 3.5; // Blinding overexposure for pass-through transition
    } else if (view === "dashboard") {
      modifier = 0.95; // Balanced clinical dashboard light
    }

    const time = state.clock.getElapsedTime();
    const lerpSpeed = 0.055;

    // Wake-up lighting sequence on page load (0 to 1 over first 2.0s)
    const wakeUp = Math.min(1.0, time / 2.0);

    // Retrieve light meshes from the R3F scene graph
    const ambient = state.scene.getObjectByName("ambient-light") as THREE.AmbientLight;
    const dir = state.scene.getObjectByName("dir-light") as THREE.DirectionalLight;
    const point = state.scene.getObjectByName("point-light") as THREE.PointLight;
    const spot = state.scene.getObjectByName("spot-light") as THREE.SpotLight;

    // Interpolate values
    if (ambient) {
      ambient.color.lerp(activePreset.ambientColor, lerpSpeed);
      ambient.intensity = THREE.MathUtils.lerp(
        ambient.intensity,
        activePreset.ambientIntensity * modifier * wakeUp,
        lerpSpeed
      );
    }

    if (dir) {
      dir.color.lerp(activePreset.dirColor, lerpSpeed);
      dir.intensity = THREE.MathUtils.lerp(
        dir.intensity,
        activePreset.dirIntensity * modifier * wakeUp,
        lerpSpeed
      );
    }

    if (point) {
      point.color.lerp(activePreset.fillColor, lerpSpeed);
      point.intensity = THREE.MathUtils.lerp(
        point.intensity,
        activePreset.fillIntensity * modifier * wakeUp,
        lerpSpeed
      );
    }

    if (spot) {
      spot.color.lerp(activePreset.spotColor, lerpSpeed);
      spot.intensity = THREE.MathUtils.lerp(
        spot.intensity,
        activePreset.spotIntensity * modifier * spotModifier * wakeUp,
        lerpSpeed
      );
    }
  });

  return null;
}
