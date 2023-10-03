import type ILogFormat from '#/common/interfaces/ILogFormat';

export default interface IWintonLogger {
  $kind: 'winston';
  emerg: (content: Partial<ILogFormat & { err: Error }>) => void;
  alert: (content: Partial<ILogFormat & { err: Error }>) => void;
  crit: (content: Partial<ILogFormat & { err: Error }>) => void;
  error: (content: Partial<ILogFormat & { err: Error }>) => void;
  warning: (content: Partial<ILogFormat & { err: Error }>) => void;
  notice: (content: Partial<ILogFormat & { err: Error }>) => void;
  info: (content: Partial<ILogFormat & { err: Error }>) => void;
  debug: (content: Partial<ILogFormat & { err: Error }>) => void;
  $: (...args: any[]) => void;
}
