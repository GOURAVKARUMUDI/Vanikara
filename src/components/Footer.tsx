"use client";

import Link from "next/link";
import { Mail, Linkedin, Github } from "lucide-react";
import { useConsent } from "@/context/ConsentContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { openPreferences } = useConsent();

  return (
    <footer className="pt-20 pb-10 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/10 shadow-sm">
                <img src="/logo.png" alt="Vanikara Logo" className="w-7 h-auto group-hover:scale-105 transition-transform" />
              </div>
              <span className="font-display font-black text-sm tracking-widest text-[var(--text-primary)]">
                VANIKARA
              </span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
              Building Tomorrow Through Intelligence. An Indian technology company crafting scalable platforms, student ecosystems, and smart digital workflows.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2.5 mt-2">
              {[
                { icon: <Linkedin className="w-4.5 h-4.5" />, href: "https://linkedin.com/company/vanikara", label: "LinkedIn" },
                { icon: <Github className="w-4.5 h-4.5" />, href: "https://github.com/vanikara", label: "GitHub" },
                { icon: <Mail className="w-4.5 h-4.5" />, href: "mailto:vanikara26@gmail.com", label: "Email" }
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--accent-color)] text-[var(--text-secondary)] hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column: Company */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] mb-5">
              Company
            </h4>
            <FooterLinks
              links={[
                { href: "/about", label: "About Us" },
                { href: "/projects", label: "Our Projects" },
                { href: "/products", label: "Our Products" },
                { href: "/careers", label: "Join Careers" },
                { href: "/press", label: "Press & Media" },
                { href: "/brand", label: "Brand Identity" },
                { href: "/investors", label: "Investor Relations" }
              ]}
            />
          </div>

          {/* Links Column: Ecosystem */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] mb-5">
              Ecosystem Tools
            </h4>
            <FooterLinks
              links={[
                { href: "/ai", label: "CYGMA AI Node" },
                { href: "/upload", label: "Secure Vault Upload" },
                { href: "/dashboard", label: "Client Portal" },
                { href: "/admin", label: "Admin Operating OS" }
              ]}
            />
          </div>

          {/* Links Column: Legal / Contact */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)] mb-5">
                Legal Controls
              </h4>
              <FooterLinks
                links={[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms & Conditions" },
                  { href: "/cookies", label: "Cookie Policy" },
                  { href: "/security", label: "Security Page" },
                  { onClick: openPreferences, label: "Privacy & Cookie Settings" }
                ]}
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                Official Support
              </span>
              <a
                href="mailto:vanikara26@gmail.com"
                className="text-xs font-semibold text-[var(--accent-color)] hover:underline"
              >
                vanikara26@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-8 border-t border-[var(--glass-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <div className="space-y-1.5 max-w-xl">
            <p className="text-[var(--text-primary)] font-extrabold font-display">VANIKARA Intelligence Private Limited</p>
            <p>Incorporated under the Companies Act, 2013 • CIN: U47912AP2026PTC125340</p>
            <p>© 2026 VANIKARA Intelligence Private Limited. All Rights Reserved.</p>
          </div>
          <div className="shrink-0 text-right">
            <p>
              Crafted with <span className="text-orange-500 animate-pulse">♥</span> for innovation
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

interface FooterLinkItem {
  href?: string;
  onClick?: () => void;
  label: string;
}

function FooterLinks({ links }: { links: FooterLinkItem[] }) {
  return (
    <ul className="space-y-3 list-none p-0 m-0">
      {links.map(({ href, onClick, label }) => (
        <li key={label}>
          {onClick ? (
            <button
              onClick={onClick}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:translate-x-1 inline-block transition-all duration-300 bg-transparent border-none p-0 text-left outline-none cursor-pointer"
            >
              {label}
            </button>
          ) : (
            <Link
              href={href || "/"}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:translate-x-1 inline-block transition-all duration-300"
            >
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
