import type { TSyslogConfigLevels } from '#/loggings/winston/interfaces/TSyslogConfigLevels';
import chalk from 'chalk';

export const colors: Record<TSyslogConfigLevels, chalk.ChalkFunction> = {
  emerg: chalk.red,
  alert: chalk.red,
  crit: chalk.red,
  error: chalk.red,
  warning: chalk.yellow,
  notice: chalk.yellow,
  info: chalk.blue,
  debug: chalk.gray,
};
