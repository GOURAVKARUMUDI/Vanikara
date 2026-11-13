"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Check, ChevronDown, ExternalLink, Plus, RotateCcw, Save, Trash2, Undo2 } from "lucide-react";
import type { ContentGroup } from "@/content/schema";
import { ContentValidationError, blankLike, itemTemplate, sanitizeContent, type FieldRules } from "@/content/validate";

/* ------------------------------------------------------------------ */
/* Types and helpers                                                   */
/* ------------------------------------------------------------------ */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Obj = { [key: string]: Json };

interface EditorData {
  groups: ContentGroup[];
  defaults: Record<string, Json>;
  current: Record<string, Json>;
  overrides: Record<string, { updatedAt: string | null; updatedBy: string | null }>;
  storeReady: boolean;
}

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

const LABELS: Record<string, string> = {
  cin: "CIN",
  siteUrl: "Website address",
  officialEmail: "General email",
  supportEmail: "Support email",
  linkedin: "LinkedIn link",
  href: "Link",
  desc: "Description",
  fullName: "Registered name",
  publicName: "Public name",
  isFounder: "Founder",
  isDirector: "Director",
  isTarget: "Is target (planned)",
  nameNote: "Name note",
};

function labelFor(key: string) {
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const LONG_KEY = /(desc|description|summary|bio|statement|body|lead|paragraph|note|text|mission|heading|tagline)/i;

function isLongText(key: string, sample: Json) {
  return LONG_KEY.test(key) || (typeof sample === "string" && (sample.length > 70 || sample.includes("\n")));
}

function itemTitle(item: Json, index: number) {
  if (isObj(item)) {
    for (const k of ["title", "publicName", "name", "label", "date"]) {
      if (typeof item[k] === "string" && item[k]) return item[k] as string;
    }
  }
  if (typeof item === "string" && item) return item.length > 60 ? `${item.slice(0, 60)}…` : item;
  return `Item ${index + 1}`;
}

function newId(base: string) {
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `${slug || "item"}-${Date.now().toString(36)}`;
}

const inputClass =
  "w-full rounded-compact border border-line-strong bg-surface-raised/80 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15 disabled:opacity-60";

/* ------------------------------------------------------------------ */
/* Field renderers                                                     */
/* ------------------------------------------------------------------ */

interface FieldProps {
  name: string;
  value: Json;
  template: Json;
  onChange: (next: Json) => void;
  rules: FieldRules & { hidden?: string[] };
  path: string;
  error?: string | null;
}

function Field({ name, value, template, onChange, rules, path, error }: FieldProps) {
  const id = `field-${path.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const label = labelFor(name);
  const isError = error != null && (error.startsWith(path + ":") || error.startsWith(path + " "));

  if (Array.isArray(template)) {
    return <ListField name={name} value={Array.isArray(value) ? value : []} template={template} onChange={onChange} rules={rules} path={path} error={error} />;
  }

  if (isObj(template)) {
    const v = isObj(value) ? value : (blankLike(template) as Obj);
    return (
      <fieldset className="space-y-4 rounded-card border border-line p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</legend>
        <ObjectFields value={v} template={template} onChange={onChange} rules={rules} path={path} error={error} />
      </fieldset>
    );
  }

  if (typeof template === "boolean") {
    return (
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-compact border border-line px-3 py-2.5">
        <span className="text-sm font-medium text-fg">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value === true}
          onClick={() => onChange(!(value === true))}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value === true ? "bg-action" : "bg-surface-sunken ring-1 ring-inset ring-[var(--border-strong)]"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value === true ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </button>
      </label>
    );
  }

  const readonly = rules.readonly?.includes(name);
  const options = rules.enums?.[name];
  const common = {
    id,
    "aria-invalid": isError || undefined,
    className: `${inputClass} ${isError ? "border-brand-red focus:border-brand-red focus:ring-brand-red/15" : ""}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-fg-muted">
        {label}
        {readonly && <span className="ml-1.5 font-normal text-fg-subtle">(fixed)</span>}
      </label>
      {typeof template === "number" ? (
        <input {...common} type="number" min={0} step="any" value={typeof value === "number" ? value : 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
      ) : options ? (
        <select {...common} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : isLongText(name, template) ? (
        <textarea {...common} rows={String(value ?? "").length > 220 ? 5 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} disabled={readonly} />
      ) : (
        <input {...common} type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} disabled={readonly} />
      )}
      {isError && <p className="mt-1 text-xs font-medium text-brand-red dark:text-ambition">{error!.slice(path.length + 1).trim()}</p>}
    </div>
  );
}

function ObjectFields({ value, template, onChange, rules, path, error }: Omit<FieldProps, "name" | "value" | "template"> & { value: Obj; template: Obj }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.keys(template)
        .filter((k) => !rules.hidden?.includes(k))
        .map((k) => {
          const t = template[k];
          const wide = Array.isArray(t) || isObj(t) || (typeof t === "string" && isLongText(k, t));
          return (
            <div key={k} className={wide ? "sm:col-span-2" : ""}>
              <Field
                name={k}
                value={value[k] ?? blankLike(t)}
                template={t}
                onChange={(next) => onChange({ ...value, [k]: next })}
                rules={rules}
                path={path ? `${path}.${k}` : k}
                error={error}
              />
            </div>
          );
        })}
    </div>
  );
}

