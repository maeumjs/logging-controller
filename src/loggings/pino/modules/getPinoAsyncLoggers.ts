import type { IPinoMaeumLogger } from '#/loggings/pino/interfaces/IPinoMaeumLogger';
import type { TPinoAsyncGetOptions } from '#/loggings/pino/interfaces/TPinoAsyncGetOptions';
import type { TPinoSyncGetOptions } from '#/loggings/pino/interfaces/TPinoSyncGetOptions';
import { getPinoNonNullableOptions } from '#/loggings/pino/options/getPinoNonNullableOptions';
import pino from 'pino';
import { isPromise } from 'util/types';

export async function getPinoAsyncLoggers(
  name: string,
  getOptions?: TPinoAsyncGetOptions | TPinoSyncGetOptions,
  partialOptions?: Partial<pino.LoggerOptions>,
): Promise<IPinoMaeumLogger> {
  if (getOptions == null) {
    const options = getPinoNonNullableOptions();
    const logger = pino(options);
    return { logger, name, options };
  }

  const nullables = getOptions(partialOptions);
  const options = isPromise(nullables) ? await nullables : nullables;
  const logger = pino(getPinoNonNullableOptions(options));

  return { logger, name, options };
}
