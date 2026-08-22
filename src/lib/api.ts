import { sanitizeInput, validatePayload } from './security';
import { securityLogger } from '../utils/security-logger';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const method = options.method || 'GET';
  
  if (options.body && typeof options.body === 'string') {
    try {
      const parsedBody = JSON.parse(options.body);
      const { isSafe, threats } = validatePayload(parsedBody);
      
      if (!isSafe) {
        securityLogger.log('REQUEST_BLOCKED', 'Malicious payload rejected', {
          path: url,
          payload: parsedBody,
          threats
        });
        throw new Error('SECURITY_VIOLATION');
      }

      const sanitizedBody: Record<string, any> = {};
      Object.entries(parsedBody).forEach(([k, v]) => {
        sanitizedBody[k] = typeof v === 'string' ? sanitizeInput(v) : v;
      });
      options.body = JSON.stringify(sanitizedBody);
    } catch (e) {
      if ((e as Error).message === 'SECURITY_VIOLATION') throw e;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      securityLogger.log('AUTH_FAILURE', 'Unauthorized access attempt', { path: url });
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body: any, options?: RequestInit) => 
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: any, options?: RequestInit) => 
    request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'DELETE' })
};
