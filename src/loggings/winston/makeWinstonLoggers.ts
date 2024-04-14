import { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import { WINSTON_LOGGERS_SYMBOL_KEY } from '#/common/symbols/WINSTON_LOGGERS_SYMBOL_KEY';
import { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import type {
  IWinstonLoggersOptions,
  IWinstonMaeumLogger,
  TWinstonLoggersBootstrapOptions,
} from '#/loggings/winston/interfaces/IWinstonContainerOption';
import { getAsyncLoggers } from '#/loggings/winston/modules/getAsyncLoggers';
import { getSyncLoggers } from '#/loggings/winston/modules/getSyncLoggers';
import { getWinstonContainerOptions } from '#/loggings/winston/options/getWinstonContainerOption';
import { asValue, type AwilixContainer } from 'awilix';

export function makeWinstonLoggers<TASYNC extends boolean>(
  container: AwilixContainer,
  async?: TASYNC,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersBootstrapOptions<TASYNC>;
  },
): TASYNC extends true ? Promise<WinstonLoggers> : WinstonLoggers;
export function makeWinstonLoggers<TASYNC extends boolean>(
  container: AwilixContainer,
  async?: TASYNC,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersBootstrapOptions<TASYNC>;
  },
) {
  const options = getWinstonContainerOptions<TASYNC>(makeOptions?.options);

  if (async) {
    return (async () => {
      const loggers: IWinstonLoggersOptions['loggers'] = await Array.from(options.entries()).reduce(
        async (prevHandle: Promise<IWinstonLoggersOptions['loggers']>, [name, application]) => {
          const handle = async (aggregations: IWinstonLoggersOptions['loggers']) => {
            const logger = await getAsyncLoggers(
              name,
              application.getOptions,
              application.defaultOptions,
            );

            return { ...aggregations, [name]: logger };
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

      container.register(WINSTON_LOGGERS_SYMBOL_KEY, asValue(winstonLoggers));
      container.register(MAEUM_LOGGERS_SYMBOL_KEY, asValue(winstonLoggers));

      return winstonLoggers;
    })(); // end of async logic
  }

  const loggers = Array.from(options.entries()).reduce((aggregations, [name, application]) => {
    const logger = getSyncLoggers(name, application.getOptions, application.defaultOptions);

    if (logger == null) {
      return aggregations;
    }

    return { ...aggregations, [name]: logger };
  }, new Map<string, IWinstonMaeumLogger>());

  const winstonLoggers = new WinstonLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(WINSTON_LOGGERS_SYMBOL_KEY, asValue(winstonLoggers));
  container.register(MAEUM_LOGGERS_SYMBOL_KEY, asValue(winstonLoggers));

  return winstonLoggers;
}
