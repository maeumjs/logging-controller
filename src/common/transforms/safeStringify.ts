export function safeStringify(data: unknown) {
  try {
    return JSON.stringify(data);
  } catch {
    return '{}';
  }
}
