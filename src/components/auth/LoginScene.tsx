"use client";

import { useEffect } from "react";
import { useCygmaWorld } from "@/context/CygmaWorldContext";

/**
 * LoginScene: Sets active view to "login" and hides the default navbar.
 */
export default function LoginScene() {
  const { setView, setNavbarVisible } = useCygmaWorld();

  useEffect(() => {
    setView("login");
    setNavbarVisible(false);
  }, [setView, setNavbarVisible]);

  return null;
}
