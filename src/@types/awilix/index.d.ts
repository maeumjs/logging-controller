/* eslint-disable @typescript-eslint/naming-convention */
import type { CURL_CREATOR_SYMBOL_KEY } from '#/common/symbols/CURL_CREATOR_SYMBOL_KEY';
import type { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import type { WINSTON_LOGGERS_SYMBOL_KEY } from '#/common/symbols/WINSTON_LOGGERS_SYMBOL_KEY';
import type { CurlCreator } from '#/http/curl/CurlCreator';
import type { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import type { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import type { ResolveOptions } from 'awilix';

declare module 'awilix' {
  export interface AwilixContainer {
    resolve(
      name: typeof WINSTON_LOGGERS_SYMBOL_KEY,
      resolveOptions?: ResolveOptions,
    ): WinstonLoggers;
    resolve(name: typeof MAEUM_LOGGERS_SYMBOL_KEY, resolveOptions?: ResolveOptions): MaeumLoggers;
    resolve(name: typeof CURL_CREATOR_SYMBOL_KEY, resolveOptions?: ResolveOptions): CurlCreator;
  }
}
