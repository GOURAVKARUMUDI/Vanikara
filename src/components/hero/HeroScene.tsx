"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * HeroScene: Registers route view="hero" and tracks scroll coordinates.
 */
export default function HeroScene() {
  const { setView, setScrollOffset, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("hero");
    setNavbarVisible(true);
    setIsTransitioning(false);

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setView, setScrollOffset, setNavbarVisible, setIsTransitioning]);

  return null;
}
