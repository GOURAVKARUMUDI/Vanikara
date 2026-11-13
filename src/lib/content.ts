import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { supabaseService } from "@/utils/supabase/service";
import { CONTENT_DEFAULTS, CONTENT_KEYS, type ContentKey, type SiteContent } from "@/content/defaults";
import { GROUP_BY_KEY } from "@/content/schema";
import { sanitizeContent } from "@/content/validate";
import { logError } from "@/lib/security";

/**
 * Website content: defaults from src/content/defaults.ts, overridden by
 * whatever admins have saved in the `site_content` table.
 *
 * Reads are cached under the "site-content" tag, so pages stay fast and
 * static. Saving clears the tag and the page cache, so the next visitor
 * sees the change straight away.
 */

export const CONTENT_TAG = "site-content";
const TABLE = "site_content";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Saved values replace defaults field by field; lists are replaced whole. */
function deepMerge(base: unknown, override: unknown): unknown {
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(override)) if (k in base) out[k] = deepMerge(base[k], v);
    return out;
  }
  return override === undefined ? base : override;
}

/** Validate a saved group against its default; returns the cleaned value. */
export function cleanGroup(key: ContentKey, value: unknown) {
  const base = CONTENT_DEFAULTS[key];
  return sanitizeContent(base, deepMerge(base, value), GROUP_BY_KEY[key]);
}

interface Row {
  key: string;
  value: unknown;
  updated_at: string | null;
  updated_by: string | null;
}

export interface ContentState {
  content: SiteContent;
  /** Groups that have saved overrides, with when and by whom. */
  overrides: Partial<Record<ContentKey, { updatedAt: string | null; updatedBy: string | null }>>;
  /** False when the table is missing or the database is unreachable. */
  storeReady: boolean;
}

async function loadState(): Promise<ContentState> {
  const content = { ...CONTENT_DEFAULTS } as Record<ContentKey, unknown>;
  const overrides: ContentState["overrides"] = {};
  try {
    const { data, error } = await supabaseService.from(TABLE).select("key, value, updated_at, updated_by");
    if (error) throw error;
    for (const row of (data ?? []) as Row[]) {
      if (!CONTENT_KEYS.includes(row.key as ContentKey)) continue;
      const key = row.key as ContentKey;
      try {
        content[key] = cleanGroup(key, row.value);
        overrides[key] = { updatedAt: row.updated_at, updatedBy: row.updated_by };
      } catch (err) {
        // A stored value that no longer fits the defaults is ignored, never rendered.
        logError(`Site content: ignoring invalid "${key}"`, err);
      }
    }
    return { content: content as SiteContent, overrides, storeReady: true };
  } catch (err) {
    logError("Site content: using defaults", err);
    return { content: CONTENT_DEFAULTS, overrides: {}, storeReady: false };
  }
}

// Saves publish instantly (see publish()); the 10-minute refresh is a safety
// net so the site recovers by itself if the database was briefly unreachable.
const cachedState = unstable_cache(loadState, ["site-content-v1"], { tags: [CONTENT_TAG], revalidate: 600 });

/** Website content for rendering (cached). */
export async function getSiteContent(): Promise<SiteContent> {
  return (await cachedState()).content;
}

/** Full state for the admin editor — always read fresh. */
export async function getContentStateFresh(): Promise<ContentState> {
  return loadState();
}

function publish() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

export async function saveContentGroup(key: ContentKey, value: unknown, admin: string) {
  const clean = cleanGroup(key, value);
  const { error } = await supabaseService
    .from(TABLE)
    .upsert({ key, value: clean, updated_at: new Date().toISOString(), updated_by: admin }, { onConflict: "key" });
  if (error) throw error;
  publish();
  return clean;
}

export async function resetContentGroup(key: ContentKey) {
  const { error } = await supabaseService.from(TABLE).delete().eq("key", key);
  if (error) throw error;
  publish();
}
