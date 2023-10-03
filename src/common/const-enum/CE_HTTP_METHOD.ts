export const CE_HTTP_METHOD = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH',
} as const;

export type CE_HTTP_METHOD = (typeof CE_HTTP_METHOD)[keyof typeof CE_HTTP_METHOD];
