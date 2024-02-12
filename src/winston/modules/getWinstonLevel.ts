import { CE_WINSTON_DEFAULT_VALUE } from '#/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type winston from 'winston';

export function getWinstonLevel(level?: unknown): keyof winston.config.SyslogConfigSetLevels {
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
      return CE_WINSTON_DEFAULT_VALUE.LEVEL;
  }
}
