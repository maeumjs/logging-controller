export const CE_LOGGING_ACTION_CODE = {
  /** not logging */
  NOT_LOGGING: 'not-logging',

  /** logs as an object, omitting anything that cannot be converted to a string */
  OBJECTIFY: 'objectify',

  /** logs as an string, omitting anything that cannot be converted to a string */
  STRINGIFY: 'stringify',

  /** compress it with as sanppy algorithm and change it to a base64 string for logging */
  COMPRESS: 'compress',
} as const;

export type CE_LOGGING_ACTION_CODE =
  (typeof CE_LOGGING_ACTION_CODE)[keyof typeof CE_LOGGING_ACTION_CODE];
