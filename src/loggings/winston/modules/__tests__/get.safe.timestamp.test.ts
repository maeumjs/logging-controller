import { getSafeTimestamp } from '#/loggings/winston/modules/getSafeTimestamp';
import * as fnsFmt from 'date-fns/format';
import { describe, expect, it, vitest } from 'vitest';

vitest.mock('date-fns/format', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('date-fns/format')>();
  return {
    ...mod,
  };
});

vitest.mock('date-fns/parseISO', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('date-fns/parseISO')>();
  return {
    ...mod,
  };
});

describe('getSafeTimestamp', () => {
  it('successfully get safe timestamp', () => {
    const ts = getSafeTimestamp('2022-01-01T00:00:00.000Z');
    expect(ts).toEqual('09:00:00.000');
  });

  it('invalid type literal', () => {
    const spyH = vitest.spyOn(fnsFmt, 'format').mockImplementationOnce(() => '11:22:33.444');
    const ts = getSafeTimestamp(1);
    spyH.mockRestore();
    expect(ts).toEqual('11:22:33.444');
  });

  it('invalid literal format', () => {
    const spyH = vitest.spyOn(fnsFmt, 'format').mockImplementationOnce(() => '11:22:33.444');
    const ts = getSafeTimestamp('2022-01-01T99:00:00.000Z');
    spyH.mockRestore();
    expect(ts).toEqual('11:22:33.444');
  });
});
