import { objectify } from '#/common/transforms/objectify';
import { describe, expect, it, vitest } from 'vitest';

describe('objectify', () => {
  it('successfully objectify', () => {
    const obj = objectify({ name: 'hello' });
    expect(obj).toMatchObject({ name: 'hello' });
  });

  it('raise exception on objectify', () => {
    const err = new Error('error');
    const spyH = vitest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw err;
    });
    const obj = objectify({ name: 'ironman', age: () => 26 });
    spyH.mockRestore();
    expect(obj).toMatchObject({ err });
  });
});
