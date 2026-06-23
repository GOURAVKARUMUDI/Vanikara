/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 412, height: 800 }); // Mobile viewport
  await page.goto('http://localhost:3000');
  
  // Wait for page to settle
  await page.waitForTimeout(1000);
  
  // Print direct children of body and their bounding boxes
  const children = await page.evaluate(() => {
    return Array.from(document.body.children).map(child => {
      const rect = child.getBoundingClientRect();
      return {
        tagName: child.tagName,
        id: child.id,
        className: child.className,
        display: window.getComputedStyle(child).display,
        position: window.getComputedStyle(child).position,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height
        }
      };
    });
  });
  
  console.log('=== BODY CHILDREN ===');
  console.log(JSON.stringify(children, null, 2));
  
  // Print children of the flex container (MainLayout)
  const mainLayoutChildren = await page.evaluate(() => {
    const mainLayout = document.querySelector('body > div.flex') || document.querySelector('.flex-col.min-h-screen');
    if (!mainLayout) return 'MainLayout not found';
    return Array.from(mainLayout.children).map(child => {
      const rect = child.getBoundingClientRect();
      return {
        tagName: child.tagName,
        id: child.id,
        className: child.className,
        display: window.getComputedStyle(child).display,
        position: window.getComputedStyle(child).position,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height
        }
      };
    });
  });
  
  console.log('\n=== MAIN LAYOUT CHILDREN ===');
  console.log(JSON.stringify(mainLayoutChildren, null, 2));

  await browser.close();
})();
