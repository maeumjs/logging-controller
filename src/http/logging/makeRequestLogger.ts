import { $YMBOL_KEY_REQUEST_LOGGER } from '#/common/symbols/SYMBOL_KEY_REQUEST_LOGGER';
import { RequestLogger } from '#/http/logging/RequestLogger';
import { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { IClassContainer } from '@maeum/tools';

export function makeRequestLogger(
  container: IClassContainer,
  nullableOption?: Parameters<typeof getRequestLoggerOption>[0],
) {
  const option = getRequestLoggerOption(nullableOption);
  const requestLogger = new RequestLogger(option, container);

  container.register($YMBOL_KEY_REQUEST_LOGGER, requestLogger);

  return nullableOption;
}
