import type { ILogFormat } from '#/common/interfaces/ILogFormat';

export interface IPinoLogger {
  $kind: 'pino';
  fatal: (content: Partial<ILogFormat & { err: Error }>) => void;
  error: (content: Partial<ILogFormat & { err: Error }>) => void;
  warn: (content: Partial<ILogFormat & { err: Error }>) => void;
  info: (content: Partial<ILogFormat & { err: Error }>) => void;
  debug: (content: Partial<ILogFormat & { err: Error }>) => void;
  trace: (content: Partial<ILogFormat & { err: Error }>) => void;
  silent: (content: Partial<ILogFormat & { err: Error }>) => void;
  $: (...args: any[]) => void;
}
