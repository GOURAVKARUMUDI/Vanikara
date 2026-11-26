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
  { path: "/careers", heading: /Opening Soon/ },
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
    await page.goto("/", { waitUntil: "networkidle" });
    await page.mouse.move(200, 300);
    await page.mouse.move(240, 320);
    const manageBtn = page.getByRole("button", { name: "Manage preferences" });
    await expect(manageBtn).toBeVisible({ timeout: 10000 });
    await manageBtn.click();
    await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeVisible();
    await page.getByRole("switch").nth(1).click();

    const request = page.waitForRequest((r) => r.url().includes("/api/privacy/consent") && r.method() === "POST");
    await page.getByRole("button", { name: "Save choices" }).click();
    const response = await (await request).response();
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeHidden();
  });

  test("all visual pages render every image cleanly with zero uncaught page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await prepare(page);

    const visualRoutes = [
      "/",
      "/businesses",
      "/food-delivery",
      "/businesses/travel",
      "/businesses/hotels",
      "/businesses/quick-commerce",
      "/cygma-ai",
      "/cygma-ai/resume-intelligence",
      "/technology",
      "/about",
      "/careers",
    ];

    for (const route of visualRoutes) {
      await page.goto(route, { waitUntil: "networkidle" });
      // Trigger lazy-loaded Next.js <Image> elements by scrolling through the page
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll("img"));
        for (const img of imgs) {
          img.loading = "eager";
          img.scrollIntoView({ behavior: "instant" });
        }
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
              setTimeout(resolve, 4000);
            });
          })
        );
      });
      const broken = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("img"));
        return imgs
          .filter((img) => {
            const style = window.getComputedStyle(img);
            return style.display !== "none" && style.visibility !== "hidden" && img.getBoundingClientRect().width > 0;
          })
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.getAttribute("src"));
      });
      expect(broken, `Broken images on ${route}`).toEqual([]);
    }
    expect(errors, "Uncaught page errors").toEqual([]);
  });

  test("desktop mega menus and site search work cleanly", async ({ page }) => {
    await prepare(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Businesses" }).click();
    await expect(page.getByRole("link", { name: /Unified Consumer Ecosystem/ })).toBeVisible();
    await page.getByRole("button", { name: "CYGMA_AI" }).click();
    await expect(page.getByRole("link", { name: /CYGMA-RI — Resume Intelligence/ })).toBeVisible();

    await page.getByRole("button", { name: "Search site" }).click();
    const searchDialog = page.getByRole("dialog", { name: "Search Vanikara" });
    await expect(searchDialog).toBeVisible();
    await searchDialog.getByRole("searchbox").fill("Resume");
    await expect(searchDialog.getByRole("link", { name: /CYGMA-RI/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(searchDialog).toBeHidden();
  });

  test("CYGMA-RI interactive preview switches demo candidates and preserves human oversight", async ({ page }) => {
    await prepare(page);
    await page.goto("/cygma-ai/resume-intelligence");
    await expect(page.getByText("Intelligence supports the decision. Humans make it.").first()).toBeVisible();
    await page.getByRole("button", { name: /B\. Demo Candidate 02/ }).click();
    await expect(page.getByText("Evidence Unavailable").first()).toBeVisible();
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
