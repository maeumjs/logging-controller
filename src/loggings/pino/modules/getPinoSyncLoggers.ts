import type { IPinoMaeumLogger } from '#/loggings/pino/interfaces/IPinoMaeumLogger';
import type { TPinoSyncGetOptions } from '#/loggings/pino/interfaces/TPinoSyncGetOptions';
import { getPinoNonNullableOptions } from '#/loggings/pino/options/getPinoNonNullableOptions';
import pino from 'pino';

export function getPinoSyncLoggers(
  name: string,
  getOptions?: TPinoSyncGetOptions,
  partialOptions?: Partial<pino.LoggerOptions>,
): IPinoMaeumLogger {
  if (getOptions == null) {
    const options = getPinoNonNullableOptions();
    const logger = pino(options);
    return { logger, name, options };
  }

  const options = getOptions(partialOptions);

  if (options == null) {
    throw new Error('Sync `getOptions` cannot use async getOptions function');
  }

  const logger = pino(getPinoNonNullableOptions(options));

  return { logger, name, options };
}
