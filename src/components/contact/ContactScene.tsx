"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * ContactScene: Registers route view="contact" for communications node target.
 */
export default function ContactScene() {
  const { setView, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("contact");
    setNavbarVisible(true);
    setIsTransitioning(false);
  }, [setView, setNavbarVisible, setIsTransitioning]);

  return null;
}
