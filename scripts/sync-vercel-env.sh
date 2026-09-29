#!/usr/bin/env bash
# Copies the settings the site needs from .env.local into the linked Vercel
# project (Production, Preview and Development). Values go straight from
# this machine to Vercel; nothing is printed or written elsewhere.
#
#   bash scripts/sync-vercel-env.sh
#
# Re-running is safe: existing values are replaced.
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE"; exit 1; }
command -v vercel >/dev/null || { echo "Install the Vercel CLI first: npm i -g vercel@latest"; exit 1; }

# Link this folder to your Vercel project once (asks which project).
[ -f .vercel/project.json ] || vercel link

REQUIRED=(
  NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY
  ADMIN_ACCOUNTS ADMIN_SESSION_SECRET
  NEXT_PUBLIC_FIREBASE_API_KEY NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
)
# Sent only if they have a value in .env.local
OPTIONAL=(
  SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS
  UPSTASH_REDIS_REST_URL UPSTASH_REDIS_REST_TOKEN
  RAZORPAY_KEY_ID RAZORPAY_KEY_SECRET NEXT_PUBLIC_RAZORPAY_KEY_ID
  GOOGLE_FORM_CONTACT_URL GOOGLE_FORM_CAREERS_URL GOOGLE_FORM_INTERNSHIP_URL
)

value_of() {
  # Last uncommented NAME=value line, without surrounding quotes
  grep -E "^$1=" "$ENV_FILE" | tail -1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/'
}

push() {
  local name="$1" value="$2"
  for target in production preview development; do
    vercel env rm "$name" "$target" -y >/dev/null 2>&1 || true
    printf '%s' "$value" | vercel env add "$name" "$target" >/dev/null
  done
  echo "  ✓ $name"
}

missing=0
echo "Required settings:"
for name in "${REQUIRED[@]}"; do
  v="$(value_of "$name")"
  if [ -z "$v" ]; then echo "  ✗ $name is empty in $ENV_FILE"; missing=1; else push "$name" "$v"; fi
done

echo "Optional settings:"
for name in "${OPTIONAL[@]}"; do
  v="$(value_of "$name")"
  if [ -n "$v" ]; then push "$name" "$v"; else echo "  – $name (not set, skipped)"; fi
done

# The public site URL must be the real domain in production, never localhost.
vercel env rm NEXT_PUBLIC_SITE_URL production -y >/dev/null 2>&1 || true
printf '%s' "https://www.vanikara.com" | vercel env add NEXT_PUBLIC_SITE_URL production >/dev/null
echo "  ✓ NEXT_PUBLIC_SITE_URL (production = https://www.vanikara.com)"

[ "$missing" -eq 0 ] || { echo "Some required settings are empty — fill them in $ENV_FILE and run again."; exit 1; }
echo
echo "Done. Redeploy for the new values to take effect:  vercel --prod   (or push to your production branch)"
