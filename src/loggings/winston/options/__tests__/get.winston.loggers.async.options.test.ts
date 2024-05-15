import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { TWinstonLoggersSyncBootstrapOption } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';
import { getNonNullableOptions } from '#/loggings/winston/options/getNonNullableOptions';
import { getWinstonLoggersAsyncOptions } from '#/loggings/winston/options/getWinstonLoggersAsyncOptions';
import { isPromise } from 'util/types';
import { describe, expect, it } from 'vitest';

describe('getWinstonLoggersAsyncOptions', () => {
  it('pass undefined option', () => {
    const options = getWinstonLoggersAsyncOptions();
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
    const options = getWinstonLoggersAsyncOptions(
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

  it('check generated getOptions function result', async () => {
    const options = getWinstonLoggersAsyncOptions();
    const r01 = options.get?.(CE_WINSTON_DEFAULT_VALUE.DEFAULT_NAME)?.getOptions?.();
    const r02 = isPromise(r01) ? await r01 : r01;
    const expecting = getNonNullableOptions();

    expect(r02?.defaultMeta).toMatchObject(expecting.defaultMeta);
    expect(r02?.levels).toMatchObject(expecting.levels ?? []);
  });
});
