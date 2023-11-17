import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { escape } from '#/http/modules/escape';

export function getError(
  content?: Partial<ILogFormat & { err: Error }>,
): Pick<ILogFormat, 'errMsg' | 'errStk'> {
  if (content?.err == null && content?.errMsg == null && content?.errStk == null) {
    return { errMsg: undefined, errStk: undefined };
  }

  if (content?.err != null) {
    return {
      errMsg: content?.err.message,
      errStk: content?.err.stack != null ? escape(content.err.stack) : content.err.stack,
    };
  }

  return {
    errMsg: content?.errMsg,
    errStk: content?.errStk != null ? escape(content.errStk) : content.errStk,
  };
}
