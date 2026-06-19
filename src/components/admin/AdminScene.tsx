"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * AdminScene: Registers route view="admin" to pivot camera perspective to minimal operations layout.
 */
export default function AdminScene() {
  const { setView, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("admin");
    setNavbarVisible(true);
    setIsTransitioning(false);
  }, [setView, setNavbarVisible, setIsTransitioning]);

  return null;
}
