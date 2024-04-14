import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { getWinstonLevel } from '#/loggings/winston/options/getWinstonLevel';
import os from 'node:os';
import winston from 'winston';

export function createConsoleTransport(
  level?: keyof typeof winston.config.syslog.levels,
  formatter?: winston.Logform.Format,
) {
  return new winston.transports.Console({
    level: getWinstonLevel(level) as string,
    format: formatter ?? getFormatter(),
    eol: os.EOL,
  });
}
