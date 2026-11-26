"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Inbox, LayoutDashboard, LogIn, LogOut, Settings, User } from "lucide-react";
import { googleSignOut, type SessionState } from "./session";

function Avatar({ name, picture, size = 30 }: { name: string; picture: string | null; size?: number }) {
  return picture ? (
    <Image
      src={picture}
      alt=""
      width={size}
      height={size}
      unoptimized
      referrerPolicy="no-referrer"
      className="rounded-full border border-line"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="grid place-items-center rounded-full bg-action text-xs font-semibold uppercase text-white"
      style={{ width: size, height: size }}
    >
      {name[0] || "U"}
    </span>
  );
}

export default function AccountMenu({ session, isActive }: { session: SessionState; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session.loaded) {
    return <span aria-hidden="true" className="hidden h-9 w-9 md:inline-block" />;
  }

  const { user, isAdmin } = session;

  if (!user && !isAdmin) {
    return (
      <Link
        href="/account/login"
        aria-current={isActive ? "page" : undefined}
        className="hidden h-9 items-center gap-1.5 rounded-compact border border-line px-3 text-xs font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-secondary md:inline-flex"
      >
        <LogIn aria-hidden="true" className="h-3.5 w-3.5 text-fg-muted" />
        <span>Sign in</span>
      </Link>
    );
  }

  if (!user && isAdmin) {
    return (
      <Link
        href="/admin"
        aria-current={isActive ? "page" : undefined}
        className="hidden h-9 items-center gap-1.5 rounded-compact border border-intel/30 bg-intel/10 px-3 text-xs font-semibold text-intel transition-colors hover:bg-intel/15 md:inline-flex"
      >
        <LayoutDashboard aria-hidden="true" className="h-3.5 w-3.5" />
        <span>Console</span>
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
        aria-label={`Account: ${user!.name}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-compact px-1.5 transition-colors hover:bg-surface-sunken"
      >
        <Avatar name={user!.name} picture={user!.picture} size={28} />
      </button>

      <div
        id={`${id}-menu`}
        role="menu"
        aria-label="Account menu"
        data-open={open}
        inert={!open}
        className="nav-panel absolute right-0 top-full z-50 origin-top-right pt-2"
      >
        <div className="glass-strong w-64 p-1.5">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={user!.name} picture={user!.picture} size={34} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{user!.name}</p>
              <p className="truncate text-xs text-fg-subtle">{user!.email}</p>
            </div>
          </div>
          <div className="rule my-1" />
          <Link
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-compact px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-sunken"
          >
            <User aria-hidden="true" className="h-4 w-4 text-fg-muted" />
            Account overview
          </Link>
          <Link
            role="menuitem"
            href="/account/applications"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-compact px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-sunken"
          >
            <Briefcase aria-hidden="true" className="h-4 w-4 text-fg-muted" />
            My applications
          </Link>
          <Link
            role="menuitem"
            href="/account/enquiries"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-compact px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-sunken"
          >
            <Inbox aria-hidden="true" className="h-4 w-4 text-fg-muted" />
            My enquiries
          </Link>
          <Link
            role="menuitem"
            href="/account/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-compact px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-sunken"
          >
            <Settings aria-hidden="true" className="h-4 w-4 text-fg-muted" />
            Settings & privacy
          </Link>
          {isAdmin && (
            <>
              <div className="rule my-1" />
              <Link
                role="menuitem"
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-compact px-3 py-2 text-sm font-semibold text-intel transition-colors hover:bg-surface-sunken"
              >
                <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                Vanikara Console
              </Link>
            </>
          )}
          <div className="rule my-1" />
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              googleSignOut();
            }}
            className="flex w-full items-center gap-2.5 rounded-compact px-3 py-2 text-left text-sm text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
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
