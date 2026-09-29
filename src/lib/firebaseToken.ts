import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verifies a Firebase Auth ID token on the server without a service
 * account: the token must be signed by Google's Secure Token keys, issued
 * for this Firebase project, unexpired, and belong to a verified Google
 * email. Anything else is rejected.
 */

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
  { cooldownDuration: 30_000, cacheMaxAge: 6 * 60 * 60 * 1000 }
);

export interface VerifiedGoogleUser {
  uid: string;
  email: string;
  name: string;
  picture: string | null;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedGoogleUser | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || typeof idToken !== "string" || idToken.length > 4096) return null;

  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
      clockTolerance: 30,
    });

    const firebase = payload.firebase as { sign_in_provider?: string } | undefined;
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!payload.sub || payload.sub.length > 128) return null;
    if (firebase?.sign_in_provider !== "google.com") return null;
    if (!email || payload.email_verified !== true) return null;
    // Firebase: auth_time must be in the past
    if (typeof payload.auth_time === "number" && payload.auth_time > Date.now() / 1000 + 30) return null;

    const name = typeof payload.name === "string" && payload.name.trim() ? payload.name.trim().slice(0, 100) : email.split("@")[0];
    const picture =
      typeof payload.picture === "string" && /^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\//i.test(payload.picture)
        ? payload.picture
        : null;

    return { uid: payload.sub, email, name, picture };
  } catch {
    return null;
  }
}
