// Responsive, console and screenshot sweep for the audit.
// Usage: AUDIT_BASE_URL=http://localhost:3112 node tests/audit/responsive-sweep.mjs
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3112";
const OUT = join(process.cwd(), "docs/audit/evidence");
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
];

const ROUTES = [
  "/", "/businesses", "/food-delivery", "/cygma-ai", "/cygma-ai/resume-intelligence",
  "/careers", "/contact", "/login", "/account/login", "/legal/privacy",
];

// Routes that get screenshots at desktop and mobile.
const SHOT_ROUTES = {
  "/": "homepage",
  "/businesses": "business-portfolio",
  "/food-delivery": "food-services",
  "/cygma-ai": "cygma-ai",
  "/cygma-ai/resume-intelligence": "cygma-ri",
  "/careers": "careers-opening-soon",
  "/contact": "contact-unavailable-notice",
};

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
  for (const route of ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 200)); });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message.slice(0, 200)}`));
    page.on("response", (res) => { if (res.status() >= 500) failedRequests.push(`${res.status()} ${new URL(res.url()).pathname}`); });

    let status = null;
    let overflow = null;
    try {
      const response = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
      status = response?.status() ?? null;
      overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, overflowPx: doc.scrollWidth - doc.clientWidth };
      });
      const brokenImages = await page.evaluate(() =>
        [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute("src")),
      );
      if (brokenImages.length) consoleErrors.push(`broken images: ${brokenImages.join(", ")}`);
      if (SHOT_ROUTES[route] && (vp.name === "1440x900" || vp.name === "390x844")) {
        const tag = vp.name === "390x844" ? "mobile" : "desktop";
        await page.screenshot({ path: join(OUT, `${SHOT_ROUTES[route]}-${tag}.png`), fullPage: false });
      }
    } catch (err) {
      consoleErrors.push(`navigation: ${String(err.message).slice(0, 200)}`);
    }
    results.push({ viewport: vp.name, route, status, horizontalOverflowPx: overflow?.overflowPx ?? null, consoleErrors, serverErrors: failedRequests });
    await page.close();
  }
  await context.close();
}

await browser.close();
writeFileSync(join(OUT, "responsive-results.json"), JSON.stringify(results, null, 2));
const overflowing = results.filter((r) => (r.horizontalOverflowPx ?? 0) > 0);
const withErrors = results.filter((r) => r.consoleErrors.length || r.serverErrors.length);
console.log(JSON.stringify({ checks: results.length, overflowing: overflowing.length, withConsoleOrServerErrors: withErrors.length }, null, 2));
for (const r of overflowing) console.log(`OVERFLOW ${r.viewport} ${r.route} +${r.horizontalOverflowPx}px`);
for (const r of withErrors) console.log(`ERRORS ${r.viewport} ${r.route} ${JSON.stringify([...r.consoleErrors, ...r.serverErrors]).slice(0, 300)}`);
