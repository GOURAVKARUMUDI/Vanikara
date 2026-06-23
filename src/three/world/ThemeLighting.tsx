import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { useTheme } from "@/components/layout/ThemeContext";

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

/**
 * ThemeLighting: Dynamically interpolates scene light colors and intensities
 * between Light and Dark mode presets and contextual route views.
 */
export default function ThemeLighting() {
  const { view, sceneReady } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const revealProgress = useRef(0);

  useFrame((state, delta) => {
    const isDark = resolvedTheme === "dark";
    const activePreset = isDark ? themePresets.dark : themePresets.light;

    // Retrieve light meshes from the R3F scene graph
    const ambient = state.scene.getObjectByName("ambient-light") as THREE.AmbientLight;
    const dir = state.scene.getObjectByName("dir-light") as THREE.DirectionalLight;
    const point = state.scene.getObjectByName("point-light") as THREE.PointLight;
    const spot = state.scene.getObjectByName("spot-light") as THREE.SpotLight;

    if (!sceneReady) {
      revealProgress.current = 0;
      if (ambient) ambient.intensity = 0;
      if (dir) dir.intensity = 0;
      if (point) point.intensity = 0;
      if (spot) spot.intensity = 0;
      return;
    }

    if (revealProgress.current < 3.0) {
      revealProgress.current = Math.min(3.0, revealProgress.current + delta);
    }
    const timeSinceReady = revealProgress.current;
    const revealOpacity = Math.min(1.0, timeSinceReady / 1.5);
    const idleActive = timeSinceReady >= 3.0;

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

    const lerpSpeed = 0.055;

    // Interpolate values
    if (ambient) {
      ambient.color.lerp(activePreset.ambientColor, lerpSpeed);
      ambient.intensity = THREE.MathUtils.lerp(
        ambient.intensity,
        activePreset.ambientIntensity * modifier * revealOpacity,
        lerpSpeed
      );
    }

    if (dir) {
      dir.color.lerp(activePreset.dirColor, lerpSpeed);
      dir.intensity = THREE.MathUtils.lerp(
        dir.intensity,
        activePreset.dirIntensity * modifier * revealOpacity,
        lerpSpeed
      );
    }

    if (point) {
      point.color.lerp(activePreset.fillColor, lerpSpeed);
      point.intensity = THREE.MathUtils.lerp(
        point.intensity,
        activePreset.fillIntensity * modifier * revealOpacity,
        lerpSpeed
      );
    }

    if (spot) {
      spot.color.lerp(activePreset.spotColor, lerpSpeed);
      spot.intensity = THREE.MathUtils.lerp(
        spot.intensity,
        activePreset.spotIntensity * modifier * spotModifier * revealOpacity,
        lerpSpeed
      );
    }

    // 2. Dynamic orbital lighting
    if (idleActive) {
      const t = state.clock.getElapsedTime();
      
      // Directional light slowly orbits the top hemisphere
      if (dir) {
        dir.position.x = -6 + Math.sin(t * 0.1) * 2;
        dir.position.z = -4 + Math.cos(t * 0.1) * 2;
      }
      
      // Point light slowly shifts to cast dynamic rim highlights
      if (point) {
        point.position.x = Math.sin(t * 0.15) * 3;
        point.position.z = 3 + Math.cos(t * 0.12) * 2;
      }
      
      // Spot light drifts subtly to animate specular reflections
      if (spot) {
        spot.position.x = 9 + Math.sin(t * 0.08) * 1.5;
        spot.position.y = -5.5 + Math.cos(t * 0.05) * 1.5;
      }
    }
  });

  return null;
}
