import { interpretorErrorHandler } from '#/common/interpretorErrorHandler';
import { makeCurlCreator } from '#/http/curl/makeCurlCreator';
import { makeRequestLogger } from '#/http/logging/makeRequestLogger';
import type { IMaeumAsyncLoggersWithPinoOptions } from '#/loggings/pino/interfaces/IMaeumAsyncLoggersWithPinoOptions';
import { makePinoAsyncLoggers } from '#/loggings/pino/makePinoAsyncLoggers';
import type { IMaeumAsyncLoggersWithWinstonOptions } from '#/loggings/winston/interfaces/IMaeumAsyncLoggersWithWinstonOptions';
import { makeAsyncWinstonLoggers } from '#/loggings/winston/makeAsyncWinstonLoggers';
import type { IClassContainer } from '@maeum/tools';

export async function makeAsyncLoggers(
  container: IClassContainer,
  kind: 'winston' | 'pino',
  option?: IMaeumAsyncLoggersWithWinstonOptions | IMaeumAsyncLoggersWithPinoOptions,
): Promise<boolean> {
  if (kind === 'winston') {
    const winstonOptions = (option as undefined | IMaeumAsyncLoggersWithWinstonOptions)?.winston;

    await makeAsyncWinstonLoggers(container, winstonOptions);
    makeCurlCreator(container, option?.curl);
    makeRequestLogger(container, option?.request);
    interpretorErrorHandler(container);

    return true;
  }

  const pinoOptions = (option as undefined | IMaeumAsyncLoggersWithPinoOptions)?.pino;
  await makePinoAsyncLoggers(container, pinoOptions);
  makeCurlCreator(container, option?.curl);
  makeRequestLogger(container, option?.request);
  interpretorErrorHandler(container);

  return true;
}
