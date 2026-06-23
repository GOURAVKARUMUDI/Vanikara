"use client";

import { useConsent, ConsentSettings } from "@/context/ConsentContext";
import { usePerformance, usePerformanceFps } from "@/context/PerformanceContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Activity, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { usePWA } from "@/hooks/usePWA";

/**
 * PreferencesModal: Re-usable privacy and performance panel modal allowing granular 
 * consent controls and graphics engine overrides, matching WCAG keyboard trap accessibility standards.
 */
export default function PreferencesModal() {
  const { showModal, consent, closePreferences, savePreferences, acceptAll, rejectOptional } = useConsent();
  const { profile, currentProfile, setProfileOverride, detectedSpecs, reduceMotion, setReduceMotion } = usePerformance();
  const fps = usePerformanceFps();
  const { isInstallable, installApp } = usePWA();

  const [activeTab, setActiveTab] = useState<"privacy" | "performance">("privacy");

  // Local state for cookie changes before saving
  const [localPrefs, setLocalPrefs] = useState<Omit<ConsentSettings, "essential">>({
    preferences: false,
    analytics: false,
    marketing: false
  });

  // Escape key event listener for WCAG accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePreferences();
      }
    };
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, closePreferences]);

  // Sync local state when modal opens
  useEffect(() => {
    if (showModal) {
      setLocalPrefs({
        preferences: consent.preferences,
        analytics: consent.analytics,
        marketing: consent.marketing
      });
    }
  }, [showModal, consent]);

  const handleToggle = (key: keyof typeof localPrefs) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    savePreferences(localPrefs);
  };

  // Profile metadata (disabled)

  return (
    <AnimatePresence>
      {showModal && (
        <div 
          className="fixed inset-0 z-[9995] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Glass blur overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreferences}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card Content */}
          <motion.div
            initial={{ scale: 0.94, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative w-full max-w-xl glass-card rounded-[2.5rem] p-0 overflow-hidden backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_24px_64px_rgba(0,0,0,0.22)] select-none pointer-events-auto flex flex-col max-h-[90vh]"
          >
            {/* Gloss reflection highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

            {/* Header / Tabs */}
            <div className="px-6 pt-6 pb-2 border-b border-[var(--glass-border)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4.5 bg-[var(--accent-color)] rounded-full" />
                  <h3 id="modal-title" className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)]">
                    System Control Center
                  </h3>
                </div>
                <button
                  onClick={closePreferences}
                  className="p-1.5 rounded-xl hover:bg-slate-500/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Navigation Controls */}
              <div className="flex gap-1.5 p-1 bg-slate-500/5 border border-[var(--glass-border)] rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === "privacy"
                      ? "bg-[var(--accent-color)] text-white shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Privacy Controls
                </button>
                <button
                  onClick={() => setActiveTab("performance")}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === "performance"
                      ? "bg-[var(--accent-color)] text-white shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Graphics Tuning
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="px-6 py-5 overflow-y-auto space-y-5 flex-grow custom-scrollbar">
              
              {/* TAB 1: Privacy Controls */}
              {activeTab === "privacy" && (
                <div className="space-y-4">
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">
                    Manage your cookies here. Essential cookies are necessary for fundamental website functions like secure gateways and session states, while optional cookies allow us to optimize analytics.
                  </p>

                  <div className="space-y-3.5">
                    {/* 1. Essential */}
                    <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          Essential Cookies <span className="text-[8px] font-black uppercase text-[var(--accent-color)] tracking-wider">(Locked)</span>
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Used for user authentications, secure Stripe payments, CSRF tokens, consent persistence, and theme rendering. They cannot be deactivated.
                        </p>
                      </div>
                      <Lock className="w-4.5 h-4.5 text-[var(--text-secondary)] opacity-70 shrink-0 mt-0.5" />
                    </div>

                    {/* 2. Preferences */}
                    <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Preference Cookies</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Remembers custom workspace selections (e.g. chat window layouts, persistent collapsible panels, theme choices).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("preferences")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 mt-0.5 relative outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                          localPrefs.preferences ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                        aria-checked={localPrefs.preferences}
                        role="switch"
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            localPrefs.preferences ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 3. Analytics */}
                    <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Analytics Cookies</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Allows us to track page latency metrics, node request velocities, and core feature engagement statistics to optimize platforms.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("analytics")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 mt-0.5 relative outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                          localPrefs.analytics ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                        aria-checked={localPrefs.analytics}
                        role="switch"
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            localPrefs.analytics ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 4. Marketing */}
                    <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Marketing & Targeting</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Required for tracking campaign efficiency and targeted referrals. Left deactivated by default.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("marketing")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 mt-0.5 relative outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                          localPrefs.marketing ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                        aria-checked={localPrefs.marketing}
                        role="switch"
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            localPrefs.marketing ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Performance Tuning */}
              {activeTab === "performance" && (
                <div className="space-y-5">
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">
                    Manage graphics rendering presets and motion options below to optimize performance and battery life for your device.
                  </p>

                  {/* Graphics Quality selector */}
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-[var(--text-primary)]">Graphics Quality Mode</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                        Choose standard graphics presets. <strong>Auto</strong> will dynamically scale down details if browser frame rates drop.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2.5">
                      {(["auto", "ultra", "high", "medium", "low", "battery"] as const).map((prof) => (
                        <button
                          key={prof}
                          type="button"
                          onClick={() => setProfileOverride(prof)}
                          className={`py-2 px-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                            profile === prof
                              ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-sm shadow-[var(--accent-color)]/25 scale-[1.02]"
                              : "bg-slate-500/5 hover:bg-slate-500/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--glass-border)]"
                          }`}
                        >
                          {prof}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reduce Motion toggle option */}
                  <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)]">
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-[var(--text-primary)]">Reduce Motion</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                        Halts camera orbit paths and dynamic particle drift movements for accessibility. Visual shaders and premium materials remain active unless restricted by quality.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReduceMotion(!reduceMotion)}
                      className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 mt-0.5 relative outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                        reduceMotion ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                      }`}
                      aria-checked={reduceMotion}
                      role="switch"
                      aria-label="Toggle reduce motion"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          reduceMotion ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* PWA App Installation Option */}
                  {isInstallable && (
                    <div className="flex items-center justify-between gap-6 p-4 rounded-2xl bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/25 shadow-sm shadow-[var(--accent-color)]/5 animate-in fade-in duration-300">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Download className="w-4 h-4 text-[var(--accent-color)]" />
                          Install VANIKARA App
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Install this platform as a standalone application on your home screen or desktop for instant launching and offline capabilities.
                        </p>
                      </div>
                      <Button
                        onClick={installApp}
                        variant="primary"
                        size="sm"
                        className="font-bold text-[9px] uppercase tracking-wider py-2 px-4 shrink-0"
                      >
                        Install
                      </Button>
                    </div>
                  )}

                  {/* Telemetry Display */}
                  <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-1.5 border-b border-[var(--glass-border)] pb-2 select-none">
                      <Activity className="w-3.5 h-3.5 text-[var(--accent-color)] animate-pulse" />
                      Live Graphics Telemetry
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-semibold text-[var(--text-secondary)]">
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span>Rendering Performance</span>
                        <span className="font-mono text-green-500">{fps} FPS</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span>Engine Configuration</span>
                        <span className="font-mono text-[var(--text-primary)] uppercase">
                          {profile === "auto" ? `Auto (${currentProfile})` : currentProfile}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span>Display Pixel Ratio</span>
                        <span className="font-mono text-[var(--text-primary)]">{detectedSpecs.dpr.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span>Motion Settings</span>
                        <span className="font-mono text-[var(--text-primary)] uppercase">{reduceMotion ? "Reduced" : "Standard"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-5 border-t border-[var(--glass-border)] flex flex-wrap gap-2 justify-between items-center">
              
              {/* Left text feedback */}
              <div className="text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-wider">
                Status: <strong className="text-[var(--text-primary)]">{activeTab === "privacy" ? "Cookie Cache Active" : "Optimized Pipeline Active"}</strong>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {activeTab === "privacy" ? (
                  <>
                    <button
                      onClick={rejectOptional}
                      className="px-5 py-2.5 rounded-full border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-slate-500/5 transition-all cursor-pointer outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    >
                      Reject Optional
                    </button>
                    <button
                      onClick={acceptAll}
                      className="px-5 py-2.5 rounded-full border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-slate-500/5 transition-all cursor-pointer outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    >
                      Accept All
                    </button>
                    <Button
                      onClick={handleSave}
                      variant="primary"
                      size="sm"
                      className="font-bold text-[9px] uppercase tracking-wider py-2.5 px-5"
                    >
                      Save Preferences
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={closePreferences}
                    variant="primary"
                    size="sm"
                    className="font-bold text-[9px] uppercase tracking-wider py-2.5 px-6"
                  >
                    Apply & Close
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
