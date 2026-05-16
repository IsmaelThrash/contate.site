// src/lib/logger.js
// Centralized logging utility to prevent sensitive data leakage in production

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // We might want to log errors to an external service (like Sentry) in production,
    // but for now, we just log to console in development.
    if (isDevelopment) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger;
