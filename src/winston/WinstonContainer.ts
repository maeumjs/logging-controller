import { CE_DEFAULT_VALUE } from '#/common/const-enum/CE_DEFAULT_VALUE';
import type ILogContainerOption from '#/common/interfaces/ILogContainerOption';
import type { TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import type ILogFormat from '#/common/interfaces/ILogFormat';
import ll from '#/common/ll';
import getError from '#/common/modules/getError';
import prepareCreation from '#/common/modules/prepareCreation';
import prepareCreationSync from '#/common/modules/prepareCreationSync';
import type IWinstonContainerOption from '#/winston/interfaces/IWinstonContainerOption';
import type IWintonLogger from '#/winston/interfaces/IWintonLogger';
import getFormatter from '#/winston/modules/getFormatter';
import getWinstonContainerOption from '#/winston/modules/getWinstonContainerOption';
import getWinstonLevel from '#/winston/modules/getWinstonLevel';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import os from 'node:os';
import path from 'node:path';
import type { LastArrayElement } from 'type-fest';
import winston from 'winston';

type TWinstionLoggerApplication = {
  logger: winston.Logger;
  application: LastArrayElement<IWinstonContainerOption['applications']>;
};

type TWinstonLoggerContainer = Record<string, TWinstionLoggerApplication>;

export default class WinstonContainer {
  static #it: WinstonContainer;

  static #isBootstrap: boolean = false;

  public static get it() {
    return WinstonContainer.#it;
  }

  public static get isBootstrap() {
    return WinstonContainer.#isBootstrap;
  }

  public static getLogger(
    args: {
      level: ReturnType<typeof getWinstonLevel>;
      levels: typeof winston.config.syslog.levels;
    },
    option: IWinstonContainerOption,
    application: LastArrayElement<IWinstonContainerOption['applications']>,
    logFilePath: { path: string; filename: string; on: TFilePathKind },
  ) {
    if (application.getOption != null) {
      const transportOption = application.getOption(option, logFilePath, application);
      const logger = winston.createLogger(transportOption);
      return { logger, application };
    }

    const applogFilename = path.join(logFilePath.path, logFilePath.filename);

    const next = {
      ...application,
      path: { ...application.path },
      filename: { ...application.filename },
    };

    next.path.on = logFilePath.on;
    next.filename.on = logFilePath.on;

    const logger = winston.createLogger({
      level: args.level as string,
      levels: args.levels,
      defaultMeta: { logger: application.name, pid: process.pid },
      transports: [
        new winston.transports.File({
          level: args.level as string,
          filename: applogFilename,
          format: getFormatter(),
          eol: os.EOL,
        }),
      ],
    });

    return { logger, application: next };
  }

  public static createLogger<T extends boolean>(
    async: T,
    args: {
      level: ReturnType<typeof getWinstonLevel>;
      levels: typeof winston.config.syslog.levels;
    },
    option: IWinstonContainerOption,
    application: LastArrayElement<IWinstonContainerOption['applications']>,
  ): T extends true ? Promise<TWinstionLoggerApplication> : TWinstionLoggerApplication;
  public static createLogger<T extends boolean>(
    async: T,
    args: {
      level: ReturnType<typeof getWinstonLevel>;
      levels: typeof winston.config.syslog.levels;
    },
    option: IWinstonContainerOption,
    application: LastArrayElement<IWinstonContainerOption['applications']>,
  ): Promise<TWinstionLoggerApplication> | TWinstionLoggerApplication {
    if (async) {
      return (async () => {
        const logFilePath = await prepareCreation(option, application);
        return WinstonContainer.getLogger(args, option, application, logFilePath);
      })();
    }

    const logFilePath = prepareCreationSync(option, application);
    return WinstonContainer.getLogger(args, option, application, logFilePath);
  }

  public static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getWinstonContainerOption>[0],
  ): T extends true ? Promise<ILogContainerOption> : ILogContainerOption;
  public static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getWinstonContainerOption>[0],
  ): ILogContainerOption | Promise<ILogContainerOption> {
    const option = getWinstonContainerOption(nullableOption);
    const level = getWinstonLevel(option.logLevel);
    const { levels } = winston.config.syslog;

    if (async) {
      return (async () => {
        const loggers = await option.applications.reduce(
          async (prevHandle: Promise<TWinstonLoggerContainer>, application) => {
            const handle = async (aggregations: TWinstonLoggerContainer) => {
              const logger = await WinstonContainer.createLogger(
                true,
                { level, levels },
                option,
                application,
              );
              return { ...aggregations, [logger.application.name]: logger };
            };

            return handle(await prevHandle);
          },
          Promise.resolve({}),
        );

        WinstonContainer.#it = new WinstonContainer(option, loggers);
        WinstonContainer.#isBootstrap = true;

        return option;
      })(); // end of async logic
    }

    const loggers = option.applications.reduce(
      (aggregations: TWinstonLoggerContainer, application) => {
        const logger = WinstonContainer.createLogger(false, { level, levels }, option, application);
        return { ...aggregations, [logger.application.name]: logger };
      },
      {},
    );

    WinstonContainer.#it = new WinstonContainer(option, loggers);
    WinstonContainer.#isBootstrap = true;

    return option;
  }

  #option: ILogContainerOption;

  #loggers: TWinstonLoggerContainer;

  constructor(option: ILogContainerOption, loggers: TWinstonLoggerContainer) {
    this.#option = option;
    this.#loggers = loggers;
  }

  get option() {
    return this.#option;
  }

  public static getLogMethod(
    level: keyof winston.config.SyslogConfigSetLevels,
    logger: winston.Logger,
  ) {
    switch (level) {
      case 'emerg':
        return logger.emerg;
      case 'alert':
        return logger.alert;
      case 'crit':
        return logger.crit;
      case 'error':
        return logger.error;
      case 'warning':
        return logger.warning;
      case 'notice':
        return logger.notice;
      case 'info':
        return logger.info;
      case 'debug':
        return logger.debug;
      default:
        return logger.debug;
    }
  }

  public static l(rawName: string, rawFullname?: string): Readonly<IWintonLogger> {
    const { name, fullname } =
      rawFullname == null
        ? { name: CE_DEFAULT_VALUE.APPLICATION_NAME, fullname: rawName }
        : { name: rawName, fullname: rawFullname };
    const filename = basenames(fullname, ['.ts', '.tsx', '.mts', '.cts']);

    let debugLogger: debug.IDebugger | undefined;

    const debugLogging = (...args: any[]) => {
      debugLogger =
        debugLogger != null
          ? debugLogger
          : ll(process.env.DEBUG_CHANNEL, filename, WinstonContainer.#it.#option.develop());

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
        const func = WinstonContainer.getLogMethod(level, application.logger);

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
}
