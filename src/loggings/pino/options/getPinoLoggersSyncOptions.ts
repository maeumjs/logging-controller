import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import type {
  TPinoLoggersBootstrapSyncOption,
  TPinoLoggersBootstrapSyncOptions,
} from '#/loggings/pino/interfaces/TPinoLoggersBootstrapSyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';

export function getPinoLoggersSyncOptions(
  options?: TPinoLoggersBootstrapSyncOptions,
): TPinoLoggersBootstrapSyncOptions {
  const applications: TPinoLoggersBootstrapSyncOptions =
    options ?? new Map<string, TPinoLoggersBootstrapSyncOption>();

  const next = Array.from(applications.entries()).reduce<
    Map<string, TPinoLoggersBootstrapSyncOption>
  >((aggregated, [name, application]) => {
    if (name == null || application == null) {
      return aggregated;
    }

    return { ...aggregated, [name]: application };
  }, new Map<string, TPinoLoggersBootstrapSyncOption>());

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
