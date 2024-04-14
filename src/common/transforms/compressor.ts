import { safeStringify } from '#/common/transforms/safeStringify';
import { escape } from '#/http/logging/modules/escape';
import { compress } from 'snappy';

export async function compressor(data: unknown): Promise<string> {
  try {
    if (typeof data !== 'string') {
      const stringified = safeStringify(data);
      const compressed = await compress(stringified);
      return compressed.toString('base64');
    }

    const compressed = await compress(data);
    return compressed.toString('base64');
  } catch {
    const compressed = await compress(
      `{ "error": "compressor fail", "payload": ${escape(safeStringify(data))} }`,
    );

    return compressed.toString('base64');
  }
}
