import winston from 'winston';

export const CE_WINSTON_DEFAULT_VALUE = {
  DEFAULT_NAME: 'app',
  LEVEL: 'info' satisfies keyof typeof winston.config.syslog.levels,
  LEVELS: winston.config.syslog.levels,
  LOCAL_DIR: 'logs',
  FILENAME: 'nodejs.log',
} as const;

export type CE_WINSTON_DEFAULT_VALUE =
  (typeof CE_WINSTON_DEFAULT_VALUE)[keyof typeof CE_WINSTON_DEFAULT_VALUE];
