import getDefaultColorRedaction from '#/winston/modules/getDefaultColorRedaction';
import getDefaultRedaction from '#/winston/modules/getDefaultRedaction';
import getSafeFormatter from '#/winston/modules/getSafeFormatter';
import winston from 'winston';

export default function getFormatter(useColor: boolean = false) {
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
