"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * AboutScene: Registers route view="about" and tracks scroll offsets.
 */
export default function AboutScene() {
  const { setView, setScrollOffset, setNavbarVisible, setIsTransitioning } = useCygmaWorld();

  useEffect(() => {
    setView("about");
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
