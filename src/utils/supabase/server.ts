import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createClient = (cookieStore: any) => {
  const url = supabaseUrl || "https://placeholder-url.supabase.co";
  const key = supabaseKey || "placeholder-anon-key";

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key is missing! Using placeholder values for build compilation.');
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
          }
        },
      },
    },
  );
};

