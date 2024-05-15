import { getOnlyMessageFormatter } from '#/loggings/winston/modules/getOnlyMessageFormatter';
import { getOnlyMessageInfo } from '#/loggings/winston/modules/getOnlyMessageInfo';
import { describe, expect, it } from 'vitest';

describe('getOnlyMessageFormatter', () => {
  it('get message only formatter', () => {
    const r01 = getOnlyMessageFormatter();
    expect(r01).toBeTruthy();
  });
});

describe('getWithoutMessageInfo', () => {
  it('pass', () => {
    const r01 = getOnlyMessageInfo({ message: 'hi', test: 'hello' });
    const r02 = getOnlyMessageInfo({ test: 'hello' });

    expect(r01).toMatchObject({ message: { test: 'hello' } });
    expect(r02).toMatchObject({ message: { test: 'hello' } });
  });
});
