"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "./ThemeContext";

const OPTIONS: { mode: ThemeMode; label: string; hint: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", hint: "High-clarity light surface", Icon: Sun },
  { mode: "dark", label: "Dark", hint: "Deep navy enterprise surface", Icon: Moon },
  { mode: "auto", label: "System", hint: "Follow device preference", Icon: Monitor },
];

export default function ThemeSwitcher({ align = "right" }: { align?: "right" | "left" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (mode: ThemeMode) => {
    setOpen(false);
    setTheme(mode);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]'));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };

  const label = `Theme: ${theme === "auto" ? `System (${resolvedTheme})` : theme}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={label}
        title={label}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-compact text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
      >
        <Sun aria-hidden="true" className="hidden h-4 w-4 dark:block" />
        <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
      </button>

      <div
        id={`${id}-menu`}
        role="menu"
        aria-label="Theme preference"
        data-open={open}
        onKeyDown={onMenuKey}
        inert={!open}
        className={`nav-panel absolute top-full z-50 pt-2 ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
      >
        <div className="glass-strong w-60 p-1.5">
          {OPTIONS.map(({ mode, label: optionLabel, hint, Icon }) => {
            const selected = theme === mode;
            const resolvedHint = mode === "auto" ? `Currently ${resolvedTheme}` : hint;
            return (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => choose(mode)}
                className={`flex w-full items-center gap-3 rounded-compact px-3 py-2 text-left transition-colors ${
                  selected ? "bg-surface-secondary text-fg" : "text-fg-muted hover:bg-surface-sunken hover:text-fg"
                }`}
              >
                <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${selected ? "text-intel" : ""}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg">{optionLabel}</span>
                  <span className="block text-xs text-fg-subtle">{resolvedHint}</span>
                </span>
                {selected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-intel" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
