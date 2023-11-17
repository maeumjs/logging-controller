import type { LevelWithSilent } from 'pino';

export function getPinoLevel(level?: string): LevelWithSilent {
  switch (level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
    case 'silent':
      return level;
    default:
      return 'info';
  }
}
