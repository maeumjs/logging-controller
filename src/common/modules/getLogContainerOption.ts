import type ILogContainerOption from '#/common/interfaces/ILogContainerOption';
import type { PartialDeep } from 'type-fest';

export default function getLogContainerOption(
  option?: PartialDeep<ILogContainerOption>,
): ILogContainerOption {
  const applications = option?.applications ?? [];

  if (applications.length <= 0) {
    applications.push({
      name: 'app',
      path: {
        on: 'var',
        var: '/var/log/nodejs',
        local: 'logs',
      },
      filename: {
        on: 'var',
        var: 'nodejs.log',
        local: 'nodejs.log',
      },
    });
  }

  return {
    develop: option?.develop ?? (() => true),
    logLevel: option?.logLevel ?? 'info',
    applications,
  } satisfies ILogContainerOption;
}
