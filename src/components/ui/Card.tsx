"use client";

import React, { ReactNode, CSSProperties, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Enables the brand hover lift and glow effect. Default: true. */
  hover?: boolean;
  style?: CSSProperties;
}

/**
 * Card: Frosted Glassmorphism card surface that matches active atmosphere settings.
 * Elevated with interactive physics-based 3D cursor tilt and cursor-tracking glass sheen reflections.
 */
export default function Card({ children, className = "", hover = true, style }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spotlight coordinates relative to card bounds
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for interactive 3D Tilt
  const tiltX = useSpring(0, { damping: 20, stiffness: 220 });
  const tiltY = useSpring(0, { damping: 20, stiffness: 220 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set spotlight coordinates
    mouseX.set(x);
    mouseY.set(y);

    // Calculate rotation angles (limit to maximum 4 degrees tilt)
    const rotateX = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 4.0;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4.0;
    
    tiltX.set(rotateX);
    tiltY.set(rotateY);
  };

  const handleMouseEnter = () => {
    if (!hover) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!hover) return;
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  const hoverClass = hover ? "glass-card" : "liquid-glass rounded-2xl";

  // Compile the spotlight style dynamically
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(320px circle at ${x}px ${y}px, rgba(30, 107, 214, 0.08), transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${hoverClass} p-0 overflow-hidden relative ${className}`}
      style={{
        ...style,
        perspective: 1000,
        rotateX: hover ? tiltX : 0,
        rotateY: hover ? tiltY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={hover ? {
        y: -4,
        boxShadow: "0 12px 40px var(--glass-glow), var(--shadow-lift)",
      } : {}}
      transition={{ type: "spring" as const, stiffness: 280, damping: 22 }}
    >
      {/* 1. Dynamic Specular Spotlight Glow (follows cursor inside card) */}
      {hover && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: spotlightBg,
          }}
        />
      )}
      
      {/* 2. Glass Specular highlight sheen overlay */}
      {hover && (
        <div className="absolute inset-0 pointer-events-none border border-white/10 dark:border-white/5 rounded-2xl z-20" />
      )}

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * CardBody: Inner padding container for Card content.
 */
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 sm:p-8 ${className}`}>{children}</div>;
}
