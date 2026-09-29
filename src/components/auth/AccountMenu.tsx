"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { googleSignOut, type SessionState } from "./session";

function Avatar({ name, picture, size = 32 }: { name: string; picture: string | null; size?: number }) {
  return picture ? (
    <Image
      src={picture}
      alt=""
      width={size}
      height={size}
      unoptimized
      referrerPolicy="no-referrer"
      className="rounded-full ring-2 ring-[var(--glass-edge)]"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="grid place-items-center rounded-full bg-action text-xs font-bold uppercase text-white"
      style={{ width: size, height: size }}
    >
      {name[0]}
    </span>
  );
}

/**
 * Navbar account control.
 *  - Signed out: "Sign in".
 *  - Google user: avatar opening a small glass menu (name, email, sign out).
 *  - Admin: an "Admin" shortcut to the console (in the menu, or on its own).
 */
export default function AccountMenu({ session, isActive }: { session: SessionState; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session.loaded) return <span aria-hidden="true" className="hidden h-9 w-9 md:inline-block" />;

  const { user, isAdmin } = session;

  if (!user) {
    return (
      <Link
        href={isAdmin ? "/admin" : "/login"}
        aria-current={isActive ? "page" : undefined}
        aria-label={isAdmin ? "Admin console" : "Sign in"}
        className={`hidden h-9 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-semibold transition-colors hover:bg-surface-sunken md:inline-flex ${
          isAdmin ? "text-ambition" : "text-fg-muted hover:text-fg"
        }`}
      >
        {isAdmin ? <LayoutDashboard aria-hidden="true" className="h-4 w-4" /> : <LogIn aria-hidden="true" className="h-4 w-4" />}
        <span className="hidden xl:inline">{isAdmin ? "Admin" : "Sign in"}</span>
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={`Account: ${user.name}`}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-105"
      >
        <Avatar name={user.name} picture={user.picture} />
      </button>

      <div
        id={`${id}-menu`}
        role="menu"
        aria-label="Account"
        data-open={open}
        inert={!open}
        className="nav-panel absolute right-0 top-full z-50 origin-top-right pt-3"
      >
        <div className="liquid-glass glass-strong w-64 rounded-feature p-1.5">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={user.name} picture={user.picture} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
              <p className="truncate text-xs text-fg-muted">{user.email}</p>
            </div>
          </div>
          <div className="rule mx-3 my-1" />
          {isAdmin && (
            <Link
              role="menuitem"
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-compact px-3 py-2.5 text-sm font-semibold text-ambition transition-colors hover:bg-surface-sunken/70"
            >
              <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
              Admin console
            </Link>
          )}
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              googleSignOut();
            }}
            className="flex w-full items-center gap-2.5 rounded-compact px-3 py-2.5 text-left text-sm font-semibold text-fg-muted transition-colors hover:bg-surface-sunken/70 hover:text-fg"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export { Avatar };
