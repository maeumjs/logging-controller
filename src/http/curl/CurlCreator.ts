import { $YMBOL_KEY_MAEUM_LOGGERS } from '#/common/symbols/SYMBOL_KEY_MAEUM_LOGGERS';
import type { IFastMakerRoutePath } from '#/http/common/interfaces/IFastMakerRoutePath';
import type { ICurlCreatorOption } from '#/http/curl/interfaces/IRequestCurlCreatorOption';
import type { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import type { IMaeumLoggers } from '#/loggings/common/interfaces/IMaeumLogger';
import type { IClassContainer } from '@maeum/tools';
import { safeStringify } from '@maeum/tools';
import type { FastifyRequest } from 'fastify';
import { createFromFastify3 } from 'jin-curlize';
import { isError } from 'my-easy-fp';

export class CurlCreator {
  #option: ICurlCreatorOption;

  #logger: IMaeumLoggers;

  constructor(option: ICurlCreatorOption, container: IClassContainer) {
    this.#option = option;
    this.#logger = container.resolve<MaeumLoggers>($YMBOL_KEY_MAEUM_LOGGERS).l('curl-creator');
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

      this.#logger.$(err.message);
      this.#logger.$(err.stack);

      return undefined;
    }
  }
}
