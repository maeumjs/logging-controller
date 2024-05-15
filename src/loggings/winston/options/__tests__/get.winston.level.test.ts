import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getWinstonLevel } from '#/loggings/winston/options/getWinstonLevel';
import { describe, expect, it } from 'vitest';

describe('getWinstonLevel', () => {
  it('every level', () => {
    const r01 = getWinstonLevel('emerg');
    const r03 = getWinstonLevel('alert');
    const r04 = getWinstonLevel('crit');
    const r05 = getWinstonLevel('error');
    const r06 = getWinstonLevel('warning');
    const r07 = getWinstonLevel('notice');
    const r08 = getWinstonLevel('info');
    const r09 = getWinstonLevel('debug');
    const r10 = getWinstonLevel('i-am-not-level');

    expect(r01).toEqual('emerg');
    expect(r03).toEqual('alert');
    expect(r04).toEqual('crit');
    expect(r05).toEqual('error');
    expect(r06).toEqual('warning');
    expect(r07).toEqual('notice');
    expect(r08).toEqual('info');
    expect(r09).toEqual('debug');
    expect(r10).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVEL);
  });

  it('default value', () => {
    const r01 = getWinstonLevel('i-am-not-level', 'debug');
    expect(r01).toEqual('debug');
  });
});
