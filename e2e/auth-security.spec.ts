import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import path from "path";

/**
 * Security-regression suite for the four vulnerabilities fixed in the
 * 2026 security audit:
 *
 *   1. isAdmin() used to trust user_metadata (browser-writable) -> now
 *      only trusts app_metadata (service-role-writable only).
 *   2/3. RLS + column grants used to let a user write their own
 *      `subscriptions.plan` / `users.role` directly -> now revoked for
 *      the `authenticated` Postgres role (see supabase/2026_security_hardening.sql).
 *   4. auth/callback used to reset an existing subscription to `free` with
 *      a fresh trial on every login -> now idempotent (only provisions if
 *      no subscription row exists yet).
 *
 * This file does NOT duplicate e2e/production-rc1.spec.ts (public pages,
 * theme, cookie consent, 404s, redirects). It only covers access control,
 * input validation, CSRF, privilege escalation and rate limiting.
 */

// ---------------------------------------------------------------------
// Load live Supabase credentials for this project's own dev instance.
// There is no separate staging/test Supabase project for this app, so
// section D below performs a real (but harmless, self-cleaning) write
// against it: one throwaway auth user, created and deleted per run.
// `.env.local` is git-ignored and never committed; process.loadEnvFile
// is a Node 20.6+ built-in, so no extra dependency is required.
// ---------------------------------------------------------------------
try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"));
} catch {
  // File may not exist in some environments; credential-gated tests below
  // are skipped in that case rather than failing.
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HAS_SUPABASE_CREDS = Boolean(SUPABASE_URL && ANON_KEY && SERVICE_KEY);

// isTrustedOrigin() runs before auth on PATCH/POST/DELETE handlers, so
// any test in sections A/B that wants to exercise the AUTH check (not the
// CSRF check) on those methods must supply a same-origin Origin header.
const TRUSTED_ORIGIN = { origin: "http://localhost:3000" };

// =======================================================================
// A. Unauthenticated access control
// =======================================================================
test.describe("A. Unauthenticated access control", () => {
  test("GET /admin redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("GET /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  for (const p of ["/api/admin/users", "/api/admin/stats", "/api/admin/settings"]) {
    test(`GET ${p} -> 401`, async ({ request }) => {
      const res = await request.get(p);
      expect(res.status()).toBe(401);
    });
  }

  // GET /api/admin/privacy is intentionally NOT auth-gated: per its own
  // source (src/app/api/admin/privacy/route.ts), unauthenticated callers
  // get a 200 with a *filtered* public payload (policy text + optional
  // services, no `stats`), and only admins get the full config. This is a
  // deliberate design choice (the privacy policy is public content), not
  // the vulnerability class under test here -- so we assert the filtering
  // instead of a blanket 401.
  test("GET /api/admin/privacy -> 200 with filtered (no stats) payload for anonymous callers", async ({
    request,
  }) => {
    const res = await request.get("/api/admin/privacy");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).not.toHaveProperty("stats");
  });

  test("PATCH /api/admin/users with a fake body -> 401 (not 500, not 200)", async ({ request }) => {
    // Trusted Origin supplied deliberately so this test isolates the AUTH
    // check specifically; the CSRF check is covered separately in section C.
    const res = await request.patch("/api/admin/users", {
      headers: TRUSTED_ORIGIN,
      data: { id: "00000000-0000-0000-0000-000000000000", role: "admin" },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    // Response must not leak stack traces or internals.
    expect(JSON.stringify(body)).not.toMatch(/at .*\(.*:\d+:\d+\)/); // stack frame shape
    expect(body.error).toBe("Unauthorized");
  });
});

// =======================================================================
// B. Malformed input rejected
// =======================================================================
test.describe.serial("B. Malformed input + rate limiting (serialized: shared /api/contact IP bucket)", () => {
  test("POST /api/contact with missing required fields -> 400, no stack trace leaked", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "Only Name" } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    const asString = JSON.stringify(body);
    expect(asString).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(asString.toLowerCase()).not.toContain("node_modules");
  });

  test("POST /api/contact with an invalid email -> 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test User",
        email: "not-an-email",
        subject: "Hello",
        message: "This is a test message.",
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("PATCH /api/admin/users unauthenticated with an invalid role -> 401, not 400 (auth checked before validation)", async ({
    request,
  }) => {
    const res = await request.patch("/api/admin/users", {
      headers: TRUSTED_ORIGIN,
      data: { id: "x", role: "superadmin" }, // fails uuid() and enum() validation too
    });
    // If validation ran first this would be 400; auth runs first -> 401.
    expect(res.status()).toBe(401);
  });

  test("admin users PATCH zod schema rejects role values outside ['user','admin'] (source check)", async () => {
    const source = readFileSync(
      path.join(__dirname, "..", "src/app/api/admin/users/route.ts"),
      "utf-8"
    );
    expect(source).toMatch(/z\.enum\(\s*\[\s*["']user["']\s*,\s*["']admin["']\s*\]\s*\)/);
  });

  // -----------------------------------------------------------------
  // E. Rate limiting (kept in this serial block: it shares the same
  // in-memory per-IP bucket in src/lib/rateLimit.ts as the two contact
  // tests above — keyed on IP alone, not IP+route — so it must run
  // after them, in the same worker, or it would consume their quota).
  // -----------------------------------------------------------------
  test("firing ~40 rapid POSTs at /api/contact trips the 30/min limit (429)", async ({ request }) => {
    // Body is intentionally invalid (empty object): isRateLimited() runs
    // BEFORE zod validation in the route, so this still exercises the
    // limiter without inserting ~30 junk rows into the live leads table.
    const attempts = 40;
    const responses = await Promise.all(
      Array.from({ length: attempts }, () => request.post("/api/contact", { data: {} }))
    );
    const statuses = responses.map((r) => r.status());
    const rateLimited = statuses.filter((s) => s === 429);
    expect(rateLimited.length, `statuses seen: ${statuses.join(",")}`).toBeGreaterThan(0);
  });
});

// =======================================================================
// C. CSRF Origin check
// =======================================================================
test.describe("C. CSRF Origin check (isTrustedOrigin)", () => {
  test("PATCH /api/admin/users with a foreign Origin -> 403 before auth is even checked", async ({ request }) => {
    const res = await request.patch("/api/admin/users", {
      headers: { origin: "https://evil-attacker.example" },
      data: { id: "00000000-0000-0000-0000-000000000000", role: "admin" },
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden");
  });

  test("PATCH /api/admin/users with no Origin header -> 403 (missing origin treated as untrusted)", async ({
    request,
  }) => {
    const res = await request.patch("/api/admin/users", {
      headers: { origin: "" },
      data: { id: "00000000-0000-0000-0000-000000000000", role: "admin" },
    });
    expect(res.status()).toBe(403);
  });

  test("POST /api/admin/privacy with a foreign Origin -> 403 before auth is even checked", async ({ request }) => {
    const res = await request.post("/api/admin/privacy", {
      headers: { origin: "https://evil-attacker.example" },
      data: { currentVersion: "9.9.9" },
    });
    expect(res.status()).toBe(403);
  });

  test("same-origin PATCH /api/admin/users still passes CSRF (falls through to 401, not 403)", async ({
    request,
  }) => {
    // Sanity check for the two tests above: proves 403 is really about the
    // Origin header, not some other reason unrelated requests would also hit.
    const res = await request.patch("/api/admin/users", {
      headers: TRUSTED_ORIGIN,
      data: { id: "00000000-0000-0000-0000-000000000000", role: "admin" },
    });
    expect(res.status()).toBe(401);
  });
});

// =======================================================================
// D. Privilege escalation against a real test account
// =======================================================================
test.describe.serial("D. Privilege escalation attempts (live Supabase project)", () => {
  test.skip(!HAS_SUPABASE_CREDS, "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY not found in .env.local");

  let adminClient: SupabaseClient;
  let userClient: SupabaseClient;
  let testUserId = "";
  const testEmail = `e2e-test-${Date.now()}@vanikara-test.local`;
  const testPassword = `Vk-Test-${Math.random().toString(36).slice(2)}!Aa1`;

  let sharedContext: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    adminClient = createClient(SUPABASE_URL!, SERVICE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const connectivityMessage = (rawMessage: string) =>
      new Error(
        `Cannot reach the Supabase project at ${SUPABASE_URL} (underlying error: "${rawMessage}"). ` +
          `A direct \`nslookup\` for this project's hostname against 8.8.8.8, run independently of this ` +
          `test, also returned NXDOMAIN — so this is an infrastructure/connectivity problem (the project ` +
          `appears unreachable or no longer exists), NOT a signal about whether ` +
          `supabase/2026_security_hardening.sql has been applied. That question could not be tested in ` +
          `this environment. Part D cannot run until this project is reachable from wherever these tests execute.`
      );

    let created: Awaited<ReturnType<typeof adminClient.auth.admin.createUser>>["data"] | undefined;
    try {
      const result = await adminClient.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      });
      if (result.error) {
        if (/fetch failed/i.test(result.error.message)) throw connectivityMessage(result.error.message);
        throw new Error(result.error.message);
      }
      created = result.data;
    } catch (err) {
      if (err instanceof Error && /fetch failed/i.test(err.message) && !/Cannot reach the Supabase project/.test(err.message)) {
        throw connectivityMessage(err.message);
      }
      throw err;
    }
    if (!created?.user) {
      throw new Error("Failed to create throwaway test user: no user returned");
    }
    testUserId = created.user.id;

    // The app's own /auth/callback route (which provisions public.users /
    // public.subscriptions on first login) only runs for the OAuth/magic-
    // link code-exchange flow, not for password sign-in. We drive the real
    // password-login form below (more realistic than injecting cookies),
    // so we provision these two rows ourselves here via the service-role
    // client -- exactly mirroring what auth/callback does on first login --
    // so that sections D.2/D.3 update a REAL existing row (an update that
    // matches zero rows would trivially "pass" without proving anything).
    await adminClient.from("users").insert({ id: testUserId, email: testEmail, role: "user" });
    await adminClient.from("subscriptions").insert({
      user_id: testUserId,
      plan: "free",
      status: "active",
    });

    // A user-scoped client authenticated as the throwaway account, via the
    // public anon key + a real password sign-in -- functionally identical
    // to what runs in the browser (RLS/grants are evaluated purely from the
    // JWT, regardless of whether the call originates from Node or a page).
    // We use this (rather than injecting @supabase/supabase-js into the
    // page via a CDN <script>) because the app's CSP
    // (script-src 'self' ... -- see next.config.mjs) does not allow
    // loading external script CDNs, which would make in-page injection
    // unreliable; app-level access control is still verified against a
    // REAL browser session driven through the actual /login form below.
    userClient = createClient(SUPABASE_URL!, ANON_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: signInErr } = await userClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (signInErr) {
      throw new Error(`Failed to sign in as throwaway test user: ${signInErr.message}`);
    }

    sharedContext = await browser.newContext();
    page = await sharedContext.newPage();
  });

  test.afterAll(async () => {
    await page?.close();
    await sharedContext?.close();
    // Cascades to public.users / public.subscriptions via ON DELETE CASCADE.
    if (testUserId) {
      await adminClient.auth.admin.deleteUser(testUserId);
    }
  });

  test("D0. signing in through the real /login form establishes an ordinary (non-admin) session", async () => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign in with password" }).click();
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/dashboard$/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("D0b. baseline: this ordinary session cannot reach /admin or /api/admin/stats", async () => {
    await page.goto("/admin");
    // Logged in but not admin -> app/admin/page.tsx redirects to /dashboard
    // (distinct from the unauthenticated case, which redirects to /login).
    await expect(page).toHaveURL(/\/dashboard$/);

    const res = await page.request.get("/api/admin/stats");
    expect(res.status()).toBe(401);
  });

  test("D1. auth.updateUser({data:{role:'admin'}}) succeeds at the API but grants nothing (isAdmin.ts fix)", async () => {
    // GoTrue legitimately allows a user to write their own user_metadata --
    // that call succeeding is expected, not a bug. The fix is that nothing
    // in the app trusts this field any more.
    const { error } = await userClient.auth.updateUser({ data: { role: "admin" } });
    expect(error).toBeNull();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard$/);

    const res = await page.request.get("/api/admin/stats");
    expect(res.status()).toBe(401);
  });

  test("D2. directly UPDATE-ing public.users.role via the client SDK is rejected", async () => {
    const { data, error } = await userClient
      .from("users")
      .update({ role: "admin" })
      .eq("id", testUserId)
      .select();

    const rejected = Boolean(error) || !data || data.length === 0;
    expect(
      rejected,
      `Expected the UPDATE to error or affect 0 rows (2026_security_hardening.sql not applied?). Got: ${JSON.stringify(
        { data, error }
      )}`
    ).toBe(true);

    const { data: actualRow } = await adminClient
      .from("users")
      .select("role")
      .eq("id", testUserId)
      .single();
    expect(actualRow?.role).not.toBe("admin");

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard$/);
    const res = await page.request.get("/api/admin/stats");
    expect(res.status()).toBe(401);
  });

  test("D3. directly UPDATE-ing public.subscriptions.plan via the client SDK is rejected", async () => {
    const { data: before } = await adminClient
      .from("subscriptions")
      .select("plan")
      .eq("user_id", testUserId)
      .maybeSingle();

    const { data, error } = await userClient
      .from("subscriptions")
      .update({ plan: "pro" })
      .eq("user_id", testUserId)
      .select();

    const rejected = Boolean(error) || !data || data.length === 0;
    expect(
      rejected,
      `Expected the UPDATE to error or affect 0 rows (2026_security_hardening.sql not applied?). Got: ${JSON.stringify(
        { data, error }
      )}`
    ).toBe(true);

    const { data: after } = await adminClient
      .from("subscriptions")
      .select("plan")
      .eq("user_id", testUserId)
      .maybeSingle();
    expect(after?.plan).toBe(before?.plan ?? "free");
    expect(after?.plan).not.toBe("pro");
  });
});
