import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getWinstonLogMethod } from '#/loggings/winston/modules/getWinstonLogMethod';
import { makeWinstonConsoleTransport } from '#/loggings/winston/transports/makeWinstonConsoleTransport';
import { describe, expect, it } from 'vitest';
import winston from 'winston';

describe('getLogMethod', () => {
  it('all methods test', () => {
    const logger = winston.createLogger({
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      transports: [makeWinstonConsoleTransport(CE_WINSTON_DEFAULT_VALUE.LEVEL)],
    });

    const r01 = getWinstonLogMethod('emerg', logger);
    const r02 = getWinstonLogMethod('alert', logger);
    const r03 = getWinstonLogMethod('crit', logger);
    const r04 = getWinstonLogMethod('error', logger);
    const r05 = getWinstonLogMethod('warning', logger);
    const r06 = getWinstonLogMethod('notice', logger);
    const r07 = getWinstonLogMethod('info', logger);
    const r08 = getWinstonLogMethod('debug', logger);
    const r09 = getWinstonLogMethod('debug2', logger);

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
