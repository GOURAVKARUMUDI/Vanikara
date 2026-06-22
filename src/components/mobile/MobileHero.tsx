"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

interface MobileHeroProps {
  handleScrollClick?: () => void;
}

export default function MobileHero({ handleScrollClick }: MobileHeroProps) {
  const handleScroll = () => {
    if (handleScrollClick) {
      handleScrollClick();
    } else {
      document.getElementById("our-vision")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden bg-transparent pt-28 pb-16 px-6"
    >
      {/* Volumetric Radial Glow for ambience (Highly optimized for mobile performance) */}
      <div
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] rounded-full filter blur-[80px] pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle, var(--accent-color), transparent 70%)`,
        }}
      />

      <div className="max-w-md w-full mx-auto relative z-20 flex flex-col items-center text-center">
        {/* Logo and Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center select-none mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-md backdrop-blur-md relative mb-2">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Image src="/logo.png" alt="Vanikara Logo" className="w-7 h-[19px]" width={28} height={19} priority />
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/40 dark:bg-white/5 border border-white/25 dark:border-white/10 rounded-full shadow-sm">
            <span className="font-display font-black text-[8px] tracking-widest text-[var(--text-primary)] uppercase">
              VANIKARA INTELLIGENCE
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-[1.2] tracking-tight mb-4 text-[var(--text-primary)] uppercase text-balance text-2xl px-2"
        >
          Engineering Tomorrow&apos;s <br />
          <span className="gradient-text">Intelligent Digital Experiences</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs text-[var(--text-secondary)] w-full max-w-[320px] mx-auto mb-6 leading-relaxed font-semibold"
        >
          VANIKARA Intelligence Private Limited is an Indian technology company engineering high-performance AI layers, unified student systems, and secure cloud platforms.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2.5 w-full max-w-[260px] mx-auto"
        >
          <Button href="/products" variant="primary" size="md" className="w-full justify-center">
            Explore Products
          </Button>
          <Button href="/ai" variant="secondary" size="md" className="w-full justify-center">
            Meet CYGMA AI
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer text-[var(--text-secondary)]"
        onClick={handleScroll}
      >
        <span className="text-[7px] font-black uppercase tracking-widest font-mono">SCROLL</span>
        <ChevronDown className="w-3 h-3" />
      </motion.div>
    </section>
  );
}
