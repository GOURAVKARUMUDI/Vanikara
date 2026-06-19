"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor: Renders a premium, smooth custom cursor with a spring-loaded
 * follower ring that scales and changes color on hover states.
 */
export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Directly track cursor positions without React re-render loops (60+ FPS)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Elastic follower spring physics configuration
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide standard system cursor on desktop screens
    document.documentElement.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Audit hovers over interactive/clickable nodes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      setHovered(!!isClickable);
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.documentElement.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* 1. Core Pointer Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--accent-color)] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* 2. Fluid Specular Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] hidden md:block"
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovered ? 42 : 22,
          height: hovered ? 42 : 22,
          borderColor: hovered ? "var(--accent-color)" : "var(--text-secondary)",
          backgroundColor: hovered ? "rgba(30, 107, 214, 0.08)" : "transparent",
          opacity: hovered ? 0.9 : 0.45,
          borderWidth: hovered ? 2 : 1.5,
          boxShadow: hovered ? "0 0 12px rgba(30, 107, 214, 0.25)" : "none",
        }}
        animate={{
          scale: hovered ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />
    </>
  );
}
