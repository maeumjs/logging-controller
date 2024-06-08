import { CE_DI } from '#/di/CE_DI';
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

  const pinoLoggers = new PinoLoggers({
    getEnableDebugMessage: makeOptions?.getEnableDebugMessage ?? (() => false),
    loggers,
    defaultAppName: makeOptions?.defaultAppName,
  });

  container.register(CE_DI.PINO_LOGGERS, pinoLoggers);
  container.register(CE_DI.MAEUM_LOGGERS, pinoLoggers);

  return pinoLoggers;
}
