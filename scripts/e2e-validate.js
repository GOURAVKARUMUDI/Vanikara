const HOST = process.env.VALIDATE_HOST || "http://localhost:3000";

const ROUTES = [
  "/",
  "/businesses",
  "/food-delivery",
  "/businesses/travel",
  "/businesses/hotels",
  "/businesses/quick-commerce",
  "/cygma-ai",
  "/cygma-ai/resume-intelligence",
  "/cygma",
  "/what-we-build",
  "/about",
  "/leadership",
  "/technology",
  "/careers",
  "/contact",
  "/account/login",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health",
  "/api/portfolio",
];

async function checkRoute(route) {
  const url = `${HOST}${route}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP status error: ${res.status}`);
    }

    const text = await res.text();
    if (route === "/api/health") {
      const json = JSON.parse(text);
      if (json.status !== "healthy") {
        throw new Error(`Degraded diagnostic node status: ${JSON.stringify(json.services)}`);
      }
    } else if (route === "/api/portfolio") {
      const json = JSON.parse(text);
      if (!json.success || !Array.isArray(json.data?.items)) {
        throw new Error("Invalid portfolio payload");
      }
      if (json.data.items.some((i) => i.visibility !== "public")) {
        throw new Error("Non-public portfolio item leaked in public API");
      }
    } else if (route === "/") {
      if (!text.toLowerCase().includes("vanikara")) {
        throw new Error("Brand signature 'VANIKARA' not found in root body");
      }
    }

    console.log(`\x1b[32m%s\x1b[0m`, `✓ PASS: ${route} (${res.status})`);
    return true;
  } catch (err) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ FAIL: ${route} - ${err.message}`);
    return false;
  }
}

async function run() {
  console.log("====================================================");
  console.log("  VANIKARA V2 ROUTE & API INTEGRITY VALIDATOR       ");
  console.log("====================================================");
  console.log(`Targeting instance: ${HOST}\n`);

  let failed = false;
  for (const route of ROUTES) {
    const success = await checkRoute(route);
    if (!success) failed = true;
  }

  if (failed) {
    console.error("\n\x1b[31m%s\x1b[0m", "✗ INTEGRITY VERIFICATION FAILED.");
    process.exit(1);
  } else {
    console.log("\n\x1b[32m%s\x1b[0m", `✓ ALL ${ROUTES.length} ROUTES & APIS VERIFIED.`);
    process.exit(0);
  }
}

run();
