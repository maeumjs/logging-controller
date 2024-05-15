import pino from 'pino';

export const CE_PINO_DEFAULT_VALUE = {
  DEFAULT_NAME: 'app',
  LEVEL: 'info' satisfies pino.Level,
  LEVELS: pino.levels.values,
  LOCAL_DIR: 'logs',
  FILENAME: 'nodejs.log',
} as const;

export type CE_PINO_DEFAULT_VALUE =
  (typeof CE_PINO_DEFAULT_VALUE)[keyof typeof CE_PINO_DEFAULT_VALUE];
