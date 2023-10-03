import chalk from 'chalk';
import type winston from 'winston';

const colors: Record<keyof winston.config.SyslogConfigSetLevels, chalk.ChalkFunction> = {
  emerg: chalk.red,
  alert: chalk.red,
  crit: chalk.red,
  error: chalk.red,
  warning: chalk.yellow,
  notice: chalk.yellow,
  info: chalk.blue,
  debug: chalk.gray,
};

export default colors;
