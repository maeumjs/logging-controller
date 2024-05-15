import { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import { WINSTON_LOGGERS_SYMBOL_KEY } from '#/common/symbols/WINSTON_LOGGERS_SYMBOL_KEY';
import { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import type { IWinstonMaeumLogger } from '#/loggings/winston/interfaces/IWinstonMaeumLogger';
import type { TWinstonLoggersSyncBootstrapOptions } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';
import { getWinstonSyncLoggers } from '#/loggings/winston/modules/getWinstonSyncLoggers';
import { getWinstonLoggersSyncOptions } from '#/loggings/winston/options/getWinstonLoggersSyncOptions';
import type { IClassContainer } from '@maeum/tools';

export function makeSyncWinstonLoggers(
  container: IClassContainer,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersSyncBootstrapOptions;
  },
) {
  const options = getWinstonLoggersSyncOptions(makeOptions?.options);

  const loggers = Array.from(options.entries()).reduce((aggregations, [name, application]) => {
    const logger = getWinstonSyncLoggers(name, application.getOptions, application.defaultOptions);

    if (logger == null) {
      return aggregations;
    }

    aggregations.set(name, logger);
    return aggregations;
  }, new Map<string, IWinstonMaeumLogger>());

  const winstonLoggers = new WinstonLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(WINSTON_LOGGERS_SYMBOL_KEY, winstonLoggers);
  container.register(MAEUM_LOGGERS_SYMBOL_KEY, winstonLoggers);

  return winstonLoggers;
}
