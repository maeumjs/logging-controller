import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import { makePinoTransport } from '#/loggings/pino/transports/makePinoTransport';
import type pino from 'pino';

export function getPinoNonNullableOptions(
  nullableOptions?: Partial<pino.LoggerOptions>,
): pino.LoggerOptions {
  const level =
    nullableOptions?.level != null ? nullableOptions.level : CE_PINO_DEFAULT_VALUE.LEVEL;

  const levels =
    nullableOptions?.customLevels != null
      ? nullableOptions.customLevels
      : CE_PINO_DEFAULT_VALUE.LEVELS;

  const transport =
    nullableOptions?.transport != null ? nullableOptions.transport : makePinoTransport();

  const options: pino.LoggerOptions = {
    ...nullableOptions,
    level,
    customLevels: levels,
    transport,
  };

  return options;
}
