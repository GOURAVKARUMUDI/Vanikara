"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search, X, LayoutDashboard, LogIn, User } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import ThemeSwitcher from "./layout/ThemeSwitcher";
import AccountMenu from "./auth/AccountMenu";
import { googleSignOut, useSession } from "./auth/session";
import type { SiteContent } from "@/content/defaults";

type MenuKey = "company" | "businesses" | "ai" | "technology" | "careers" | "contact" | null;

interface NavItem {
  href: string;
  label: string;
  desc: string;
}

const MENUS: Record<Exclude<MenuKey, null>, { label: string; items: NavItem[] }> = {
  company: {
    label: "Company",
    items: [
      { href: "/about", label: "About Vanikara", desc: "Our mission, story, and product-first philosophy" },
      { href: "/leadership", label: "Leadership", desc: "Founders, directors, and corporate governance" },
      { href: "/about#journey", label: "Our Journey", desc: "Verified company milestones and roadmap" },
      { href: "/legal/legal-information", label: "Corporate Governance", desc: "Statutory identity, CIN, and legal disclosures" },
    ],
  },
  businesses: {
    label: "Businesses",
    items: [
      { href: "/businesses", label: "Unified Consumer Ecosystem", desc: "Long-term vision for connected everyday services" },
      { href: "/food-delivery", label: "Food Services", desc: "Food Delivery, Dine-in, Takeaway & Telephone Ordering" },
      { href: "/businesses/travel", label: "Travel Booking", desc: "DPR / Planning Stage — future travel services" },
      { href: "/businesses/hotels", label: "Hotel Booking", desc: "DPR / Planning Stage — future accommodation services" },
      { href: "/businesses/quick-commerce", label: "Quick Commerce", desc: "Future Exploration — everyday essentials" },
    ],
  },
  ai: {
    label: "CYGMA_AI",
    items: [
      { href: "/cygma-ai", label: "CYGMA_AI Overview", desc: "Proprietary intelligence ecosystem powered by Vanikara" },
      { href: "/cygma-ai/resume-intelligence", label: "CYGMA-RI — Resume Intelligence", desc: "B2B AI-powered resume analysis & pre-verification" },
      { href: "/cygma-ai#internal-intelligence", label: "Internal Intelligence", desc: "Operational decision-support R&D" },
      { href: "/cygma-ai#responsible-ai", label: "Responsible AI", desc: "Human oversight, privacy, and evidence standards" },
    ],
  },
  technology: {
    label: "Technology",
    items: [
      { href: "/technology", label: "Engineering", desc: "Modular architecture, data systems, and reliability" },
      { href: "/technology#security", label: "Cybersecurity", desc: "Defense-in-depth, RLS, and privacy by design" },
      { href: "/what-we-build", label: "All Initiatives", desc: "Complete product and research overview" },
    ],
  },
  careers: {
    label: "Careers",
    items: [
      { href: "/careers", label: "Open Positions", desc: "Explore current roles and general applications" },
      { href: "/careers?type=Internship", label: "Internships", desc: "Student and early-career engineering opportunities" },
      { href: "/account/applications", label: "Application Tracking", desc: "Check the status of your submitted applications" },
    ],
  },
  contact: {
    label: "Contact",
    items: [
      { href: "/contact", label: "General Enquiries", desc: "Reach our team in Guntur, Andhra Pradesh" },
      { href: "/contact?topic=partnership", label: "Partnerships", desc: "Restaurant, travel, hospitality, and enterprise partners" },
      { href: "/cygma-ai/resume-intelligence#early-access", label: "CYGMA-RI Early Access", desc: "B2B recruitment and enterprise enquiries" },
      { href: "/contact?topic=support", label: "Support", desc: "Assistance, policy queries, and grievance redressal" },
    ],
  },
};

const SEARCH_INDEX = [
  { href: "/", title: "Home", category: "Page", desc: "Vanikara corporate homepage" },
  { href: "/businesses", title: "Unified Consumer Services Ecosystem", category: "Businesses", desc: "Food Services, Travel, Hotels, and Quick Commerce" },
  { href: "/food-delivery", title: "Food Services", category: "Business", desc: "Food Delivery, Dine-in, Takeaway, and AI Telephone Ordering" },
  { href: "/businesses/travel", title: "Travel Booking", category: "DPR / Planning", desc: "Connected travel services feasibility assessment" },
  { href: "/businesses/hotels", title: "Hotel Booking", category: "DPR / Planning", desc: "Connected accommodation services feasibility assessment" },
  { href: "/businesses/quick-commerce", title: "Quick Commerce", category: "Exploration", desc: "Future exploration into everyday essentials" },
  { href: "/cygma-ai", title: "CYGMA_AI Ecosystem", category: "AI", desc: "Proprietary intelligence ecosystem powered by Vanikara Intelligence" },
  { href: "/cygma-ai/resume-intelligence", title: "CYGMA-RI (Resume Intelligence)", category: "B2B Product", desc: "AI-powered B2B resume analysis and pre-verification platform" },
  { href: "/about", title: "About Vanikara", category: "Company", desc: "Story, mission, principles, and milestones" },
  { href: "/leadership", title: "Leadership", category: "Company", desc: "Founders and directors of Vanikara Intelligence" },
  { href: "/technology", title: "Technology & Engineering", category: "Technology", desc: "Architecture, cybersecurity, reliability, and stack" },
  { href: "/careers", title: "Careers & Internships", category: "Careers", desc: "Open roles, internships, and application submission" },
  { href: "/contact", title: "Contact & Partnerships", category: "Contact", desc: "General enquiries, partnerships, and support" },
  { href: "/account", title: "Account Portal", category: "Account", desc: "Track applications, enquiries, and privacy preferences" },
  { href: "/legal", title: "Legal & Compliance", category: "Legal", desc: "Terms, privacy, refund, shipping, cookies, and CIN" },
];

