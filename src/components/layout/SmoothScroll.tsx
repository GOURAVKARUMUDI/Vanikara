"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * SmoothScroll: Intercepts wheel events on desktop viewports and applies
 * linear interpolation (lerp) damping for a highly fluid inertial scrolling experience.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const isMoving = useRef(false);

  // Sync scroll references to 0 immediately on route changes
  useEffect(() => {
    targetScrollY.current = 0;
    currentScrollY.current = 0;
    isMoving.current = false;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch capability to bypass inertial override on mobile/tablet (preserves native swipe inertia)
    const isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };

    if (isTouchDevice()) return;

    // Animation runner loop
    const animate = () => {
      if (!isMoving.current) return;

      const diff = targetScrollY.current - currentScrollY.current;
      
      // Stop animation loop once we are extremely close to the target
      if (Math.abs(diff) < 0.15) {
        currentScrollY.current = targetScrollY.current;
        window.scrollTo(0, currentScrollY.current);
        isMoving.current = false;
        return;
      }

      // Linear interpolation with a smooth damping coefficient (0.075)
      currentScrollY.current += diff * 0.075;
      window.scrollTo(0, currentScrollY.current);

      requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent default browser jumpy scroll step
      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Scale wheel delta slightly for organic speed weight
      targetScrollY.current += e.deltaY * 0.85;
      targetScrollY.current = Math.max(0, Math.min(targetScrollY.current, maxScroll));

      if (!isMoving.current) {
        isMoving.current = true;
        requestAnimationFrame(animate);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    // Sync scroll registers if scroll happens through other means (arrow keys, scrollbar click, hash scrolls)
    const handleScrollSync = () => {
      if (!isMoving.current) {
        targetScrollY.current = window.scrollY;
        currentScrollY.current = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScrollSync, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScrollSync);
    };
  }, [pathname]);

  return null;
}
