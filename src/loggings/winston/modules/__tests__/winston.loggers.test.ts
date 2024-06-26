import * as ge from '#/common/modules/getError';
import { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { IWinstonLoggersOptions } from '#/loggings/winston/interfaces/IWinstonLoggersOptions';
import { getWinstonAsyncLoggers } from '#/loggings/winston/modules/getWinstonAsyncLoggers';
import { getWinstonSyncLoggers } from '#/loggings/winston/modules/getWinstonSyncLoggers';
import fs from 'node:fs';
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

describe('getWinstonSyncLoggers', () => {
  it('sync function', async () => {
    const logApp = getWinstonSyncLoggers('api', (defaultOptions) => defaultOptions ?? {}, {
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
    });

    expect(logApp?.name).toEqual('api');
  });

  it('async function', async () => {
    expect(() => {
      getWinstonSyncLoggers('api', async (defaultOptions) => defaultOptions ?? {}, {
        levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      });
    }).toThrowError();
  });
});

describe('getWinstonAsyncLoggers', () => {
  it('async function', async () => {
    const logApp = await getWinstonAsyncLoggers(
      'api',
      async (defaultOptions) => defaultOptions ?? {},
      {
        levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      },
    );

    expect(logApp.name).toEqual('api');
  });

  it('sync function', async () => {
    const logApp = await getWinstonAsyncLoggers('api', (defaultOptions) => defaultOptions ?? {}, {
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
    });

    expect(logApp.name).toEqual('api');
  });
});

describe('getError', () => {
  it('pass', () => {
    const extracted = ge.getError({ err: new Error('message') });
    expect(extracted.errMsg).toEqual('message');
  });

  it('undefined', () => {
    const extracted = ge.getError({});
    expect(extracted.errMsg).toBeUndefined();
  });

  it('object', () => {
    const extracted = ge.getError({ errMsg: 'message', errStk: 'stack' });
    expect(extracted).toMatchObject({ errMsg: 'message', errStk: 'stack' });
  });
});

describe('WinstonLoggers', () => {
  it('async', async () => {
    const defaultName = 'app';
    const option: IWinstonLoggersOptions = {
      getEnableDebugMessage: () => true,
      loggers: new Map([[defaultName, await getWinstonAsyncLoggers(defaultName)]]),
    };
    const winston = new WinstonLoggers(option);
    const log = winston.l('iamfilename');

    log.$('test');
    log.emerg({ err: new Error('test') });
    log.alert({});
    log.crit({});
    log.error({});
    log.warning({});
    log.notice({});
    log.info({});
    log.debug({});

    expect(winston.enableDebugMessage).toBeTruthy();
    expect(winston).toBeTruthy();
    expect(winston.loggers).toBeTruthy();

    expect(log).toBeTruthy();
  });

  it('sync', () => {
    const defaultName = 'app';
    const option: IWinstonLoggersOptions = {
      getEnableDebugMessage: () => true,
      loggers: new Map([[defaultName, getWinstonSyncLoggers(defaultName)]]),
    };
    const winston = new WinstonLoggers(option);
    const log = winston.l('iamfilename');

    log.$('test');
    log.emerg({ err: new Error('test') });
    log.alert({});
    log.crit({});
    log.error({});
    log.warning({});
    log.notice({});
    log.info({});
    log.debug({});

    expect(winston.enableDebugMessage).toBeTruthy();
    expect(winston).toBeTruthy();
    expect(winston.loggers).toBeTruthy();

    expect(log).toBeTruthy();
  });

  it('error - application not found', () => {
    const defaultName = 'app';
    const option: IWinstonLoggersOptions = {
      getEnableDebugMessage: () => true,
      loggers: new Map([[defaultName, getWinstonSyncLoggers(defaultName)]]),
    };
    const winston = new WinstonLoggers(option);

    expect(() => {
      const log = winston.l('not-found-application', 'iamfilename');
      log.info({ message: 'test' } as any);
    }).toThrowError();

    expect(winston).toBeTruthy();
  });

  it('error - in logging function', () => {
    const defaultName = 'app';
    const option: IWinstonLoggersOptions = {
      getEnableDebugMessage: () => true,
      loggers: new Map([[defaultName, getWinstonSyncLoggers(defaultName)]]),
    };
    const winston = new WinstonLoggers(option);

    vi.spyOn(ge, 'getError').mockImplementation(() => {
      throw new Error('for test, one-time');
    });

    const log = winston.l('app', 'iamfilename');
    log.info({});
  });
});
