import type winston from 'winston';

export function getLogMethod(
  level: keyof winston.config.SyslogConfigSetLevels,
  logger: winston.Logger,
) {
  switch (level) {
    case 'emerg':
      return logger.emerg;
    case 'alert':
      return logger.alert;
    case 'crit':
      return logger.crit;
    case 'error':
      return logger.error;
    case 'warning':
      return logger.warning;
    case 'notice':
      return logger.notice;
    case 'info':
      return logger.info;
    case 'debug':
      return logger.debug;
    default:
      return logger.debug;
  }
}
