import { getDefaultRedaction } from '#/loggings/winston/modules/getDefaultRedaction';
import { getSafeFormatter } from '#/loggings/winston/modules/getSafeFormatter';
import winston from 'winston';

export function getOnlyMessageFormatter() {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => getSafeFormatter(info, getDefaultRedaction)),
  );
}
