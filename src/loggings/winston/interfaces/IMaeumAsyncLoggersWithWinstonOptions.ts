import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { TWinstonLoggersAsyncBootstrapOptions } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapAsyncOptions';

export interface IMaeumAsyncLoggersWithWinstonOptions {
  winston?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersAsyncBootstrapOptions;
  };
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<ICurlCreatorOption>;
}
