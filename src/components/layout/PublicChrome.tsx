"use client";

import { usePathname } from "next/navigation";

/** Hides public site chrome (e.g. Footer) when rendering the Vanikara Console (/admin). */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
