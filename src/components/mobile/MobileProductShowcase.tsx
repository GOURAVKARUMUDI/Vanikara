"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface ProductShowcaseItem {
  title: string;
  category: string;
  desc: string;
  features: string[];
  tech: string[];
  availability: string;
  mockupUrl?: string;
  icon: React.ReactNode;
  exploreHref: string;
}

interface MobileProductShowcaseProps {
  products: ProductShowcaseItem[];
}

export default function MobileProductShowcase({ products }: MobileProductShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPos = target.scrollLeft;
    const itemWidth = target.clientWidth;
    const index = Math.round(scrollPos / itemWidth);
    if (index !== activeIndex && index >= 0 && index < products.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Horizontal Swipe Carousel Wrapper */}
      <div
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 select-none scrollbar-none px-1"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((prod, _idx) => (
          <div
            key={prod.title}
            className="w-full shrink-0 snap-center border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md rounded-3xl p-6 shadow-md flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Atmospheric light bubble */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 blur-[35px] rounded-full pointer-events-none -mr-10 -mt-10" />

            {/* Category and Header */}
            <div className="space-y-1">
              <span className="block text-[8px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                {prod.category}
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-500/5 rounded-lg shrink-0">
                  {prod.icon}
                </div>
                <h3 className="font-display font-black text-base text-[var(--text-primary)]">
                  {prod.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">
              {prod.desc}
            </p>

            {/* Feature points */}
            <div className="space-y-1.5 border-l border-[var(--glass-border)] pl-3 my-1">
              {prod.features.slice(0, 2).map((feat, fIdx) => (
                <div key={fIdx} className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>

            {/* Tech tag list */}
            <div className="flex flex-wrap gap-1.5 my-1">
              {prod.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[8px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-500/5 border border-[var(--glass-border)] text-[var(--text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Render Mockup/Visual Representation inside Card */}
            <div className="mt-2 w-full">
              {prod.mockupUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-1.5 shadow-sm w-full max-w-full">
                  <Image
                    src={prod.mockupUrl}
                    alt={`${prod.title} Mockup`}
                    width={500}
                    height={380}
                    className="w-full h-[120px] rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[120px] rounded-xl border border-white/5 bg-[#070b16] p-3 shadow-sm relative overflow-hidden flex flex-col justify-between font-mono text-[9px] text-indigo-400 select-none">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
                  <div className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                    </span>
                    <span className="text-[7px] text-slate-600 uppercase tracking-wider">cygma-node</span>
                  </div>
                  <div className="space-y-1 py-1 flex-grow text-[8px] leading-tight">
                    <p className="text-slate-600">&gt; fetch(&quot;/api/ai/stream&quot;)</p>
                    <p className="text-emerald-500">✔ Connected to gateway</p>
                    <p className="text-indigo-300">&gt; Stream chunk index: #0492</p>
                  </div>
                </div>
              )}
            </div>

            {/* Link button & Status indicator */}
            <div className="pt-2 flex justify-between items-center mt-auto border-t border-[var(--glass-border)]">
              <Link
                href={prod.exploreHref}
                className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/95 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-sm"
              >
                Explore <Play className="w-2.5 h-2.5 fill-current" />
              </Link>
              <div className="text-[8px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                {prod.availability.replace(" Sandbox Mode Active", "")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-1.5">
        {products.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === idx ? "w-4 bg-[var(--accent-color)]" : "w-1.5 bg-slate-500/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
