import type winston from 'winston';

export type TWinstonAsyncGetOptions = (
  options?: Partial<winston.LoggerOptions>,
) => Promise<Partial<winston.LoggerOptions>>;
