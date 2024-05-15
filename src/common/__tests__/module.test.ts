import { ll } from '#/common/ll';
import { getDebugChannel } from '#/common/modules/getDebugChannel';
import { getError } from '#/common/modules/getError';
import { objectify } from '#/common/transforms/objectify';
import { safeStringify } from '#/common/transforms/safeStringify';
import { noop } from '@maeum/tools';
import { describe, expect, it, vi } from 'vitest';

describe('getLogContainerOption', () => {
  it("pass - don't string type", () => {
    const r01 = getDebugChannel(1);
    const r02 = getDebugChannel(undefined);
    const r03 = getDebugChannel(null);
    const r04 = getDebugChannel(true);
    const r05 = getDebugChannel(false);
    const r06 = getDebugChannel(BigInt(3));

    expect(r01).toEqual('maeum');
    expect(r02).toEqual('maeum');
    expect(r03).toEqual('maeum');
    expect(r04).toEqual('maeum');
    expect(r05).toEqual('maeum');
    expect(r06).toEqual('maeum');
  });

  it('pass - custom channel', () => {
    const channel = getDebugChannel('logchan');
    expect(channel).toEqual('logchan');
  });
});

describe('ll', () => {
  it('pass - debug function', () => {
    const fn = ll('maeum', 'iamfilename', true);
    expect(fn.namespace).toEqual('maeum:iamfilename');
  });

  it('pass - anomynous function', () => {
    const fn = ll('maeum', 'iamfilename', true);
    expect(fn).toBeTruthy();
  });
});

describe('noop', () => {
  it('pass', () => {
    noop();
  });
});

describe('safeStringify', () => {
  it('pass', () => {
    const r01 = safeStringify({ name: 'hello' });
    expect(r01).toEqual(`{"name":"hello"}`);
  });

  it('exception', () => {
    const spyH = vi.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
      throw new Error('error');
    });
    const r01 = safeStringify({
      name: 'hello',
      a: new Error(),
    });

    spyH.mockRestore();

    expect(r01).toEqual('{}');
  });
});

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

describe('objectify', () => {
  it('pass', () => {
    const obj = objectify({ name: 'ironman', age: () => 26 });
    expect(obj).toMatchObject({ name: 'ironman' });
  });

  it('pass - exception', () => {
    const err = new Error('error');
    const spyH = vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw err;
    });
    const obj = objectify({ name: 'ironman', age: () => 26 });
    spyH.mockRestore();
    expect(obj).toMatchObject({ err });
  });
});
