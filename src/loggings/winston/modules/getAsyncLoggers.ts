import type {
  IWinstonMaeumLogger,
  TAsyncGetOptions,
  TSyncGetOptions,
} from '#/loggings/winston/interfaces/IWinstonContainerOption';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';
import { isPromise } from 'util/types';
import winston from 'winston';

export async function getAsyncLoggers(
  name: string,
  getOptions?: TAsyncGetOptions | TSyncGetOptions,
  partialOptions?: Partial<winston.LoggerOptions>,
): Promise<IWinstonMaeumLogger> {
  if (getOptions == null) {
    const options = getNonNullableOptions();
    const logger = winston.createLogger(options);
    return { logger, name, options };
  }

  const nullables = getOptions(partialOptions);
  const options = isPromise(nullables) ? await nullables : nullables;
  const defaultMeta = { logger: name, pid: process.pid };
  const logger = winston.createLogger(getNonNullableOptions({ ...options, defaultMeta }));

  return { logger, name, options };
}
