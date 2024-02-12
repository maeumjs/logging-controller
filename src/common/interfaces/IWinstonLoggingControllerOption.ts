import type { IRequestCurlCreatorOption } from '#/http/interfaces/IRequestCurlCreatorOption';
import type { IRequestLoggerOption } from '#/http/interfaces/IRequestLoggerOption';
import type { TWinstonContainerBootstrapOptions } from '#/winston/interfaces/IWinstonContainerOption';

export interface IWinstonLoggingControllerOption<TASYNC extends boolean = false> {
  winston?: TASYNC extends true
    ? {
        getEnableDebugMessage?: () => boolean;
        defaultAppName?: string;
        loggers?: TWinstonContainerBootstrapOptions<true>;
      }
    : {
        getEnableDebugMessage?: () => boolean;
        defaultAppName?: string;
        loggers?: TWinstonContainerBootstrapOptions<false>;
      };
  request?: Partial<IRequestLoggerOption>;
  curl?: Partial<IRequestCurlCreatorOption>;
}
