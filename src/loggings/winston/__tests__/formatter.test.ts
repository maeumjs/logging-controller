import { getFormatter } from '#/loggings/winston/modules/getFormatter';
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

describe('getWithoutMessageInfo', () => {
  it('pass', () => {
    const r01 = getWithoutMessageInfo({ message: 'hi', test: 'hello' });
    const r02 = getWithoutMessageInfo({ test: 'hello' });

    expect(r01).toMatchObject({ test: 'hello' });
    expect(r02).toMatchObject({ test: 'hello' });
  });
});
