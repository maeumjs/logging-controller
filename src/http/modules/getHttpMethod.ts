import { CE_HTTP_METHOD } from '#/common/const-enum/CE_HTTP_METHOD';

export function getHttpMethod(method?: unknown): string {
  if (method == null || typeof method !== 'string') {
    return 'UNKNOWN';
  }

  const upperCased = method.toUpperCase();

  switch (upperCased) {
    case CE_HTTP_METHOD.GET:
    case CE_HTTP_METHOD.HEAD:
    case CE_HTTP_METHOD.POST:
    case CE_HTTP_METHOD.PUT:
    case CE_HTTP_METHOD.DELETE:
    case CE_HTTP_METHOD.CONNECT:
    case CE_HTTP_METHOD.OPTIONS:
    case CE_HTTP_METHOD.TRACE:
    case CE_HTTP_METHOD.PATCH:
      return upperCased;
    default:
      return 'UNKNOWN';
  }
}
