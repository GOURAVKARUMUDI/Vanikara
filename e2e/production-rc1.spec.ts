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
  { path: "/", heading: /Building what/ },
  { path: "/about", heading: /conversation/ },
  { path: "/what-we-build", heading: /Two initiatives/ },
  { path: "/food-delivery", heading: /Food delivery/ },
  { path: "/cygma", heading: /CYGMA AI/ },
  { path: "/technology", heading: /How we intend to build/ },
  { path: "/leadership", heading: /people building VANIKARA/ },
  { path: "/careers", heading: /Build with us/ },
  { path: "/contact", heading: /Let's talk/ },
  { path: "/legal", heading: /Policies/ },
  { path: "/pricing", heading: /Clear prices/ },
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
  test("homepage has title, brand symbol and skip link", async ({ page }) => {
    await prepare(page);
    await page.goto("/");
    await expect(page).toHaveTitle("VANIKARA — Building What Comes Next");
    await expect(page.getByRole("img", { name: "The VANIKARA symbol" })).toBeVisible();
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

  test("legacy routes redirect", async ({ page }) => {
    await prepare(page);
    await page.goto("/products");
    await expect(page).toHaveURL(/\/what-we-build$/);
    await page.goto("/ai");
    await expect(page).toHaveURL(/\/cygma$/);
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
    for (const name of ["Terms & Conditions", "Privacy Policy", "Refund & Cancellation", "Shipping & Delivery", "Pricing", "Contact"]) {
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
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog", { name: "Site navigation" });
      await expect(menu).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");

      await page.getByRole("button", { name: "Open menu" }).click();
      await menu.getByRole("link", { name: /Technology/ }).click();
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
