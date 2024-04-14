export function getOnlyMessageInfo(transformableInfo: { [key: string | symbol]: unknown }) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { message: _message, ...other } = transformableInfo;
  return { message: { ...other } };
}
