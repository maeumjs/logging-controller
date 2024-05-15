import { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import { WINSTON_LOGGERS_SYMBOL_KEY } from '#/common/symbols/WINSTON_LOGGERS_SYMBOL_KEY';
import { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import type { IWinstonLoggersOptions } from '#/loggings/winston/interfaces/IWinstonLoggersOptions';
import type { IWinstonMaeumLogger } from '#/loggings/winston/interfaces/IWinstonMaeumLogger';
import type { TWinstonLoggersAsyncBootstrapOptions } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapAsyncOptions';
import { getWinstonAsyncLoggers } from '#/loggings/winston/modules/getWinstonAsyncLoggers';
import { getWinstonLoggersAsyncOptions } from '#/loggings/winston/options/getWinstonLoggersAsyncOptions';
import type { IClassContainer } from '@maeum/tools';

export async function makeAsyncWinstonLoggers(
  container: IClassContainer,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersAsyncBootstrapOptions;
  },
) {
  const options = getWinstonLoggersAsyncOptions(makeOptions?.options);

  const loggers: IWinstonLoggersOptions['loggers'] = await Array.from(options.entries()).reduce(
    async (prevHandle: Promise<IWinstonLoggersOptions['loggers']>, [name, application]) => {
      const handle = async (aggregations: IWinstonLoggersOptions['loggers']) => {
        const logger = await getWinstonAsyncLoggers(
          name,
          application.getOptions,
          application.defaultOptions,
        );

        aggregations.set(name, logger);
        return aggregations;
      };

      return handle(await prevHandle);
    },
    Promise.resolve(new Map<string, IWinstonMaeumLogger>()),
  );

  const winstonLoggers = new WinstonLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(WINSTON_LOGGERS_SYMBOL_KEY, winstonLoggers);
  container.register(MAEUM_LOGGERS_SYMBOL_KEY, winstonLoggers);

  return winstonLoggers;
}
