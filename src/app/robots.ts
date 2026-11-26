import type { MetadataRoute } from "next";

/**
 * Crawl policy. Administrative, account and login surfaces are also marked
 * noindex on the pages themselves, and their APIs are protected by server-side
 * authentication, so this file is not the access control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/account", "/login", "/api/"],
      },
    ],
    sitemap: "https://www.vanikara.com/sitemap.xml",
  };
}