function isActive(pathname: string, href: string) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

export default function Navbar({
  identity: _identity,
  navigation: _navigation,
}: Pick<SiteContent, "identity" | "navigation">) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const idBase = useId();
  const session = useSession(pathname);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (openMenu && !navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobileOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const filteredSearch = searchQuery.trim()
    ? SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_INDEX.slice(0, 7);

  return (
    <>
      <header className="glass fixed inset-x-0 top-0 z-40 h-[var(--header-height)]">
        <div className="container-page flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              aria-label="VANIKARA — Home"
              className="inline-flex shrink-0 items-center rounded-compact py-1"
            >
              <BrandMark size={24} priority />
            </Link>

            <nav ref={navRef} aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-0.5">
              {(Object.keys(MENUS) as Exclude<MenuKey, null>[]).map((key) => {
                const group = MENUS[key];
                const isOpen = openMenu === key;
                const activeGroup = group.items.some((i) => isActive(pathname, i.href));
                return (
                  <div key={key} className="relative">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${idBase}-${key}`}
                      onClick={() => setOpenMenu(isOpen ? null : key)}
                      className={`inline-flex h-9 items-center gap-1 rounded-compact px-2.5 text-sm font-medium transition-colors ${
                        activeGroup || isOpen
                          ? "bg-surface-secondary text-fg"
                          : "text-fg-muted hover:bg-surface-sunken hover:text-fg"
                      }`}
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      id={`${idBase}-${key}`}
                      data-open={isOpen}
                      inert={!isOpen}
                      className="nav-panel absolute left-0 top-full z-50 pt-2"
                    >
                      <div className="glass-strong w-[340px] p-2">
                        <ul className="space-y-0.5">
                          {group.items.map((item) => {
                            const active = isActive(pathname, item.href);
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  aria-current={active ? "page" : undefined}
                                  onClick={() => setOpenMenu(null)}
                                  className={`block rounded-compact px-3 py-2.5 transition-colors ${
                                    active
                                      ? "bg-surface-secondary text-intel"
                                      : "text-fg hover:bg-surface-sunken"
                                  }`}
                                >
                                  <span className="block text-sm font-semibold">{item.label}</span>
                                  <span className="mt-0.5 block text-xs text-fg-muted">{item.desc}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search site"
              title="Search (⌘K)"
              className="grid h-9 w-9 place-items-center rounded-compact text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
            </button>

            <ThemeSwitcher />
            <AccountMenu session={session} isActive={pathname.startsWith("/account") || pathname.startsWith("/login")} />

            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls={`${idBase}-mobile`}
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-compact text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          id={`${idBase}-mobile`}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 overflow-y-auto bg-surface lg:hidden"
        >
          <div className="container-page space-y-6 py-6">
            {(Object.keys(MENUS) as Exclude<MenuKey, null>[]).map((key) => {
              const group = MENUS[key];
              return (
                <div key={key} className="border-b border-line pb-4">
                  <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    {group.label}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(pathname, item.href) ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-compact py-2 text-base font-medium text-fg hover:text-intel"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="flex flex-wrap gap-3 pt-2">
              {session.user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-md flex-1">
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      googleSignOut();
                    }}
                    className="btn btn-outline btn-md"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/account/login" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-md w-full">
                  <LogIn className="h-4 w-4" />
                  Sign in to Account
                </Link>
              )}
              {session.isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-md w-full">
                  <LayoutDashboard className="h-4 w-4" />
                  Vanikara Console
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Vanikara"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="glass-strong w-full max-w-xl overflow-hidden">
            <search>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-fg-muted" />
                <label htmlFor={`${idBase}-search`} className="sr-only">
                  Search Vanikara businesses, CYGMA_AI, careers, and policies
                </label>
                <input
                  ref={searchInputRef}
                  id={`${idBase}-search`}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses, CYGMA_AI, CYGMA-RI, careers, policies..."
                  className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="rounded-compact p-1 text-fg-muted hover:bg-surface-sunken hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </search>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredSearch.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-fg-muted">
                  No pages matched &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {filteredSearch.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="group flex items-center justify-between gap-3 rounded-compact px-3 py-2.5 transition-colors hover:bg-surface-secondary"
                      >
                        <div>
                          <span className="flex items-center gap-2 text-sm font-medium text-fg">
                            {item.title}
                            <span className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px] uppercase text-fg-subtle">
                              {item.category}
                            </span>
                          </span>
                          <span className="block text-xs text-fg-muted">{item.desc}</span>
                        </div>
                        <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0 text-fg-subtle" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
