import { CE_DI } from '#/di/CE_DI';
import { PinoLoggers } from '#/loggings/pino/PinoLoggers';
import type { IPinoMaeumLogger } from '#/loggings/pino/interfaces/IPinoMaeumLogger';
import type { TPinoLoggersBootstrapSyncOptions } from '#/loggings/pino/interfaces/TPinoLoggersBootstrapSyncOptions';
import { getPinoLoggersSyncOptions } from '#/loggings/pino/options/getPinoLoggersSyncOptions';
import { getWinstonSyncLoggers } from '#/loggings/winston/modules/getWinstonSyncLoggers';
import type { IClassContainer } from '@maeum/tools';

export function makePinoSyncLoggers(
  container: IClassContainer,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TPinoLoggersBootstrapSyncOptions;
  },
) {
  const options = getPinoLoggersSyncOptions(makeOptions?.options);
  const loggers = Array.from(options.entries()).reduce((aggregations, [name, application]) => {
    const logger = getWinstonSyncLoggers(name, application.getOptions, application.defaultOptions);

    if (logger == null) {
      return aggregations;
    }

    return { ...aggregations, [name]: logger };
  }, new Map<string, IPinoMaeumLogger>());

  const pinoLoggers = new PinoLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(CE_DI.PINO_LOGGERS, pinoLoggers);
  container.register(CE_DI.MAEUM_LOGGERS, pinoLoggers);

  return pinoLoggers;
}
