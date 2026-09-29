/**
 * Signed session tokens — Web Crypto only, so the same code runs in the
 * proxy, route handlers and server components.
 *
 * Two independent kinds:
 *   admin — the fixed admin accounts (cookie vk_admin). Grants the admin console.
 *   user  — visitors who signed in with Google (cookie vk_user). Grants
 *           nothing beyond being recognised: the site is the same for them.
 *
 * Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256).
 * Each kind is signed with its own key derived from ADMIN_SESSION_SECRET
 * and carries its kind in the payload, so a user token can never be
 * accepted as an admin token (or the reverse). Without the secret no
 * session can be issued or verified: access fails closed.
 */

export const ADMIN_COOKIE = "vk_admin";
export const USER_COOKIE = "vk_user";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // admins: 8 hours
export const USER_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // users: 7 days

type Kind = "admin" | "user";

export interface AdminSession {
  t: "admin";
  /** Admin username (lowercase). */
  u: string;
  /** Issued at / expires at, in seconds since epoch. */
  iat: number;
  exp: number;
}

export interface UserSession {
  t: "user";
  /** Firebase user id. */
  u: string;
  email: string;
  name: string;
  picture: string | null;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && value.length >= 32 ? value : null;
}

async function hmacKey(value: string, kind: Kind) {
  return crypto.subtle.importKey("raw", encoder.encode(`${value}:${kind}-session`), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

async function sign(kind: Kind, payload: object): Promise<string | null> {
  const key = secret();
  if (!key) return null;
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(key, kind), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

async function verify<T extends { t: Kind; u: string; exp: number }>(kind: Kind, token: string | undefined | null): Promise<T | null> {
  const key = secret();
  if (!key || !token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  try {
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(key, kind), fromBase64Url(signature), encoder.encode(body));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as T;
    if (payload.t !== kind || typeof payload.u !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ---------- Admin ---------- */

export async function signAdminSession(username: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  return sign("admin", { t: "admin", u: username, iat: now, exp: now + SESSION_TTL_SECONDS } satisfies AdminSession);
}

export async function verifyAdminSession(token: string | undefined | null): Promise<AdminSession | null> {
  const session = await verify<AdminSession>("admin", token);
  // A removed admin loses access immediately, even with a live token
  if (!session || !configuredAdminUsernames().includes(session.u)) return null;
  return session;
}

/** Usernames present in ADMIN_ACCOUNTS (no secrets are read here). */
export function configuredAdminUsernames(): string[] {
  return (process.env.ADMIN_ACCOUNTS ?? "")
    .split(";")
    .map((entry) => entry.split(":")[0]?.trim().toLowerCase())
    .filter(Boolean);
}

/* ---------- Google users ---------- */

export async function signUserSession(user: Pick<UserSession, "u" | "email" | "name" | "picture">): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  return sign("user", { t: "user", ...user, iat: now, exp: now + USER_SESSION_TTL_SECONDS } satisfies UserSession);
}

export async function verifyUserSession(token: string | undefined | null): Promise<UserSession | null> {
  return verify<UserSession>("user", token);
}

/* ---------- Cookies ---------- */

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

export const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: USER_SESSION_TTL_SECONDS,
};
