import Image from "next/image";
import { SYMBOL_HEIGHT, SYMBOL_SRC, SYMBOL_WIDTH } from "./BrandMark";

const TICKS = Array.from({ length: 72 }, (_, i) => i);

/**
 * Hero visual: the VANIKARA symbol presented in an engineered light
 * environment. The symbol itself is never redrawn, rotated or recoloured —
 * only the light around it moves.
 *
 * - Entrance: opacity/scale/blur settle (CSS), then one light sweep that is
 *   masked to the symbol's own shape.
 * - Hover: a soft light follows the pointer (`data-light`, see Enhancements).
 * - The outer dial turns very slowly; it stops for reduced-motion users.
 */
export default function BrandStage({ className = "" }: { className?: string }) {
  return (
    <div
      data-light
      className={`group/stage relative isolate mx-auto aspect-square w-full max-w-[560px] ${className}`}
    >
      {/* Warm and cool light fields, matching each wing */}
      <div
        aria-hidden="true"
        className="absolute inset-[6%] -z-10 rounded-full opacity-90"
        style={{
          background:
            "radial-gradient(closest-side at 30% 52%, color-mix(in oklab, var(--vanikara-bright-orange) 30%, transparent), transparent 100%), radial-gradient(closest-side at 70% 46%, color-mix(in oklab, var(--vanikara-blue) 34%, transparent), transparent 100%)",
        }}
      />

      {/* Precision dial */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full text-fg"
        fill="none"
      >
        <defs>
          <linearGradient id="stage-arc-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-gold)" }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-orange)" }} />
          </linearGradient>
          <linearGradient id="stage-arc-cool" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--vanikara-cyan)" }} />
            <stop offset="100%" style={{ stopColor: "var(--vanikara-blue)" }} />
          </linearGradient>
          <radialGradient id="stage-fade" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="stage-mask">
            <rect width="400" height="400" fill="url(#stage-fade)" />
          </mask>
        </defs>

        <g mask="url(#stage-mask)">
          <g className="origin-center animate-[spin_180s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "fill-box" }}>
            {TICKS.map((i) => (
              <line
                key={i}
                x1="200"
                y1="14"
                x2="200"
                y2={i % 6 === 0 ? 24 : 19}
                stroke="currentColor"
                strokeOpacity={i % 6 === 0 ? 0.22 : 0.1}
                strokeWidth="1"
                transform={`rotate(${i * 5} 200 200)`}
              />
            ))}
          </g>
          <circle cx="200" cy="200" r="162" stroke="currentColor" strokeOpacity="0.08" />
          <circle cx="200" cy="200" r="124" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="2 6" />
          {/* Two short arcs — one per wing */}
          <path d="M 64 262 A 150 150 0 0 1 132 70" stroke="url(#stage-arc-warm)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M 336 262 A 150 150 0 0 0 268 70" stroke="url(#stage-arc-cool)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>

      {/* Pointer light (fine pointers only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-700 group-hover/stage:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 40%), color-mix(in oklab, var(--vanikara-white) 16%, transparent), transparent 70%)",
        }}
      />

      {/* Symbol + reflection */}
      <div className="absolute inset-x-[19%] top-[27%]">
        <div className="symbol-enter relative" style={{ aspectRatio: `${SYMBOL_WIDTH} / ${SYMBOL_HEIGHT}` }}>
          <Image
            src={SYMBOL_SRC}
            alt="The VANIKARA symbol"
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 340px, 62vw"
            className="object-contain drop-shadow-[0_18px_40px_rgba(7,26,61,0.18)] dark:drop-shadow-[0_18px_48px_rgba(0,110,255,0.25)]"
          />
          <div aria-hidden="true" className="symbol-sweep" />
        </div>

        {/* Floor reflection: a faded mirror of the same asset */}
        <div
          aria-hidden="true"
          className="symbol-enter relative mt-2 -scale-y-100 opacity-[0.1] dark:opacity-[0.16]"
          style={{
            aspectRatio: `${SYMBOL_WIDTH} / ${SYMBOL_HEIGHT}`,
            WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 38%)",
            maskImage: "linear-gradient(to top, #000 0%, transparent 38%)",
            ["--symbol-delay" as string]: "300ms",
          }}
        >
          <Image src={SYMBOL_SRC} alt="" fill loading="eager" sizes="(min-width: 1024px) 340px, 62vw" className="object-contain blur-[1.5px]" />
        </div>
      </div>

      {/* Contact shadow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[74%] h-6 w-[46%] -translate-x-1/2 rounded-[50%] bg-navy/20 blur-xl dark:bg-black/60"
      />
    </div>
  );
}
