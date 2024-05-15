import type winston from 'winston';

export type TWinsonSyncGetOptions = (
  options?: Partial<winston.LoggerOptions>,
) => Partial<winston.LoggerOptions>;
