"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogIn } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import Button from "@/components/ui/Button";
import ThemeSwitcher from "./layout/ThemeSwitcher";
import AccountMenu, { Avatar } from "./auth/AccountMenu";
import { googleSignOut, useSession } from "./auth/session";
import { COMPANY_IDENTITY, NAVIGATION } from "@/data/company";

type MenuKey = "company" | "products" | null;

const PRIMARY_LINKS = [
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeTimer = useRef<number | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const idBase = useId();

  // Close all menus on navigation
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Glass state after a small scroll. setState bails out when unchanged.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Account state for the sign-in control (display only; access is
  // enforced server-side). Re-read on navigation and on sign-in/out.
  const session = useSession(pathname);
  const showAdmin = session.isAdmin;

  // Mobile menu: scroll lock, Escape, focus management
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !mobileMenuRef.current) return;
      const focusables = [
        menuToggleRef.current,
        ...Array.from(mobileMenuRef.current.querySelectorAll<HTMLElement>("a, button")),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Desktop dropdowns: Escape closes and returns focus
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        document.getElementById(`${idBase}-${openMenu}-trigger`)?.focus();
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu, idBase]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);


  const productsActive = NAVIGATION.products.some((p) => isActive(pathname, p.href)) || pathname === "/what-we-build";
  const companyActive = NAVIGATION.company.some((c) => isActive(pathname, c.href));

  const navItemClass = (active: boolean) =>
    `link-underline inline-flex items-center gap-1 px-1 py-2 text-[0.9375rem] font-medium transition-colors duration-200 ${
      active ? "text-fg" : "text-fg-muted hover:text-fg"
    }`;

  const renderDropdown = (key: Exclude<MenuKey, null>, label: string, active: boolean) => {
    const open = openMenu === key;
    const panelId = `${idBase}-${key}-panel`;
    return (
      <div
        className="relative"
        onMouseEnter={() => {
          cancelClose();
          setOpenMenu(key);
        }}
        onMouseLeave={scheduleClose}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenMenu(null);
        }}
      >
        <button
          id={`${idBase}-${key}-trigger`}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpenMenu(open ? null : key)}
          className={navItemClass(active)}
          aria-current={active ? "page" : undefined}
        >
          {label}
          <ChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          id={panelId}
          data-open={open}
          className="nav-panel absolute left-1/2 top-full -translate-x-1/2 pt-3"
        >
          <div className="liquid-glass glass-strong w-[22rem] rounded-feature p-2">
            {key === "products" ? (
              <>
                {NAVIGATION.products.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-compact p-3 transition-colors hover:bg-surface-sunken"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.tone === "warm" ? "bg-brand-orange" : "bg-brand-blue"
                      }`}
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-fg">{item.label}</span>
                      <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">{item.desc}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-fg-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
                <div className="rule mx-3 my-1" />
                <Link
                  href="/what-we-build"
                  className="group flex items-center justify-between rounded-compact px-3 py-2.5 text-[0.8125rem] font-semibold text-intel transition-colors hover:bg-surface-sunken"
                >
                  Overview of our work
                  <ArrowUpRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </Link>
              </>
            ) : (
              NAVIGATION.company.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-compact p-3 transition-colors hover:bg-surface-sunken"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  <span className="block text-sm font-semibold text-fg">{item.label}</span>
                  <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">{item.desc}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const mobileLinks = [
    { href: "/about", label: "About" },
    { href: "/what-we-build", label: "Products" },
    { href: "/technology", label: "Technology" },
    { href: "/leadership", label: "Leadership" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div aria-hidden="true" className="scroll-progress" />
      {/* Mobile full-screen menu (sits beneath the bar so the toggle stays reachable) */}
      <div
        ref={mobileMenuRef}
        id={`${idBase}-mobile-menu`}
        data-open={mobileOpen}
        className="mobile-menu mobile-menu--glass lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_100%_0%,var(--glow-blue),transparent_70%),radial-gradient(50%_35%_at_0%_100%,var(--glow-orange),transparent_70%)]" />
        <nav
          aria-label="Mobile"
          className="container-page relative flex h-full flex-col overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-24"
        >
          <ul className="flex-1 space-y-1">
            {mobileLinks.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} data-stagger style={{ ["--i" as string]: i }}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="w-6 text-xs font-semibold tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[1.75rem] font-bold leading-none tracking-tight transition-colors sm:text-4xl ${
                        active ? "text-intel" : "text-fg group-active:text-intel"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div data-stagger style={{ ["--i" as string]: mobileLinks.length }} className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {NAVIGATION.products.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="liquid-glass glass rounded-card p-4"
                >
                  <span
                    aria-hidden="true"
                    className={`mb-3 block h-1.5 w-6 rounded-full ${item.tone === "warm" ? "bg-brand-orange" : "bg-brand-blue"}`}
                  />
                  <span className="block text-sm font-semibold text-fg">{item.label}</span>
                  <span className="mt-1 block text-xs text-fg-muted">{item.desc}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1 text-sm text-fg-muted">
                <a href={`mailto:${COMPANY_IDENTITY.officialEmail}`} className="w-fit font-medium text-fg">
                  {COMPANY_IDENTITY.officialEmail}
                </a>
                <span>{COMPANY_IDENTITY.operationalLocation}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {session.user && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      googleSignOut();
                    }}
                    className="liquid-glass glass inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold text-fg"
                    aria-label={`Sign out ${session.user.name}`}
                  >
                    <Avatar name={session.user.name} picture={session.user.picture} size={28} />
                    Sign out
                  </button>
                )}
                {(showAdmin || !session.user) && (
                  <Link
                    href={showAdmin ? "/admin" : "/login"}
                    onClick={() => setMobileOpen(false)}
                    className="liquid-glass glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-fg"
                  >
                    {showAdmin ? (
                      <LayoutDashboard aria-hidden="true" className="h-4 w-4 text-ambition" />
                    ) : (
                      <LogIn aria-hidden="true" className="h-4 w-4 text-intel" />
                    )}
                    {showAdmin ? "Admin" : "Sign in"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Bar */}
      <div className={`container-page relative z-50 transition-[padding] duration-500 ease-brand ${scrolled ? "pt-3" : "pt-0"}`}>
        <div
          className={`flex items-center justify-between rounded-feature border transition-[height,background-color,border-color,box-shadow,padding] duration-500 ease-brand ${
            scrolled
              ? "glass liquid-glass h-14 px-3 sm:px-4"
              : "h-[72px] border-transparent bg-transparent px-0 shadow-none"
          }`}
        >
          <Link href="/" className="rounded-compact py-1 pr-2" aria-label="VANIKARA — home">
            <BrandMark size={26} priority />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {renderDropdown("company", "Company", companyActive)}
            {renderDropdown("products", "Products", productsActive)}
            {PRIMARY_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={navItemClass(active)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <AccountMenu session={session} isActive={isActive(pathname, showAdmin ? "/admin" : "/login")} />
            <ThemeSwitcher />

            <Button href="/contact" size="sm" arrow className="hidden sm:inline-flex">
              Contact
            </Button>

            <button
              ref={menuToggleRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls={`${idBase}-mobile-menu`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="relative grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-surface-sunken lg:hidden"
            >
              <span aria-hidden="true" className="menu-toggle__line top-1/2" />
              <span aria-hidden="true" className="menu-toggle__line top-1/2" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
