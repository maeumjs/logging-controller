export default function getDebugChannel(channel: unknown) {
  if (typeof channel === 'string' && channel != null && channel !== '') {
    return channel;
  }

  return 'maeum';
}
