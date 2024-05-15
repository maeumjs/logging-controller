import type { TPinoAsyncGetOptions } from '#/loggings/pino/interfaces/TPinoAsyncGetOptions';
import type { TPinoSyncGetOptions } from '#/loggings/pino/interfaces/TPinoSyncGetOptions';
import type pino from 'pino';

export type TPinoLoggersBootstrapAsyncOption = {
  defaultOptions?: Partial<pino.LoggerOptions>;
  getOptions?: TPinoAsyncGetOptions | TPinoSyncGetOptions;
};

export type TPinoLoggersBootstrapAsyncOptions = Map<
  /**
   * If you use multiple log transports, you can add up transports other than the default `app` transport.
   * For example, you can use the `app` transport for application logs and add a `biz` transport for business logs.
   */
  string,
  /**
   * pino transport 객체에 개인화 설정을 전달할 때 사용한다. formatter를 직접 설정하거나, 파일명, 저장 경로등
   * transport 설정을 질접 전달해야 할 때 사용한다.
   *
   * Use to pass customization settings to a pino transport object. Use this when you need to
   * set the formatter directly or pass in transport settings such as filename, save path, etc.
   */
  TPinoLoggersBootstrapAsyncOption
>;
