import type { ILogContainerOption, TFilePathKind } from '#/common/interfaces/ILogContainerOption';
import type pino from 'pino';
import type { Level } from 'pino';
import type { LastArrayElement, Merge } from 'type-fest';

export interface IPinoContainerOption<
  TransportType = Record<string, unknown>,
  MultiStreamType = Level,
> extends Omit<ILogContainerOption, 'applications'> {
  applications: Merge<
    LastArrayElement<ILogContainerOption['applications']>,
    {
      /**
       * pino stream 객체에 개인화 설정을 전달할 때 사용한다. formatter를 직접 설정하거나, 파일명, 저장 경로등
       * transport 설정을 질접 전달해야 할 때 사용한다.
       *
       * Use to pass customization settings to a pino stream object. Use this when you need to
       * set the redaction settings directly or pass in stream settings such as filename, save path, etc.
       */
      getStream?: (
        option: IPinoContainerOption,
        logFilePath: { path: string; filename: string; on: TFilePathKind },
        application: LastArrayElement<ILogContainerOption['applications']>,
      ) =>
        | ReturnType<typeof pino.destination>
        | ReturnType<typeof pino.multistream<MultiStreamType>>
        | ReturnType<typeof pino.transport<TransportType>>;
    }
  >[];
}
