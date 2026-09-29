import { scrypt, timingSafeEqual, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  USER_COOKIE,
  verifyAdminSession,
  verifyUserSession,
  type AdminSession,
  type UserSession,
} from "./adminSession";

/**
 * Fixed admin accounts. There is no registration: the only accounts are
 * the ones listed in ADMIN_ACCOUNTS, formatted as
 *
 *   username:saltHex:hashHex;username2:saltHex:hashHex
 *
 * where hash = scrypt(password, salt, 64). Generate entries with
 * `node scripts/hash-admin-password.mjs <username>`. Plain-text passwords
 * are never stored in the code or the environment.
 */

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

interface AdminAccount {
  username: string;
  salt: Buffer;
  hash: Buffer;
}

function readAccounts(): AdminAccount[] {
  return (process.env.ADMIN_ACCOUNTS ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const [username, salt, hash] = entry.split(":");
      if (!username || !/^[0-9a-f]{32,}$/i.test(salt ?? "") || !/^[0-9a-f]{128}$/i.test(hash ?? "")) return [];
      return [{ username: username.trim().toLowerCase(), salt: Buffer.from(salt, "hex"), hash: Buffer.from(hash, "hex") }];
    });
}

// Compared against when the username is unknown, so response time does not
// reveal which usernames exist.
const DUMMY = { salt: randomBytes(16), hash: randomBytes(KEY_LENGTH) };

export async function verifyAdminCredentials(username: string, password: string): Promise<string | null> {
  const name = username.trim().toLowerCase();
  const account = readAccounts().find((a) => a.username === name);
  const derived = await scryptAsync(password, account?.salt ?? DUMMY.salt, KEY_LENGTH);
  const match = timingSafeEqual(derived, account?.hash ?? DUMMY.hash);
  return account && match ? account.username : null;
}

export function isAdminAuthConfigured() {
  return readAccounts().length > 0 && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}

/** The signed-in admin for this request, or null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifyAdminSession(store.get(ADMIN_COOKIE)?.value);
}

/**
 * The Google-signed-in visitor for this request, or null. Being a user
 * grants no admin capability anywhere — admin checks use getAdminSession.
 */
export async function getUserSession(): Promise<UserSession | null> {
  const store = await cookies();
  return verifyUserSession(store.get(USER_COOKIE)?.value);
}

/* ---------- Brute-force protection (per instance, in memory) ---------- */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, number[]>();

export function loginLockout(key: string): number {
  const now = Date.now();
  const recent = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, recent);
  if (recent.length < MAX_FAILURES) return 0;
  return Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
}

export function recordLoginFailure(key: string) {
  const list = failures.get(key) ?? [];
  list.push(Date.now());
  failures.set(key, list);
}

export function clearLoginFailures(key: string) {
  failures.delete(key);
}
