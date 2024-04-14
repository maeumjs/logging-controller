import { CE_HTTP_METHOD } from '#/common/const-enum/CE_HTTP_METHOD';
import { getHttpMethod } from '#/http/common/modules/getHttpMethod';
import { getSafeTimestamp } from '#/loggings/winston/modules/getSafeTimestamp';
import { getWinstonLevel } from '#/loggings/winston/options/getWinstonLevel';
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
  it('unknown method', () => {
    const r01 = getHttpMethod();
    const r02 = getHttpMethod(1);
    const r03 = getHttpMethod('A');

    expect(r01).toEqual('UNKNOWN');
    expect(r02).toEqual('UNKNOWN');
    expect(r03).toEqual('UNKNOWN');
  });

  it('delete method', () => {
    const r04 = getHttpMethod('DELETE');
    const r05 = getHttpMethod('delete');
    const r06 = getHttpMethod('Delete');

    expect(r04).toEqual(CE_HTTP_METHOD.DELETE);
    expect(r05).toEqual(CE_HTTP_METHOD.DELETE);
    expect(r06).toEqual(CE_HTTP_METHOD.DELETE);
  });

  it('get method', () => {
    const r07 = getHttpMethod('GET');
    const r08 = getHttpMethod('get');
    const r09 = getHttpMethod('Get');

    expect(r07).toEqual(CE_HTTP_METHOD.GET);
    expect(r08).toEqual(CE_HTTP_METHOD.GET);
    expect(r09).toEqual(CE_HTTP_METHOD.GET);
  });

  it('head method', () => {
    const r10 = getHttpMethod('HEAD');
    const r11 = getHttpMethod('head');
    const r12 = getHttpMethod('Head');

    expect(r10).toEqual(CE_HTTP_METHOD.HEAD);
    expect(r11).toEqual(CE_HTTP_METHOD.HEAD);
    expect(r12).toEqual(CE_HTTP_METHOD.HEAD);
  });

  it('patch method', () => {
    const r13 = getHttpMethod('PATCH');
    const r14 = getHttpMethod('patch');
    const r15 = getHttpMethod('Patch');

    expect(r13).toEqual(CE_HTTP_METHOD.PATCH);
    expect(r14).toEqual(CE_HTTP_METHOD.PATCH);
    expect(r15).toEqual(CE_HTTP_METHOD.PATCH);
  });

  it('post method', () => {
    const r16 = getHttpMethod('POST');
    const r17 = getHttpMethod('post');
    const r18 = getHttpMethod('Post');

    expect(r16).toEqual(CE_HTTP_METHOD.POST);
    expect(r17).toEqual(CE_HTTP_METHOD.POST);
    expect(r18).toEqual(CE_HTTP_METHOD.POST);
  });

  it('put method', () => {
    const r19 = getHttpMethod('PUT');
    const r20 = getHttpMethod('put');
    const r21 = getHttpMethod('Put');

    expect(r19).toEqual(CE_HTTP_METHOD.PUT);
    expect(r20).toEqual(CE_HTTP_METHOD.PUT);
    expect(r21).toEqual(CE_HTTP_METHOD.PUT);
  });

  it('options method', () => {
    const r22 = getHttpMethod('OPTIONS');
    const r23 = getHttpMethod('options');
    const r24 = getHttpMethod('Options');

    expect(r22).toEqual(CE_HTTP_METHOD.OPTIONS);
    expect(r23).toEqual(CE_HTTP_METHOD.OPTIONS);
    expect(r24).toEqual(CE_HTTP_METHOD.OPTIONS);
  });

  it('search method', () => {
    const r25 = getHttpMethod('SEARCH');
    const r26 = getHttpMethod('search');
    const r27 = getHttpMethod('Search');

    expect(r25).toEqual(CE_HTTP_METHOD.SEARCH);
    expect(r26).toEqual(CE_HTTP_METHOD.SEARCH);
    expect(r27).toEqual(CE_HTTP_METHOD.SEARCH);
  });

  it('trace method', () => {
    const r28 = getHttpMethod('TRACE');
    const r29 = getHttpMethod('trace');
    const r30 = getHttpMethod('Trace');

    expect(r28).toEqual(CE_HTTP_METHOD.TRACE);
    expect(r29).toEqual(CE_HTTP_METHOD.TRACE);
    expect(r30).toEqual(CE_HTTP_METHOD.TRACE);
  });

  it('propfind method', () => {
    const r31 = getHttpMethod('PROPFIND');
    const r32 = getHttpMethod('propfind');
    const r33 = getHttpMethod('Propfind');

    expect(r31).toEqual(CE_HTTP_METHOD.PROPFIND);
    expect(r32).toEqual(CE_HTTP_METHOD.PROPFIND);
    expect(r33).toEqual(CE_HTTP_METHOD.PROPFIND);
  });

  it('proppatch method', () => {
    const r34 = getHttpMethod('PROPPATCH');
    const r35 = getHttpMethod('proppatch');
    const r36 = getHttpMethod('Proppatch');

    expect(r34).toEqual(CE_HTTP_METHOD.PROPPATCH);
    expect(r35).toEqual(CE_HTTP_METHOD.PROPPATCH);
    expect(r36).toEqual(CE_HTTP_METHOD.PROPPATCH);
  });

  it('mkcol method', () => {
    const r37 = getHttpMethod('MKCOL');
    const r38 = getHttpMethod('mkcol');
    const r39 = getHttpMethod('Mkcol');

    expect(r37).toEqual(CE_HTTP_METHOD.MKCOL);
    expect(r38).toEqual(CE_HTTP_METHOD.MKCOL);
    expect(r39).toEqual(CE_HTTP_METHOD.MKCOL);
  });

  it('copy method', () => {
    const r40 = getHttpMethod('COPY');
    const r41 = getHttpMethod('copy');
    const r42 = getHttpMethod('Copy');

    expect(r40).toEqual(CE_HTTP_METHOD.COPY);
    expect(r41).toEqual(CE_HTTP_METHOD.COPY);
    expect(r42).toEqual(CE_HTTP_METHOD.COPY);
  });

  it('move method', () => {
    const r43 = getHttpMethod('MOVE');
    const r44 = getHttpMethod('move');
    const r45 = getHttpMethod('Move');

    expect(r43).toEqual(CE_HTTP_METHOD.MOVE);
    expect(r44).toEqual(CE_HTTP_METHOD.MOVE);
    expect(r45).toEqual(CE_HTTP_METHOD.MOVE);
  });

  it('lock method', () => {
    const r46 = getHttpMethod('LOCK');
    const r47 = getHttpMethod('lock');
    const r48 = getHttpMethod('Lock');

    expect(r46).toEqual(CE_HTTP_METHOD.LOCK);
    expect(r47).toEqual(CE_HTTP_METHOD.LOCK);
    expect(r48).toEqual(CE_HTTP_METHOD.LOCK);
  });

  it('unlock method', () => {
    const r49 = getHttpMethod('UNLOCK');
    const r50 = getHttpMethod('unlock');
    const r51 = getHttpMethod('Unlock');

    expect(r49).toEqual(CE_HTTP_METHOD.UNLOCK);
    expect(r50).toEqual(CE_HTTP_METHOD.UNLOCK);
    expect(r51).toEqual(CE_HTTP_METHOD.UNLOCK);
  });
});
