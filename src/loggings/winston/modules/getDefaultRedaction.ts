import { safeStringify } from '#/common/transforms/safeStringify';
import { getWithoutMessageInfo } from '#/loggings/winston/modules/getWithoutMessageInfo';

export function getDefaultRedaction(transformableInfo: {
  [key: string | symbol]: unknown;
}): string {
  const info = getWithoutMessageInfo(transformableInfo);
  return safeStringify(info);
}
