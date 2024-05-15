import { colors } from '#/loggings/winston/modules/colors';
import { getDefaultColorRedaction } from '#/loggings/winston/modules/getDefaultColorRedaction';
import { beforeAll, describe, expect, it } from 'vitest';

describe('getDefaultColorRedaction', () => {
  beforeAll(() => {
    colors.emerg = ((...text: string[]) => text.join('')) as any;
    colors.alert = ((...text: string[]) => text.join('')) as any;
    colors.crit = ((...text: string[]) => text.join('')) as any;
    colors.error = ((...text: string[]) => text.join('')) as any;
    colors.warning = ((...text: string[]) => text.join('')) as any;
    colors.notice = ((...text: string[]) => text.join('')) as any;
    colors.info = ((...text: string[]) => text.join('')) as any;
    colors.debug = ((...text: string[]) => text.join('')) as any;
  });

  it('without filename', () => {
    const r01 = getDefaultColorRedaction({ timestamp: '2024-05-15T00:00:00.000Z', level: 'info' });
    expect(r01).toEqual('[09:00:00.000 info]: {}');
  });

  it('with filename', () => {
    const r01 = getDefaultColorRedaction({
      timestamp: '2024-05-15T00:00:00.000Z',
      level: 'info',
      _f: 'test.ts',
    });

    expect(r01).toEqual('[09:00:00.000 info test.ts]: {}');
  });

  it('with filename, id', () => {
    const r01 = getDefaultColorRedaction({
      timestamp: '2024-05-15T00:00:00.000Z',
      id: 'db-init',
      level: 'info',
      _f: 'test.ts',
    });

    expect(r01).toEqual('[09:00:00.000 info db-init test.ts]: {"id":"db-init"}');
  });

  it('invalid winston level', () => {
    const r01 = getDefaultColorRedaction({
      timestamp: '2024-05-15T00:00:00.000Z',
      level: 'unknown',
      filename: 'test.ts',
    });

    expect(r01).toEqual('[09:00:00.000 debug]: {"filename":"test.ts"}');
  });
});
