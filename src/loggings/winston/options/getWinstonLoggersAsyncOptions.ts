import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type {
  TWinstonLoggersAsyncBootstrapOption,
  TWinstonLoggersAsyncBootstrapOptions,
} from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapAsyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';

export function getWinstonLoggersAsyncOptions(
  options?: TWinstonLoggersAsyncBootstrapOptions,
): TWinstonLoggersAsyncBootstrapOptions {
  const applications = options ?? new Map<string, TWinstonLoggersAsyncBootstrapOption>();

  const next = Array.from(applications.entries()).reduce<
    Map<string, TWinstonLoggersAsyncBootstrapOption>
  >((aggregated, [name, application]) => {
    if (name == null || application == null) {
      return aggregated;
    }

    aggregated.set(name, application);
    return aggregated;
  }, new Map<string, TWinstonLoggersAsyncBootstrapOption>());

  if (Object.keys(next).length <= 0) {
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
