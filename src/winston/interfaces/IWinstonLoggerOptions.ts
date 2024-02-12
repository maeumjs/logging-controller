import type winston from 'winston';

export interface IWinstonLoggerOptions {
  level: string;

  levels: winston.config.AbstractConfigSetLevels;

  /** application name */
  name: string;

  /** transports.File 같은 파일을 사용하는 `transports`를 사용하는 경우 file 이름 */
  getFilePath: () => string;

  /** formatter */
  formatter: winston.Logform.Format;

  defaultMeta: () => Record<string, unknown>;
}
