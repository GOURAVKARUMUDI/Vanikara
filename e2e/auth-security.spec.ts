import { test, expect } from "@playwright/test";

/**
 * Security regression suite for the current access model:
 *
 *   - Admins: fixed accounts (ADMIN_ACCOUNTS) with a signed vk_admin cookie.
 *   - Visitors: optional Google sign-in (Firebase) with a signed vk_user
 *     cookie that grants no admin access.
 *
 * These tests only read, or send requests that are rejected — they never
 * write to the database and need no credentials.
 */

const BASE = "http://localhost:3000";
const json = { "Content-Type": "application/json" };
const sameOrigin = { ...json, Origin: BASE };

test.describe("Access control", () => {
  test("/admin sends signed-out visitors to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin$/);
  });

  test("the retired /dashboard route sends visitors to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  for (const path of ["/api/admin/stats", "/api/admin/users", "/api/admin/settings", "/api/leads", "/api/clients"]) {
    test(`GET ${path} without an admin session -> 401`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(401);
      expect(await res.text()).not.toMatch(/stack|at .*\.(ts|js)/i);
    });
  }

  test("public privacy config never includes admin statistics", async ({ request }) => {
    const res = await request.get("/api/admin/privacy");
    // The proxy blocks /api/admin/* for everyone who is not an admin
    expect([200, 401]).toContain(res.status());
    if (res.status() === 200) expect((await res.json()).data?.stats).toBeUndefined();
  });

  test("a forged admin cookie is rejected", async ({ request }) => {
    const res = await request.get("/api/auth/session", { headers: { Cookie: "vk_admin=eyJ0IjoiYWRtaW4iLCJ1IjoiZ291cmF2In0.forged" } });
    expect((await res.json()).authenticated).toBe(false);
  });

  test("there is no public sign-up endpoint", async ({ request }) => {
    for (const path of ["/api/auth/signup", "/api/auth/register"]) {
      expect((await request.post(path, { headers: sameOrigin, data: {} })).status()).toBe(404);
    }
  });

  test("anonymous callers cannot create leads directly", async ({ request }) => {
    const res = await request.post("/api/leads", { headers: sameOrigin, data: { name: "x", email: "x@example.com" } });
    expect(res.status()).toBe(401);
  });

  test("payments require a signed-in customer or admin", async ({ request }) => {
    const res = await request.post("/api/payment", {
      headers: sameOrigin,
      data: { action: "create", clientId: "00000000-0000-0000-0000-000000000000" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("Sign-in hardening", () => {
  test("wrong admin credentials get one generic message", async ({ request }) => {
    const a = await request.post("/api/auth/login", { headers: { ...sameOrigin, "X-Real-IP": "198.51.100.201" }, data: { username: "nobody-here", password: "wrong-password" } });
    const b = await request.post("/api/auth/login", { headers: { ...sameOrigin, "X-Real-IP": "198.51.100.202" }, data: { username: "gourav", password: "wrong-password" } });
    expect(a.status()).toBe(401);
    expect(b.status()).toBe(401);
    expect((await a.json()).error).toBe((await b.json()).error);
  });

  test("repeated admin sign-in attempts are rate limited", async ({ request }) => {
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) {
      const res = await request.post("/api/auth/login", {
        headers: { ...sameOrigin, "X-Real-IP": "198.51.100.210" },
        data: { username: `probe${i}`, password: "wrong-password" },
      });
      statuses.push(res.status());
    }
    expect(statuses).toContain(429);
  });

  test("Google sign-in rejects tokens that were not issued by Google", async ({ request }) => {
    const fake = `${"a".repeat(40)}.${"b".repeat(60)}.${"c".repeat(40)}`;
    const res = await request.post("/api/auth/google", { headers: { ...sameOrigin, "X-Real-IP": "198.51.100.220" }, data: { idToken: fake } });
    expect(res.status()).toBe(401);
  });
});

test.describe("Cross-site request protection", () => {
  for (const [method, path] of [
    ["POST", "/api/auth/login"],
    ["POST", "/api/auth/google"],
    ["POST", "/api/contact"],
    ["PATCH", "/api/admin/users"],
    ["POST", "/api/payment"],
  ] as const) {
    test(`${method} ${path} from another site -> 403`, async ({ request }) => {
      const res = await request.fetch(path, { method, headers: { ...json, Origin: "https://evil.example" }, data: {} });
      // Admin API paths are blocked by the proxy (401) before the handler's origin check (403)
      expect([401, 403]).toContain(res.status());
    });
  }

  test("contact form rejects invalid input without leaking internals", async ({ request }) => {
    const res = await request.post("/api/contact", { headers: { ...sameOrigin, "X-Real-IP": "198.51.100.230" }, data: { name: "", email: "not-an-email" } });
    expect(res.status()).toBe(400);
    expect(await res.text()).not.toMatch(/stack|supabase|postgres/i);
  });
});

test.describe("Security headers", () => {
  test("pages send hardened headers", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("admin surfaces are never cached or indexed", async ({ request }) => {
    const res = await request.get("/login");
    // Production sends "no-store"; the dev server substitutes its own "no-cache"
    expect(res.headers()["cache-control"]).toMatch(/no-store|no-cache/);
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });
});
