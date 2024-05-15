import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { TWinstonLoggersSyncBootstrapOptions } from '#/loggings/winston/interfaces/TWinstonLoggersBootstrapSyncOptions';

export interface IMaeumSyncLoggersWithWinstonOptions {
  winston?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TWinstonLoggersSyncBootstrapOptions;
  };
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<ICurlCreatorOption>;
}
