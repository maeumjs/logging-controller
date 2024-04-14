import { REQUEST_LOGGER_SYMBOL_KEY } from '#/common/symbols/REQUEST_LOGGER_SYMBOL_KEY';
import { RequestLogger } from '#/http/logging/RequestLogger';
import { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import { asValue, type AwilixContainer } from 'awilix';

export function makeRequestLogger(
  container: AwilixContainer,
  nullableOption?: Parameters<typeof getRequestLoggerOption>[0],
) {
  const option = getRequestLoggerOption(nullableOption);
  const requestLogger = new RequestLogger(option, container);

  container.register(REQUEST_LOGGER_SYMBOL_KEY, asValue(requestLogger));

  return nullableOption;
}
