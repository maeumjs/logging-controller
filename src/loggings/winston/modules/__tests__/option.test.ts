import { getWinstonContainerOptions } from '#/loggings/winston/options/getWinstonContainerOption';
import { describe, expect, it } from 'vitest';

describe('getWinstonContainerOption', () => {
  it('pass undefined option', () => {
    const options = getWinstonContainerOptions();

    expect(options).toBeTruthy();
  });
});
