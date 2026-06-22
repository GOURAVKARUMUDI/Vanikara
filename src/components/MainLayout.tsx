"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import dynamic from "next/dynamic";

import CustomCursor from "./layout/CustomCursor";
import SmoothScroll from "./layout/SmoothScroll";
import ConsentBanner from "./layout/ConsentBanner";
import PreferencesModal from "./layout/PreferencesModal";
import { useTheme } from "./layout/ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";
import CapacitorManager from "./layout/CapacitorManager";
import IntroAnimation from "./IntroAnimation";

// Dynamic import for client-only R3F Canvas
const IntelligenceWorld = dynamic(() => import("@/three/world/IntelligenceWorld"), {
  ssr: false,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAiPage = pathname === "/ai";
  const { view, isTransitioning, sceneReady, setSceneReady } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const { currentProfile } = usePerformance();
  const [showFlash, setShowFlash] = useState(false);
  const [deferCanvas, setDeferCanvas] = useState(false);
  const [reducedMotionState, setReducedMotionState] = useState<"user" | "always">("always");
  const [isMobileDevice, setIsMobileDevice] = useState(true); // Optimistic mobile to avoid hydration mismatch
  const [introComplete, setIntroComplete] = useState(false);

  const mainRoutes = ["/", "/about", "/projects", "/products", "/ai", "/login", "/careers", "/contact", "/dashboard", "/admin"];
  const showCanvas = mainRoutes.includes(pathname);
  const isPerformanceLow = currentProfile === "low" || currentProfile === "battery";
  const shouldRenderCanvas = showCanvas && !isPerformanceLow;

  // Detect mobile viewport on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768;
      setIsMobileDevice(mobile);
    }
  }, []);

  // Mark scene as ready immediately if canvas is bypassed to unblock state transition gates
  useEffect(() => {
    if (!shouldRenderCanvas) {
      setSceneReady(true);
    }
  }, [shouldRenderCanvas, setSceneReady]);

  // Disable native automatic scroll restoration to ensure clean starts at the top
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Reset scroll position to top on route change to prevent inheriting scroll offsets
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("VANIKARA SW registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("VANIKARA SW registration failed:", error);
        });
    }
  }, []);

  // Defer heavy Three.js hydration to unblock main thread and improve LCP
  useEffect(() => {
    if (typeof window === "undefined" || !shouldRenderCanvas) return;

    setReducedMotionState("user");
    // Desktop high-perf: Mount canvas after a short delay (100ms) to allow page text to paint first
    const timer = setTimeout(() => {
      setDeferCanvas(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [shouldRenderCanvas]);

  // Sync Success White Flash Timeline
  useEffect(() => {
    if (view === "success") {
      const t1 = setTimeout(() => {
        setShowFlash(true);
      }, 550); // Flash triggers as camera enters the core

      const t2 = setTimeout(() => {
        setShowFlash(false);
      }, 2000); // Fades out on the destination page

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [view]);

  return (
    <MotionConfig reducedMotion={reducedMotionState}>
      <div className="flex flex-col min-h-screen bg-transparent relative">
        {/* Intro Loading Screen Overlay */}
        {!introComplete && (
          <IntroAnimation
            onComplete={() => setIntroComplete(true)}
          />
        )}

        {/* Global 3D World Scene Backdrop */}
        {shouldRenderCanvas && (
          <>
            {deferCanvas && <IntelligenceWorld />}
            <div 
              className={`fixed inset-0 z-0 bg-[#030712] transition-opacity duration-[1500ms] ease-in-out pointer-events-none ${
                sceneReady ? "opacity-0" : "opacity-100"
              }`}
            />
          </>
        )}

        {/* Dynamic UI Wrapper: Fades in only when the intro screen has resolved */}
        <motion.div
          animate={{ opacity: introComplete ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col min-h-screen bg-transparent relative w-full"
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-color)] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <ConsentBanner />
          <PreferencesModal />
          <CustomCursor />
          <Navbar />
          <CapacitorManager />

          {/* Fullscreen Success White Flash overlay */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`fixed inset-0 z-50 pointer-events-none ${
                  resolvedTheme === "dark" ? "bg-slate-950" : "bg-white"
                }`}
              />
            )}
          </AnimatePresence>

          <motion.main
            key={pathname}
            id="main-content"
            initial={false}
            animate={{ 
              opacity: isTransitioning ? 0 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-grow pt-16 z-10 relative"
          >
            {children}
          </motion.main>
          {!isAiPage && <Footer />}
        </motion.div>
      </div>
    </MotionConfig>
  );
}



