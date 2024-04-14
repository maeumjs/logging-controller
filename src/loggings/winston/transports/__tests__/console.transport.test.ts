import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { createConsoleTransport } from '#/loggings/winston/transports/createConsoleTransport';
import { describe, expect, it } from 'vitest';

describe('createFileTransport', () => {
  it('default option', () => {
    const transport = createConsoleTransport();
    expect(transport.level).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVEL);
    expect(transport.format).toBeDefined();
  });

  it('custom option', () => {
    const transport = createConsoleTransport('error', getFormatter());
    expect(transport.level).toEqual('error');
    expect(transport.format).toBeDefined();
  });
});
