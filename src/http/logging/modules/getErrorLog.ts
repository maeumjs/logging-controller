import { getValidationErrorSummary } from '@maeum/tools';
import type { ErrorObject } from 'ajv';

export function getErrorLog(
  err: Error & { validation?: ErrorObject[]; option?: { logging?: unknown } },
) {
  const validation = err.validation != null ? getValidationErrorSummary(err.validation) : undefined;
  const logging = err?.option?.logging;
  return { validation, logging };
}
