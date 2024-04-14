import type winston from 'winston';

export type TSyncGetOptions = (
  options?: Partial<winston.LoggerOptions>,
) => Partial<winston.LoggerOptions>;

export type TAsyncGetOptions = (
  options?: Partial<winston.LoggerOptions>,
) => Promise<Partial<winston.LoggerOptions>>;

export type TWinstonLoggersBootstrapOptions<TASYNC extends boolean> = Map<
  /**
   * If you use multiple log transports, you can add up transports other than the default `app` transport.
   * For example, you can use the `app` transport for application logs and add a `biz` transport for business logs.
   */
  string,
  /**
   * winston transport 객체에 개인화 설정을 전달할 때 사용한다. formatter를 직접 설정하거나, 파일명, 저장 경로등
   * transport 설정을 질접 전달해야 할 때 사용한다.
   *
   * Use to pass customization settings to a winston transport object. Use this when you need to
   * set the formatter directly or pass in transport settings such as filename, save path, etc.
   */
  {
    defaultOptions?: Partial<winston.LoggerOptions>;
    getOptions?: TASYNC extends boolean ? TAsyncGetOptions | TSyncGetOptions : TSyncGetOptions;
  }
>;

export interface IWinstonMaeumLogger {
  /** name of the application for logger */
  name: string;

  /** winston logger */
  logger: winston.Logger;

  /** winston logger option */
  options: winston.LoggerOptions;
}

export interface IWinstonLoggersOptions {
  getEnableDebugMessage: () => boolean;
  defaultAppName?: string;
  loggers: Map<string, IWinstonMaeumLogger>;
}
