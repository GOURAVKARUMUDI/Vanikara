"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

export const THEME_STORAGE_KEY = "vanikara-theme";

/**
 * Runs in <head> before first paint so the correct theme is applied
 * immediately (no light/dark flash). Also marks JS as available for
 * progressive-enhancement styles and records the first-visit intro.
 */
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||((!t||t==='auto')&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.setAttribute('data-theme',d?'dark':'light');if(sessionStorage.getItem('vk-intro')){r.classList.add('intro-seen')}else{sessionStorage.setItem('vk-intro','1');r.classList.add('intro-first');setTimeout(function(){r.classList.remove('intro-first')},1200)}}catch(e){r.setAttribute('data-theme','light')}})();`;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
  return "auto";
}

function resolve(theme: ThemeMode): ResolvedTheme {
  if (theme !== "auto") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The real theme is already on <html> via THEME_BOOT_SCRIPT. `theme` stays
  // `null` until the stored preference has been read, so the sync effect
  // below never overwrites the boot script's value with a default.
  const [theme, setThemeState] = useState<ThemeMode | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  useEffect(() => {
    if (theme === null) return;
    const next = resolve(theme);
    setResolvedTheme(next);
    document.documentElement.setAttribute("data-theme", next);

    if (theme !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const value = media.matches ? "dark" : "light";
      setResolvedTheme(value);
      document.documentElement.setAttribute("data-theme", value);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Non-persistent session is acceptable
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: theme ?? "auto", resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
