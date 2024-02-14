import type { IFastMakerRoutePath } from '#/http/interfaces/IFastMakerRoutePath';
import type { IHTTPLogRecordAction } from '#/http/interfaces/IHTTPLogRecordAction';
import type { IHTTPLogRecordHandler } from '#/http/interfaces/IHTTPLogRecordHandler';
import type { IWintonLogger } from '#/winston/interfaces/IWintonLogger';
import type { PartialDeep } from 'type-fest';

export interface IRequestLoggerOption {
  /** log-id create function */
  getLogId: (route: Omit<IFastMakerRoutePath, 'filePath'>) => string;

  /** specifies the curl command logging or not logging */
  isCurl: boolean;

  /** specifies FastifyReply payload */
  isReplyPayloadLogging: boolean;

  /**
   * includes 항목에 정의된 라우팅 주소 중에 로그를 기록하지 않을 라우팅 주소를 설정합니다
   * specify which of the routing paths specified in the `includes` field will not be logged
   * */
  excludes: Map<string, boolean>;

  /**
   * Request를 기록할 라우팅 주소를 설정합니다
   * specify a routing path to log
   * */
  includes: Map<string, boolean>;

  /**
   * logger, winston or pino
   */
  logger: Readonly<IWintonLogger>;

  /**
   * URL 별로 어떤 로그를 남길지 설정합니다. 예를들면 FastifyRequest.querystring을
   * 로깅하지 않음, 오브젝트로 로깅, 문자열로 로깅, 압축해서 로깅 중에 하나를 적용할 수 있습니다.
   * 만약 로그 레코드 생성을 직접 하고 싶다면 handlers를 설정하면 됩니다.
   *
   * specifies which logs are logged per URL. For example about FastifyRequest.querystring,
   * you can apply one of the following: do not log, log it as an object,
   * log it as a string, or log it compressed. If you want to handle the creation of the
   * log records yourself, you can set up handlers.
   */
  contents: {
    default: PartialDeep<IHTTPLogRecordAction>;
    actions: Map<string, IHTTPLogRecordAction>;
    handlers: Map<string, IHTTPLogRecordHandler>;
  };

  /**
   * HTTP 로깅을 어떤 레벨로 기록할지 결정합니다. 기본 값은 info입니다.
   *
   * Determines what level of HTTP logging is recorded. The default value is info.
   * */
  level: string;

  /** specifies the stringify function, generate string */
  stringify: (data: unknown) => string | Promise<string>;

  /** specifies the objectify function, generate object */
  objectify: (data: unknown) => unknown;

  /** specifies the compress function, generate compressed base64 string */
  compress: (data: unknown) => string | Promise<string>;
}
