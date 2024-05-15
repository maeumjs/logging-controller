import { CE_WINSTON_DEFAULT_VALUE } from '#/loggings/winston/const-enum/CE_WINSTON_DEFAULT_VALUE';
import type { TSyslogConfigLevels } from '#/loggings/winston/interfaces/TSyslogConfigLevels';

export function getWinstonLevel(
  level?: unknown,
  defaultLevel?: TSyslogConfigLevels,
): TSyslogConfigLevels {
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
      return defaultLevel ?? CE_WINSTON_DEFAULT_VALUE.LEVEL;
  }
}
