import interpretorErrorHandler from '#/common/interpretorErrorHandler';
import type getRequestCurlCreatorOption from '#/http/modules/getRequestCurlCreatorOption';
import type getRequestLoggerOption from '#/http/modules/getRequestLoggerOption';
import RequestCurlCreator from '#/http/request/RequestCurlCreator';
import RequestLogger from '#/http/request/RequestLogger';
import PinoContainer from '#/pino/PinoContainer';
import type getPinoContainerOption from '#/pino/modules/getPinoContainerOption';
import WinstonContainer from '#/winston/WinstonContainer';
import type getWinstonContainerOption from '#/winston/modules/getWinstonContainerOption';

export function bootstrapWinston<T extends boolean>(
  async: T,
  option?: {
    winston?: Parameters<typeof getWinstonContainerOption>[0];
    request?: Parameters<typeof getRequestLoggerOption>[0];
    curl?: Parameters<typeof getRequestCurlCreatorOption>[0];
  },
): T extends true ? Promise<boolean> : boolean;
export function bootstrapWinston<T extends boolean>(
  async: T,
  option?: {
    winston?: Parameters<typeof getWinstonContainerOption>[0];
    request?: Parameters<typeof getRequestLoggerOption>[0];
    curl?: Parameters<typeof getRequestCurlCreatorOption>[0];
  },
): Promise<boolean> | boolean {
  if (async) {
    return (async () => {
      await WinstonContainer.bootstrap(true, option?.winston);
      RequestLogger.bootstrap(option?.request);
      RequestCurlCreator.bootstrap(option?.curl);
      interpretorErrorHandler();
      return true;
    })();
  }

  WinstonContainer.bootstrap(false, option?.winston);
  RequestLogger.bootstrap(option?.request);
  RequestCurlCreator.bootstrap(option?.curl);
  interpretorErrorHandler();
  return false;
}

export function bootstrapPino<T extends boolean>(
  async: T,
  option?: {
    pino?: Parameters<typeof getPinoContainerOption>[0];
    request?: Parameters<typeof getRequestLoggerOption>[0];
    curl?: Parameters<typeof getRequestCurlCreatorOption>[0];
  },
): T extends true ? Promise<boolean> : boolean;
export function bootstrapPino<T extends boolean>(
  async: T,
  option?: {
    pino?: Parameters<typeof getPinoContainerOption>[0];
    request?: Parameters<typeof getRequestLoggerOption>[0];
    curl?: Parameters<typeof getRequestCurlCreatorOption>[0];
  },
): Promise<boolean> | boolean {
  if (async) {
    return (async () => {
      await PinoContainer.bootstrap(true, option?.pino);
      RequestLogger.bootstrap(option?.request);
      RequestCurlCreator.bootstrap(option?.curl);
      interpretorErrorHandler();
      return true;
    })();
  }

  PinoContainer.bootstrap(false, option?.pino);
  RequestLogger.bootstrap(option?.request);
  RequestCurlCreator.bootstrap(option?.curl);
  interpretorErrorHandler();
  return false;
}
