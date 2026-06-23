"use client";

import Link from "next/link";
import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import Magnetic from "./Magnetic";

const MotionLink = motion.create(Link);

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function Button({
  href,
  variant = "primary",
  size = "md",
  magnetic = false,
  className = "",
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleRipple = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Clear ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    handleRipple(e);
    if (onClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick(e as any);
    }
  };

  const baseClasses =
    "relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:pointer-events-none select-none";

  const sizeClasses = {
    sm: "px-5 py-2 text-xs tracking-wider",
    md: "px-7 py-3 text-sm tracking-wide",
    lg: "px-9 py-4 text-base tracking-wide",
  }[size];

  const variantClasses = {
    primary:
      "text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-400/30 backdrop-blur-md shadow-[0_4px_20px_rgba(30,107,214,0.15)] hover:shadow-[0_8px_32px_rgba(30,107,214,0.3)] hover:scale-105 transition-all",
    secondary:
      "bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[var(--text-primary)] hover:bg-white/15 dark:hover:bg-white/10 backdrop-blur-md shadow-[0_4px_12px_rgba(255,255,255,0.02)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.05)] hover:scale-105 transition-all",
    ghost:
      "bg-transparent border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-[var(--glass-bg)] backdrop-blur-sm",
    white:
      "bg-white border border-slate-200 text-slate-900 hover:shadow-md hover:bg-slate-55",
  }[variant];

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Click ripple animations */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none bg-white/20 animate-ping"
          style={{
            left: r.x - 30,
            top: r.y - 30,
            width: 60,
            height: 60,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </>
  );

  const mergedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  // Interactive springs parameters
  const motionProps = {
    whileHover: { scale: 1.025 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 450, damping: 17 }
  };

  const buttonElement = href ? (
    <MotionLink 
      href={href} 
      className={mergedClasses} 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={handleClick as any}
      {...motionProps}
    >
      {buttonContent}
    </MotionLink>
  ) : (
    <motion.button 
      className={mergedClasses} 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={handleClick as any} 
      {...motionProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...props as any}
    >
      {buttonContent}
    </motion.button>
  );

  if (magnetic) {
    return <Magnetic>{buttonElement}</Magnetic>;
  }

  return buttonElement;
}
