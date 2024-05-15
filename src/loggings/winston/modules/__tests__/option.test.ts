import { getWinstonLoggersSyncOptions } from '#/loggings/winston/options/getWinstonLoggersSyncOptions';
import { describe, expect, it } from 'vitest';

describe('getWinstonContainerOption', () => {
  it('pass undefined option', () => {
    const options = getWinstonLoggersSyncOptions();

    expect(options).toBeTruthy();
  });
});
