import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { ll } from '#/common/ll';
import { getError } from '#/common/modules/getError';
import { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { IWinstonLoggersOptions } from '#/loggings/winston/interfaces/IWinstonContainerOption';
import type { IWintonLoggers } from '#/loggings/winston/interfaces/IWintonLoggers';
import { getLogMethod } from '#/loggings/winston/modules/getLogMethod';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import type winston from 'winston';

export class WinstonLoggers extends MaeumLoggers {
  #getEnableDebugMessage: IWinstonLoggersOptions['getEnableDebugMessage'];

  #loggers: IWinstonLoggersOptions['loggers'];

  #defaultName: string;

  constructor(options: IWinstonLoggersOptions) {
    super();

    this.#getEnableDebugMessage = options.getEnableDebugMessage;
    this.#loggers = options.loggers;
    this.#defaultName = options.defaultAppName ?? CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME;
  }

  get loggers(): IWinstonLoggersOptions['loggers'] {
    return this.#loggers;
  }

  override l(rawName: string, rawFullname?: string): Readonly<IWintonLoggers> {
    const { name, fullname } =
      rawFullname == null
        ? { name: this.#defaultName, fullname: rawName }
        : { name: rawName, fullname: rawFullname };
    const filename = basenames(fullname, ['.ts', '.tsx', '.mts', '.cts']);

    let debugLogger: debug.IDebugger | undefined;

    const debugLogging = (...args: any[]) => {
      debugLogger =
        debugLogger != null
          ? debugLogger
          : ll(process.env.DEBUG_CHANNEL, filename, this.#getEnableDebugMessage());

      const [formatter, ...rest] = args;
      debugLogger(formatter, ...rest);
    };

    const doLogging = (
      level: keyof winston.config.SyslogConfigSetLevels,
      content: Partial<ILogFormat & { err: Error }>,
    ) => {
      const application = this.#loggers.get(name);

      if (application == null) {
        throw new Error(`Logging application([${name}]) does not exists`);
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
}
