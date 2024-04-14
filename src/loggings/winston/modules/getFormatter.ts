import { getDefaultColorRedaction } from '#/loggings/winston/modules/getDefaultColorRedaction';
import { getDefaultRedaction } from '#/loggings/winston/modules/getDefaultRedaction';
import { getSafeFormatter } from '#/loggings/winston/modules/getSafeFormatter';
import winston from 'winston';

export function getFormatter(useColor: boolean = false) {
  if (useColor) {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => getSafeFormatter(info, getDefaultColorRedaction)),
    );
  }

  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => getSafeFormatter(info, getDefaultRedaction)),
  );
}
