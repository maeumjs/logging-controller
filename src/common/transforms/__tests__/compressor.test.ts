import { compressor } from '#/common/transforms/compressor';
import * as ss from '#/common/transforms/safeStringify';
import { describe, expect, it, vi } from 'vitest';

describe('compressor', () => {
  it('pass - object', async () => {
    const compressed = await compressor({ name: 'hellop' });
    expect(compressed).toEqual('EUB7Im5hbWUiOiJoZWxsb3AifQ==');
  });

  it('pass - string', async () => {
    const compressed = await compressor('hi-compressor');
    expect(compressed).toEqual('DTBoaS1jb21wcmVzc29y');
  });

  it('pass - string', async () => {
    const spyH = vi.spyOn(ss, 'safeStringify').mockImplementationOnce(() => {
      throw new Error('error');
    });
    const compressed = await compressor({ name: 'hellop' });
    spyH.mockRestore();
    expect(compressed).toEqual(
      'POx7ICJlcnJvciI6ICJjb21wcmVzc29yIGZhaWwiLCAicGF5bG9hZCI6IHsibmFtZSI6ImhlbGxvcCJ9IH0=',
    );
  });
});
