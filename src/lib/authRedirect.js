"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { isAdmin } from "@/lib/isAdmin";

export function useAuthRedirect() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user, stay where they are or handle accordingly in the page
        return;
      }

      // Check role and redirect if on a restricted page or root
      const pathname = window.location.pathname;
      const isUserAdmin = isAdmin(user);

      if (pathname === "/" || pathname === "/login") {
        if (isUserAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }

      // Protect admin routes
      if (pathname.startsWith("/admin") && !isUserAdmin) {
        router.push("/dashboard");
      }
    }

    checkUser();
  }, [router, supabase]);
}
