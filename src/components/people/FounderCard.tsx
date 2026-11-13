import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Founder } from "@/data/company";
import { GRIEVANCE_OFFICER } from "@/data/legal";
import { SYMBOL_SRC } from "@/components/brand/BrandMark";

interface FounderCardProps {
  person: Founder;
  index: number;
}

/** "KARUMUDI GOURAV" → "Karumudi Gourav" */
function titleCase(name: string) {
  return name.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/** True when the registered name is just the public name in a different order or case. */
function sameName(a: string, b: string) {
  const words = (s: string) => s.toLowerCase().split(/\s+/).filter(Boolean).sort().join(" ");
  return words(a) === words(b);
}

/**
 * Founder / leadership card with everything the company records about the
 * person: public and registered name, title, founder and director status,
 * areas of responsibility, a short bio and LinkedIn. Initials stand in for
 * photographs until real portraits are available — no stock or generated faces.
 */
export default function FounderCard({ person, index }: FounderCardProps) {
  const tone = index % 2 === 0 ? "warm" : "cool";
  const isGrievanceOfficer = sameName(person.publicName, GRIEVANCE_OFFICER.name);
  const focus = [...person.responsibilities, ...(isGrievanceOfficer ? ["Grievance Officer"] : [])];
  const showRegisteredName = !sameName(person.fullName, person.publicName);

  const badges = [person.isFounder && "Founder", person.isDirector && "Director"].filter(Boolean) as string[];

  return (
    <article
      data-reveal
      data-tone={tone}
      data-tier="secondary"
      data-tilt
      style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
      className="card-interactive surface flex h-full flex-col overflow-hidden rounded-feature"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface-sunken sm:aspect-[5/4]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              tone === "warm"
                ? "radial-gradient(80% 70% at 20% 100%, var(--glow-orange), transparent 70%)"
                : "radial-gradient(80% 70% at 80% 100%, var(--glow-blue), transparent 70%)",
          }}
        />
        <Image
          src={SYMBOL_SRC}
          alt=""
          aria-hidden="true"
          width={220}
          height={180}
          sizes="220px"
          className="pointer-events-none absolute -bottom-10 -right-10 w-[62%] select-none opacity-[0.07] dark:opacity-[0.1]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-6 text-[3.25rem] font-extrabold leading-none tracking-tight text-fg/85"
        >
          {person.initials}
        </span>
        {badges.length > 0 && (
          <div className="absolute right-5 top-5 flex gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-line bg-surface-raised/70 px-2.5 py-1 text-[0.6875rem] font-semibold text-fg-muted backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-fg">{person.publicName}</h3>
        <p className={`mt-1 text-sm font-semibold ${tone === "warm" ? "text-ambition" : "text-intel"}`}>
          {person.designation}
        </p>
        {showRegisteredName && (
          <p className="mt-1 text-xs text-fg-subtle">
            Registered name: <span className="font-medium text-fg-muted">{titleCase(person.fullName)}</span>
          </p>
        )}

        <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">{person.bio}</p>

        {focus.length > 0 && (
          <div className="mt-5">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-fg-subtle">Responsible for</p>
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${person.publicName}'s responsibilities`}>
              {focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-surface-sunken/60 px-2.5 py-1 text-xs font-medium text-fg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
            aria-label={`${person.publicName} on LinkedIn (opens in a new tab)`}
          >
            <span className="link-underline">LinkedIn</span>
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </article>
  );
}
