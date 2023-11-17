import { getBootstrapedLogger } from '#/common/modules/getBootstrapedLogger';
import type { IRequestCurlCreatorOption } from '#/http/interfaces/IRequestCurlCreatorOption';

export function getRequestCurlCreatorOption(
  option?: Partial<IRequestCurlCreatorOption>,
): IRequestCurlCreatorOption {
  const logger = getBootstrapedLogger('request-curl-logger', option);

  const next: IRequestCurlCreatorOption = {
    curl: option?.curl ?? { prettify: false },
    excludes: option?.excludes ?? new Map<string, string>(),
    logger,
  };

  return next;
}
