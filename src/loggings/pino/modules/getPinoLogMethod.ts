import type pino from 'pino';

export function getPinoLogMethod(level: pino.Level, logger: pino.Logger) {
  switch (level) {
    case 'fatal':
      return logger.fatal;
    case 'warn':
      return logger.warn;
    case 'error':
      return logger.error;
    case 'info':
      return logger.info;
    case 'trace':
      return logger.trace;
    default:
      return logger.trace;
  }
}
