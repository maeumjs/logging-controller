import type { CE_DI } from '#/di/CE_DI';
import type { CurlCreator } from '#/http/curl/CurlCreator';
import type { RequestLogger } from '#/http/logging/RequestLogger';
import type { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import type { PinoLoggers } from '#/loggings/pino/PinoLoggers';
import type { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import '@maeum/tools';

declare module '@maeum/tools' {
  interface IClassContainer {
    resolve(name: typeof CE_DI.CURL_CREATOR): CurlCreator;
    resolve(name: typeof CE_DI.REQUEST_LOGGER): RequestLogger;
    resolve(name: typeof CE_DI.WINSTON_LOGGERS): WinstonLoggers;
    resolve(name: typeof CE_DI.PINO_LOGGERS): PinoLoggers;
    resolve(name: typeof CE_DI.MAEUM_LOGGERS): MaeumLoggers;
  }
}
