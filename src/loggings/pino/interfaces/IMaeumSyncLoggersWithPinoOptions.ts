import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { TPinoLoggersBootstrapSyncOptions } from '#/loggings/pino/interfaces/TPinoLoggersBootstrapSyncOptions';

export interface IMaeumSyncLoggersWithPinoOptions {
  pino?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TPinoLoggersBootstrapSyncOptions;
  };
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<ICurlCreatorOption>;
}
