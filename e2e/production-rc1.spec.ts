import { test, expect, type Page } from "@playwright/test";

/** Skip the first-visit intro and pre-accept consent so overlays don't interfere. */
async function prepare(page: Page, { consent = true }: { consent?: boolean } = {}) {
  await page.addInitScript((withConsent) => {
    sessionStorage.setItem("vk-intro", "1");
    if (withConsent) {
      localStorage.setItem(
        "cookie_consent_settings",
        JSON.stringify({ essential: true, preferences: false, analytics: false, marketing: false })
      );
      localStorage.setItem("cookie_consent_version", "1.0.0");
    }
  }, consent);
}

const PAGES = [
  { path: "/", heading: /Intelligence meets possibility\./ },
  { path: "/businesses", heading: /One connected consumer ecosystem/ },
  { path: "/businesses/travel", heading: /Travel Booking/ },
  { path: "/businesses/hotels", heading: /Hotel Booking/ },
  { path: "/businesses/quick-commerce", heading: /Quick Commerce/ },
  { path: "/cygma-ai", heading: /Intelligence, Built for Purpose/ },
  { path: "/cygma-ai/resume-intelligence", heading: /Less Manual Verification/ },
  { path: "/about", heading: /conversation/ },
  { path: "/what-we-build", heading: /Two focused initiatives/ },
  { path: "/food-delivery", heading: /Food delivery/ },
  { path: "/cygma", heading: /Intelligence, Built for Purpose/ },
  { path: "/technology", heading: /How we intend to build/ },
  { path: "/leadership", heading: /people building VANIKARA/ },
  { path: "/careers", heading: /Build with us/ },
  { path: "/contact", heading: /Let's talk/ },
  { path: "/account/login", heading: /Sign in to your Vanikara Account/ },
  { path: "/legal", heading: /Policies/ },
  { path: "/legal/terms", heading: /Terms & Conditions/ },
  { path: "/legal/privacy", heading: /Privacy Policy/ },
  { path: "/legal/refund", heading: /Refund & Cancellation Policy/ },
  { path: "/legal/shipping", heading: /Shipping & Delivery Policy/ },
  { path: "/legal/cookies", heading: /Cookie Policy/ },
  { path: "/legal/security", heading: /Security/ },
  { path: "/legal/legal-information", heading: /Company Information/ },
  { path: "/login", heading: /Sign in to VANIKARA/ },
];

test.describe("VANIKARA website", () => {
  test("homepage has title, brand mark and skip link", async ({ page }) => {
    await prepare(page);
    await page.goto("/");
    await expect(page).toHaveTitle("VANIKARA — Intelligence Meets Purpose");
    await expect(page.getByRole("link", { name: "VANIKARA — Home" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
  });

  for (const { path, heading } of PAGES) {
    test(`${path} renders its page heading`, async ({ page }) => {
      await prepare(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    });
  }

  test("legacy routes and shortcuts redirect", async ({ page }) => {
    await prepare(page);
    await page.goto("/products");
    await expect(page).toHaveURL(/\/what-we-build$/);
    await page.goto("/ai");
    await expect(page).toHaveURL(/\/cygma-ai$/);
    await page.goto("/cygma-ri");
    await expect(page).toHaveURL(/\/cygma-ai\/resume-intelligence$/);
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/what-we-build$/);
  });

  test("portfolio API enforces public visibility and guards admin scope", async ({ request }) => {
    const pub = await request.get("/api/portfolio");
    expect(pub.status()).toBe(200);
    const pubJson = await pub.json();
    expect(pubJson.success).toBe(true);
    expect(Array.isArray(pubJson.data.items)).toBe(true);
    for (const item of pubJson.data.items) {
      expect(item.visibility).toBe("public");
    }

    const adminScope = await request.get("/api/portfolio?scope=admin");
    expect(adminScope.status()).toBe(401);
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    await prepare(page);
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/doesn't exist/);
  });

  test("theme picker switches theme and remembers the choice", async ({ page }) => {
    await prepare(page);
    await page.addInitScript(() => localStorage.setItem("vanikara-theme", "light"));
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: /^Theme:/ }).click();
    await page.getByRole("menuitemradio", { name: /Dark/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("vanikara-theme"))).toBe("dark");
  });

  test("footer links every policy Razorpay and Indian law expect", async ({ page }) => {
    await prepare(page);
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    for (const name of ["Terms & Conditions", "Privacy Policy", "Refund & Cancellation", "Shipping & Delivery", "Contact"]) {
      await expect(footer.getByRole("link", { name, exact: false }).first()).toBeVisible();
    }
  });

  test("contact page shows the grievance officer", async ({ page }) => {
    await prepare(page);
    await page.goto("/contact");
    await expect(page.getByText("Grievance Officer", { exact: true })).toBeVisible();
  });

  test("custom cookie choices are recorded", async ({ page }) => {
    await prepare(page, { consent: false });
    await page.goto("/");
    await page.mouse.move(200, 300);
    await page.getByRole("button", { name: "Manage preferences" }).click();
    await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeVisible();
    await page.getByRole("switch").nth(1).click();

    const request = page.waitForRequest((r) => r.url().includes("/api/privacy/consent") && r.method() === "POST");
    await page.getByRole("button", { name: "Save choices" }).click();
    const response = await (await request).response();
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeHidden();
  });

  test.describe("mobile", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("menu opens, navigates and closes with Escape", async ({ page }) => {
      await prepare(page);
      await page.goto("/");
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const menu = page.getByRole("dialog", { name: "Site navigation" });
      await expect(menu).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");

      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await menu.getByRole("link", { name: "Engineering" }).click();
      await expect(page).toHaveURL(/\/technology$/);
    });

    test("pages do not scroll horizontally", async ({ page }) => {
      await prepare(page);
      for (const { path } of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, path).toBeLessThanOrEqual(0);
      }
    });
  });

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    expect((await res.json()).status).toBe("healthy");
  });
});
