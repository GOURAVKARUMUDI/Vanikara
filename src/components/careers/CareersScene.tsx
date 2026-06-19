"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * CareersScene: Registers route view="careers" for innovation hub camera preset.
 */
export default function CareersScene() {
  const { setView, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("careers");
    setNavbarVisible(true);
    setIsTransitioning(false);
  }, [setView, setNavbarVisible, setIsTransitioning]);

  return null;
}
