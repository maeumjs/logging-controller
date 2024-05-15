import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import type {
  TPinoLoggersBootstrapAsyncOption,
  TPinoLoggersBootstrapAsyncOptions,
} from '#/loggings/pino/interfaces/TPinoLoggersBootstrapAsyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';

export function getPinoLoggersAsyncOptions(
  options?: TPinoLoggersBootstrapAsyncOptions,
): TPinoLoggersBootstrapAsyncOptions {
  const applications: TPinoLoggersBootstrapAsyncOptions =
    options ?? new Map<string, TPinoLoggersBootstrapAsyncOption>();

  const next = Array.from(applications.entries()).reduce<
    Map<string, TPinoLoggersBootstrapAsyncOption>
  >((aggregated, [name, application]) => {
    if (name == null || application == null) {
      return aggregated;
    }

    return { ...aggregated, [name]: application };
  }, new Map<string, TPinoLoggersBootstrapAsyncOption>());

  if (Object.keys(next).length <= 0) {
    const defaultConfig = getNonNullableOptions();

    return new Map([
      [
        CE_PINO_DEFAULT_VALUE.DEFAULT_NAME,
        {
          getOptions: () => defaultConfig,
        },
      ],
    ]);
  }

  return next;
}
