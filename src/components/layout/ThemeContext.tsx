"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

export type RevealOrigin = { x: number; y: number };

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode, origin?: RevealOrigin) => void;
}

export const THEME_STORAGE_KEY = "vanikara-theme";

/**
 * Runs in <head> before first paint to prevent FOUC and synchronize
 * <meta name="color-scheme"> and [data-theme] with stored preference
 * or system preference (prefers-color-scheme).
 */
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var m=document.querySelector('meta[name="color-scheme"]');if(t==='light'||t==='dark'){if(m)m.content=t;r.setAttribute('data-theme',t);}else{if(m)m.content='light dark';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;r.setAttribute('data-theme',d?'dark':'light');}}catch(e){r.setAttribute('data-theme','light');}})();`;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage unavailable
  }
  return "auto";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDOM(mode: ThemeMode): ResolvedTheme {
  const resolved = mode === "auto" ? getSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolved);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) {
    meta.content = mode === "auto" ? "light dark" : mode;
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const initial = readStoredTheme();
    setThemeState(initial);
    setResolvedTheme(applyThemeToDOM(initial));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      if (readStoredTheme() === "auto") {
        setResolvedTheme(applyThemeToDOM("auto"));
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        const next = readStoredTheme();
        setThemeState(next);
        setResolvedTheme(applyThemeToDOM(next));
      }
    };

    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      if (next === "auto") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage failure; still apply in memory
    }
    setResolvedTheme(applyThemeToDOM(next));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
