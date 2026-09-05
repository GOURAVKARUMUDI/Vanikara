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
 * Alias for sanitize - used by SecureForm component
 */
export const sanitizeInput = (str: string): string => {
  return sanitize(str);
};

/**
 * Validate payload for security threats (XSS, injection, etc.)
 */
export const validatePayload = (
  payload: Record<string, any>
): { isSafe: boolean; threats: string[] } => {
  const threats: string[] = [];
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === 'string') {
      xssPatterns.forEach((pattern) => {
        if (pattern.test(value)) {
          threats.push(`Potential XSS in field: ${key}`);
        }
      });

      // Check for SQL injection patterns
      if (/('|(--)|;|\/\*|\*\/|(xp_|sp_))/gi.test(value)) {
        threats.push(`Potential SQL injection in field: ${key}`);
      }
    }
  });

  return {
    isSafe: threats.length === 0,
    threats,
  };
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

/**
 * Detect threats in a given string and return risk score and classification
 */
export const detectThreat = (
  input: string
): { score: number; classification: string } => {
  if (typeof input !== 'string') {
    return { score: 0, classification: 'safe' };
  }

  let score = 0;

  // XSS patterns
  if (/<script[^>]*>.*?<\/script>/gi.test(input)) score += 100;
  if (/javascript:/gi.test(input)) score += 80;
  if (/on\w+\s*=/gi.test(input)) score += 70;
  if (/<iframe/gi.test(input)) score += 90;
  if (/<object|<embed/gi.test(input)) score += 85;

  // SQL injection patterns
  if (/('|(--)|;|\/\*|\*\/)/gi.test(input)) score += 60;
  if (/(xp_|sp_)/gi.test(input)) score += 75;

  // Path traversal
  if (/\.\.\//gi.test(input)) score += 50;

  // Command injection
  if (/[;&|`$()]/g.test(input)) score += 40;

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, score);

  let classification = 'safe';
  if (normalizedScore > 70) classification = 'critical';
  else if (normalizedScore > 50) classification = 'high';
  else if (normalizedScore > 30) classification = 'medium';
  else if (normalizedScore > 0) classification = 'low';

  return { score: normalizedScore, classification };
};
