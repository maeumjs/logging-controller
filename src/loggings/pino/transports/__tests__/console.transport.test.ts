import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { makeWinstonConsoleTransport } from '#/loggings/winston/transports/makeWinstonConsoleTransport';
import { describe, expect, it } from 'vitest';

describe('createFileTransport', () => {
  it('default option', () => {
    const transport = makeWinstonConsoleTransport();
    expect(transport.level).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVEL);
    expect(transport.format).toBeDefined();
  });

  it('custom option', () => {
    const transport = makeWinstonConsoleTransport('error', getFormatter());
    expect(transport.level).toEqual('error');
    expect(transport.format).toBeDefined();
  });
});
