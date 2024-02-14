import { getBootstrapedLogger } from '#/common/modules/getBootstrapedLogger';
import { compressor } from '#/common/transforms/compressor';
import { objectify as objectifor } from '#/common/transforms/objectify';
import { safeStringify } from '#/common/transforms/safeStringify';
import { CE_LOGGING_ACTION_CODE } from '#/http/const-enum/CE_LOGGING_ACTION_CODE';
import type { IFastMakerRoutePath } from '#/http/interfaces/IFastMakerRoutePath';
import type { IHTTPLogRecordAction } from '#/http/interfaces/IHTTPLogRecordAction';
import type { IHTTPLogRecordHandler } from '#/http/interfaces/IHTTPLogRecordHandler';
import type { IRequestLoggerOption } from '#/http/interfaces/IRequestLoggerOption';
import type { PartialDeep } from 'type-fest';

export function getRequestLoggerOption(
  option?: PartialDeep<Omit<IRequestLoggerOption, 'logger' | 'contents'>> & {
    logger?: IRequestLoggerOption['logger'];
    contents?: IRequestLoggerOption['contents'];
  },
): IRequestLoggerOption {
  const getLogId =
    option?.getLogId != null
      ? option?.getLogId
      : (route: Omit<IFastMakerRoutePath, 'filePath'>) => `http-request-${route.method}`;

  const logger = getBootstrapedLogger('request-logger', option);
  const isCurl = option?.isCurl ?? true;
  const isReplyPayloadLogging = option?.isReplyPayloadLogging ?? false;
  const excludes = option?.excludes ?? new Map<string, boolean>();
  const includes = option?.includes ?? new Map<string, boolean>();
  const contentsDefault: IHTTPLogRecordAction = {
    request: {
      querystring:
        option?.contents?.default?.request?.querystring ?? CE_LOGGING_ACTION_CODE.OBJECTIFY,
      headers: option?.contents?.default?.request?.headers ?? CE_LOGGING_ACTION_CODE.OBJECTIFY,
      params: option?.contents?.default?.request?.params ?? CE_LOGGING_ACTION_CODE.OBJECTIFY,
      body: option?.contents?.default?.request?.body ?? CE_LOGGING_ACTION_CODE.OBJECTIFY,
    },
    reply: {
      headers: option?.contents?.default?.reply?.headers ?? CE_LOGGING_ACTION_CODE.NOT_LOGGING,
      payload: option?.contents?.default?.reply?.payload ?? CE_LOGGING_ACTION_CODE.NOT_LOGGING,
    },
    other: option?.contents?.default?.other ?? CE_LOGGING_ACTION_CODE.OBJECTIFY,
  };
  const level = option?.level ?? 'info';
  const stringify = option?.stringify ?? ((data: unknown) => safeStringify(data));
  const compress = option?.compress ?? ((data: unknown) => compressor(data));
  const objectify = option?.objectify ?? ((data: unknown) => objectifor(data));

  return {
    ...option,
    getLogId,
    isCurl,
    isReplyPayloadLogging,
    excludes,
    includes,
    logger,
    contents: {
      default: contentsDefault,
      actions: new Map<string, IHTTPLogRecordAction>(),
      handlers: new Map<string, IHTTPLogRecordHandler>(),
    },
    level,
    stringify,
    compress,
    objectify,
  };
}
