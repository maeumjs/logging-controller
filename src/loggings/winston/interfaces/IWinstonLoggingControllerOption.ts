import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { TWinstonLoggersBootstrapOptions } from '#/loggings/winston/interfaces/IWinstonContainerOption';

export interface IWinstonLoggingControllerOption<TASYNC extends boolean = false> {
  winston?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersBootstrapOptions<TASYNC>;
  };
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<ICurlCreatorOption>;
}
