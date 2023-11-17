import { format, parseISO } from 'date-fns';

export function getSafeTimestamp(literal?: unknown): string {
  try {
    if (typeof literal !== 'string') {
      throw new Error('invalid timestamp string');
    }

    return format(parseISO(literal), 'HH:mm:ss.SSS');
  } catch {
    return format(new Date(), 'HH:mm:ss.SSS');
  }
}
