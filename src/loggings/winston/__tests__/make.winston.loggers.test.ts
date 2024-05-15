import { container } from '#/common/__tests__/container';
import { WinstonLoggers } from '#/loggings/winston/WinstonLoggers';
import { TWinstonLoggersSyncBootstrapOption } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';
import { makeAsyncWinstonLoggers } from '#/loggings/winston/makeAsyncWinstonLoggers';
import { makeSyncWinstonLoggers } from '#/loggings/winston/makeSyncWinstonLoggers';
import { describe, expect, it } from 'vitest';

describe('makeSyncWinstonLoggers', () => {
  it('successfully make logger instance', () => {
    const logger = makeSyncWinstonLoggers(container);
    expect(logger.enableDebugMessage).toBeFalsy();
    expect(logger).toBeInstanceOf(WinstonLoggers);
  });

  it('successfully make logger instance using custom options, multiple logger', () => {
    const logger = makeSyncWinstonLoggers(container, {
      getEnableDebugMessage: () => true,
      options: new Map<string, TWinstonLoggersSyncBootstrapOption>([
        ['api', {}],
        ['biz', {}],
      ]),
    });

    expect(logger.enableDebugMessage).toBeTruthy();
    expect(logger).toBeInstanceOf(WinstonLoggers);
  });
});

describe('makeAsyncWinstonLoggers', () => {
  it('successfully make logger instance', async () => {
    const logger = await makeAsyncWinstonLoggers(container);
    expect(logger.enableDebugMessage).toBeFalsy();
    expect(logger).toBeInstanceOf(WinstonLoggers);
  });

  it('successfully make logger instance using custom options, multiple logger', async () => {
    const logger = await makeAsyncWinstonLoggers(container, {
      getEnableDebugMessage: () => true,
      options: new Map<string, TWinstonLoggersSyncBootstrapOption>([
        ['api', {}],
        ['biz', {}],
      ]),
    });

    expect(logger.enableDebugMessage).toBeTruthy();
    expect(logger).toBeInstanceOf(WinstonLoggers);
  });
});
