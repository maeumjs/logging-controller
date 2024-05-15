import { $YMBOL_KEY_CURL_CREATOR } from '#/common/symbols/SYMBOL_KEY_CURL_CREATOR';
import { CurlCreator } from '#/http/curl/CurlCreator';
import { getCurlCreatorOption } from '#/http/curl/modules/getCurlCreatorOption';
import type { IClassContainer } from '@maeum/tools';

export function makeCurlCreator(
  container: IClassContainer,
  nullableOption?: Parameters<typeof getCurlCreatorOption>[0],
) {
  const option = getCurlCreatorOption(nullableOption);
  const curlCreator = new CurlCreator(option, container);

  container.register($YMBOL_KEY_CURL_CREATOR, curlCreator);

  return option;
}
