import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { getWinstonLevel } from '#/loggings/winston/options/getWinstonLevel';
import os from 'node:os';
import winston from 'winston';

export function makeWinstonFileTransport(
  level?: keyof typeof winston.config.syslog.levels,
  dirname?: string,
  filename?: string,
  formatter?: winston.Logform.Format,
) {
  return new winston.transports.File({
    level: getWinstonLevel(level) as string,
    dirname: dirname ?? CE_WINSTON_DEFAULT_VALUE.LOCAL_DIR,
    filename: filename ?? CE_WINSTON_DEFAULT_VALUE.FILENAME,
    format: formatter ?? getFormatter(),
    eol: os.EOL,
  });
}
