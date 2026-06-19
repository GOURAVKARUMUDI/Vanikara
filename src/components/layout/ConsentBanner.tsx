"use client";

import { useConsent } from "@/context/ConsentContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";
import Button from "@/components/ui/Button";

/**
 * ConsentBanner: Renders a floating, premium frosted glass banner for GDPR/CCPA
 * compliance, matching the company's visual language.
 */
export default function ConsentBanner() {
  const { showBanner, policyText, acceptAll, rejectOptional, openPreferences } = useConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Subtle background dim overlay - non-blocking to allow page interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-[9990] pointer-events-none"
          />

          {/* Floating CMP Liquid Glass Card Container */}
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md w-auto z-[9991] glass-card p-0 rounded-[2rem] overflow-hidden select-none border border-white/10 dark:border-white/5 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto"
          >
            {/* Ambient inner glow reflection layer */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-4.5 bg-[var(--accent-color)] rounded-full" />
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)]">
                  Your Privacy Matters
                </h4>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                {policyText}{" "}
                <Link href="/privacy" className="text-[var(--accent-color)] hover:underline font-bold">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="text-[var(--accent-color)] hover:underline font-bold">
                  Cookie Policy
                </Link>.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Button
                  onClick={rejectOptional}
                  variant="secondary"
                  size="sm"
                  className="font-bold text-[9px] uppercase tracking-wider py-2.5"
                >
                  Reject Optional
                </Button>
                <Button
                  onClick={acceptAll}
                  variant="primary"
                  size="sm"
                  className="font-bold text-[9px] uppercase tracking-wider py-2.5"
                >
                  Accept All
                </Button>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={openPreferences}
                  className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
