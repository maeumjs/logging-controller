import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type {
  TWinstonLoggersSyncBootstrapOption,
  TWinstonLoggersSyncBootstrapOptions,
} from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';

export function getWinstonLoggersSyncOptions(
  options?: TWinstonLoggersSyncBootstrapOptions,
): TWinstonLoggersSyncBootstrapOptions {
  const applications = options ?? new Map<string, TWinstonLoggersSyncBootstrapOption>();

  const next = Array.from(applications.entries()).reduce<
    Map<string, TWinstonLoggersSyncBootstrapOption>
  >((aggregated, [name, application]) => {
    if (application == null) {
      return aggregated;
    }

    aggregated.set(name, application);
    return aggregated;
  }, new Map<string, TWinstonLoggersSyncBootstrapOption>());

  if (next.size <= 0) {
    const defaultConfig = getNonNullableOptions();

    return new Map([
      [
        CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME,
        {
          getOptions: () => defaultConfig,
        },
      ],
    ]);
  }

  return next;
}
