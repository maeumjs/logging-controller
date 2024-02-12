import type { IWinstonLoggingControllerOption } from '#/common/interfaces/IWinstonLoggingControllerOption';
import { interpretorErrorHandler } from '#/common/interpretorErrorHandler';
import { RequestCurlCreator } from '#/http/request/RequestCurlCreator';
import { RequestLogger } from '#/http/request/RequestLogger';
import { WinstonContainer } from '#/winston/WinstonContainer';

export function bootstrapWinston<TASYNC extends boolean>(
  async: TASYNC,
  option?: IWinstonLoggingControllerOption<TASYNC>,
): TASYNC extends true ? Promise<boolean> : boolean;
export function bootstrapWinston<TASYNC extends boolean>(
  async: TASYNC,
  option?: IWinstonLoggingControllerOption<TASYNC>,
): Promise<boolean> | boolean {
  if (async) {
    return (async () => {
      await WinstonContainer.bootstrap(
        true,
        option?.winston?.getEnableDebugMessage,
        option?.winston?.defaultAppName,
        option?.winston?.loggers,
      );
      RequestLogger.bootstrap(option?.request);
      RequestCurlCreator.bootstrap(option?.curl);
      interpretorErrorHandler();
      return true;
    })();
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  WinstonContainer.bootstrap(
    false,
    option?.winston?.getEnableDebugMessage,
    option?.winston?.defaultAppName,
    option?.winston?.loggers,
  );
  RequestLogger.bootstrap(option?.request);
  RequestCurlCreator.bootstrap(option?.curl);
  interpretorErrorHandler();
  return false;
}
