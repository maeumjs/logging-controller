import type {
  IWinstonMaeumLogger,
  TAsyncGetOptions,
  TSyncGetOptions,
} from '#/loggings/winston/interfaces/IWinstonContainerOption';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';
import { isPromise } from 'util/types';
import winston from 'winston';

export function getSyncLoggers(
  name: string,
  getOptions?: TAsyncGetOptions | TSyncGetOptions,
  partialOptions?: Partial<winston.LoggerOptions>,
): IWinstonMaeumLogger {
  if (getOptions == null) {
    const options = getNonNullableOptions();
    const logger = winston.createLogger(options);
    return { logger, name, options };
  }

  const nullables = getOptions(partialOptions);
  const options = isPromise(nullables) ? undefined : nullables;

  if (options == null) {
    throw new Error('Sync `getOptions` cannot use async getOptions function');
  }

  const defaultMeta = { logger: name, pid: process.pid };
  const logger = winston.createLogger(getNonNullableOptions({ ...options, defaultMeta }));

  return { logger, name, options };
}
