/**
 * Vanikara Logger Utility
 * Standardized logging with brand prefixes and environment-aware filtering.
 */

const IS_PROD = process.env.NODE_ENV === 'production';
const DEBUG = !IS_PROD;

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

/**
 * Generates the standardized brand prefix for console logs.
 */
const getPrefix = (level: LogLevel): string => `[VANIKARA_INTELLIGENCE-${level}]`;

export const logger = {
  /**
   * Logs informational messages in non-production environments.
   */
  info: (message: string, ...args: unknown[]): void => {
    if (DEBUG) {
      console.log(`%c${getPrefix('INFO')}: ${message}`, 'color: #1E6BD6; font-weight: bold;', ...args);
    }
  },

  /**
   * Logs warning messages in non-production environments.
   */
  warn: (message: string, ...args: unknown[]): void => {
    if (DEBUG) {
      console.warn(`%c${getPrefix('WARN')}: ${message}`, 'color: #FF7A00; font-weight: bold;', ...args);
    }
  },

  /**
   * Logs error messages with structured context and timestamps.
   * Errors are always logged, even in production.
   */
  error: (message: string, error?: unknown, context?: unknown): void => {
    console.error(`%c[VANIKARA_INTELLIGENCE-ERROR]: ${message}`, 'color: #ef4444; font-weight: bold;');
    if (error) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error('Error Details:', error);
      }
    }
    if (context) {
      console.error('Context:', context);
    }
  },

  /**
   * Starts a console group for related logs.
   */
  group: (title: string): void => {
    if (DEBUG) console.group(`%c${title}`, 'color: #FFC400; font-weight: bold;');
  },

  /**
   * Ends the current console group.
   */
  groupEnd: (): void => {
    if (DEBUG) console.groupEnd();
  },

  /**
   * Standardized helper for component lifecycle events.
   */
  lifecycle: (component: string, event: 'mount' | 'unmount' | 'update'): void => {
    logger.info(`${component} lifecycle: ${event}`);
  },

  /**
   * Standardized helper for form interaction events.
   */
  form: (name: string, status: 'submit' | 'success' | 'failure' | 'validation_error', data?: unknown): void => {
    if (status === 'failure') {
      logger.error(`Form [${name}] - failure`, data);
    } else if (status === 'validation_error') {
      logger.warn(`Form [${name}] - validation_error`, data || '');
    } else {
      logger.info(`Form [${name}] - ${status}`, data || '');
    }
  },

  /**
   * Standardized helper for API request lifecycle events.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: (endpoint: string, status: 'start' | 'success' | 'failure', details?: any): void => {
    const level = status === 'failure' ? 'error' : 'info';
    if (level === 'error') {
      logger.error(`API [${endpoint}] - ${status}`, details?.error, details);
    } else {
      logger.info(`API [${endpoint}] - ${status}`, details || '');
    }
  }
};
