import type { ILogContainerOption, TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import type { LastArrayElement, Merge } from 'type-fest';
import type { LoggerOptions } from 'winston';

export interface IWinstonContainerOption extends Omit<ILogContainerOption, 'applications'> {
  /**
   * If you use multiple log transports, you can add up transports other than the default `app` transport.
   * For example, you can use the `app` transport for application logs and add a `biz` transport for business logs.
   */
  applications: Merge<
    LastArrayElement<ILogContainerOption['applications']>,
    {
      /**
       * winston transport 객체에 개인화 설정을 전달할 때 사용한다. formatter를 직접 설정하거나, 파일명, 저장 경로등
       * transport 설정을 질접 전달해야 할 때 사용한다.
       *
       * Use to pass customization settings to a winston transport object. Use this when you need to
       * set the formatter directly or pass in transport settings such as filename, save path, etc.
       */
      getOption?: (
        option: IWinstonContainerOption,
        logFilePath: { path: string; filename: string; on: TFilePathKind },
        application: LastArrayElement<ILogContainerOption['applications']>,
      ) => LoggerOptions;
    }
  >[];
}
