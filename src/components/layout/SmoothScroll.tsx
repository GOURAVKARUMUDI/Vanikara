"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis for premium velocity-based scroll momentum
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for "heavy yet effortless" feel
      smoothWheel: true,
      wheelMultiplier: 0.9, // Slightly heavier wheel feel
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Reset scroll when pathname changes
    const _handleRouteChange = () => {
      lenis.scrollTo(0, { immediate: true });
    };

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
