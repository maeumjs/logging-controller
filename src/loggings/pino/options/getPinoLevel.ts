import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import type pino from 'pino';

export function getPinoLevel(level?: unknown, defaultLevel?: pino.Level): pino.Level {
  switch (level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return level;
    default:
      return defaultLevel ?? CE_PINO_DEFAULT_VALUE.LEVEL;
  }
}
