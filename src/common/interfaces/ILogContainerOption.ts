export type TFilePathKind = 'var' | 'local';

export default interface ILogContainerOption {
  /**
   * 개발 모드를 설정합니다. 개발 모드인 경우 log 파일 디렉터리가 없을 경우 자동생성하는 등의 개발
   * 편의 기능을 제공합니다
   *
   * specifies the development mode. When in development mode, logging-controller provide development conveniences,
   * such as auto-creating the log file directory if it doesn't exist.
   * */
  develop: () => boolean;

  /**
   * specifies the log level.
   *
   * - if you are using winston, use [syslog](https://en.wikipedia.org/wiki/Syslog) level
   * - if you are using pino, use [pion](https://getpino.io/#/docs/api?id=level-string) level
   */
  logLevel: string;

  /**
   * 여러 개의 로그 transport를 사용하는 경우, 기본 app transport 외 다른 transport를 설정할 수 있다.
   * 예를들면, app transport는 어플리케이션 로그로 사용하고, biz transport를 추가하여 비즈니스 로그를 위해
   * 사용할 수 있다.
   *
   * If you use multiple log transports, you can add up transports other than the default `app` transport.
   * For example, you can use the `app` transport for application logs and add a `biz` transport for business logs.
   */
  applications: {
    name: string;
    path: Record<TFilePathKind, string> & { on: TFilePathKind };
    filename: Record<TFilePathKind, string> & { on: TFilePathKind };
  }[];
}
