import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { makeWinstonFileTransport } from '#/loggings/winston/transports/makeWinstonFileTransport';
import type winston from 'winston';

export function getNonNullableOptions(
  nullableOptions?: Partial<winston.LoggerOptions>,
): winston.LoggerOptions {
  const level =
    nullableOptions?.level != null ? nullableOptions.level : CE_WINSTON_DEFAULT_VALUE.LEVEL;

  const levels =
    nullableOptions?.levels != null ? nullableOptions.levels : CE_WINSTON_DEFAULT_VALUE.LEVELS;

  const transportArray =
    nullableOptions?.transports != null
      ? nullableOptions.transports
      : [
          makeWinstonFileTransport(
            CE_WINSTON_DEFAULT_VALUE.LEVEL,
            CE_WINSTON_DEFAULT_VALUE.LOCAL_DIR,
            CE_WINSTON_DEFAULT_VALUE.FILENAME,
            getFormatter(),
          ),
        ];

  const transports =
    Array.isArray(transportArray) && transportArray.length <= 0
      ? [
          makeWinstonFileTransport(
            CE_WINSTON_DEFAULT_VALUE.LEVEL,
            CE_WINSTON_DEFAULT_VALUE.LOCAL_DIR,
            CE_WINSTON_DEFAULT_VALUE.FILENAME,
            getFormatter(),
          ),
        ]
      : transportArray;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const defaultMeta =
    nullableOptions?.defaultMeta != null
      ? nullableOptions.defaultMeta
      : { logger: CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME, pid: process.pid };

  const options: winston.LoggerOptions = {
    ...nullableOptions,
    level,
    levels,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    defaultMeta,
    transports,
  };

  return options;
}
