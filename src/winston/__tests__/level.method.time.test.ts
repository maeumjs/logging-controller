import { CE_HTTP_METHOD } from '#/common/const-enum/CE_HTTP_METHOD';
import { getHttpMethod } from '#/http/modules/getHttpMethod';
import { getSafeTimestamp } from '#/winston/modules/getSafeTimestamp';
import { getWinstonLevel } from '#/winston/modules/getWinstonLevel';
import { describe, expect, it, vi } from 'vitest';

describe('getWinstonLevel', () => {
  it('pass', () => {
    const r01 = getWinstonLevel();
    const r02 = getWinstonLevel('A');

    const r03 = getWinstonLevel('emerg');
    const r04 = getWinstonLevel('alert');
    const r05 = getWinstonLevel('crit');
    const r06 = getWinstonLevel('error');
    const r07 = getWinstonLevel('warning');
    const r08 = getWinstonLevel('notice');
    const r09 = getWinstonLevel('info');
    const r10 = getWinstonLevel('debug');

    expect(r01).toEqual('info');
    expect(r02).toEqual('info');

    expect(r03).toEqual('emerg');
    expect(r04).toEqual('alert');
    expect(r05).toEqual('crit');
    expect(r06).toEqual('error');
    expect(r07).toEqual('warning');
    expect(r08).toEqual('notice');
    expect(r09).toEqual('info');
    expect(r10).toEqual('debug');
  });
});

describe('getSafeTimestamp', () => {
  it('pass empty', () => {
    const m = new Date(2023, 0, 1, 11, 22, 33, 444);
    vi.setSystemTime(m);

    const r01 = getSafeTimestamp();
    expect(r01).toEqual('11:22:33.444');
  });

  it('pass', () => {
    const r01 = getSafeTimestamp('2023-01-01T01:02:03.004+09:00');
    expect(r01).toEqual('01:02:03.004');
  });
});

describe('getHttpMethod', () => {
  it('pass', () => {
    const r01 = getHttpMethod();
    const r02 = getHttpMethod(1);
    const r03 = getHttpMethod('A');

    const r04 = getHttpMethod('get');
    const r05 = getHttpMethod('GET');
    const r06 = getHttpMethod('head');
    const r07 = getHttpMethod('HEAD');
    const r08 = getHttpMethod('post');
    const r09 = getHttpMethod('POST');
    const r10 = getHttpMethod('put');
    const r11 = getHttpMethod('PUT');
    const r12 = getHttpMethod('delete');
    const r13 = getHttpMethod('DELETE');
    const r14 = getHttpMethod('connect');
    const r15 = getHttpMethod('CONNECT');
    const r16 = getHttpMethod('options');
    const r17 = getHttpMethod('OPTIONS');
    const r18 = getHttpMethod('trace');
    const r19 = getHttpMethod('TRACE');
    const r20 = getHttpMethod('patch');
    const r21 = getHttpMethod('PATCH');

    expect(r01).toEqual('UNKNOWN');
    expect(r02).toEqual('UNKNOWN');
    expect(r03).toEqual('UNKNOWN');

    expect(r04).toEqual(CE_HTTP_METHOD.GET);
    expect(r05).toEqual(CE_HTTP_METHOD.GET);
    expect(r06).toEqual(CE_HTTP_METHOD.HEAD);
    expect(r07).toEqual(CE_HTTP_METHOD.HEAD);
    expect(r08).toEqual(CE_HTTP_METHOD.POST);
    expect(r09).toEqual(CE_HTTP_METHOD.POST);
    expect(r10).toEqual(CE_HTTP_METHOD.PUT);
    expect(r11).toEqual(CE_HTTP_METHOD.PUT);
    expect(r12).toEqual(CE_HTTP_METHOD.DELETE);
    expect(r13).toEqual(CE_HTTP_METHOD.DELETE);
    expect(r14).toEqual(CE_HTTP_METHOD.CONNECT);
    expect(r15).toEqual(CE_HTTP_METHOD.CONNECT);
    expect(r16).toEqual(CE_HTTP_METHOD.OPTIONS);
    expect(r17).toEqual(CE_HTTP_METHOD.OPTIONS);
    expect(r18).toEqual(CE_HTTP_METHOD.TRACE);
    expect(r19).toEqual(CE_HTTP_METHOD.TRACE);
    expect(r20).toEqual(CE_HTTP_METHOD.PATCH);
    expect(r21).toEqual(CE_HTTP_METHOD.PATCH);
  });
});
