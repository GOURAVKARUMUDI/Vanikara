/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('@playwright/test');

const HOST = "http://localhost:3000";

const VIEWPORTS = [
  { name: "iPhone SE (Small Phone)", width: 320, height: 568 },
  { name: "iPhone X (Medium Phone)", width: 375, height: 812 },
  { name: "Pixel 7 (Large Phone)", width: 412, height: 915 },
  { name: "iPad (Tablet)", width: 768, height: 1024 },
  { name: "iPad Pro (Pro Tablet / Folded)", width: 1024, height: 1366 }
];

const ROUTES = [
  "/",
  "/about",
  "/products",
  "/services",
  "/careers",
  "/contact",
  "/faq",
  "/status",
  "/changelog",
  "/login"
];

async function run() {
  console.log("====================================================");
  console.log("   VANIKARA RESPONSIVE MOBILE SIMULATOR & AUDIT     ");
  console.log("====================================================\n");

  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nChecking Device Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log("-".repeat(60));

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
      });

      const page = await context.newPage();

      // Dismiss cookie consent banner preemptively so it doesn't skew width calculations
      await page.addInitScript(() => {
        const settings = JSON.stringify({
          essential: true,
          preferences: true,
          analytics: true,
          marketing: true,
        });
        localStorage.setItem("cookie_consent_settings", settings);
        localStorage.setItem("cookie_consent_version", "1.0.0");
      });

      for (const route of ROUTES) {
        const url = `${HOST}${route}`;
        try {
          await page.goto(url, { waitUntil: "domcontentloaded" });
          // Wait for custom threejs scene initialization and framer-motion entry layout shifts to settle
          await page.waitForTimeout(1500);

          const audit = await page.evaluate((vpWidth) => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const winWidth = window.innerWidth;

            // Detect horizontal overflow scrollbars
            const overflow = docWidth > winWidth || bodyWidth > winWidth;
            const excessWidth = Math.max(docWidth, bodyWidth) - winWidth;

            // Find specific element leaking past screen borders
            let leakingElement = null;
            const allElements = document.querySelectorAll('body *');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                // If element leaks past the right side of the screen
                if (rect.right > winWidth + 1) {
                  // Only report elements that actually occupy space and overflow
                  const style = window.getComputedStyle(el);
                  if (style.overflowX !== 'hidden' && style.display !== 'none') {
                    leakingElement = {
                      tagName: el.tagName,
                      id: el.id,
                      className: el.className ? el.className.split(' ').slice(0, 3).join(' ') : '',
                      right: rect.right,
                      width: rect.width
                    };
                    break;
                  }
                }
              }
            }

            return {
              overflow,
              excessWidth,
              winWidth,
              docWidth,
              bodyWidth,
              leakingElement
            };
          }, vp.width);

          if (audit.overflow) {
            console.log(
              `\x1b[31m%s\x1b[0m`,
              `✗ FAIL: ${route} - Horizontal Overflow detected! Viewport: ${audit.winWidth}px, Doc ScrollWidth: ${audit.docWidth}px, Body ScrollWidth: ${audit.bodyWidth}px (+${audit.excessWidth}px excess)`
            );
            if (audit.leakingElement) {
              console.log(
                `      Leaking Node: <${audit.leakingElement.tagName.toLowerCase()} id="${audit.leakingElement.id}" class="${audit.leakingElement.className}..."> (Right border: ${audit.leakingElement.right}px, Width: ${audit.leakingElement.width}px)`
              );
            }
            hasErrors = true;
          } else {
            console.log(`\x1b[32m%s\x1b[0m`, `✓ PASS: ${route} (No overflow detected)`);
          }
        } catch (routeErr) {
          console.log(`\x1b[31m%s\x1b[0m`, `✗ ERROR loading ${route}: ${routeErr.message}`);
          hasErrors = true;
        }
      }
      await context.close();
    }
  } catch (err) {
    console.error("Runner Exception:", err);
    hasErrors = true;
  } finally {
    await browser.close();
  }

  console.log("\n====================================================");
  if (hasErrors) {
    console.error("\x1b[31m%s\x1b[0m", "✗ AUDIT FAILED: One or more pages have responsive layouts that leak elements.");
    process.exit(1);
  } else {
    console.log("\x1b[32m%s\x1b[0m", "✓ ALL SYSTEMS VERIFIED: responsive scaling holds up across all simulated viewports.");
    process.exit(0);
  }
}

run();
