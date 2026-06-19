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

// Dynamic import for client-only R3F Canvas
const IntelligenceWorld = dynamic(() => import("@/three/world/IntelligenceWorld"), {
  ssr: false,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAiPage = pathname === "/ai";
  const { view, isTransitioning } = useCygmaWorld();
  const [showFlash, setShowFlash] = useState(false);

  const mainRoutes = ["/", "/about", "/projects", "/ai", "/login", "/careers", "/contact", "/dashboard", "/admin"];
  const showCanvas = mainRoutes.includes(pathname);

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
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col min-h-screen bg-transparent">
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

      {/* Global 3D World Scene Backdrop */}
      {showCanvas && <IntelligenceWorld />}

      {/* Fullscreen Success White Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.main
        key={pathname}
        id="main-content"
        initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
        animate={{ 
          opacity: isTransitioning ? 0 : 1, 
          scale: isTransitioning ? 0.98 : 1, 
          filter: isTransitioning ? "blur(4px)" : "blur(0px)" 
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex-grow pt-16 z-10"
      >
        {children}
      </motion.main>
      {!isAiPage && <Footer />}
      </div>
    </MotionConfig>
  );
}



