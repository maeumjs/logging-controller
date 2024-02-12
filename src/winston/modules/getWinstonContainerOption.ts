import { CE_WINSTON_DEFAULT_VALUE } from '#/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { TWinstonContainerBootstrapOptions } from '#/winston/interfaces/IWinstonContainerOption';
import { getNonNullableOptions } from '#/winston/modules/getNonNullableOptions';

export function getWinstonContainerOptions<TASYNC extends boolean>(
  options?: TWinstonContainerBootstrapOptions<TASYNC>,
): TWinstonContainerBootstrapOptions<TASYNC> {
  const applications = options ?? {};

  const next = Object.entries(applications).reduce<TWinstonContainerBootstrapOptions<TASYNC>>(
    (aggregated, [name, application]) => {
      if (name == null || application == null) {
        return aggregated;
      }

      return { ...aggregated, [name]: application };
    },
    {},
  );

  if (Object.keys(next).length <= 0) {
    const defaultConfig = getNonNullableOptions();

    return {
      [CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME]: {
        getOptions: () => defaultConfig,
      },
    };
  }

  return next;
}
