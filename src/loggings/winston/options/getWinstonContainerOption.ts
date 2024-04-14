import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { TWinstonLoggersBootstrapOptions } from '#/loggings/winston/interfaces/IWinstonContainerOption';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';

export function getWinstonContainerOptions<TASYNC extends boolean>(
  options?: TWinstonLoggersBootstrapOptions<TASYNC>,
): TWinstonLoggersBootstrapOptions<TASYNC> {
  const applications = options ?? {};

  const next = Object.entries(applications).reduce<TWinstonLoggersBootstrapOptions<TASYNC>>(
    (aggregated, [name, application]) => {
      if (name == null || application == null) {
        return aggregated;
      }

      return { ...aggregated, [name]: application };
    },
    new Map(),
  );

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
