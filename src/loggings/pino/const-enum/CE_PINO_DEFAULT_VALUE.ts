import pino from 'pino';

export const CE_PINO_DEFAULT_VALUE = {
  DEFAULT_NAME: 'app',
  LEVEL: 'info' satisfies keyof typeof pino.levels.values,
  LEVELS: pino.levels,
  LOCAL_DIR: 'logs',
  FILENAME: 'nodejs.log',
} as const;

export type CE_PINO_DEFAULT_VALUE =
  (typeof CE_PINO_DEFAULT_VALUE)[keyof typeof CE_PINO_DEFAULT_VALUE];
