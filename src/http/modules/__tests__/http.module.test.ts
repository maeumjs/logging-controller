import { CE_LOGGING_ACTION_CODE } from '#/http/const-enum/CE_LOGGING_ACTION_CODE';
import { IHTTPLogRecordAction } from '#/http/interfaces/IHTTPLogRecordAction';
import { IHTTPLogRecordHandler } from '#/http/interfaces/IHTTPLogRecordHandler';
import { IRequestLoggerOption } from '#/http/interfaces/IRequestLoggerOption';
import { IRoutePath } from '#/http/interfaces/IRoutePath';
import { getRequestLoggerOption } from '#/http/modules/getRequestLoggerOption';
import { WinstonContainer } from '#/winston/WinstonContainer';
import { beforeAll, describe, expect, it } from 'vitest';

describe('getRequestLoggerOption', () => {
  beforeAll(() => {
    WinstonContainer.bootstrap(false, () => false, undefined, {});
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
      logger: WinstonContainer.l('request-logger'),
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
