import { safeStringify } from '#/common/transforms/safeStringify';
import { colors } from '#/loggings/winston/modules/colors';
import { getSafeTimestamp } from '#/loggings/winston/modules/getSafeTimestamp';
import { getWithoutMessageInfo } from '#/loggings/winston/modules/getWithoutMessageInfo';

export function getDefaultColorRedaction(transformableInfo: { [key: string | symbol]: unknown }) {
  const withoutMessage = getWithoutMessageInfo(transformableInfo);
  const { _f: filename, level, timestamp: isoTimestamp, ...other } = withoutMessage;
  const timestamp = getSafeTimestamp(isoTimestamp);
  const colorizer = colors[level ?? 'debug'] ?? colors.debug;

  if (filename == null) {
    const prefix =
      colorizer?.(`[${timestamp} ${level}${other.id == null ? '' : ` ${other.id}`}]:`) ?? '';

    return `${prefix} ${safeStringify(other)}`;
  }

  const prefix = `${colorizer?.(
    `[${timestamp} ${level}${other.id == null ? '' : ` ${other.id}`}`,
  )}${colors.info?.(filename) ?? ''}${colorizer?.(']:') ?? ''}`;

  return `${prefix} ${safeStringify(other)}`;
}
