import { $YMBOL_KEY_MAEUM_LOGGERS } from '#/common/symbols/SYMBOL_KEY_MAEUM_LOGGERS';
import { $YMBOL_KEY_WINSTON_LOGGERS } from '#/common/symbols/SYMBOL_KEY_WINSTON_LOGGERS';
import { PinoLoggers } from '#/loggings/pino/PinoLoggers';
import type { IPinoLoggersOptions } from '#/loggings/pino/interfaces/IPinoLoggersOptions';
import type { IPinoMaeumLogger } from '#/loggings/pino/interfaces/IPinoMaeumLogger';
import type { TPinoLoggersBootstrapAsyncOptions } from '#/loggings/pino/interfaces/TPinoLoggersBootstrapAsyncOptions';
import { getPinoAsyncLoggers } from '#/loggings/pino/modules/getPinoAsyncLoggers';
import { getPinoLoggersAsyncOptions } from '#/loggings/pino/options/getPinoLoggersAsyncOptions';
import type { IClassContainer } from '@maeum/tools';

export async function makePinoAsyncLoggers(
  container: IClassContainer,
  makeOptions?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TPinoLoggersBootstrapAsyncOptions;
  },
) {
  const options = getPinoLoggersAsyncOptions(makeOptions?.options);
  const loggers: IPinoLoggersOptions['loggers'] = await Array.from(options.entries()).reduce(
    async (prevHandle: Promise<IPinoLoggersOptions['loggers']>, [name, application]) => {
      const handle = async (aggregations: IPinoLoggersOptions['loggers']) => {
        const logger = await getPinoAsyncLoggers(
          name,
          application.getOptions,
          application.defaultOptions,
        );

        return { ...aggregations, [name]: logger };
      };

      return handle(await prevHandle);
    },
    Promise.resolve(new Map<string, IPinoMaeumLogger>()),
  );

  const winstonLoggers = new PinoLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register($YMBOL_KEY_WINSTON_LOGGERS, winstonLoggers);
  container.register($YMBOL_KEY_MAEUM_LOGGERS, winstonLoggers);

  return winstonLoggers;
}
