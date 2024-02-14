import type { IRequestCurlCreatorOption } from '#/http/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/modules/getRequestLoggerOption';
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
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<IRequestCurlCreatorOption>;
}
