import { interpretorErrorHandler } from '#/common/interpretorErrorHandler';
import { makeCurlCreator } from '#/http/curl/makeCurlCreator';
import { makeRequestLogger } from '#/http/logging/makeRequestLogger';
import type { IMaeumSyncLoggersWithPinoOptions } from '#/loggings/pino/interfaces/IMaeumSyncLoggersWithPinoOptions';
import { makePinoSyncLoggers } from '#/loggings/pino/makePinoSyncLoggers';
import type { IMaeumSyncLoggersWithWinstonOptions } from '#/loggings/winston/interfaces/IMaeumSyncLoggersWithWinstonOptions';
import { makeSyncWinstonLoggers } from '#/loggings/winston/makeSyncWinstonLoggers';
import type { IClassContainer } from '@maeum/tools';

export function makeSyncLoggers(
  container: IClassContainer,
  kind: 'winston' | 'pino',
  option?: IMaeumSyncLoggersWithWinstonOptions | IMaeumSyncLoggersWithPinoOptions,
): boolean {
  if (kind === 'winston') {
    const winstonOptions = (option as undefined | IMaeumSyncLoggersWithWinstonOptions)?.winston;

    makeSyncWinstonLoggers(container, winstonOptions);
    makeCurlCreator(container, option?.curl);
    makeRequestLogger(container, option?.request);
    interpretorErrorHandler(container);

    return false;
  }

  const pinoOptions = (option as undefined | IMaeumSyncLoggersWithPinoOptions)?.pino;

  makePinoSyncLoggers(container, pinoOptions);
  makeCurlCreator(container, option?.curl);
  makeRequestLogger(container, option?.request);
  interpretorErrorHandler(container);

  return false;
}
