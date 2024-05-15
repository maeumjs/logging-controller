import { safeStringify } from '#/common/transforms/safeStringify';
import { describe, expect, it, vi } from 'vitest';

describe('safeStringify', () => {
  it('successfully safeStringify', () => {
    const r01 = safeStringify({ name: 'hello' });
    expect(r01).toEqual(`{"name":"hello"}`);
  });

  it('raise exception on safeStringify', () => {
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
