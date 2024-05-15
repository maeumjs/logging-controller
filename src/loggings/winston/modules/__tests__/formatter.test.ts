import { getDefaultRedaction } from '#/loggings/winston/modules/getDefaultRedaction';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { getSafeFormatter } from '#/loggings/winston/modules/getSafeFormatter';
import { getWithoutMessageInfo } from '#/loggings/winston/modules/getWithoutMessageInfo';
import { describe, expect, it } from 'vitest';

describe('getFormatter', () => {
  it('pass', () => {
    const r01 = getFormatter(true);
    expect(r01).toBeTruthy();
  });

  it('pass', () => {
    const r01 = getFormatter(false);
    expect(r01).toBeTruthy();
  });
});

describe('getSafeFormatter', () => {
  it('successfully get safe formatter', () => {
    const r01 = getSafeFormatter({ message: 'hi' }, getDefaultRedaction);
    expect(r01).toMatchObject({});
  });

  it('raise exception from safe formatter', () => {
    const r01 = getSafeFormatter({ message: 'hi' }, () => {
      throw new Error('raise error');
    });
    expect(r01).toEqual('{}');
  });
});

describe('getWithoutMessageInfo', () => {
  it('pass', () => {
    const r01 = getWithoutMessageInfo({ message: 'hi', test: 'hello' });
    const r02 = getWithoutMessageInfo({ test: 'hello' });

    expect(r01).toMatchObject({ test: 'hello' });
    expect(r02).toMatchObject({ test: 'hello' });
  });
});
