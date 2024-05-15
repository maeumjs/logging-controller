import type { IPinoMaeumLogger } from '#/loggings/pino/interfaces/IPinoMaeumLogger';

export interface IPinoLoggersOptions {
  getEnableDebugMessage: () => boolean;
  defaultAppName?: string;
  loggers: Map<string, IPinoMaeumLogger>;
}
