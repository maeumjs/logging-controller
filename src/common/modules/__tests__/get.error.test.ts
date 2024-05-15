import { getError } from '#/common/modules/getError';
import { describe, expect, it } from 'vitest';

describe('getError', () => {
  it('pass - undefined', () => {
    const r01 = getError();
    const r02 = getError({ errMsg: undefined });
    const r03 = getError({ errMsg: undefined, errStk: undefined });

    expect(r01).toMatchObject({ errMsg: undefined, errStk: undefined });
    expect(r02).toMatchObject({ errMsg: undefined, errStk: undefined });
    expect(r03).toMatchObject({ errMsg: undefined, errStk: undefined });
  });

  it('pass - with Error', () => {
    const err = new Error('error');
    err.stack = 'Error: error';

    const content = getError({ err });
    expect(content).toMatchObject({ errMsg: 'error', errStk: 'Error: error' });
  });

  it('pass - with Error null stacktrace', () => {
    const err = new Error('error');
    err.stack = undefined;

    const content = getError({ err });
    expect(content).toMatchObject({ errMsg: 'error', errStk: undefined });
  });

  it('pass - with ILogFormat', () => {
    const content = getError({ errMsg: 'error', errStk: 'Error: error' });
    expect(content).toMatchObject({ errMsg: 'error', errStk: 'Error: error' });
  });

  it('pass - with ILogFormat null stacktrace', () => {
    const content = getError({ errMsg: 'error', errStk: undefined });
    expect(content).toMatchObject({ errMsg: 'error', errStk: undefined });
  });
});
