"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Sparkles, User as UserIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { isAdmin } from "@/lib/isAdmin";
import { useAuthRedirect } from "@/lib/authRedirect";
import { useTheme, ThemeMode } from "./layout/ThemeContext";
import { useCygmaWorld, CygmaView } from "@/context/CygmaWorldContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/ai", label: "AI" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const { navbarVisible, setNavbarVisible, setView, setIsTransitioning } = useCygmaWorld();
  
  useAuthRedirect();

  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    let frameId: number;

    if (pathname !== "/") {
      frameId = requestAnimationFrame(() => {
        setIsHeroVisible(false);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const heroEl = document.getElementById("hero");
    if (!heroEl) {
      frameId = requestAnimationFrame(() => {
        setIsHeroVisible(true);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(heroEl);

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    // Scroll smoothly to top if already on target page
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let targetView: CygmaView | null = null;
    if (href === "/") targetView = "hero";
    else if (href === "/about") targetView = "about";
    else if (href === "/projects") targetView = "projects";
    else if (href === "/ai") targetView = "ai";
    else if (href === "/careers") targetView = "careers";
    else if (href === "/contact") targetView = "contact";
    else if (href === "/dashboard") targetView = "dashboard";
    else if (href === "/admin") targetView = "admin";
    else if (href === "/login") targetView = "login";

    if (targetView) {
      e.preventDefault();
      setIsTransitioning(true);
      setView(targetView);

      if (targetView === "login") {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }

      const delay = targetView === "login" ? 1100 : 700;
      setTimeout(() => {
        router.push(href);
      }, delay);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sub) sub.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMobileMenuOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ["auto", "light", "dark"];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const renderThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "dark":
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case "auto":
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <motion.header
        animate={{ 
          opacity: navbarVisible ? 1 : 0, 
          y: navbarVisible ? 0 : -20,
          pointerEvents: navbarVisible ? "auto" : "none" 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`w-full md:w-[72vw] max-w-4xl pointer-events-auto transition-all duration-500 rounded-full border border-white/10 dark:border-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden group/navbar ${
          isScrolled 
            ? "py-2 px-6 bg-white/70 dark:bg-slate-900/60 scale-95" 
            : "py-3 px-8 bg-white/40 dark:bg-slate-950/20"
        }`}
      >
        {/* Shine highlight line at top (Reflection Layer) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group select-none"
            onClick={(e) => handleLinkClick(e, "/")}
          >
            <div className="relative overflow-hidden w-8 h-8 rounded-xl flex items-center justify-center bg-white/10 dark:bg-white/5 shadow-sm border border-white/10 dark:border-white/5">
              <img 
                src="/logo.png" 
                alt="Vanikara Logo" 
                className="w-6 h-auto group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <span className="font-display font-black text-xs tracking-widest text-[var(--text-primary)]">
              VANIKARA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-500/5 dark:bg-white/5 px-2 py-1 rounded-full border border-white/5">
            {NAV_LINKS.map((link) => {
              const isHome = link.href === "/";
              const active = isHome 
                ? (pathname === "/" && isHeroVisible)
                : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href === "/" ? "/#hero" : link.href}
                  className="relative px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {active && (
                    <motion.span
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 bg-white/60 dark:bg-white/10 rounded-full border border-white/20 dark:border-white/5 shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 ${
                    active
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
            
            {/* Dashboard / Admin links */}
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="relative px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer"
                >
                  {pathname === "/dashboard" && (
                    <motion.span
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 bg-white/60 dark:bg-white/10 rounded-full border border-white/20 dark:border-white/5 shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 ${
                    pathname === "/dashboard"
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}>
                    Portal
                  </span>
                </Link>
                {isAdmin(user.email) && (
                  <Link 
                    href="/admin" 
                    className="relative px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors duration-300 select-none cursor-pointer"
                  >
                    {pathname === "/admin" && (
                      <motion.span
                        layoutId="activeNavCapsule"
                        className="absolute inset-0 bg-white/60 dark:bg-white/10 rounded-full border border-white/20 dark:border-white/5 shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className={`relative z-10 ${
                      pathname === "/admin"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}>
                      Admin
                    </span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Controls and Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-full hover:bg-slate-500/10 border border-transparent hover:border-white/10 transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center"
              title={`Theme: ${theme.toUpperCase()}`}
            >
              {renderThemeIcon()}
            </button>

            {user ? (
              <div className="flex items-center gap-1.5">
                <Link 
                  href="/dashboard"
                  className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-[var(--accent-color)] text-white hover:scale-105 transition-transform border border-white/20 shadow-md"
                  title="View Portal"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button 
                href="/login" 
                variant="ghost" 
                size="sm" 
                magnetic
                onClick={(e) => handleLinkClick(e as any, "/login")}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={cycleTheme}
              className="p-1.5 rounded-full hover:bg-slate-500/10 transition-colors cursor-pointer"
            >
              {renderThemeIcon()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-[var(--text-primary)] hover:bg-slate-500/10 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden pointer-events-auto"
          >
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Vanikara Logo" className="w-7 h-auto" />
                <span className="font-display font-black text-xs tracking-widest text-[var(--text-primary)]">
                  VANIKARA
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-slate-500/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-5 my-auto items-center">
               {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href === "/" ? "/#hero" : link.href}
                  className="text-xl font-display font-black uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
                  onClick={(e) => {
                    handleLinkClick(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <>
                   <Link
                    href="/dashboard"
                    className="text-xl font-display font-black uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
                  >
                    Portal
                  </Link>
                  {isAdmin(user.email) && (
                    <Link
                      href="/admin"
                      className="text-xl font-display font-black uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="flex flex-col gap-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="text-center text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    Portal Active: {user.email}
                  </div>
                  <Button onClick={handleLogout} variant="secondary" size="lg" className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  href="/login" 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLinkClick(e as any, "/login");
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
