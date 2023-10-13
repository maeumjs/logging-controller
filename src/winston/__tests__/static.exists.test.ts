import * as getError from '#/common/modules/getError';
import prepareCreation from '#/common/modules/prepareCreation';
import prepareCreationSync from '#/common/modules/prepareCreationSync';
import WinstonContainer from '#/winston/WinstonContainer';
import type IWinstonContainerOption from '#/winston/interfaces/IWinstonContainerOption';
import fs from 'node:fs';
import path from 'node:path';
import type { LastArrayElement } from 'type-fest';
import { describe, expect, it, vi } from 'vitest';
import winston from 'winston';

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
    const option: IWinstonContainerOption = {
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
    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const logger = WinstonContainer.getLogger(
      { level: 'info', levels: winston.config.syslog.levels },
      option,
      application,
      { path: './logs', filename: 'nodejs.log', on: 'var' },
    );

    expect(logger).toBeTruthy();
  });

  it('default-option', () => {
    const option: IWinstonContainerOption = {
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
    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const logger = WinstonContainer.getLogger(
      { level: 'info', levels: winston.config.syslog.levels },
      option,
      {
        ...application,
        getOption: () => {
          return {
            level: 'info',
            levels: winston.config.syslog.levels,
            defaultMeta: { logger: application.name, pid: process.pid },
            transports: [
              new winston.transports.File({
                level: 'info' as string,
                filename: './logs/nodejs.log',
              }),
            ],
          };
        },
      },
      { path: './logs', filename: 'nodejs.log', on: 'var' },
    );

    expect(logger).toBeTruthy();
  });
});

describe('createLogger', () => {
  it('async', async () => {
    const option: IWinstonContainerOption = {
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
    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const loggers = await WinstonContainer.createLogger(
      true,
      { level: 'info', levels: winston.config.syslog.levels },
      option,
      application,
    );

    expect(loggers).toBeTruthy();
  });

  it('sync', () => {
    const option: IWinstonContainerOption = {
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
    const application: LastArrayElement<IWinstonContainerOption['applications']> = {
      name: 'app',
      path: { on: 'var', var: './logs', local: '.' },
      filename: { on: 'var', var: 'nodejs.log', local: 'nodejs.log' },
    };

    const loggers = WinstonContainer.createLogger(
      false,
      { level: 'info', levels: winston.config.syslog.levels },
      option,
      application,
    );

    expect(loggers).toBeTruthy();
  });
});

describe('getError', () => {
  it('pass', () => {
    const extracted = getError.default({ err: new Error('message') });
    expect(extracted.errMsg).toEqual('message');
  });

  it('undefined', () => {
    const extracted = getError.default({});
    expect(extracted.errMsg).toBeUndefined();
  });

  it('object', () => {
    const extracted = getError.default({ errMsg: 'message', errStk: 'stack' });
    expect(extracted).toMatchObject({ errMsg: 'message', errStk: 'stack' });
  });
});

describe('createLogger', () => {
  it('async', async () => {
    const option: IWinstonContainerOption = {
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

    await WinstonContainer.bootstrap(true, option);

    const log = WinstonContainer.l('iamfilename');

    log.$('test');
    log.emerg({ err: new Error('test') });
    log.alert({});
    log.crit({});
    log.error({});
    log.warning({});
    log.notice({});
    log.info({});
    log.debug({});

    expect(WinstonContainer.it).toBeTruthy();
    expect(WinstonContainer.it.option).toBeTruthy();

    expect(log).toBeTruthy();
  });

  it('sync', () => {
    const option: IWinstonContainerOption = {
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

    WinstonContainer.bootstrap(false, option);

    const log = WinstonContainer.l('app', 'iamfilename');
    log.$('test');

    expect(WinstonContainer.it).toBeTruthy();
  });

  it('error - application not found', () => {
    const option: IWinstonContainerOption = {
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

    WinstonContainer.bootstrap(false, option);

    expect(() => {
      const log = WinstonContainer.l('not-found-application', 'iamfilename');
      log.info({ message: 'test' } as any);
    }).toThrowError();

    expect(WinstonContainer.it).toBeTruthy();
  });

  it('error - in logging function', () => {
    const option: IWinstonContainerOption = {
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

    WinstonContainer.bootstrap(false, option);

    vi.spyOn(getError, 'default').mockImplementation(() => {
      throw new Error('for test, one-time');
    });

    const log = WinstonContainer.l('app', 'iamfilename');
    log.info({});
  });
});
