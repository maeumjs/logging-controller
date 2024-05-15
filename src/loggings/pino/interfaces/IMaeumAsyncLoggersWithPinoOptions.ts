import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { getRequestLoggerOption } from '#/http/logging/modules/getRequestLoggerOption';
import type { TPinoLoggersBootstrapAsyncOptions } from '#/loggings/pino/interfaces/TPinoLoggersBootstrapAsyncOptions';

export interface IMaeumAsyncLoggersWithPinoOptions {
  pino?: {
    getEnableDebugMessage?: () => boolean;
    defaultAppName?: string;
    options?: TPinoLoggersBootstrapAsyncOptions;
  };
  request?: Parameters<typeof getRequestLoggerOption>[0];
  curl?: Partial<ICurlCreatorOption>;
}
