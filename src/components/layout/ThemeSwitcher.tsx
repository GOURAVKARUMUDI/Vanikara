"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Clock, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "./ThemeContext";
import { DARK_FROM, LIGHT_FROM, formatHour } from "@/lib/daypart";

const OPTIONS: { mode: ThemeMode; label: string; hint: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", hint: "Always light", Icon: Sun },
  { mode: "dark", label: "Dark", hint: "Always dark", Icon: Moon },
  {
    mode: "auto",
    label: "Auto",
    hint: `Light ${formatHour(LIGHT_FROM)}–${formatHour(DARK_FROM)}, dark after`,
    Icon: Clock,
  },
];

/**
 * Theme picker: a round trigger showing the current theme, opening a
 * liquid-glass menu. Choosing an option switches with a circular reveal
 * that grows from the trigger.
 */
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
    rootRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (mode: ThemeMode) => {
    const rect = triggerRef.current?.getBoundingClientRect();
    setOpen(false);
    setTheme(mode, rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]'));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };

  const label = `Theme: ${theme === "auto" ? `Auto (${resolvedTheme} now)` : theme}`;

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
        className="theme-toggle relative grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
      >
        <Sun aria-hidden="true" className="hidden h-[18px] w-[18px] dark:block" />
        <Moon aria-hidden="true" className="h-[18px] w-[18px] dark:hidden" />
        {theme === "auto" && (
          <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-action text-white ring-2 ring-[var(--surface-base)]">
            <Clock className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        )}
      </button>

      <div
        id={`${id}-menu`}
        role="menu"
        aria-label="Theme"
        data-open={open}
        onKeyDown={onMenuKey}
        inert={!open}
        className={`nav-panel absolute top-full z-50 pt-3 ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
      >
        <div className="liquid-glass glass-strong w-[15.5rem] max-w-[calc(100vw-2rem)] rounded-feature p-1.5">
          {OPTIONS.map(({ mode, label: optionLabel, hint, Icon }) => {
            const selected = theme === mode;
            return (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => choose(mode)}
                className={`group flex w-full items-center gap-3 rounded-compact px-3 py-2.5 text-left transition-colors ${
                  selected ? "bg-[color-mix(in_oklab,var(--accent-intel)_12%,transparent)]" : "hover:bg-surface-sunken/70"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                    selected ? "border-transparent bg-action text-white" : "border-line text-fg-muted group-hover:text-fg"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">{optionLabel}</span>
                  <span className="block text-xs text-fg-muted">{hint}</span>
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
