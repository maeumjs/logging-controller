import type winston from 'winston';

export type TSyslogConfigLevels = keyof Pick<
  winston.config.SyslogConfigSetLevels,
  'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
>;
