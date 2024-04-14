import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import type { IMaeumLoggers } from '#/loggings/common/interfaces/IMaeumLogger';

export interface IWintonLoggers extends IMaeumLoggers {
  $kind: 'winston';
  emerg: (content: Partial<ILogFormat & { err: Error }>) => void;
  alert: (content: Partial<ILogFormat & { err: Error }>) => void;
  crit: (content: Partial<ILogFormat & { err: Error }>) => void;
  warning: (content: Partial<ILogFormat & { err: Error }>) => void;
  notice: (content: Partial<ILogFormat & { err: Error }>) => void;
  debug: (content: Partial<ILogFormat & { err: Error }>) => void;
}
