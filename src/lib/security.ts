// @ts-expect-error isomorphic-dompurify has mismatched types sometimes
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string to prevent XSS.
 */
export const sanitize = (str: string): string => {
  if (typeof str !== 'string') return '';
  return DOMPurify.sanitize(str.trim());
};

/**
 * HTML-encode a string for safe interpolation into HTML email templates.
 * Prevents XSS via email clients that render HTML.
 */
export const escapeHtml = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Unified API response formatter.
 * Returns the actual user-facing error string passed to the function.
 * For security-sensitive contexts, callers should pass a safe message
 * rather than raw internal error details.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiResponse = (success: boolean, data: any = null, error: string | null = null) => {
  return { success, data, error };
};

/**
 * Structured error logging for server-side diagnostics.
 * Logs detailed context for developers without exposing secrets to clients.
 *
 * @param context   - Component or module name (e.g. "Stream Route", "OpenAI Provider")
 * @param error     - The error object or message string
 * @param metadata  - Optional structured fields for log correlation
 */
export const logError = (
  context: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  metadata?: {
    requestId?: string;
    model?: string;
    statusCode?: number;
    errorType?: string;
    userId?: string;
    latencyMs?: number;
  }
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry: Record<string, any> = {
    timestamp: new Date().toISOString(),
    context,
    // Supabase/PostgREST errors are plain objects: keep their message and code
    message:
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null
          ? [error.code, error.message ?? JSON.stringify(error), error.details].filter(Boolean).join(" — ")
          : String(error),
  };

  if (error instanceof Error && error.stack) {
    entry.stack = error.stack;
  }

  if (metadata) {
    Object.assign(entry, metadata);
  }

  console.error(`[CYGMA][${entry.timestamp}][${context}]`, JSON.stringify(entry, null, 2));
};

/**
 * Structured info logging for non-error diagnostics.
 */
export const logInfo = (
  context: string,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry: Record<string, any> = {
    timestamp: new Date().toISOString(),
    context,
    message,
    ...metadata,
  };

  console.log(`[CYGMA][${entry.timestamp}][${context}]`, JSON.stringify(entry, null, 2));
};

/**
 * Honeypot check.
 */
export const isBot = (honeypot: string): boolean => {
  return honeypot.length > 0;
};

/**
 * CSRF defense-in-depth for cookie-authenticated, state-changing requests.
 *
 * Supabase's session cookies are already SameSite=Lax, which blocks the
 * cookie from being attached to cross-site POST/PATCH/DELETE requests —
 * that alone stops the classic CSRF attack. This adds a second, explicit
 * check (matching the request's Origin against the app's own origin) so
 * privileged mutations don't rely on cookie attributes alone.
 */
export const isTrustedOrigin = (req: Request): boolean => {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  // Same-origin fetch/XHR requests always send an Origin header for
  // state-changing methods; its absence here is itself suspicious for a
  // browser-originated request, so treat a missing header as untrusted.
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

