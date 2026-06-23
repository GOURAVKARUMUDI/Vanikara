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
    message: error instanceof Error ? error.message : String(error),
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
  const _entry: Record<string, any> = {
    timestamp: new Date().toISOString(),
    context,
    message,
    ...metadata,
  };

};

/**
 * Honeypot check.
 */
export const isBot = (honeypot: string): boolean => {
  return honeypot.length > 0;
};
