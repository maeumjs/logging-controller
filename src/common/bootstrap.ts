import { interpretorErrorHandler } from '#/common/interpretorErrorHandler';
import { makeCurlCreator } from '#/http/curl/makeCurlCreator';
import { makeRequestLogger } from '#/http/logging/makeRequestLogger';
import type { IWinstonLoggingControllerOption } from '#/loggings/winston/interfaces/IWinstonLoggingControllerOption';
import { makeWinstonLoggers } from '#/loggings/winston/makeWinstonLoggers';
import type { AwilixContainer } from 'awilix';

export function makeLoggers<TASYNC extends boolean>(
  async: TASYNC,
  container: AwilixContainer,
  option?: IWinstonLoggingControllerOption<TASYNC>,
): TASYNC extends true ? Promise<boolean> : boolean;
export function makeLoggers<TASYNC extends boolean>(
  async: TASYNC,
  container: AwilixContainer,
  option?: IWinstonLoggingControllerOption<TASYNC>,
): Promise<boolean> | boolean {
  if (async) {
    return (async () => {
      await makeWinstonLoggers(container, async, option?.winston);
      makeCurlCreator(container, option?.curl);
      makeRequestLogger(container, option?.request);
      interpretorErrorHandler(container);
      return true;
    })();
  }

  makeWinstonLoggers(container, async as false, option?.winston);
  makeCurlCreator(container, option?.curl);
  makeRequestLogger(container, option?.request);
  interpretorErrorHandler(container);
  return false;
}
