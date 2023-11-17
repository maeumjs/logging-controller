import { prepareCreation } from '#/common/modules/prepareCreation';
import { prepareCreationSync } from '#/common/modules/prepareCreationSync';
import type { IWinstonContainerOption } from '#/winston/interfaces/IWinstonContainerOption';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import type { LastArrayElement } from 'type-fest';
import { describe, expect, it, vi } from 'vitest';

vi.spyOn(fs, 'mkdirSync').mockImplementation(() => 'created mocking');
vi.spyOn(fs.promises, 'mkdir').mockImplementation(() => Promise.resolve('created mocking'));

vi.mock('my-node-fp', async () => {
  return {
    ...(await vi.importActual<typeof import('my-node-fp')>('my-node-fp')),
    existsSync: vi.fn().mockReturnValue(false),
    exists: vi.fn().mockReturnValue(Promise.resolve(false)),
  };
});

describe('prepareCreationSync', () => {
  it('directory not exists', () => {
    const option: IWinstonContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './src', local: '.' },
          filename: { on: 'var', var: 'node.log', local: 'node.log' },
        },
      ],
    };

    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './src', local: '.' },
      filename: { on: 'var', var: 'node.log', local: 'node.log' },
    };

    const hash = randomUUID().replace(/-/g, '');

    expect(() => {
      prepareCreationSync(
        { ...option, develop: () => true },
        { ...application, path: { on: 'local', var: '.', local: hash } },
      );
    }).toThrowError();
  });
});

describe('prepareCreation', () => {
  it('directory not exists', async () => {
    vi.mock('my-node-fp', async () => {
      return {
        ...(await vi.importActual<typeof import('my-node-fp')>('my-node-fp')),
        exists: vi.fn().mockReturnValue(Promise.resolve(false)),
      };
    });

    const option: IWinstonContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './src', local: '.' },
          filename: { on: 'var', var: 'node.log', local: 'node.log' },
        },
      ],
    };

    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './src', local: '.' },
      filename: { on: 'var', var: 'node.log', local: 'node.log' },
    };

    const hash = randomUUID().replace(/-/g, '');

    await expect(async () => {
      await prepareCreation(
        { ...option, develop: () => true },
        { ...application, path: { on: 'local', var: '.', local: hash } },
      );
    }).rejects.toThrow();
  });
});
