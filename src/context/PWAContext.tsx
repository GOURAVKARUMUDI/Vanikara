"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import PWAInstallGuide from "@/components/layout/PWAInstallGuide";

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  platform: "native" | "ios" | "unknown";
  showIOSInstructions: boolean;
  setShowIOSInstructions: (show: boolean) => void;
  installApp: () => Promise<boolean>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"native" | "ios" | "unknown">("unknown");
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if app is running in standalone mode (already installed PWA)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    // Determine platform
    const ua = navigator.userAgent;
    const isIOS = 
      /iPad|iPhone|iPod/.test(ua) || 
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      setPlatform("ios");
      setIsInstallable(true); // iOS Safari can be added to home screen anytime
    } else {
      setPlatform("native");
    }

    // Check if a prompt was already captured by the layout head script
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).deferredPrompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInstallPrompt((window as any).deferredPrompt);
      setIsInstallable(true);
      setPlatform("native");
    }

    // Listen to native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      setPlatform("native");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = e;
    };

    // Listen to native appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Development Debug overrides
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get("debug_pwa");
    const debugStorage = localStorage.getItem("debug_pwa");

    if (debugParam === "true" || debugStorage === "true") {
      setIsInstallable(true);
      const isIOSDebug = params.get("platform") === "ios" || localStorage.getItem("debug_pwa_platform") === "ios";
      setPlatform(isIOSDebug ? "ios" : "native");
      
      // Setup a mock native prompt if we are in native debug mode
      if (!isIOSDebug) {
        setInstallPrompt({
          prompt: () => {
          },
          userChoice: Promise.resolve({ outcome: "accepted" })
        });
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (platform === "ios") {
      setShowIOSInstructions(true);
      return true;
    }

    if (!installPrompt) {
      console.warn("PWA installation is not available: no native install prompt stashed.");
      return false;
    }

    try {
      // Trigger the stashed install prompt
      await installPrompt.prompt();
      
      // Await user's install preference selection
      const { outcome } = await installPrompt.userChoice;

      // Clear the stashed prompt regardless of outcome to avoid calling prompt() on an exhausted object
      setInstallPrompt(null);
      setIsInstallable(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = null;

      if (outcome === "accepted") {
        setIsInstalled(true);
        return true;
      }
    } catch (err) {
      console.error("PWA native installation failed:", err);
      // Ensure we clear state on error to avoid double prompt attempts crashing the site
      setInstallPrompt(null);
      setIsInstallable(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = null;
    }
    
    return false;
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        platform,
        showIOSInstructions,
        setShowIOSInstructions,
        installApp,
      }}
    >
      {children}
      <PWAInstallGuide
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
      />
    </PWAContext.Provider>
  );
}

export function usePWAContext() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWAContext must be used within a PWAProvider");
  }
  return context;
}
