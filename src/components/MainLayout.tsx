"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import dynamic from "next/dynamic";


import SmoothScroll from "./layout/SmoothScroll";
import ConsentBanner from "./layout/ConsentBanner";
import PreferencesModal from "./layout/PreferencesModal";
import { useTheme } from "./layout/ThemeContext";
import { usePerformance } from "@/context/PerformanceContext";
import CapacitorManager from "./layout/CapacitorManager";
import Preloader from "./layout/Preloader";
// Dynamic import for client-only R3F Canvas
const IntelligenceWorld = dynamic(() => import("@/three/world/IntelligenceWorld"), {
  ssr: false,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAiPage = pathname === "/ai";
  const { view, sceneReady, setSceneReady, appRevealComplete } = useCygmaWorld();
  const { resolvedTheme } = useTheme();
  const { currentProfile } = usePerformance();
  const [showFlash, setShowFlash] = useState(false);
  const [reducedMotionState, setReducedMotionState] = useState<"user" | "always">("always");

  const mainRoutes = ["/", "/about", "/projects", "/products", "/ai", "/login", "/careers", "/contact", "/dashboard", "/admin"];
  const showCanvas = mainRoutes.includes(pathname);
  const isPerformanceLow = currentProfile === "low" || currentProfile === "battery";
  const shouldRenderCanvas = showCanvas && !isPerformanceLow;


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
        .then((_registration) => {
        })
        .catch((error) => {
          console.error("VANIKARA SW registration failed:", error);
        });
    }
  }, []);

  // Unblock reduced motion preference parsing
  useEffect(() => {
    if (typeof window === "undefined" || !shouldRenderCanvas) return;
    setReducedMotionState("user");
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

  // Environment Variable Production Guard
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("[CYGMA FATAL] Missing required NEXT_PUBLIC_SUPABASE variables in production environment. Features will fail.");
      }
    }
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotionState}>
      <div className="flex flex-col min-h-screen bg-transparent relative">
        <Preloader />

        {/* Global 3D World Scene Backdrop */}
        {shouldRenderCanvas && (
          <>
            <IntelligenceWorld />
            {/* We no longer overlay black based on sceneReady here because the Preloader covers it. 
                But we keep it just in case as a fallback background. */}
            <div 
              className={`fixed inset-0 z-0 bg-[#030712] transition-opacity duration-[1500ms] ease-in-out pointer-events-none ${
                sceneReady ? "opacity-0" : "opacity-100"
              }`}
            />
          </>
        )}

        {/* Dynamic UI Wrapper */}
        <div className={`flex flex-col min-h-screen bg-transparent relative w-full z-10 transition-opacity duration-1000 ease-in-out ${
          appRevealComplete ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-color)] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <ConsentBanner />
          <PreferencesModal />

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

          <main
            key={pathname}
            id="main-content"
            className="flex-grow pt-16 z-10 relative"
          >
            {children}
          </main>
          {!isAiPage && <Footer />}
        </div>
      </div>
    </MotionConfig>
  );
}



