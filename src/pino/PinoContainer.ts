import { CE_DEFAULT_VALUE } from '#/common/const-enum/CE_DEFAULT_VALUE';
import type ILogContainerOption from '#/common/interfaces/ILogContainerOption';
import type { TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import type ILogFormat from '#/common/interfaces/ILogFormat';
import ll from '#/common/ll';
import getError from '#/common/modules/getError';
import prepareCreation from '#/common/modules/prepareCreation';
import prepareCreationSync from '#/common/modules/prepareCreationSync';
import type IPinoContainerOption from '#/pino/interfaces/IPinoContainerOption';
import type IPinoLogger from '#/pino/interfaces/IPinoLogger';
import getPinoContainerOption from '#/pino/modules/getPinoContainerOption';
import getPinoLevel from '#/pino/modules/getPinoLevel';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import inspector from 'node:inspector';
import path from 'node:path';
import { pino, type LevelWithSilent } from 'pino';
import type { LastArrayElement } from 'type-fest';

type TPinoLoggerApplication = {
  logger: pino.Logger;
  application: LastArrayElement<IPinoContainerOption['applications']>;
};

type TPinoLoggerContainer = Record<string, TPinoLoggerApplication>;

export default class PinoContainer {
  static #it: PinoContainer;

  static #isBootstrap: boolean = false;

  public static get it() {
    return PinoContainer.#it;
  }

  public static get isBootstrap() {
    return PinoContainer.#isBootstrap;
  }

  public static getLogger(
    level: ReturnType<typeof getPinoLevel>,
    option: IPinoContainerOption,
    application: LastArrayElement<IPinoContainerOption['applications']>,
    logFilePath: { path: string; filename: string; on: TFilePathKind },
  ) {
    if (application.getStream != null) {
      const transport = application.getStream(option, logFilePath, application);
      const logger = pino(transport);
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

    const logger =
      inspector.url() == null
        ? pino(
            pino.transport({
              targets: [
                {
                  target: 'pino/file',
                  level,
                  options: {
                    destination: applogFilename,
                  },
                },
              ],
            }),
          )
        : pino(pino.destination(applogFilename));

    return { logger, application: next };
  }

  public static createLogger<T extends boolean>(
    async: T,
    level: ReturnType<typeof getPinoLevel>,
    option: IPinoContainerOption,
    application: LastArrayElement<IPinoContainerOption['applications']>,
  ): T extends true ? Promise<TPinoLoggerApplication> : TPinoLoggerApplication;
  public static createLogger<T extends boolean>(
    async: T,
    level: ReturnType<typeof getPinoLevel>,
    option: IPinoContainerOption,
    application: LastArrayElement<IPinoContainerOption['applications']>,
  ): Promise<TPinoLoggerApplication> | TPinoLoggerApplication {
    if (async) {
      return (async () => {
        const logFilePath = await prepareCreation(option, application);
        return PinoContainer.getLogger(level, option, application, logFilePath);
      })();
    }

    const logFilePath = prepareCreationSync(option, application);
    return PinoContainer.getLogger(level, option, application, logFilePath);
  }

  public static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getPinoContainerOption>[0],
  ): T extends true ? Promise<ILogContainerOption> : ILogContainerOption;
  public static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getPinoContainerOption>[0],
  ): Promise<ILogContainerOption> | ILogContainerOption {
    const option = getPinoContainerOption(nullableOption);
    const level = getPinoLevel(option.logLevel);

    if (async) {
      return (async () => {
        const loggers = await option.applications.reduce(
          async (prevHandle: Promise<TPinoLoggerContainer>, application) => {
            const handle = async (aggregations: TPinoLoggerContainer) => {
              const logger = await PinoContainer.createLogger(true, level, option, application);
              return { ...aggregations, [logger.application.name]: logger };
            };

            return handle(await prevHandle);
          },
          Promise.resolve({}),
        );

        PinoContainer.#it = new PinoContainer(option, loggers);
        PinoContainer.#isBootstrap = true;

        return option;
      })(); // end of async logic
    }

    const loggers = option.applications.reduce(
      (aggregations: TPinoLoggerContainer, application) => {
        const logger = PinoContainer.createLogger(false, level, option, application);
        return { ...aggregations, [logger.application.name]: logger };
      },
      {},
    );

    PinoContainer.#it = new PinoContainer(option, loggers);
    PinoContainer.#isBootstrap = true;

    return option;
  }

  public static getLogMethod(level: LevelWithSilent, logger: pino.Logger) {
    switch (level) {
      case 'fatal':
        return logger.fatal;
      case 'error':
        return logger.error;
      case 'warn':
        return logger.warn;
      case 'info':
        return logger.info;
      case 'debug':
        return logger.debug;
      case 'trace':
        return logger.trace;
      default:
        return logger.debug;
    }
  }

  public static l(rawName: string, rawFullname?: string): Readonly<IPinoLogger> {
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
          : ll(process.env.DEBUG_CHANNEL, filename, PinoContainer.#it.#option.develop());

      const [formatter, ...rest] = args;
      debugLogger(formatter, ...rest);
    };

    const doLogging = (level: LevelWithSilent, content: Partial<ILogFormat & { err: Error }>) => {
      const application = PinoContainer.#it.#loggers[name];

      if (application == null) {
        throw new Error(`Logging application([${name}]) does not exists`);
      }

      if (!PinoContainer.#isBootstrap) {
        throw new Error(`WinstonContainer not bootstrapped`);
      }

      try {
        const status = content.status ?? httpStatusCodes.OK;
        const id = content.id ?? 'SYS';
        const func = PinoContainer.getLogMethod(level, application.logger);

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
      $kind: 'pino',
      fatal: (content: Partial<ILogFormat>) => doLogging('fatal', content),
      error: (content: Partial<ILogFormat>) => doLogging('error', content),
      warn: (content: Partial<ILogFormat>) => doLogging('warn', content),
      info: (content: Partial<ILogFormat>) => doLogging('info', content),
      debug: (content: Partial<ILogFormat>) => doLogging('debug', content),
      trace: (content: Partial<ILogFormat>) => doLogging('trace', content),
      silent: (content: Partial<ILogFormat>) => doLogging('silent', content),
      $: (...args: any[]) => {
        debugLogging(...args);
      },
    };
  }

  #option: ILogContainerOption;

  #loggers: TPinoLoggerContainer;

  constructor(option: ILogContainerOption, loggers: TPinoLoggerContainer) {
    this.#option = option;
    this.#loggers = loggers;
  }

  get option() {
    return this.#option;
  }
}
