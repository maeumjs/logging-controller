import type { IFastMakerRoutePath } from '#/http/interfaces/IFastMakerRoutePath';
import type { IRequestCurlCreatorOption } from '#/http/interfaces/IRequestCurlCreatorOption';
import { getRequestCurlCreatorOption } from '#/http/modules/getRequestCurlCreatorOption';
import { safeStringify } from '@maeum/tools';
import type { FastifyRequest } from 'fastify';
import { createFromFastify3, encodeQuerystring } from 'jin-curlize';
import { isError } from 'my-easy-fp';

export class RequestCurlCreator {
  static #it: RequestCurlCreator;

  static #isBootstrap: boolean = false;

  static get it() {
    return RequestCurlCreator.#it;
  }

  static get isBootstrap() {
    return RequestCurlCreator.#isBootstrap;
  }

  public static querystringReplacer(qs: URLSearchParams): URLSearchParams {
    const next = new URLSearchParams(qs);
    next.set('tid', `'"$(uuidgen)"'`);
    return encodeQuerystring(next);
  }

  static bootstrap(nullableOption?: Parameters<typeof getRequestCurlCreatorOption>[0]) {
    const option = getRequestCurlCreatorOption(nullableOption);
    RequestCurlCreator.#it = new RequestCurlCreator(option);
    RequestCurlCreator.#isBootstrap = true;

    return option;
  }

  #option: IRequestCurlCreatorOption;

  constructor(option: IRequestCurlCreatorOption) {
    this.#option = option;
  }

  create(req: FastifyRequest, route?: Omit<IFastMakerRoutePath, 'filePath'>): string | undefined {
    try {
      if (route == null) {
        return undefined;
      }

      // exclude check
      if (
        route != null &&
        this.#option.excludes.get(route.routePath) === route.method.toLowerCase()
      ) {
        return undefined;
      }

      // recommand prettify option enable only local run-mode because newline character possible to broken log
      const command = safeStringify(createFromFastify3(req, this.#option.curl)); // escape for json object

      return command === '' ? undefined : command;
    } catch (caught) {
      const err = isError(caught, new Error(`unknown error raised from ${__filename}`));

      this.#option.logger.$(err.message);
      this.#option.logger.$(err.stack);

      return undefined;
    }
  }
}
