import { REQUEST_LOGGER_SYMBOL_KEY } from '#/common/symbols/REQUEST_LOGGER_SYMBOL_KEY';
import { RequestLogger } from '#/http/logging/RequestLogger';
import { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { IClassContainer } from '@maeum/tools';

export function makeRequestLogger(
  container: IClassContainer,
  nullableOption?: Parameters<typeof getRequestLoggerOption>[0],
) {
  const option = getRequestLoggerOption(nullableOption);
  const requestLogger = new RequestLogger(option, container);

  container.register(REQUEST_LOGGER_SYMBOL_KEY, requestLogger);

  return nullableOption;
}
