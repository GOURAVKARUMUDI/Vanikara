'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

/**
 * Shared animation configuration for consistent premium feel.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SPRING_TRANSITION = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any };
const _FADE_TRANSITION   = { duration: 0.5 };

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

/**
 * FadeUp: Smooth upward reveal on scroll.
 */
export function FadeUp({ children, className = '', delay = 0, y = 28, once = true }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay }}
      viewport={{ once, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}



interface StaggerProps {
  children: ReactNode;
  className?: string;
  delayStart?: number;
  staggerDelay?: number;
}

/**
 * StaggerGrid: Container to orchestrate child staggered reveals.
 */
export function StaggerGrid({ children, className = '', delayStart = 0, staggerDelay = 0.1 }: StaggerProps) {
  const containerVariants: Variants = useMemo(() => ({
    visible: { transition: { staggerChildren: staggerDelay, delayChildren: delayStart } },
  }), [staggerDelay, delayStart]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem: Child component to be used inside StaggerGrid.
 */
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const itemVariants: Variants = useMemo(() => ({
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
  }), []);

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
