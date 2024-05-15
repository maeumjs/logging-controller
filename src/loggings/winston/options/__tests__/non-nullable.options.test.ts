import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';
import { makeWinstonConsoleTransport } from '#/loggings/winston/transports/makeWinstonConsoleTransport';
import { describe, expect, it } from 'vitest';

describe('getNonNullableOptions', () => {
  it('empty parameter', () => {
    const options = getNonNullableOptions();

    expect(options.level).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVEL);
    expect(options.levels).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVELS);
    expect(options.defaultMeta).toBeTruthy();
    expect(options.transports).toBeTruthy();
  });

  it('custom parameter', () => {
    const options = getNonNullableOptions({
      level: 'error',
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      defaultMeta: { name: 'api' },
      transports: [makeWinstonConsoleTransport()],
    });

    expect(options.level).toEqual('error');
    expect(options.levels).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVELS);
    expect(options.defaultMeta).toBeTruthy();
    expect(options.transports).toBeTruthy();
  });

  it('custom parameter', () => {
    const options = getNonNullableOptions({
      level: 'error',
      levels: CE_WINSTON_DEFAULT_VALUE.LEVELS,
      defaultMeta: { name: 'api' },
      transports: [],
    });

    expect(options.level).toEqual('error');
    expect(options.levels).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVELS);
    expect(options.defaultMeta).toBeTruthy();
    expect(options.transports).toBeTruthy();
  });
});
