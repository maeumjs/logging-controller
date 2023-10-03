import safeStringify from '#/common/transforms/safeStringify';
import getWithoutMessageInfo from '#/winston/modules/getWithoutMessageInfo';

export default function getDefaultRedaction(transformableInfo: {
  [key: string | symbol]: unknown;
}): string {
  const info = getWithoutMessageInfo(transformableInfo);
  return safeStringify(info);
}
