import type { IPinoLoggingControllerOption } from '#/common/interfaces/IPinoLoggingControllerOption';
import type { IWinstonLoggingControllerOption } from '#/common/interfaces/IWinstonLoggingControllerOption';
import { interpretorErrorHandler } from '#/common/interpretorErrorHandler';
import { RequestCurlCreator } from '#/http/request/RequestCurlCreator';
import { RequestLogger } from '#/http/request/RequestLogger';
import { PinoContainer } from '#/pino/PinoContainer';
import { WinstonContainer } from '#/winston/WinstonContainer';

export function bootstrapWinston<T extends boolean>(
  async: T,
  option?: IWinstonLoggingControllerOption,
): T extends true ? Promise<boolean> : boolean;
export function bootstrapWinston<T extends boolean>(
  async: T,
  option?: IWinstonLoggingControllerOption,
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
  option?: IPinoLoggingControllerOption,
): T extends true ? Promise<boolean> : boolean;
export function bootstrapPino<T extends boolean>(
  async: T,
  option?: IPinoLoggingControllerOption,
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
