export default function getWithoutMessageInfo(transformableInfo: {
  [key: string | symbol]: unknown;
}) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { message: _message, ...other } = transformableInfo;
  return other as Record<string, string>;
}
