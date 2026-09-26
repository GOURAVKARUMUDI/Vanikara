import type { MetadataRoute } from "next";
import { COMPANY_IDENTITY } from "@/data/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VANIKARA",
    short_name: "VANIKARA",
    description: COMPANY_IDENTITY.shortStatement,
    start_url: "/",
    // A website, not an installable app
    display: "browser",
    background_color: "#F7F9FC",
    theme_color: "#071A3D",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
