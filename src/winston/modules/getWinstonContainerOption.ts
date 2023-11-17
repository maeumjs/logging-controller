import { CE_DEFAULT_VALUE } from '#/common/const-enum/CE_DEFAULT_VALUE';
import type { ILogContainerOption } from '#/common/interfaces/ILogContainerOption';
import { getLogContainerOption } from '#/common/modules/getLogContainerOption';
import type { IWinstonContainerOption } from '#/winston/interfaces/IWinstonContainerOption';
import type { PartialDeep } from 'type-fest';

export function getWinstonContainerOption(
  nullableOption?: PartialDeep<IWinstonContainerOption>,
): IWinstonContainerOption {
  const firstStage = getLogContainerOption(nullableOption);
  const applications = nullableOption?.applications ?? [];

  if (applications.length <= 0) {
    applications.push({
      name: CE_DEFAULT_VALUE.APPLICATION_NAME,
      path: { on: 'var', var: '/var/log/nodejs', local: 'logs' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    });
  }

  return {
    ...firstStage,
    applications,
  } satisfies ILogContainerOption;
}
