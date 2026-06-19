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
  const { view, scrollOffset } = useCygmaWorld();
  const { camera, size } = useThree();

  const currentPos = useRef(new THREE.Vector3(0, 1.2, 12));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // Mouse position normalized [-1, 1]
    const aspect = size.width / size.height;

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
        targetX = 0;
        targetY = 0.4;
        targetZ = 7.5 * aspectModifier;
        targetLookY = 0.2;

        useOrbitDrift = true;
        useMouseParallax = true;

        // Apply scroll offsets for scrollytelling depth
        const scrollZ = scrollOffset * 0.004;
        const scrollYOffset = -scrollOffset * 0.0035;
        targetZ += scrollZ;
        targetY += scrollYOffset;
        targetLookY += scrollYOffset * 0.25;
        break;

      case "about":
        // Camera orbits to the side of the planet
        targetX = 5.2 * aspectModifier;
        targetY = 1.0;
        targetZ = 5.2 * aspectModifier;
        targetLookY = 0.2;

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.2;
        orbitScaleY = 0.15;
        parallaxScaleX = 0.3;
        parallaxScaleY = 0.25;

        // About has timeline scroll tracking
        const aboutScrollY = -scrollOffset * 0.003;
        targetY += aboutScrollY;
        targetLookY += aboutScrollY * 0.2;
        break;

      case "projects":
        // Camera flies below the core facing upwards
        targetX = 0;
        targetY = -4.5;
        targetZ = 4.8 * aspectModifier;
        targetLookY = 0.4;

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.15;
        orbitScaleY = 0.1;
        break;

      case "ai":
        // Camera zooms INSIDE the core!
        targetX = 0;
        targetY = 0.2;
        targetZ = 0.25; // Inside coordinates
        targetLookY = 0.2;
        targetLookZ = -3.0; // Looking deep forward

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.04;
        orbitScaleY = 0.03;
        parallaxScaleX = 0.08;
        parallaxScaleY = 0.06;
        break;

      case "login":
        // Close cinematic view
        targetX = 0;
        targetY = 0.2;
        targetZ = 3.6 * aspectModifier;
        targetLookY = 0.2;

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.08;
        orbitScaleY = 0.05;
        parallaxScaleX = 0.15;
        parallaxScaleY = 0.12;
        break;

      case "dashboard":
      case "success":
        // Passes past the core
        targetX = 0;
        targetY = 0.2;
        targetZ = -3.5 * aspectModifier;
        targetLookY = 0.2;
        targetLookZ = -7.0;
        break;

      case "admin":
        // Angled professional command view
        targetX = -2.8 * aspectModifier;
        targetY = 2.2;
        targetZ = 4.8 * aspectModifier;
        targetLookY = 0.2;

        useMouseParallax = true;
        parallaxScaleX = 0.2;
        parallaxScaleY = 0.15;
        break;

      case "careers":
        // Angled perspective from below right
        targetX = 2.8 * aspectModifier;
        targetY = -1.5;
        targetZ = 5.6 * aspectModifier;
        targetLookY = 0.2;

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.15;
        orbitScaleY = 0.1;
        break;

      case "contact":
        // Side perspective
        targetX = -3.8 * aspectModifier;
        targetY = -0.5;
        targetZ = 5.2 * aspectModifier;
        targetLookY = 0.2;

        useOrbitDrift = true;
        useMouseParallax = true;
        orbitScaleX = 0.18;
        orbitScaleY = 0.12;
        break;

      default:
        break;
    }

    // 2. Add breathing & drift animations
    if (useOrbitDrift) {
      const breathing = Math.sin(time * 0.25) * 0.1;
      targetZ += breathing;

      targetX += Math.sin(time * 0.15) * orbitScaleX;
      targetY += Math.cos(time * 0.2) * orbitScaleY;
    }

    if (useMouseParallax) {
      targetX += pointer.x * parallaxScaleX;
      targetY += pointer.y * parallaxScaleY;
    }

    // 3. Interpolation speeds: warp pass uses high speeds, others use cinematic ease
    const lerpSpeed = (view === "success" || view === "dashboard") ? 0.08 : 0.05;

    currentPos.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), lerpSpeed);
    currentLookAt.current.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), lerpSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
