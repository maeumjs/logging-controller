import { CE_DI } from '#/di/CE_DI';
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
    aggregations.set(name, logger);
    return aggregations;
  }, new Map<string, IWinstonMaeumLogger>());

  const getEnableDebugMessage =
    makeOptions?.getEnableDebugMessage != null ? makeOptions?.getEnableDebugMessage : () => false;
  const winstonLoggers = new WinstonLoggers({
    getEnableDebugMessage,
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(CE_DI.WINSTON_LOGGERS, winstonLoggers);
  container.register(CE_DI.MAEUM_LOGGERS, winstonLoggers);

  return winstonLoggers;
}
