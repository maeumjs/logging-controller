import { getDebugChannel } from '#/common/modules/getDebugChannel';
import { describe, expect, it } from 'vitest';

describe('getDebugChannel', () => {
  it('channel name is not a string type', () => {
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

  it('custom channel but names are string type', () => {
    const channel = getDebugChannel('logchan');
    expect(channel).toEqual('logchan');
  });
});
