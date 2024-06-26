import { getDebugChannel } from '#/common/modules/getDebugChannel';
import { noop } from '@maeum/tools';
import debug from 'debug';
import { basenames } from 'my-node-fp';

/**
 * @param channel name of debugging channel
 */
export function ll(env: unknown, filename: string, develop?: boolean): debug.IDebugger {
  const namespace = getDebugChannel(env);

  if (!develop) {
    const nulllog = noop as debug.IDebugger;
    return nulllog;
  }

  const channel = `${namespace}:${basenames(filename, ['.ts', '.tsx', '.mts', '.cts'])}`;

  return debug(channel);
}
