"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * CameraController: Smoothly dollys, orbits, breathes, and pans the camera
 * between the various coordinates defined by our route perspectives.
 */
export default function CameraController() {
  const { view, sceneReady } = useCygmaWorld();
  const { camera, size } = useThree();

  const currentPos = useRef(new THREE.Vector3(0, 1.2, 14));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.2, 0));
  const targetPosRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());
  const revealProgress = useRef(0);

  useFrame((state, delta) => {
    // 1. Lock camera in starting position until scene is compiled and ready
    if (!sceneReady) {
      camera.position.set(0, 1.2, 14);
      camera.lookAt(0, 0.2, 0);
      currentPos.current.set(0, 1.2, 14);
      currentLookAt.current.set(0, 0.2, 0);
      revealProgress.current = 0;
      return;
    }

    // Advance reveal progress (over 3.0 seconds total: 1.5s fade, 1.5s push)
    if (revealProgress.current < 3.0) {
      revealProgress.current = Math.min(3.0, revealProgress.current + delta);
    }
    const time = revealProgress.current;

    // Coordinated phases:
    // Phase 1: 0.0s to 1.5s -> Opacity Fade (camera remains static at starting Z=14 position)
    // Phase 2: 1.5s to 3.0s -> Camera Push (pushes from starting Z=14/Y=1.2 to target coordinates)
    const pushProgress = Math.min(1.0, Math.max(0.0, (time - 1.5) / 1.5));
    const idleActive = time >= 3.0;

    const pointer = state.pointer; // Mouse position normalized [-1, 1]
    const aspect = size.width / size.height;
    const scrollOffset = typeof window !== "undefined" ? window.scrollY : 0;
    const isMobile = aspect < 1;

    // Responsive aspect multiplier
    const aspectModifier = aspect < 1 ? 1.0 + (1.0 - aspect) * 0.8 : 1.0;

    let targetX = 0;
    let targetY = 0.4;
    let targetZ = 7.5 * aspectModifier;
    const targetLookX = 0;
    let targetLookY = 0.2;
    let targetLookZ = 0;

    let useOrbitDrift = false;
    let useMouseParallax = false;
    let orbitScaleX = 0.3;
    let orbitScaleY = 0.2;
    let parallaxScaleX = 0.55;
    let parallaxScaleY = 0.45;

    // Define route-based target parameters
    switch (view) {
      case "hero":
        if (isMobile) {
          targetX = 0;
          targetY = -0.15;
          targetZ = 8.5;
          targetLookY = -0.25;
        } else {
          targetX = 0;
          targetY = 0.4;
          targetZ = 7.5 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;

        // Apply scroll offsets for scrollytelling depth
        const scrollZ = scrollOffset * (isMobile ? 0.003 : 0.004);
        const scrollYOffset = -scrollOffset * (isMobile ? 0.0025 : 0.0035);
        targetZ += scrollZ;
        targetY += scrollYOffset;
        targetLookY += scrollYOffset * 0.25;
        break;

      case "about":
        if (isMobile) {
          targetX = 0;
          targetY = 0.8;
          targetZ = 7.5;
          targetLookY = 0.2;
        } else {
          targetX = 5.2 * aspectModifier;
          targetY = 1.0;
          targetZ = 5.2 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = isMobile ? 0.15 : 0.2;
        orbitScaleY = isMobile ? 0.1 : 0.15;
        parallaxScaleX = 0.3;
        parallaxScaleY = 0.25;

        // About has timeline scroll tracking
        const aboutScrollY = -scrollOffset * (isMobile ? 0.002 : 0.003);
        targetY += aboutScrollY;
        targetLookY += aboutScrollY * 0.2;
        break;

      case "projects":
        if (isMobile) {
          targetX = 0;
          targetY = -3.8;
          targetZ = 5.5;
          targetLookY = 0.3;
        } else {
          targetX = 0;
          targetY = -4.5;
          targetZ = 4.8 * aspectModifier;
          targetLookY = 0.4;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = isMobile ? 0.1 : 0.15;
        orbitScaleY = isMobile ? 0.08 : 0.1;
        break;

      case "products":
        if (isMobile) {
          targetX = 0;
          targetY = 1.0;
          targetZ = 7.0;
          targetLookY = 0.2;
        } else {
          targetX = -4.8 * aspectModifier;
          targetY = 2.4;
          targetZ = 5.2 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = isMobile ? 0.12 : 0.18;
        orbitScaleY = isMobile ? 0.08 : 0.12;
        break;

      case "ai":
        if (isMobile) {
          targetX = 0;
          targetY = 0.2;
          targetZ = 0.35;
          targetLookY = 0.2;
          targetLookZ = -2.5;
        } else {
          targetX = 0;
          targetY = 0.2;
          targetZ = 0.25;
          targetLookY = 0.2;
          targetLookZ = -3.0;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = 0.04;
        orbitScaleY = 0.03;
        parallaxScaleX = 0.08;
        parallaxScaleY = 0.06;
        break;

      case "login":
        if (isMobile) {
          targetX = 0;
          targetY = 0.0;
          targetZ = 4.2;
          targetLookY = 0.0;
        } else {
          targetX = 0;
          targetY = 0.2;
          targetZ = 3.6 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = 0.08;
        orbitScaleY = 0.05;
        parallaxScaleX = 0.15;
        parallaxScaleY = 0.12;
        break;

      case "dashboard":
      case "success":
        if (isMobile) {
          targetX = 0;
          targetY = 0.2;
          targetZ = -4.5;
          targetLookY = 0.2;
          targetLookZ = -6.0;
        } else {
          targetX = 0;
          targetY = 0.2;
          targetZ = -3.5 * aspectModifier;
          targetLookY = 0.2;
          targetLookZ = -7.0;
        }
        break;

      case "admin":
        if (isMobile) {
          targetX = 0;
          targetY = 1.2;
          targetZ = 6.0;
          targetLookY = 0.2;
        } else {
          targetX = -2.8 * aspectModifier;
          targetY = 2.2;
          targetZ = 4.8 * aspectModifier;
          targetLookY = 0.2;
        }

        useMouseParallax = !isMobile;
        parallaxScaleX = 0.2;
        parallaxScaleY = 0.15;
        break;

      case "careers":
        if (isMobile) {
          targetX = 0;
          targetY = -1.0;
          targetZ = 6.5;
          targetLookY = 0.2;
        } else {
          targetX = 2.8 * aspectModifier;
          targetY = -1.5;
          targetZ = 5.6 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = isMobile ? 0.1 : 0.15;
        orbitScaleY = isMobile ? 0.08 : 0.1;
        break;

      case "contact":
        if (isMobile) {
          targetX = 0;
          targetY = -0.4;
          targetZ = 6.5;
          targetLookY = 0.1;
        } else {
          targetX = -3.8 * aspectModifier;
          targetY = -0.5;
          targetZ = 5.2 * aspectModifier;
          targetLookY = 0.2;
        }

        useOrbitDrift = true;
        useMouseParallax = !isMobile;
        orbitScaleX = isMobile ? 0.12 : 0.18;
        orbitScaleY = isMobile ? 0.08 : 0.12;
        break;

      default:
        break;
    }

    // 2. Cinematic push-in scaling: start further back on Z-axis and pull in as reveal progresses
    if (pushProgress < 1.0) {
      const startZ = 14 * aspectModifier;
      const startY = 1.2;
      targetZ = THREE.MathUtils.lerp(startZ, targetZ, pushProgress);
      targetY = THREE.MathUtils.lerp(startY, targetY, pushProgress);
    }

    // 3. Add slow breathing & drift animations (active only after the push-in is complete)
    if (useOrbitDrift && idleActive) {
      const breathing = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.08;
      targetZ += breathing;

      targetX += Math.sin(state.clock.getElapsedTime() * 0.12) * orbitScaleX;
      targetY += Math.cos(state.clock.getElapsedTime() * 0.15) * orbitScaleY;
    }

    if (useMouseParallax && idleActive) {
      targetX += pointer.x * parallaxScaleX;
      targetY += pointer.y * parallaxScaleY;
    }

    // 4. Easing parameters: slow, frame-rate independent exponential damping
    const speedFactor = (view === "success" || view === "dashboard") ? 5.0 : 2.5;
    const lerpFactor = 1.0 - Math.exp(-speedFactor * delta);

    targetPosRef.current.set(targetX, targetY, targetZ);
    targetLookRef.current.set(targetLookX, targetLookY, targetLookZ);

    currentPos.current.lerp(targetPosRef.current, lerpFactor);
    currentLookAt.current.lerp(targetLookRef.current, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
