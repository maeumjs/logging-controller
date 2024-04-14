import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getLogMethod } from '#/loggings/winston/modules/getLogMethod';
import { createConsoleTransport } from '#/loggings/winston/transports/createConsoleTransport';
import { describe, expect, it } from 'vitest';
import winston from 'winston';

describe('getLogMethod', () => {
  it('all methods test', () => {
    const logger = winston.createLogger({
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      transports: [createConsoleTransport(CE_WINSTON_DEFAULT_VALUE.LEVEL)],
    });

    const r01 = getLogMethod('emerg', logger);
    const r02 = getLogMethod('alert', logger);
    const r03 = getLogMethod('crit', logger);
    const r04 = getLogMethod('error', logger);
    const r05 = getLogMethod('warning', logger);
    const r06 = getLogMethod('notice', logger);
    const r07 = getLogMethod('info', logger);
    const r08 = getLogMethod('debug', logger);
    const r09 = getLogMethod('debug2', logger);

    expect(r01).toBeTruthy();
    expect(r02).toBeTruthy();
    expect(r03).toBeTruthy();
    expect(r04).toBeTruthy();
    expect(r05).toBeTruthy();
    expect(r06).toBeTruthy();
    expect(r07).toBeTruthy();
    expect(r08).toBeTruthy();
    expect(r09).toBeTruthy();
  });
});
