import { getOnlyMessageRedaction } from '#/loggings/winston/modules/getOnlyMessageRedaction';
import { getSafeFormatter } from '#/loggings/winston/modules/getSafeFormatter';
import winston from 'winston';

export function getOnlyMessageFormatter() {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => getSafeFormatter(info, getOnlyMessageRedaction)),
  );
}
