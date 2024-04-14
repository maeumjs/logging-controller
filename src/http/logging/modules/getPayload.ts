import { CE_LOGGING_ACTION_CODE } from '#/http/logging/const-enum/CE_LOGGING_ACTION_CODE';
import type { IRequestLoggerOption } from '#/http/logging/interfaces/IRequestLoggerOption';
import { isPromise } from 'node:util/types';

export async function getPayload(
  data: unknown,
  action: CE_LOGGING_ACTION_CODE | undefined,
  handler: ((data: unknown) => string) | undefined,
  option: IRequestLoggerOption,
): Promise<unknown> {
  if (handler != null) {
    return handler(data);
  }

  switch (action) {
    case CE_LOGGING_ACTION_CODE.STRINGIFY:
      if (option.stringify != null && data != null) {
        const promise = option.stringify(data);
        const stringified = isPromise(promise) ? await promise : promise;
        return stringified;
      }

      return data;
    case CE_LOGGING_ACTION_CODE.COMPRESS:
      if (option.compress != null && data != null) {
        const promise = option.compress(data);
        const compressed = isPromise(promise) ? await promise : promise;
        return compressed;
      }

      return data;
    case CE_LOGGING_ACTION_CODE.OBJECTIFY:
      if (option.objectify != null && data != null) {
        const promise = option.objectify(data);
        const objectified = isPromise(promise) ? await promise : promise;
        return objectified;
      }

      return data;
    case CE_LOGGING_ACTION_CODE.NOT_LOGGING:
      return undefined;
    default:
      return data;
  }
}
