/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ILogFormat } from '#/common/interfaces/ILogFormat';

export interface IMaeumLoggers {
  error: (content: Partial<ILogFormat & { err: Error }>) => void;
  info: (content: Partial<ILogFormat & { err: Error }>) => void;
  $: (...args: any[]) => void;
}
