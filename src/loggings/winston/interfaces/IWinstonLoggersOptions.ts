import type { IWinstonMaeumLogger } from '#/loggings/winston/interfaces/IWinstonMaeumLogger';

export interface IWinstonLoggersOptions {
  getEnableDebugMessage: () => boolean;
  defaultAppName?: string;
  loggers: Map<string, IWinstonMaeumLogger>;
}
