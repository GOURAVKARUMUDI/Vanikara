import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.vanikara.com";
  
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/leadership", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/what-we-build", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/food-delivery", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/cygma", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/technology", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/careers", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/legal", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/legal/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/cookies", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/refund", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/security", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/legal-information", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
