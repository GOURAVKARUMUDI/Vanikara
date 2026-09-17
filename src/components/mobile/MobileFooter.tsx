"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Github, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileFooterProps {
  year: number;
  openPreferences: () => void;
}

export default function MobileFooter({ year, openPreferences }: MobileFooterProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    company: false,
    ecosystem: false,
    legal: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sectionsData = [
    {
      id: "company",
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/projects", label: "Our Projects" },
        { href: "/products", label: "Our Products" },
        { href: "/services", label: "What We Build" },
        { href: "/careers", label: "Join Careers" },
        { href: "/press", label: "Press & Media" },
        { href: "/brand", label: "Brand Identity" },
        { href: "/investors", label: "Investor Relations" },
      ],
    },
    {
      id: "ecosystem",
      title: "Ecosystem Tools",
      links: [
        { href: "/ai", label: "CYGMA AI Node" },
        { href: "/upload", label: "Secure Vault Upload" },
        { href: "/dashboard", label: "Client Portal" },
        { href: "/admin", label: "Admin Operating OS" },
      ],
    },
    {
      id: "legal",
      title: "Legal Controls",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/security", label: "Security Page" },
        { href: "/legal", label: "Legal Information" },
        { href: "/refund", label: "Refund Policy" },
        { onClick: openPreferences, label: "Privacy & Cookie Settings" },
      ],
    },
  ];

  return (
    <footer className="pt-8 pb-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md md:hidden">
      <div className="px-4 flex flex-col gap-6">
        
        {/* Brand Details */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 group self-start">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 border border-white/10 shadow-sm">
              <Image src="/logo.png" alt="Vanikara Logo" className="w-6 h-auto" width={24} height={24} />
            </div>
            <span className="font-display font-black text-xs tracking-widest text-[var(--text-primary)]">
              VANIKARA
            </span>
          </Link>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed max-w-[280px] font-semibold">
            Building Tomorrow Through Intelligence. An Indian technology company crafting scalable platforms, student ecosystems, and smart digital workflows.
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col border-y border-[var(--glass-border)] divide-y divide-[var(--glass-border)]">
          {sectionsData.map((sec) => {
            const isOpen = openSections[sec.id];
            return (
              <div key={sec.id} className="py-3 flex flex-col">
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="flex items-center justify-between w-full text-left font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] focus:outline-none cursor-pointer"
                >
                  <span>{sec.title}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 list-none p-0 mt-3 pl-1 mb-1">
                        {sec.links.map((link) => (
                          <li key={link.label}>
                            {link.onClick ? (
                              <button
                                onClick={link.onClick}
                                className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors bg-transparent border-none p-0 text-left outline-none cursor-pointer"
                              >
                                {link.label}
                              </button>
                            ) : (
                              <Link
                                href={link.href || "/"}
                                className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors block"
                              >
                                {link.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Link */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Official Support
          </span>
          <a
            href="mailto:support@vanikara.com"
            className="text-xs font-semibold text-[var(--accent-color)] hover:underline"
          >
            support@vanikara.com
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-2">
          {[
            { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/company/vanikara", label: "LinkedIn" },
            { icon: <Github className="w-4 h-4" />, href: "https://github.com/vanikara", label: "GitHub" },
            { icon: <Mail className="w-4 h-4" />, href: "mailto:support@vanikara.com", label: "Email" }
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--accent-color)] text-[var(--text-secondary)] hover:text-white transition-all active:scale-95 shadow-sm"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Bottom Details */}
        <div className="flex flex-col gap-1.5 pt-4 border-t border-[var(--glass-border)] text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <p className="text-[var(--text-primary)] font-extrabold font-display">VANIKARA Intelligence Private Limited</p>
          <p>CIN: U47912AP2026PTC125340</p>
          <p>© {year} VANIKARA Intelligence. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}
