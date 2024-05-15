import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { ll } from '#/common/ll';
import { getError } from '#/common/modules/getError';
import { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import type { IPinoLoggers } from '#/loggings/pino/interfaces/IPinoLoggers';
import type { IPinoLoggersOptions } from '#/loggings/pino/interfaces/IPinoLoggersOptions';
import { getPinoLogMethod } from '#/loggings/pino/modules/getPinoLogMethod';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import type pino from 'pino';

export class PinoLoggers extends MaeumLoggers {
  #getEnableDebugMessage: IPinoLoggersOptions['getEnableDebugMessage'];

  #loggers: IPinoLoggersOptions['loggers'];

  #defaultName: string;

  constructor(options: IPinoLoggersOptions) {
    super();

    this.#getEnableDebugMessage = options.getEnableDebugMessage;
    this.#loggers = options.loggers;
    this.#defaultName = options.defaultAppName ?? CE_PINO_DEFAULT_VALUE.DEFAULT_NAME;
  }

  get loggers(): IPinoLoggersOptions['loggers'] {
    return this.#loggers;
  }

  override l(rawName: string, rawFullname?: string): Readonly<IPinoLoggers> {
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

    const doLogging = (level: pino.Level, content: Partial<ILogFormat & { err: Error }>) => {
      const application = this.#loggers.get(name);

      if (application == null) {
        throw new Error(`Logging application([${name}]) does not exists`);
      }

      try {
        const status = content.status ?? httpStatusCodes.OK;
        const id = content.id ?? 'SYS';
        const func = getPinoLogMethod(level, application.logger);

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
      trace: (content: Partial<ILogFormat & { err: Error }>) => doLogging('trace', content),
      debug: (content: Partial<ILogFormat & { err: Error }>) => doLogging('debug', content),
      warn: (content: Partial<ILogFormat & { err: Error }>) => doLogging('warn', content),
      fatal: (content: Partial<ILogFormat & { err: Error }>) => doLogging('fatal', content),
      error: (content: Partial<ILogFormat & { err: Error }>) => doLogging('error', content),
      info: (content: Partial<ILogFormat & { err: Error }>) => doLogging('info', content),
      $: (...args: any[]) => {
        debugLogging(...args);
      },
    };
  }
}
