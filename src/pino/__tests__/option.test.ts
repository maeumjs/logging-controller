import getPinoContainerOption from '#/pino/modules/getPinoContainerOption';
import { describe, expect, it } from 'vitest';

describe('getPinoContainerOption', () => {
  it('pass undefined option', () => {
    const option = getPinoContainerOption();

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
    const option = getPinoContainerOption({
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
