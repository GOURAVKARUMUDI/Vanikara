"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * ProjectsScene: Registers route view="projects" and initializes layout.
 */
export default function ProjectsScene() {
  const { setView, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("projects");
    setNavbarVisible(true);
    setIsTransitioning(false);
  }, [setView, setNavbarVisible, setIsTransitioning]);

  return null;
}
