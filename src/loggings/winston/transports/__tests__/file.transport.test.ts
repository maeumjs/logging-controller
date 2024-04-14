import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import { getFormatter } from '#/loggings/winston/modules/getFormatter';
import { createFileTransport } from '#/loggings/winston/transports/createFileTransport';
import { describe, expect, it } from 'vitest';

describe('createFileTransport', () => {
  it('default option', () => {
    const transport = createFileTransport();
    expect(transport.level).toEqual(CE_WINSTON_DEFAULT_VALUE.LEVEL);
    expect(transport.dirname).toEqual(CE_WINSTON_DEFAULT_VALUE.LOCAL_DIR);
    expect(transport.filename).toEqual(CE_WINSTON_DEFAULT_VALUE.FILENAME);
    expect(transport.format).toBeDefined();
  });

  it('custom option', () => {
    const transport = createFileTransport('error', 'test', 'case', getFormatter());
    expect(transport.level).toEqual('error');
    expect(transport.dirname).toEqual('test');
    expect(transport.filename).toEqual('case');
    expect(transport.format).toBeDefined();
  });
});
