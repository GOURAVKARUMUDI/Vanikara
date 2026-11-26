import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// `next build` loads route modules without runtime secrets, so placeholders are
// only allowed during that build phase. At runtime in production, a missing
// configuration must fail loudly instead of sending every query to a fake host.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const isMissing = !supabaseUrl || !supabaseServiceKey;

if (isMissing && process.env.NODE_ENV === "production" && !isBuildPhase) {
  throw new Error(
    "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
  );
}

if (isMissing) {
  console.warn("Supabase URL or service role key is missing; database calls will fail until they are set.");
}

export const supabaseService = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseServiceKey || "placeholder-service-role-key"
);
