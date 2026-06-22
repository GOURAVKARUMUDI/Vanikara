// @ts-ignore
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string to prevent XSS.
 */
export const sanitize = (str: string): string => {
  if (typeof str !== 'string') return '';
  return DOMPurify.sanitize(str.trim());
};

/**
 * Sanitize string to prevent XSS (Alias for sanitize).
 */
export const sanitizeInput = (str: string): string => sanitize(str);

/**
 * Detect threat score and classification based on input content.
 */
export const detectThreat = (str: string): { score: number; classification: 'low' | 'medium' | 'high' } => {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /eval\(/i,
    /alert\(/i,
  ];

  let score = 0;
  xssPatterns.forEach(pattern => {
    if (pattern.test(str)) score += 25;
  });

  if (score > 60) return { score, classification: 'high' };
  if (score > 20) return { score, classification: 'medium' };
  return { score, classification: 'low' };
};

/**
 * Validate object payload for malicious content.
 */
export const validatePayload = (payload: any): { isSafe: boolean; threats: string[] } => {
  const threats: string[] = [];
  
  const checkValue = (val: any) => {
    if (typeof val === 'string') {
      const { score } = detectThreat(val);
      if (score > 60) threats.push(`Potential threat in value: ${val.substring(0, 20)}...`);
    } else if (typeof val === 'object' && val !== null) {
      Object.values(val).forEach(checkValue);
    }
  };

  checkValue(payload);
  return { isSafe: threats.length === 0, threats };
};

/**
 * Validate email format.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Unified API response formatter.
 * Returns the actual user-facing error string passed to the function.
 * For security-sensitive contexts, callers should pass a safe message
 * rather than raw internal error details.
 */
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
  metadata?: Record<string, any>
) => {
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
