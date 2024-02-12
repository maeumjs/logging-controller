import { getWinstonContainerOptions } from '#/winston/modules/getWinstonContainerOption';
import { describe, expect, it } from 'vitest';

describe('getWinstonContainerOption', () => {
  it('pass undefined option', () => {
    const options = getWinstonContainerOptions();

    expect(options).toMatchObject({
      app: {},
    });
  });
});
