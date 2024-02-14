import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { ll } from '#/common/ll';
import { getError } from '#/common/modules/getError';
import { CE_WINSTON_DEFAULT_VALUE } from '#/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type {
  IWinstonContainerOptions,
  IWinstonMaeumLogger,
  TAsyncGetOptions,
  TSyncGetOptions,
  TWinstonContainerBootstrapOptions,
} from '#/winston/interfaces/IWinstonContainerOption';
import type { IWintonLogger } from '#/winston/interfaces/IWintonLogger';
import { getLogMethod } from '#/winston/modules/getLogMethod';
import { getNonNullableOptions } from '#/winston/modules/getNonNullableOptions';
import { getWinstonContainerOptions } from '#/winston/modules/getWinstonContainerOption';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import { isPromise } from 'util/types';
import winston from 'winston';

export class WinstonContainer {
  static #it: WinstonContainer;

  static #isBootstrap: boolean = false;

  static #defaultName: string = CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME;

  public static get it() {
    return WinstonContainer.#it;
  }

  public static get isBootstrap() {
    return WinstonContainer.#isBootstrap;
  }

  public static get defaultName() {
    return WinstonContainer.#defaultName;
  }

  public static getSyncLoggers(
    name: string,
    getOptions: TAsyncGetOptions | TSyncGetOptions | undefined,
    defaultOptions: Partial<winston.LoggerOptions> | undefined,
  ): IWinstonMaeumLogger | undefined {
    if (getOptions == null) {
      const options = getNonNullableOptions();
      const logger = winston.createLogger(options);
      return { logger, name, options };
    }

    const nullables = getOptions(defaultOptions);
    const options = isPromise(nullables) ? undefined : nullables;

    if (options == null) {
      return undefined;
    }

    const defaultMeta = { logger: WinstonContainer.#defaultName, pid: process.pid };
    const logger = winston.createLogger(getNonNullableOptions({ ...options, defaultMeta }));

    return { logger, name, options };
  }

  public static async getAsyncLoggers(
    name: string,
    getOptions: TAsyncGetOptions | TSyncGetOptions | undefined,
    defaultOptions: Partial<winston.LoggerOptions> | undefined,
  ): Promise<IWinstonMaeumLogger> {
    if (getOptions == null) {
      const options = getNonNullableOptions();
      const logger = winston.createLogger(options);
      return { logger, name, options };
    }

    const nullables = getOptions(defaultOptions);
    const options = isPromise(nullables) ? await nullables : nullables;
    const defaultMeta = { logger: WinstonContainer.#defaultName, pid: process.pid };
    const logger = winston.createLogger(getNonNullableOptions({ ...options, defaultMeta }));

    return { logger, name, options };
  }

  public static bootstrap<TASYNC extends boolean>(
    async?: TASYNC,
    getEnableDebugMessage?: () => boolean,
    defaultAppName?: string,
    nullableOption?: TWinstonContainerBootstrapOptions<TASYNC>,
  ): TASYNC extends true ? Promise<WinstonContainer> : WinstonContainer;
  public static bootstrap<TASYNC extends boolean>(
    async?: TASYNC,
    getEnableDebugMessage?: () => boolean,
    defaultAppName?: string,
    nullableOption?: TWinstonContainerBootstrapOptions<TASYNC>,
  ): Promise<WinstonContainer> | WinstonContainer {
    if (WinstonContainer.#isBootstrap) {
      return WinstonContainer.#it;
    }

    const option = getWinstonContainerOptions<TASYNC>(nullableOption);

    WinstonContainer.#defaultName = defaultAppName ?? CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME;

    if (async) {
      return (async () => {
        const loggers: IWinstonContainerOptions['loggers'] = await Object.entries(option).reduce(
          async (prevHandle: Promise<IWinstonContainerOptions['loggers']>, [name, application]) => {
            const handle = async (aggregations: IWinstonContainerOptions['loggers']) => {
              const logger = await WinstonContainer.getAsyncLoggers(
                name,
                application.getOptions,
                application.defaultOptions,
              );

              return { ...aggregations, [name]: logger };
            };

            return handle(await prevHandle);
          },
          Promise.resolve({}),
        );

        WinstonContainer.#it = new WinstonContainer({
          getEnableDebugMessage: getEnableDebugMessage ?? (() => false),
          loggers,
        });
        WinstonContainer.#isBootstrap = true;

        return WinstonContainer.#it;
      })(); // end of async logic
    }

    const loggers = Object.entries(option).reduce((aggregations, [name, application]) => {
      const logger = WinstonContainer.getSyncLoggers(
        name,
        application.getOptions,
        application.defaultOptions,
      );

      if (logger == null) {
        return aggregations;
      }

      return { ...aggregations, [name]: logger };
    }, {});

    WinstonContainer.#it = new WinstonContainer({
      getEnableDebugMessage: getEnableDebugMessage ?? (() => false),
      loggers,
    });
    WinstonContainer.#isBootstrap = true;

    return WinstonContainer.#it;
  }

  public static l(rawName: string, rawFullname?: string): Readonly<IWintonLogger> {
    const { name, fullname } =
      rawFullname == null
        ? {
            name: WinstonContainer.defaultName,
            fullname: rawName,
          }
        : { name: rawName, fullname: rawFullname };
    const filename = basenames(fullname, ['.ts', '.tsx', '.mts', '.cts']);

    let debugLogger: debug.IDebugger | undefined;

    const debugLogging = (...args: any[]) => {
      debugLogger =
        debugLogger != null
          ? debugLogger
          : ll(process.env.DEBUG_CHANNEL, filename, WinstonContainer.#it.#getEnableDebugMessage());

      const [formatter, ...rest] = args;
      debugLogger(formatter, ...rest);
    };

    const doLogging = (
      level: keyof winston.config.SyslogConfigSetLevels,
      content: Partial<ILogFormat & { err: Error }>,
    ) => {
      const application = WinstonContainer.#it.#loggers[name];

      if (application == null) {
        throw new Error(`Logging application([${name}]) does not exists`);
      }

      if (!WinstonContainer.#isBootstrap) {
        throw new Error(`WinstonContainer not bootstrapped`);
      }

      try {
        const status = content.status ?? httpStatusCodes.OK;
        const id = content.id ?? 'SYS';
        const func = getLogMethod(level, application.logger);

        func('', {
          ...content,
          status,
          id,
          filename,
          ...getError(content),
          body: content.body,
        });
      } catch (catched) {
        const err = isError(catched, new Error(`unknown error raised from ${__filename}`));
        debugLogging(err.message); // eslint-disable-line
        debugLogging(err.stack); // eslint-disable-line
      }
    };

    return {
      $kind: 'winston',
      emerg: (content: Partial<ILogFormat & { err: Error }>) => doLogging('emerg', content),
      alert: (content: Partial<ILogFormat & { err: Error }>) => doLogging('alert', content),
      crit: (content: Partial<ILogFormat & { err: Error }>) => doLogging('crit', content),
      error: (content: Partial<ILogFormat & { err: Error }>) => doLogging('error', content),
      warning: (content: Partial<ILogFormat & { err: Error }>) => doLogging('warning', content),
      notice: (content: Partial<ILogFormat & { err: Error }>) => doLogging('notice', content),
      info: (content: Partial<ILogFormat & { err: Error }>) => doLogging('info', content),
      debug: (content: Partial<ILogFormat & { err: Error }>) => doLogging('debug', content),
      $: (...args: any[]) => {
        debugLogging(...args);
      },
    };
  }

  #getEnableDebugMessage: IWinstonContainerOptions['getEnableDebugMessage'];

  #loggers: IWinstonContainerOptions['loggers'];

  constructor(options: IWinstonContainerOptions) {
    this.#getEnableDebugMessage = options.getEnableDebugMessage;
    this.#loggers = options.loggers;
  }

  get loggers(): IWinstonContainerOptions['loggers'] {
    return this.#loggers;
  }
}
