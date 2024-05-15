import { container } from '#/common/__tests__/container';
import { CE_LOGGING_ACTION_CODE } from '#/http/logging/const-enum/CE_LOGGING_ACTION_CODE';
import { IHTTPLogRecordAction } from '#/http/logging/interfaces/IHTTPLogRecordAction';
import { IHTTPLogRecordHandler } from '#/http/logging/interfaces/IHTTPLogRecordHandler';
import { IRequestLoggerOption } from '#/http/logging/interfaces/IRequestLoggerOption';
import { IRoutePath } from '#/http/logging/interfaces/IRoutePath';
import { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import { makeAsyncWinstonLoggers } from '#/loggings/winston/makeAsyncWinstonLoggers';
import { beforeAll, describe, expect, it } from 'vitest';

describe('getRequestLoggerOption', () => {
  beforeAll(async () => {
    await makeAsyncWinstonLoggers(container);
  });

  it('pass - nullable', () => {
    const option = getRequestLoggerOption();
    expect(option).toBeTruthy();
  });

  it('pass - non-nullable', () => {
    const option: IRequestLoggerOption = {
      getLogId: (route: IRoutePath) => `request-log-${route.method}`,
      isCurl: false,
      isReplyPayloadLogging: true,
      excludes: new Map<string, boolean>([['/health', false]]),
      includes: new Map<string, boolean>([
        ['/health', true],
        ['/error', true],
      ]),
      contents: {
        default: {
          request: {
            querystring: CE_LOGGING_ACTION_CODE.STRINGIFY,
            params: CE_LOGGING_ACTION_CODE.STRINGIFY,
            headers: CE_LOGGING_ACTION_CODE.STRINGIFY,
            body: CE_LOGGING_ACTION_CODE.STRINGIFY,
          },
          reply: {
            headers: CE_LOGGING_ACTION_CODE.STRINGIFY,
            payload: CE_LOGGING_ACTION_CODE.STRINGIFY,
          },
          other: CE_LOGGING_ACTION_CODE.STRINGIFY,
        },
        actions: new Map<string, IHTTPLogRecordAction>(),
        handlers: new Map<string, IHTTPLogRecordHandler>(),
      },
      level: 'warn',
      stringify: (data: unknown) => JSON.stringify(data),
      compress: (data: unknown) => JSON.stringify(data),
      objectify: (data: unknown) => data,
    };

    const r01 = getRequestLoggerOption(option);
    expect(r01).toMatchObject(option);
  });
});
