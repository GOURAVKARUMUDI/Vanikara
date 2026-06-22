"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Sparkles, User as UserIcon, LogOut, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { usePWA } from "@/hooks/usePWA";

interface MobileNavbarProps {
  user: any;
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => void;
  handleLogout: () => Promise<void>;
  cycleTheme: () => void;
  renderThemeIcon: () => React.ReactNode;
  theme: string;
  mounted: boolean;
  isAdminUser: boolean;
  navbarVisible: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/ai", label: "AI" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function MobileNavbar({
  user,
  handleLinkClick,
  handleLogout,
  cycleTheme,
  renderThemeIcon,
  theme,
  mounted,
  isAdminUser,
  navbarVisible
}: MobileNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isInstallable, installApp } = usePWA();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 fixed-nav-safe-area pointer-events-none md:hidden">
      <motion.header
        role="banner"
        aria-label="Mobile Navigation Bar"
        animate={{
          opacity: navbarVisible ? 1 : 0,
          y: navbarVisible ? 0 : -20,
          pointerEvents: navbarVisible ? "auto" : "none"
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`w-full pointer-events-auto transition-all duration-300 rounded-2xl border border-white/10 dark:border-white/5 backdrop-blur-xl shadow-md relative overflow-hidden ${
          isScrolled
            ? "py-2 px-4 bg-white/80 dark:bg-slate-900/70 shadow-lg scale-98"
            : "py-3 px-5 bg-white/50 dark:bg-slate-950/30"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group select-none focus:outline-none"
            onClick={(e) => handleLinkClick(e, "/")}
          >
            <div className="relative overflow-hidden w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Vanikara Logo"
                className="w-5.5 h-auto transition-transform"
                width={22}
                height={22}
                priority
              />
            </div>
            <span className="font-display font-black text-[10px] tracking-widest text-[var(--text-primary)]">
              VANIKARA
            </span>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {isInstallable && (
              <button
                onClick={installApp}
                className="p-1.5 rounded-lg hover:bg-slate-500/10 text-[var(--accent-color)] active:scale-95 transition-all cursor-pointer"
                title="Install App"
                aria-label="Install App"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={cycleTheme}
              className="p-1.5 rounded-lg hover:bg-slate-500/10 active:scale-95 transition-all cursor-pointer"
              aria-label="Cycle theme"
            >
              {renderThemeIcon()}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-xl text-[var(--text-primary)] hover:bg-slate-500/10 active:scale-95 transition-all cursor-pointer relative"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl flex flex-col justify-between p-6 pt-24 mobile-menu-safe-area pointer-events-auto"
          >
            {/* Nav list */}
            <motion.nav 
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-5 items-center my-auto"
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
                    }}
                  >
                    <Link
                      href={link.href === "/" ? "/#hero" : link.href}
                      className={`text-2xl font-display font-black uppercase tracking-widest transition-colors block py-2 ${
                        active ? "text-[var(--accent-color)]" : "text-[var(--text-primary)] hover:text-[var(--accent-color)] active:scale-95"
                      }`}
                      onClick={(e) => {
                        handleLinkClick(e, link.href);
                        setMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {user && (
                <>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}>
                    <Link
                      href="/dashboard"
                      className={`text-2xl font-display font-black uppercase tracking-widest transition-colors block py-2 ${
                        pathname === "/dashboard" ? "text-[var(--accent-color)]" : "text-[var(--text-primary)] hover:text-[var(--accent-color)] active:scale-95"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Portal
                    </Link>
                  </motion.div>
                  {isAdminUser && (
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}>
                      <Link
                        href="/admin"
                        className={`text-2xl font-display font-black uppercase tracking-widest transition-colors block py-2 ${
                          pathname === "/admin" ? "text-[var(--accent-color)]" : "text-[var(--text-primary)] hover:text-[var(--accent-color)] active:scale-95"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </motion.nav>

            {/* Footer action keys */}
            <div className="flex flex-col gap-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-center text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    Portal Active: {user.email}
                  </div>
                  <Button
                    onClick={async () => {
                      setMenuOpen(false);
                      await handleLogout();
                    }}
                    variant="secondary"
                    size="md"
                    className="w-full justify-center flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  href="/login"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={(e) => {
                    setMenuOpen(false);
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
