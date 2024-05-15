import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { TWinstonLoggersSyncBootstrapOption } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';
import { getWinstonLoggersSyncOptions } from '#/loggings/winston/options/getWinstonLoggersSyncOptions';
import { describe, expect, it } from 'vitest';

describe('getWinstonLoggersSyncOptions', () => {
  it('pass undefined option', () => {
    const options = getWinstonLoggersSyncOptions();
    const expecting = new Map([
      [
        CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME,
        {
          getOptions: () => getNonNullableOptions(),
        },
      ],
    ]);

    expect(options.keys()).toMatchObject(expecting.keys());
  });

  it('custom application configuration pass to funciton', () => {
    const options = getWinstonLoggersSyncOptions(
      new Map<string, TWinstonLoggersSyncBootstrapOption>([
        ['test01', {}],
        ['test02', undefined as any],
      ]),
    );

    const expecting = new Map([
      [
        'test01',
        {
          getOptions: () => getNonNullableOptions(),
        },
      ],
    ]);

    expect(options.keys()).toMatchObject(expecting.keys());
  });

  it('check generated getOptions function result', () => {
    const options = getWinstonLoggersSyncOptions();
    const r01 = options.get?.(CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME)?.getOptions?.();
    const expecting = getNonNullableOptions();

    expect(r01?.defaultMeta).toMatchObject(expecting.defaultMeta);
    expect(r01?.levels).toMatchObject(expecting.levels ?? []);
  });
});