function ListField({ name, value, template, onChange, rules, path, error }: Omit<FieldProps, "value" | "template"> & { value: Json[]; template: Json[] }) {
  const tpl = itemTemplate(template) as Json;
  const [open, setOpen] = useState<number | null>(null);
  const objects = isObj(tpl);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    if (open === from) setOpen(to);
  };

  const add = () => {
    const fresh = blankLike(tpl);
    if (isObj(fresh) && "id" in fresh) fresh.id = newId(name);
    onChange([...value, fresh]);
    setOpen(value.length);
  };

  const remove = (i: number) => {
    if (!confirm(`Remove “${itemTitle(value[i], i)}”?`)) return;
    onChange(value.filter((_, j) => j !== i));
    setOpen(null);
  };

  const controls = (i: number) => (
    <div className="flex shrink-0 items-center gap-0.5">
      <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up" className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface-sunken hover:text-fg disabled:opacity-30">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Move down" className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface-sunken hover:text-fg disabled:opacity-30">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => remove(i)} aria-label="Remove" className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-brand-red/10 hover:text-brand-red">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-fg-muted">
        {labelFor(name)} <span className="font-normal text-fg-subtle">({value.length})</span>
      </p>
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="rounded-card border border-line bg-surface-sunken/30">
            {objects ? (
              <>
                <div className="flex items-center gap-2 pl-3 pr-1.5">
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className="flex min-w-0 flex-1 items-center gap-2 py-2.5 text-left text-sm font-semibold text-fg"
                  >
                    <ChevronDown className={`h-4 w-4 shrink-0 text-fg-subtle transition-transform ${open === i ? "rotate-180" : ""}`} />
                    <span className="truncate">{itemTitle(item, i)}</span>
                  </button>
                  {controls(i)}
                </div>
                {open === i && (
                  <div className="border-t border-line p-3">
                    <ObjectFields
                      value={isObj(item) ? item : (blankLike(tpl) as Obj)}
                      template={tpl as Obj}
                      onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))}
                      rules={rules}
                      path={`${path}[${i + 1}]`}
                      error={error}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-start gap-2 p-1.5 pl-2">
                <div className="min-w-0 flex-1">
                  <Field name={name} value={item} template={tpl} onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))} rules={rules} path={`${path}[${i + 1}]`} error={error} />
                </div>
                <div className="pt-6">{controls(i)}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button type="button" onClick={add} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-intel hover:text-intel">
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

/**
 * Website content editor. Every field of every content group gets an edit
 * box; saving publishes the change to the live website immediately.
 */
