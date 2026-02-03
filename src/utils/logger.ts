/**
 * Logger utility for development-only logging
 * Suppresses all logs in production builds
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerInterface {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

class Logger implements LoggerInterface {
  private shouldLog(_level: LogLevel): boolean {
    // Only log in development mode
    // __DEV__ is a React Native global that is true in development
    if (typeof __DEV__ !== 'undefined' && !__DEV__) {
      return false;
    }
    return true;
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
