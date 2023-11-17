export function getDebugChannel(channel: unknown) {
  if (channel != null && typeof channel === 'string' && channel !== '') {
    return channel;
  }

  return 'maeum';
}
