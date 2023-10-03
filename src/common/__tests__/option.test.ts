import getLogContainerOption from '#/common/modules/getLogContainerOption';
import { describe, expect, it } from 'vitest';

describe('getLogContainerOption', () => {
  it('pass undefined option', () => {
    const option = getLogContainerOption();

    expect(option).toMatchObject({
      logLevel: 'info',
      applications: [
        {
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
        },
      ],
    });
  });

  it('every custom option', () => {
    const option = getLogContainerOption({
      develop: () => false,
      logLevel: 'info2',
      applications: [
        {
          name: 'app',
          path: {
            on: 'local',
            var: '/var/log/nodejs2',
            local: 'logs2',
          },
          filename: {
            on: 'local',
            var: 'nodejs.log2',
            local: 'nodejs.log2',
          },
        },
      ],
    });

    expect(option).toMatchObject({
      logLevel: 'info2',
      applications: [
        {
          name: 'app',
          path: {
            on: 'local',
            var: '/var/log/nodejs2',
            local: 'logs2',
          },
          filename: {
            on: 'local',
            var: 'nodejs.log2',
            local: 'nodejs.log2',
          },
        },
      ],
    });
  });
});
