import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clientInstance: any = null;

export const createClient = () => {
  const url = supabaseUrl || "https://placeholder-url.supabase.co";
  const key = supabaseKey || "placeholder-anon-key";

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key is missing! Using placeholder values for build compilation.');
  }

  if (typeof window === 'undefined') {
    return createBrowserClient(url, key);
  }
  if (!clientInstance) {
    clientInstance = createBrowserClient(url, key);
  }
  return clientInstance;
};

