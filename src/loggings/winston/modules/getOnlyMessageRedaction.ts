import { safeStringify } from '#/common/transforms/safeStringify';
import { getWithoutMessageInfo } from '#/loggings/winston/modules/getWithoutMessageInfo';

export function getOnlyMessageRedaction(transformableInfo: {
  [key: string | symbol]: unknown;
}): string {
  const info = getWithoutMessageInfo(transformableInfo);
  return safeStringify(info);
}
