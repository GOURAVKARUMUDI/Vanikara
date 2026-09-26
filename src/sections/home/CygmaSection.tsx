import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INITIATIVES } from "@/data/company";

/**
 * CYGMA — an atmospheric, always-dark band so the section reads as a
 * distinct chapter in both themes.
 */
export default function CygmaSection() {
  const { cygma } = INITIATIVES;

  return (
    <section aria-labelledby="cygma-title" className="relative py-12 sm:py-16">
      <div className="container-page">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-panel border border-white/10 bg-navy px-6 py-16 text-white shadow-float sm:px-12 sm:py-20 lg:px-16 lg:py-24 dark:bg-surface-raised"
        >
          {/* Cool light field */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 70% at 85% 10%, color-mix(in oklab, var(--vanikara-blue) 45%, transparent), transparent 70%), radial-gradient(40% 50% at 100% 100%, color-mix(in oklab, var(--vanikara-cyan) 22%, transparent), transparent 70%), radial-gradient(50% 60% at 0% 100%, color-mix(in oklab, var(--vanikara-deep-blue) 70%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 80% 20%, #000, transparent 75%)",
              maskImage: "radial-gradient(ellipse 60% 70% at 80% 20%, #000, transparent 75%)",
            }}
          />

          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-white/70">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_0_4px_rgba(0,207,255,0.18)]" />
                {cygma.index} · {cygma.status}
              </p>
              <h2 id="cygma-title" className="text-headline mt-5">
                {cygma.title}
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">{cygma.summary}</p>

              <ul className="mt-8 space-y-2.5 text-[0.9375rem] text-white/70">
                {cygma.clarifications.map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-4 bg-brand-cyan/70" />
                    {line}
                  </li>
                ))}
              </ul>

              <Link
                href="/cygma"
                className="group mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-brand-cyan"
              >
                <span className="link-underline">The CYGMA initiative</span>
                <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
              </Link>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <p className="text-[0.8125rem] font-semibold text-white/60">Intended to develop intelligence around</p>
              <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
                {cygma.directions.map((direction, i) => (
                  <li
                    key={direction.title}
                    data-reveal
                    style={{ ["--reveal-delay" as string]: `${120 + i * 80}ms` }}
                    className="grid grid-cols-[2.5rem_1fr] gap-2 py-5"
                  >
                    <span className="text-sm font-semibold tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold">{direction.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">{direction.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-white/50">{cygma.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
