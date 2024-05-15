import { ll } from '#/common/ll';
import { noop } from '@maeum/tools';
import { describe, expect, it } from 'vitest';

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
