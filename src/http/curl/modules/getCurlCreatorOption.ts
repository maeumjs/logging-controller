import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';

export function getCurlCreatorOption(option?: Partial<ICurlCreatorOption>): ICurlCreatorOption {
  const next: ICurlCreatorOption = {
    curl: option?.curl ?? { prettify: false },
    excludes: option?.excludes ?? new Map<string, string>(),
  };

  return next;
}
