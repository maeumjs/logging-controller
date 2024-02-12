import { CE_HTTP_METHOD } from '#/common/const-enum/CE_HTTP_METHOD';

export function getHttpMethod(method?: unknown): string {
  if (method == null || typeof method !== 'string') {
    return 'UNKNOWN';
  }

  const upperCased = method.toUpperCase();

  switch (upperCased) {
    case CE_HTTP_METHOD.DELETE:
    case CE_HTTP_METHOD.GET:
    case CE_HTTP_METHOD.HEAD:
    case CE_HTTP_METHOD.PATCH:
    case CE_HTTP_METHOD.POST:
    case CE_HTTP_METHOD.PUT:
    case CE_HTTP_METHOD.OPTIONS:
    case CE_HTTP_METHOD.SEARCH:
    case CE_HTTP_METHOD.TRACE:
    case CE_HTTP_METHOD.PROPFIND:
    case CE_HTTP_METHOD.PROPPATCH:
    case CE_HTTP_METHOD.MKCOL:
    case CE_HTTP_METHOD.COPY:
    case CE_HTTP_METHOD.MOVE:
    case CE_HTTP_METHOD.LOCK:
    case CE_HTTP_METHOD.UNLOCK:
      return upperCased;
    default:
      return 'UNKNOWN';
  }
}
