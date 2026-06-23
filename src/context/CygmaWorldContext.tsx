"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

export type CygmaView = 
  | "hero" 
  | "about" 
  | "projects" 
  | "products"
  | "ai" 
  | "login" 
  | "careers" 
  | "contact" 
  | "dashboard" 
  | "admin" 
  | "success";

interface CygmaWorldContextType {
  view: CygmaView;
  setView: (view: CygmaView) => void;
  isSuccess: boolean;
  setIsSuccess: (success: boolean) => void;
  navbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
  appRevealComplete: boolean;
  setAppRevealComplete: (complete: boolean) => void;
}

const CygmaWorldContext = createContext<CygmaWorldContextType | undefined>(undefined);

export function CygmaWorldProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Helper to determine the initial view based on pathname
  const getInitialView = (path: string): CygmaView => {
    if (path === "/about") return "about";
    if (path === "/projects") return "projects";
    if (path === "/products") return "products";
    if (path === "/ai") return "ai";
    if (path === "/login") return "login";
    if (path === "/careers") return "careers";
    if (path === "/contact") return "contact";
    if (path === "/dashboard") return "dashboard";
    if (path === "/admin") return "admin";
    return "hero";
  };

  const getInitialNavbarVisible = (path: string): boolean => {
    return path !== "/login";
  };

  const [view, setView] = useState<CygmaView>(() => getInitialView(pathname));
  const [isSuccess, setIsSuccess] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(() => getInitialNavbarVisible(pathname));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [appRevealComplete, setAppRevealComplete] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Sync view automatically with the current pathname on initial load, reload, or backward/forward navigation
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsTransitioning(false);
    setIsSuccess(false);

    if (pathname === "/") {
      setView("hero");
      setNavbarVisible(true);
    } else if (pathname === "/about") {
      setView("about");
      setNavbarVisible(true);
    } else if (pathname === "/projects") {
      setView("projects");
      setNavbarVisible(true);
    } else if (pathname === "/products") {
      setView("products");
      setNavbarVisible(true);
    } else if (pathname === "/ai") {
      setView("ai");
      setNavbarVisible(true);
    } else if (pathname === "/login") {
      setView("login");
      setNavbarVisible(false); // Hide standard navbar on login screen for cinematic feel
    } else if (pathname === "/careers") {
      setView("careers");
      setNavbarVisible(true);
    } else if (pathname === "/contact") {
      setView("contact");
      setNavbarVisible(true);
    } else if (pathname === "/dashboard") {
      setView("dashboard");
      setNavbarVisible(true);
    } else if (pathname === "/admin") {
      setView("admin");
      setNavbarVisible(true);
    }
  }

  const contextValue = React.useMemo(() => ({
    view,
    setView,
    isSuccess,
    setIsSuccess,
    navbarVisible,
    setNavbarVisible,
    isTransitioning,
    setIsTransitioning,
    sceneReady,
    setSceneReady,
    appRevealComplete,
    setAppRevealComplete,
  }), [
    view,
    isSuccess,
    navbarVisible,
    isTransitioning,
    sceneReady,
    appRevealComplete,
  ]);

  return (
    <CygmaWorldContext.Provider value={contextValue}>
      {children}
    </CygmaWorldContext.Provider>
  );
}

export function useCygmaWorld() {
  const context = useContext(CygmaWorldContext);
  if (context === undefined) {
    throw new Error("useCygmaWorld must be used within a CygmaWorldProvider");
  }
  return context;
}
