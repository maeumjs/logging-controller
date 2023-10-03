export const CE_DEFAULT_VALUE = {
  APPLICATION_NAME: 'app',
} as const;

export type CE_DEFAULT_VALUE = (typeof CE_DEFAULT_VALUE)[keyof typeof CE_DEFAULT_VALUE];
