import { CE_WINSTON_DEFAULT_VALUE } from '#/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getNonNullableOptions } from '#/winston/modules/getNonNullableOptions';
import { createConsoleTransport } from '#/winston/transports/createConsoleTransport';
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
      transports: [createConsoleTransport()],
    });

    expect(options.level).toEqual('error');
    expect(options.levels).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVELS);
    expect(options.defaultMeta).toBeTruthy();
    expect(options.transports).toBeTruthy();
  });
});
