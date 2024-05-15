import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import type { IMaeumLoggers } from '#/loggings/common/interfaces/IMaeumLogger';

export interface IPinoLoggers extends IMaeumLoggers {
  $kind: 'pino';
  trace: (content: Partial<ILogFormat & { err: Error }>) => void;
  debug: (content: Partial<ILogFormat & { err: Error }>) => void;
  warn: (content: Partial<ILogFormat & { err: Error }>) => void;
  fatal: (content: Partial<ILogFormat & { err: Error }>) => void;
}
