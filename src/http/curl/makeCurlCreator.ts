import { CURL_CREATOR_SYMBOL_KEY } from '#/common/symbols/CURL_CREATOR_SYMBOL_KEY';
import { CurlCreator } from '#/http/curl/CurlCreator';
import { getCurlCreatorOption } from '#/http/curl/modules/getCurlCreatorOption';
import { asValue, type AwilixContainer } from 'awilix';

export function makeCurlCreator(
  container: AwilixContainer,
  nullableOption?: Parameters<typeof getCurlCreatorOption>[0],
) {
  const option = getCurlCreatorOption(nullableOption);
  const curlCreator = new CurlCreator(option, container);

  container.register(CURL_CREATOR_SYMBOL_KEY, asValue(curlCreator));

  return option;
}
