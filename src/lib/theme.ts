'use client';

export type Theme = 'light' | 'dark' | 'auto';

const THEME_KEY = 'vanikara-theme';
const SYSTEM_THEME = '(prefers-color-scheme: dark)';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia(SYSTEM_THEME).matches ? 'dark' : 'light';
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  return stored || 'auto';
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  const html = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'auto' && getSystemTheme() === 'dark');

  html.setAttribute('data-theme', theme);
  html.classList.toggle('dark', isDark);

  updateCSSVariables(isDark);
}

function updateCSSVariables(isDark: boolean) {
  const root = document.documentElement.style;

  if (isDark) {
    root.setProperty('--text-primary', '#ffffff');
    root.setProperty('--text-secondary', '#b3b3b3');
    root.setProperty('--text-tertiary', '#808080');
    root.setProperty('--bg-primary', '#0a0a0a');
    root.setProperty('--bg-secondary', '#1a1a1a');
    root.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
    root.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
    root.setProperty('--accent-color', '#06b6d4');
  } else {
    root.setProperty('--text-primary', '#1a1a1a');
    root.setProperty('--text-secondary', '#666666');
    root.setProperty('--text-tertiary', '#999999');
    root.setProperty('--bg-primary', '#ffffff');
    root.setProperty('--bg-secondary', '#f5f5f5');
    root.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.03)');
    root.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
    root.setProperty('--accent-color', '#0891b2');
  }
}

export function initializeTheme() {
  if (typeof window === 'undefined') return;

  const theme = getTheme();
  applyTheme(theme);

  window.matchMedia(SYSTEM_THEME).addEventListener('change', (e) => {
    if (getTheme() === 'auto') {
      applyTheme('auto');
    }
  });
}
