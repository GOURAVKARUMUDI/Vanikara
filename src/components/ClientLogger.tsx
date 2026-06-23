'use client';

import { useEffect } from 'react';
import { logger } from '@/utils/logger';

export default function ClientLogger() {
  useEffect(() => {
    // Suppress third-party Three.js deprecation warnings (e.g. THREE.Clock instantiated internally by R3F)
    const originalWarn = console.warn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.warn = (...args: any[]) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    logger.lifecycle('Application', 'mount');

    const handleWindowError = (event: ErrorEvent) => {
      logger.error('Unhandled client error', event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });

      // Post trace dump to the logs reporter endpoint
      fetch('/api/logs/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'ERROR',
          message: event.message,
          error: event.error ? { message: event.error.message, stack: event.error.stack } : null,
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            url: typeof window !== "undefined" ? window.location.href : "unknown",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
          }
        })
      }).catch(() => {});
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      logger.error('Unhandled promise rejection', reason);

      fetch('/api/logs/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'REJECTION',
          message: reason instanceof Error ? reason.message : String(reason),
          error: reason instanceof Error ? { message: reason.message, stack: reason.stack } : String(reason),
          context: {
            url: typeof window !== "undefined" ? window.location.href : "unknown",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
          }
        })
      }).catch(() => {});
    };

    if (typeof window !== "undefined") {
      window.addEventListener('error', handleWindowError);
      window.addEventListener('unhandledrejection', handleRejection);
    }

    return () => {
      console.warn = originalWarn;
      if (typeof window !== "undefined") {
        window.removeEventListener('error', handleWindowError);
        window.removeEventListener('unhandledrejection', handleRejection);
      }
    };
  }, []);

  return null;
}
