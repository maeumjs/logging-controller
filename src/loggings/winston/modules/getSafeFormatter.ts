export function getSafeFormatter(
  transformableInfo: { [key: string | symbol]: unknown },
  redactor: (transformableInfo: { [key: string | symbol]: unknown }) => string,
) {
  try {
    return redactor(transformableInfo);
  } catch {
    return '{}';
  }
}
