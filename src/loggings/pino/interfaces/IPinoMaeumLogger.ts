import type pino from 'pino';

export interface IPinoMaeumLogger {
  /** name of the application for logger */
  name: string;

  /** pino logger */
  logger: pino.Logger;

  /** pino logger option */
  options: pino.LoggerOptions;
}
