import { getPinoLevel } from '#/pino/modules/getPinoLevel';
import { describe, expect, it } from 'vitest';

describe('getPinoLevel', () => {
  it('pass', () => {
    const r01 = getPinoLevel();
    const r02 = getPinoLevel('A');

    const r03 = getPinoLevel('fatal');
    const r04 = getPinoLevel('error');
    const r05 = getPinoLevel('warn');
    const r06 = getPinoLevel('info');
    const r07 = getPinoLevel('debug');
    const r08 = getPinoLevel('trace');
    const r09 = getPinoLevel('silent');

    expect(r01).toEqual('info');
    expect(r02).toEqual('info');

    expect(r03).toEqual('fatal');
    expect(r04).toEqual('error');
    expect(r05).toEqual('warn');
    expect(r06).toEqual('info');
    expect(r07).toEqual('debug');
    expect(r08).toEqual('trace');
    expect(r09).toEqual('silent');
  });
});
