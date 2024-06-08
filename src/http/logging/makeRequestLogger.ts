import { CE_DI } from '#/di/CE_DI';
import { RequestLogger } from '#/http/logging/RequestLogger';
import { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { IClassContainer } from '@maeum/tools';

export function makeRequestLogger(
  container: IClassContainer,
  nullableOption?: Parameters<typeof getRequestLoggerOption>[0],
) {
  const option = getRequestLoggerOption(nullableOption);
  const requestLogger = new RequestLogger(option, container);

  container.register(CE_DI.REQUEST_LOGGER, requestLogger);

  return nullableOption;
}
