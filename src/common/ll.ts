import getDebugChannel from '#/common/modules/getDebugChannel';
import noop from '#/common/modules/noop';
import debug from 'debug';
import { basenames } from 'my-node-fp';

/**
 * @param channel name of debugging channel
 */
export default function ll(env: unknown, filename: string, develop?: boolean): debug.IDebugger {
  const debugChannel = getDebugChannel(env);

  if (develop) {
    const nulllog = noop as debug.IDebugger;
    return nulllog;
  }

  return debug(`${debugChannel}:${basenames(filename, ['.ts', '.tsx', '.mts', '.cts'])}`);
}
