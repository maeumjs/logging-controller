import * as ge from '#/common/modules/getError';
import { WinstonContainer } from '#/winston/WinstonContainer';
import { CE_WINSTON_DEFAULT_VALUE } from '#/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { TWinstonContainerBootstrapOptions } from '#/winston/interfaces/IWinstonContainerOption';
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

describe('getSyncLoggers', () => {
  it('sync function', async () => {
    const logApp = WinstonContainer.getSyncLoggers(
      'api',
      (defaultOptions) => defaultOptions ?? {},
      { levels: CE_WINSTON_DEFAULT_VALUE.LEVELS },
    );

    expect(logApp?.name).toEqual('api');
  });

  it('async function', async () => {
    const logApp = WinstonContainer.getSyncLoggers(
      'api',
      async (defaultOptions) => defaultOptions ?? {},
      { levels: CE_WINSTON_DEFAULT_VALUE.LEVELS },
    );

    expect(logApp).toBeUndefined();
  });
});

describe('getAsyncLoggers', () => {
  it('async function', async () => {
    const logApp = await WinstonContainer.getAsyncLoggers(
      'api',
      async (defaultOptions) => defaultOptions ?? {},
      { levels: CE_WINSTON_DEFAULT_VALUE.LEVELS },
    );

    expect(logApp.name).toEqual('api');
  });

  it('sync function', async () => {
    const logApp = await WinstonContainer.getAsyncLoggers(
      'api',
      (defaultOptions) => defaultOptions ?? {},
      { levels: CE_WINSTON_DEFAULT_VALUE.LEVELS },
    );

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

describe('createLogger', () => {
  it('async', async () => {
    const option: TWinstonContainerBootstrapOptions<true> = {
      app: { getOptions: () => ({}) },
    };

    await WinstonContainer.bootstrap(false, () => false, undefined, option);

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
    expect(WinstonContainer.it.loggers).toBeTruthy();

    expect(log).toBeTruthy();
  });

  it('sync', () => {
    const option: TWinstonContainerBootstrapOptions<false> = {
      app: { getOptions: () => ({}) },
    };

    WinstonContainer.bootstrap(false, () => false, undefined, option);

    const log = WinstonContainer.l('app', 'iamfilename');

    log.$('test');

    expect(WinstonContainer.it).toBeTruthy();
  });

  it('error - application not found', () => {
    const option: TWinstonContainerBootstrapOptions<false> = {
      app: { getOptions: () => ({}) },
    };

    WinstonContainer.bootstrap(false, () => false, undefined, option);

    expect(() => {
      const log = WinstonContainer.l('not-found-application', 'iamfilename');
      log.info({ message: 'test' } as any);
    }).toThrowError();

    expect(WinstonContainer.it).toBeTruthy();
  });

  it('error - in logging function', () => {
    const option: TWinstonContainerBootstrapOptions<false> = {
      app: { getOptions: () => ({}) },
    };

    WinstonContainer.bootstrap(false, () => false, undefined, option);

    vi.spyOn(ge, 'getError').mockImplementation(() => {
      throw new Error('for test, one-time');
    });

    const log = WinstonContainer.l('app', 'iamfilename');
    log.info({});
  });
});
