import type winston from 'winston';

export interface IWinstonMaeumLogger {
  /** name of the application for logger */
  name: string;

  /** winston logger */
  logger: winston.Logger;

  /** winston logger option */
  options: winston.LoggerOptions;
}
