"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Clock } from "lucide-react";

export interface PublicJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  work_arrangement: string;
  description: string;
  application_deadline: string | null;
}

export default function JobBoard({
  jobs,
  initialType = "",
}: {
  jobs: PublicJob[];
  initialType?: string;
}) {
  const [department, setDepartment] = useState("All");
  const [empType, setEmpType] = useState(initialType || "All");
  const [location, setLocation] = useState("All");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.department))).sort()],
    [jobs]
  );
  const types = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.employment_type))).sort()],
    [jobs]
  );
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.location))).sort()],
    [jobs]
  );

  const filtered = useMemo(
    () =>
      jobs.filter((j) => {
        if (department !== "All" && j.department !== department) return false;
        if (empType !== "All" && j.employment_type.toLowerCase() !== empType.toLowerCase()) return false;
        if (location !== "All" && j.location !== location) return false;
        return true;
      }),
    [jobs, department, empType, location]
  );

  if (jobs.length === 0) {
    return (
      <div className="surface p-8 text-center">
        <Briefcase className="mx-auto h-8 w-8 text-fg-subtle" />
        <h3 className="mt-4 text-lg font-semibold text-fg">No open roles published right now</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-fg-muted">
          We only publish genuine open positions. Even when no specific listing is active, we welcome strong engineers, designers, and interns via the general application form below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-dept" className="block font-mono text-xs uppercase text-fg-subtle">
            Department
          </label>
          <select
            id="filter-dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="v2-input mt-1"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-type" className="block font-mono text-xs uppercase text-fg-subtle">
            Employment Type
          </label>
          <select
            id="filter-type"
            value={empType}
            onChange={(e) => setEmpType(e.target.value)}
            className="v2-input mt-1"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-loc" className="block font-mono text-xs uppercase text-fg-subtle">
            Location
          </label>
          <select
            id="filter-loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="v2-input mt-1"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface p-6 text-center text-sm text-fg-muted">
          No positions match the selected filters. Try resetting filters or submit a general application below.
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {filtered.map((job) => (
            <li key={job.id}>
              <Link
                href={`/careers/${job.slug}`}
                className="group flex flex-col gap-3 p-6 transition-colors hover:bg-surface-secondary sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-medium uppercase text-intel">{job.department}</span>
                  <h3 className="mt-1 text-lg font-semibold text-fg group-hover:text-intel">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-fg-muted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location} ({job.work_arrangement})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.employment_type}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                  View role
                  <ArrowRight className="arrow-nudge h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