export default function ContentEditor() {
  const [data, setData] = useState<EditorData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [active, setActive] = useState<string>("identity");
  const [drafts, setDrafts] = useState<Record<string, Json>>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error || "Failed to load");
      setData(body.data);
      setLoadError("");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load content");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirtyKeys = useMemo(
    () => (data ? Object.keys(drafts).filter((k) => JSON.stringify(drafts[k]) !== JSON.stringify(data.current[k])) : []),
    [drafts, data]
  );

  // Warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirtyKeys.length) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirtyKeys.length]);

  if (loadError) {
    return (
      <div className="surface rounded-panel p-8 text-center text-sm text-fg-muted">
        Couldn&apos;t load website content: {loadError}{" "}
        <button type="button" onClick={load} className="font-semibold text-intel">
          Try again
        </button>
      </div>
    );
  }
  if (!data) return <div className="surface rounded-panel p-12 text-center text-sm text-fg-subtle">Loading website content…</div>;

  const group = data.groups.find((g) => g.key === active) ?? data.groups[0];
  const value = drafts[group.key] ?? data.current[group.key];
  const isDirty = dirtyKeys.includes(group.key);
  const override = data.overrides[group.key];

  const change = (next: Json) => {
    setDrafts((d) => ({ ...d, [group.key]: next }));
    setStatus(null);
    setError(null);
  };

  const save = async () => {
    // Same checks as the server, so problems show next to the field
    try {
      sanitizeContent(data.defaults[group.key], value, group);
    } catch (e) {
      if (e instanceof ContentValidationError) {
        setError(e.message);
        setStatus({ kind: "err", text: `Fix this before saving — ${e.message}` });
        return;
      }
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: group.key, value }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) throw new Error(body?.error || "Could not save");
      setData((d) => (d ? { ...d, current: { ...d.current, [group.key]: body.data }, overrides: { ...d.overrides, [group.key]: { updatedAt: new Date().toISOString(), updatedBy: "you" } } } : d));
      setDrafts((d) => {
        const { [group.key]: _, ...rest } = d;
        return rest;
      });
      setStatus({ kind: "ok", text: "Saved — the website is updated." });
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : "Could not save" });
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    setDrafts((d) => {
      const { [group.key]: _, ...rest } = d;
      return rest;
    });
    setError(null);
    setStatus(null);
  };

  const reset = async () => {
    if (!confirm(`Restore “${group.title}” to the original content? Your edits to this section will be removed from the website.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/content?key=${encodeURIComponent(group.key)}`, { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) throw new Error(body?.error || "Could not reset");
      setData((d) => {
        if (!d) return d;
        const { [group.key]: _, ...overrides } = d.overrides;
        return { ...d, current: { ...d.current, [group.key]: body.data }, overrides };
      });
      discard();
      setStatus({ kind: "ok", text: "Restored to the original content." });
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : "Could not reset" });
    } finally {
      setBusy(false);
    }
  };

  const template = data.defaults[group.key];

  return (
    <div className="space-y-6">
      {!data.storeReady && (
        <div role="alert" className="flex items-start gap-3 rounded-card border border-brand-orange/30 bg-brand-orange/10 p-4 text-sm text-fg">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ambition" />
          <p>
            <strong>Saving is not available right now.</strong> The content store can&apos;t be read — either the Supabase project is paused or
            unreachable (restore it from the Supabase dashboard), or the content table hasn&apos;t been created yet (run{" "}
            <code className="text-xs">supabase/setup_new_project.sql</code> in the SQL Editor). Reload this page afterwards. The website shows its
            built-in content in the meantime.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        {/* Group list */}
        <nav aria-label="Content sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {data.groups.map((g) => (
              <li key={g.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActive(g.key);
                    setError(null);
                    setStatus(null);
                  }}
                  aria-current={g.key === group.key ? "page" : undefined}
                  className={`flex w-full items-center justify-between gap-3 rounded-compact px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    g.key === group.key ? "bg-action text-white" : "text-fg-muted hover:bg-surface-sunken/70 hover:text-fg"
                  }`}
                >
                  <span className="whitespace-nowrap">{g.title}</span>
                  {dirtyKeys.includes(g.key) ? (
                    <span className="h-2 w-2 rounded-full bg-brand-orange" aria-label="Unsaved changes" />
                  ) : data.overrides[g.key] ? (
                    <span className={`text-[0.625rem] font-semibold uppercase tracking-wider ${g.key === group.key ? "text-white/80" : "text-intel"}`}>Edited</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Form */}
        <section aria-labelledby="content-group-title" className="surface rounded-panel">
          <header className="border-b border-line p-5 sm:p-6">
            <h2 id="content-group-title" className="text-lg font-bold text-fg">
              {group.title}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">{group.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
              <span>Appears on:</span>
              {group.pages.map((p) => (
                <a key={p} href={p} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-intel hover:underline">
                  {p === "/" ? "Home" : p}
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                </a>
              ))}
              {override?.updatedAt && (
                <span className="ml-auto">
                  Last edited {new Date(override.updatedAt).toLocaleString()} {override.updatedBy ? `by ${override.updatedBy}` : ""}
                </span>
              )}
            </div>
          </header>

          <div className="p-5 sm:p-6">
            {isObj(template) ? (
              <ObjectFields value={isObj(value) ? value : {}} template={template} onChange={change} rules={group} path="" error={error} />
            ) : (
              <Field name={group.key} value={value} template={template} onChange={change} rules={group} path="" error={error} />
            )}
          </div>

          <footer className="sticky bottom-0 flex flex-wrap items-center gap-2 rounded-b-panel border-t border-line bg-[var(--glass-bg-strong)] p-4 backdrop-blur-xl sm:px-6">
            <button type="button" onClick={save} disabled={!isDirty || busy || !data.storeReady} className="btn btn-primary btn-md">
              <Save aria-hidden="true" className="h-4 w-4" />
              {busy ? "Saving…" : "Save & publish"}
            </button>
            <button type="button" onClick={discard} disabled={!isDirty || busy} className="btn btn-ghost btn-md">
              <Undo2 aria-hidden="true" className="h-4 w-4" />
              Discard changes
            </button>
            <button type="button" onClick={reset} disabled={!override || busy} className="btn btn-ghost btn-md ml-auto text-fg-muted">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Restore original
            </button>
            {status && (
              <p
                role={status.kind === "err" ? "alert" : "status"}
                className={`flex w-full items-center gap-1.5 text-sm font-medium ${status.kind === "ok" ? "text-intel" : "text-brand-red dark:text-ambition"}`}
              >
                {status.kind === "ok" ? <Check aria-hidden="true" className="h-4 w-4" /> : <AlertTriangle aria-hidden="true" className="h-4 w-4" />}
                {status.text}
              </p>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}
