import type winston from 'winston';

export default function getWinstonLevel(
  level?: string,
): keyof winston.config.SyslogConfigSetLevels {
  switch (level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'error':
    case 'warning':
    case 'notice':
    case 'info':
    case 'debug':
      return level;
    default:
      return 'info';
  }
}
