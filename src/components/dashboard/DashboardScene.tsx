"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * DashboardScene: Registers route view="dashboard" to enter workspace coordinates.
 */
export default function DashboardScene() {
  const { setView, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("dashboard");
    setNavbarVisible(true);
    setIsTransitioning(false);
  }, [setView, setNavbarVisible, setIsTransitioning]);

  return null;
}
