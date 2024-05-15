import type pino from 'pino';

export type TPinoAsyncGetOptions = (
  options?: Partial<pino.LoggerOptions>,
) => Promise<Partial<pino.LoggerOptions>>;
