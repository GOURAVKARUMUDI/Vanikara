type SecurityLogType = 'THREAT_DETECTED' | 'REQUEST_BLOCKED' | 'AUTH_FAILURE' | 'XSS_ATTEMPT' | 'SQLI_ATTEMPT';

interface SecurityMetadata {
  score?: number;
  path?: string;
  ip?: string;
  userAgent?: string;
  payload?: any;
  userId?: string;
  threats?: string[];
}

export const securityLogger = {
  log: (type: SecurityLogType, message: string, meta: SecurityMetadata = {}) => {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      type,
      message,
      ...meta,
      env: process.env.NODE_ENV
    };

    console.group(`[SECURITY-${type}]`);
    if (meta.score && meta.score > 60) {
      console.error(`DANGER: ${message}`, entry);
    } else {
      console.warn(`ALERT: ${message}`, entry);
    }
    console.groupEnd();

    if (process.env.NODE_ENV === 'production') {
      // Transmission to external logging vault (mock)
    }
  }
};
