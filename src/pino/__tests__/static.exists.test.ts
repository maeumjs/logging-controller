import * as ge from '#/common/modules/getError';
import { prepareCreation } from '#/common/modules/prepareCreation';
import { prepareCreationSync } from '#/common/modules/prepareCreationSync';
import { PinoContainer } from '#/pino/PinoContainer';
import type { IPinoContainerOption } from '#/pino/interfaces/IPinoContainerOption';
import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import type { LastArrayElement } from 'type-fest';
import { describe, expect, it, vi } from 'vitest';

vi.spyOn(fs, 'mkdirSync').mockImplementation(() => 'created mocking');
vi.spyOn(fs.promises, 'mkdir').mockImplementation(() => Promise.resolve('created mocking'));

vi.mock('my-node-fp', async () => {
  return {
    ...(await vi.importActual<typeof import('my-node-fp')>('my-node-fp')),
    existsSync: vi.fn().mockReturnValue(true),
    exists: vi.fn().mockReturnValue(Promise.resolve(true)),
  };
});

describe('prepareCreationSync', () => {
  it('directory exists', () => {
    const option: IPinoContainerOption = {
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

    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './src', local: '.' },
      filename: { on: 'var', var: 'node.log', local: 'node.log' },
    };

    const r01 = prepareCreationSync(option, application);

    expect(r01).toMatchObject({
      path: path.resolve(path.join(process.cwd(), 'src')),
      filename: 'node.log',
      on: 'var',
    });

    const r02 = prepareCreationSync({ ...option, develop: () => true }, application);

    expect(r02).toMatchObject({
      path: path.resolve(process.cwd()),
      filename: 'node.log',
      on: 'local',
    });
  });
});

describe('prepareCreation', () => {
  it('directory exists', async () => {
    const option: IPinoContainerOption = {
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

    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './src', local: '.' },
      filename: { on: 'var', var: 'node.log', local: 'node.log' },
    };

    const r01 = await prepareCreation(option, application);

    expect(r01).toMatchObject({
      path: path.resolve(path.join(process.cwd(), 'src')),
      filename: 'node.log',
      on: 'var',
    });

    const r02 = await prepareCreation({ ...option, develop: () => true }, application);

    expect(r02).toMatchObject({
      path: path.resolve(process.cwd()),
      filename: 'node.log',
      on: 'local',
    });
  });
});

describe('getLogger', () => {
  it('default-option', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };
    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const logger = PinoContainer.getLogger('info', option, application, {
      path: '.',
      filename: 'nodejs.log',
      on: 'var',
    });

    expect(logger).toBeTruthy();
  });

  it('default-option', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };
    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const logger = PinoContainer.getLogger(
      'info',
      option,
      {
        ...application,
        getStream: () =>
          pino.destination(path.join(application.path.local, application.filename.local)),
      },
      { path: '.', filename: 'nodejs.log', on: 'var' },
    );

    expect(logger).toBeTruthy();
  });
});

describe('createLogger', () => {
  it('async', async () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };
    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const loggers = await PinoContainer.createLogger(true, 'info', option, application);

    expect(loggers).toBeTruthy();
  });

  it('sync', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };
    const application: LastArrayElement<IPinoContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const loggers = PinoContainer.createLogger(false, 'info', option, application);

    expect(loggers).toBeTruthy();
  });
});

describe('bootstrap', () => {
  it('async', async () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: '.', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };

    await PinoContainer.bootstrap(true, option);

    const log = PinoContainer.l('iamfilename');

    log.$('test');

    expect(PinoContainer.it).toBeTruthy();
    expect(PinoContainer.it.option).toBeTruthy();

    expect(log).toBeTruthy();
  });

  it('sync', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'fatal',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: '.', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };

    PinoContainer.bootstrap(false, option);

    const log = PinoContainer.l('app', 'iamfilename');
    log.$('test');
    log.fatal({});
    log.error({});
    log.warn({});
    log.info({});
    log.debug({});
    log.trace({});
    log.silent({});

    expect(PinoContainer.it).toBeTruthy();
  });

  it('error - application not found', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };

    PinoContainer.bootstrap(false, option);

    expect(() => {
      const log = PinoContainer.l('not-found-application', 'iamfilename');
      log.info({ message: 'test' } as any);
    }).toThrowError();

    expect(PinoContainer.it).toBeTruthy();
  });

  it('error - in logging function', () => {
    const option: IPinoContainerOption = {
      develop: () => false,
      logLevel: 'info',
      applications: [
        {
          name: 'app',
          path: { on: 'var', var: './logs', local: '.' },
          filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
        },
      ],
    };

    PinoContainer.bootstrap(false, option);

    vi.spyOn(ge, 'getError').mockImplementation(() => {
      throw new Error('for test, one-time');
    });

    const log = PinoContainer.l('app', 'iamfilename');
    log.info({});
  });
});
