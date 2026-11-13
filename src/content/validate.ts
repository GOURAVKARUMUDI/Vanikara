/**
 * Shape-checks edited content against its default, so an admin edit can
 * never break a page or inject anything unexpected.
 *
 * Rules
 *  - Only fields that exist in the default are kept; types must match.
 *  - Arrays are checked item by item against a template built from all
 *    default items (so optional fields are allowed on every item).
 *  - Strings are trimmed, capped, and stripped of control characters.
 *  - Fields named like links must be https URLs (or site paths for hrefs);
 *    fields named like emails must be valid email addresses.
 *  - Per-group rules (read-only fields, fixed choices) come from the schema.
 *
 * Pure TypeScript — used by the API on save and by the editor before saving.
 */

export interface FieldRules {
  /** Field names whose value must stay one of the defaults' values. */
  readonly?: string[];
  /** Field name → allowed values. */
  enums?: Record<string, string[]>;
}

export class ContentValidationError extends Error {
  path: string;
  constructor(path: string, message: string) {
    super(`${path || "value"}: ${message}`);
    this.path = path;
  }
}

const MAX_STRING = 5000;
const MAX_ITEMS = 60;

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** A blank value of the same shape (used for new array items and missing fields). */
export function blankLike(template: unknown): Json {
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  if (isPlainObject(template)) {
    return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blankLike(v)]));
  }
  return null;
}

/** Template for an array's items: every key used by any default item. */
export function itemTemplate(items: unknown[]): unknown {
  if (items.length === 0) return "";
  if (!items.every(isPlainObject)) return items[0];
  const merged: Record<string, unknown> = {};
  for (const item of items as Record<string, unknown>[]) {
    for (const [k, v] of Object.entries(item)) if (!(k in merged)) merged[k] = v;
  }
  return merged;
}

/** Every value a field takes anywhere in the default (for read-only checks). */
function collectValues(source: unknown, key: string, out = new Set<string>()): Set<string> {
  if (Array.isArray(source)) source.forEach((s) => collectValues(s, key, out));
  else if (isPlainObject(source)) {
    for (const [k, v] of Object.entries(source)) {
      if (k === key && typeof v === "string") out.add(v);
      else collectValues(v, key, out);
    }
  }
  return out;
}

const URL_KEY = /(url|linkedin|href|link)$/i;
const EMAIL_KEY = /email$/i;
const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i;

function cleanString(value: string, key: string, path: string): string {
  const s = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (s.length > MAX_STRING) throw new ContentValidationError(path, `is too long (max ${MAX_STRING} characters)`);
  if (s && EMAIL_KEY.test(key) && !EMAIL.test(s)) throw new ContentValidationError(path, "must be a valid email address");
  if (s && URL_KEY.test(key)) {
    const isSitePath = /^\/(?!\/)[\w\-./#?=&%]*$/.test(s);
    let isHttps = false;
    try {
      isHttps = new URL(s).protocol === "https:";
    } catch {
      isHttps = false;
    }
    if (!isHttps && !(key.toLowerCase().endsWith("href") && isSitePath)) {
      throw new ContentValidationError(path, "must be a full https:// link");
    }
  }
  return s;
}

/**
 * Returns a cleaned copy of `value` shaped like `template`, or throws a
 * ContentValidationError naming the first problem.
 */
export function sanitizeContent(template: unknown, value: unknown, rules: FieldRules = {}, root: unknown = template, path = "", key = ""): Json {
  if (typeof template === "string") {
    if (typeof value !== "string") throw new ContentValidationError(path, "must be text");
    const s = cleanString(value, key, path);
    const allowed = rules.enums?.[key];
    if (allowed && !allowed.includes(s)) throw new ContentValidationError(path, `must be one of: ${allowed.join(", ")}`);
    if (rules.readonly?.includes(key)) {
      const options = collectValues(root, key);
      if (options.size && !options.has(s)) throw new ContentValidationError(path, "cannot be changed");
    }
    return s;
  }
  if (typeof template === "number") {
    const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
    if (typeof n !== "number" || !Number.isFinite(n)) throw new ContentValidationError(path, "must be a number");
    if (n < 0 || n > 1e9) throw new ContentValidationError(path, "is out of range");
    return n;
  }
  if (typeof template === "boolean") {
    if (typeof value !== "boolean") throw new ContentValidationError(path, "must be on or off");
    return value;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) throw new ContentValidationError(path, "must be a list");
    if (value.length > MAX_ITEMS) throw new ContentValidationError(path, `has too many items (max ${MAX_ITEMS})`);
    const tpl = itemTemplate(template);
    return value.map((item, i) => sanitizeContent(tpl, item, rules, root, `${path}[${i + 1}]`, key));
  }
  if (isPlainObject(template)) {
    if (!isPlainObject(value)) throw new ContentValidationError(path, "must be a group of fields");
    const out: Record<string, Json> = {};
    for (const [k, tplValue] of Object.entries(template)) {
      const next = path ? `${path}.${k}` : k;
      out[k] = k in value ? sanitizeContent(tplValue, value[k], rules, root, next, k) : blankLike(tplValue);
    }
    return out;
  }
  return null;
}
