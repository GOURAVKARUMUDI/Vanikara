/**
 * Rate limiting with named buckets, so each endpoint gets a budget that
 * fits it (a login attempt is not a page of consent clicks).
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set — shared
 * across every serverless instance — and falls back to a per-instance
 * in-memory sliding window otherwise. The memory store is capped so a
 * flood of unique IPs cannot exhaust memory.
 */

interface Bucket {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}

export const RATE_LIMITS = {
  /** Default: any public endpoint without a specific budget. */
  default: { limit: 30, windowSec: 60 },
  /** Admin sign-in, per IP and (separately) per username. */
  login: { limit: 10, windowSec: 15 * 60 },
  loginUser: { limit: 20, windowSec: 15 * 60 },
  /** Google sign-in exchanges (token verification + user record write). */
  userAuth: { limit: 20, windowSec: 10 * 60 },
  /** Contact form: sends email and writes to the CRM. */
  contact: { limit: 5, windowSec: 10 * 60 },
  /** Job applications: file upload + two emails. */
  careers: { limit: 3, windowSec: 60 * 60 },
  /** Cookie consent choices. */
  consent: { limit: 20, windowSec: 10 * 60 },
  /** Client error reports. */
  logs: { limit: 20, windowSec: 60 },
} satisfies Record<string, Bucket>;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

const MAX_TRACKED_KEYS = 10_000;
const memory = new Map<string, number[]>();

function memoryCheck(key: string, { limit, windowSec }: Bucket) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    memory.set(key, recent);
    return { limited: true, remaining: 0, reset: recent[0] + windowMs };
  }

  recent.push(now);
  // Map preserves insertion order: re-insert to mark as recent, evict the oldest when full
  memory.delete(key);
  memory.set(key, recent);
  if (memory.size > MAX_TRACKED_KEYS) {
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
  return { limited: false, remaining: limit - recent.length, reset: recent[0] + windowMs };
}

/**
 * Checks (and counts) one request against a bucket for an identifier —
 * usually the client IP from `clientIp(req)`.
 */
export async function isRateLimited(
  identifier: string,
  bucketName: RateLimitBucket = "default"
): Promise<{ limited: boolean; remaining: number; reset: number }> {
  const bucket = RATE_LIMITS[bucketName];
  const key = `ratelimit:${bucketName}:${identifier}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      // INCR + EXPIRE (only when the key is new) in one round trip
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, String(bucket.windowSec), "NX"],
          ["TTL", key],
        ]),
        cache: "no-store",
      });
      if (res.ok) {
        const [incr, , ttl] = (await res.json()) as { result: number }[];
        const count = Number(incr?.result) || 0;
        const seconds = Number(ttl?.result) > 0 ? Number(ttl.result) : bucket.windowSec;
        return {
          limited: count > bucket.limit,
          remaining: Math.max(0, bucket.limit - count),
          reset: Date.now() + seconds * 1000,
        };
      }
    } catch (err) {
      console.warn("Upstash Redis unavailable, using in-memory rate limiting:", err);
    }
  }

  return memoryCheck(key, bucket);
}

/**
 * The client's IP. On Vercel, `x-real-ip` and the first `x-forwarded-for`
 * entry are set by the platform (not the client), so they are trustworthy
 * there. Elsewhere they fall back to a shared "unknown" bucket.
 */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

/** Standard 429 headers for a limited response. */
export function retryAfterHeaders(reset: number): Record<string, string> {
  return { "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) };
}
