export const CE_REQUEST_LOGGING_RESULT_CODE = {
  SUCCESS: 1,
  ALREADY_LOGGING: 10001,
  CANNOT_FOUND_ROUTE_CONFIG: 10002,
  REQUEST_URL_INCLUDED_IN_EXCLUDES: 10003,
  RAISE_EXCEPTION_LOGGING: 20001,
} as const;

export type CE_REQUEST_LOGGING_RESULT_CODE =
  (typeof CE_REQUEST_LOGGING_RESULT_CODE)[keyof typeof CE_REQUEST_LOGGING_RESULT_CODE];