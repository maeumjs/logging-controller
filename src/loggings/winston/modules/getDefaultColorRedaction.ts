import { safeStringify } from '#/common/transforms/safeStringify';
import { colors } from '#/loggings/winston/modules/colors';
import { getSafeTimestamp } from '#/loggings/winston/modules/getSafeTimestamp';
import { getWithoutMessageInfo } from '#/loggings/winston/modules/getWithoutMessageInfo';
import { getWinstonLevel } from '#/loggings/winston/options/getWinstonLevel';

export function getDefaultColorRedaction(transformableInfo: { [key: string | symbol]: unknown }) {
  const withoutMessage = getWithoutMessageInfo(transformableInfo);
  const { _f: filename, level: rawLevel, timestamp: isoTimestamp, ...other } = withoutMessage;
  const timestamp = getSafeTimestamp(isoTimestamp);
  const level = getWinstonLevel(rawLevel, 'debug');
  const colorizer = colors[level];

  if (filename == null) {
    const prefix = `${colorizer(
      `[${[timestamp, level, other.id].filter((element) => element != null).join(' ')}`,
    )}]:`;

    return `${prefix} ${safeStringify(other)}`;
  }

  const prefix = [
    `${colorizer(
      `[${[timestamp, level, other.id].filter((element) => element != null).join(' ')}`,
    )}`,
    ` ${colorizer(filename)}`,
    `${colorizer(']:')}`,
  ].join('');

  return `${prefix} ${safeStringify(other)}`;
}
