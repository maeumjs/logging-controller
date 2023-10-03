import getWinstonContainerOption from '#/winston/modules/getWinstonContainerOption';
import { describe, expect, it } from 'vitest';

describe('getWinstonContainerOption', () => {
  it('pass undefined option', () => {
    const option = getWinstonContainerOption();

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

  it('pass custom application', () => {
    const option = getWinstonContainerOption({
      develop: () => false,
      logLevel: 'info2',
      applications: [
        {
          name: 'app2',
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

    expect(option).toMatchObject({
      logLevel: 'info2',
      applications: [
        {
          name: 'app2',
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
});
