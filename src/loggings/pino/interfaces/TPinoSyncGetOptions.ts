import type pino from 'pino';

export type TPinoSyncGetOptions = (
  options?: Partial<pino.LoggerOptions>,
) => Partial<pino.LoggerOptions>;
