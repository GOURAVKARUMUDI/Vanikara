"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";

/**
 * FogController: Fades the scene fog colors and limits dynamically
 * depending on route presets and day/night themes.
 */
export default function FogController() {
  const { view } = useCygmaWorld();
  const { resolvedTheme } = useTheme();

  const themePresets = {
    dark: {
      color: new THREE.Color("#020617"), // Deep Space Navy/Black
      near: 4.0,
      far: 11.0,
    },
    light: {
      color: new THREE.Color("#c8d7e6"), // Deep slate-blue fog matching the bottom light mode gradient
      near: 3.5,
      far: 10.0,
    },
  };

  useFrame((state) => {
    const isDark = resolvedTheme === "dark";
    const preset = isDark ? themePresets.dark : themePresets.light;

    let targetNear = preset.near;
    let targetFar = preset.far;

    // View-specific adjustments
    if (view === "success") {
      targetNear = 1.0;
      targetFar = 4.0; // Draw fog extremely close during pass-through
    } else if (view === "ai") {
      targetNear = 2.5;
      targetFar = 8.0; // Thicker fog inside the core
    } else if (view === "dashboard") {
      targetNear = 5.0;
      targetFar = 14.0; // Clearer, less dense fog for work portal
    }

    const scene = state.scene;
    const lerpSpeed = 0.05;

    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(preset.color, lerpSpeed);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, targetNear, lerpSpeed);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, targetFar, lerpSpeed);
    }
  });

  return null;
}
