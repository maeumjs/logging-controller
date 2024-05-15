import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { getError } from '#/common/modules/getError';
import { CURL_CREATOR_SYMBOL_KEY } from '#/common/symbols/CURL_CREATOR_SYMBOL_KEY';
import { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import { getHttpMethod } from '#/http/common/modules/getHttpMethod';
import { getRoutePathKey } from '#/http/common/modules/getRoutePathKey';
import type { CurlCreator } from '#/http/curl/CurlCreator';
import { CE_REQUEST_LOGGING_RESULT_CODE } from '#/http/logging/const-enum/CE_REQUEST_LOGGING_RESULT_CODE';
import type { IRequestLoggerOption } from '#/http/logging/interfaces/IRequestLoggerOption';
import { getErrorLog } from '#/http/logging/modules/getErrorLog';
import { getPayload } from '#/http/logging/modules/getPayload';
import { requestFlagsPlugin } from '#/http/plugin/requestFlagsPlugin';
import type { MaeumLoggers } from '#/loggings/common/MaeumLoggers';
import type { IMaeumLoggers } from '#/loggings/common/interfaces/IMaeumLogger';
import type { IClassContainer } from '@maeum/tools';
import formatISO from 'date-fns/formatISO';
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { isError } from 'my-easy-fp';

export class RequestLogger {
  #option: IRequestLoggerOption;

  #container: IClassContainer;

  #logger: IMaeumLoggers;

  constructor(option: IRequestLoggerOption, container: IClassContainer) {
    this.#option = option;
    this.#container = container;
    this.#logger = container.resolve<MaeumLoggers>(MAEUM_LOGGERS_SYMBOL_KEY).l('request-logger');
  }

  async logging(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (req.getRequestLogging()) {
        this.#logger.$('Already logging http logging');
        return CE_REQUEST_LOGGING_RESULT_CODE.ALREADY_LOGGING;
      }

      req.setRequestLogging();

      const route = { routePath: req.routeOptions.url ?? 'route-path-404', method: req.method };

      // exclude check
      if (this.#option.excludes.get(getRoutePathKey(route))) {
        return CE_REQUEST_LOGGING_RESULT_CODE.REQUEST_URL_INCLUDED_IN_EXCLUDES;
      }

      // include check
      if (!this.#option.includes.get(getRoutePathKey(route))) {
        return CE_REQUEST_LOGGING_RESULT_CODE.REQUEST_URL_NOT_INCLUDED_IN_INCLUDES;
      }

      const err = req.getRequestError();
      const curlCreator = this.#container.resolve<CurlCreator>(CURL_CREATOR_SYMBOL_KEY);

      const action =
        this.#option.contents.actions.get(getRoutePathKey(route)) ?? this.#option.contents.default;

      const handler = this.#option.contents.handlers.get(getRoutePathKey(route));
      const { validation, logging } =
        err != null ? getErrorLog(err) : { validation: undefined, logging: undefined };

      const content: ILogFormat = {
        id: this.#option.getLogId(route),
        status: reply.statusCode,
        timestamp: formatISO(new Date()),
        duration: reply.elapsedTime,
        tid: req.id,
        ...(err != null ? getError({ err }) : {}),
        body: {
          method: getHttpMethod(req.raw.method),
          url: req.raw.url ?? '/http/logging/unknown',
          routerPath: req.routeOptions.url,
          curl: this.#option.isCurl ? curlCreator.create(req, route) : undefined,
          request: {
            queries: await getPayload(
              req.query,
              action.request?.querystring,
              handler?.request.querystring,
              this.#option,
            ),
            headers: await getPayload(
              req.headers,
              action.request?.headers,
              handler?.request.headers as (data: unknown) => string,
              this.#option,
            ),
            params: await getPayload(
              req.params,
              action.request?.params,
              handler?.request.params as (data: unknown) => string,
              this.#option,
            ),
            body: await getPayload(
              req.body,
              action.request?.body,
              handler?.request.body as (data: unknown) => string,
              this.#option,
            ),
          },
          reply: {
            headers: await getPayload(
              reply.getHeaders(),
              action.reply?.headers,
              handler?.reply.headers as (data: unknown) => string,
              this.#option,
            ),
            payload: await getPayload(
              reply.getReplyPayload(),
              action.reply?.payload,
              handler?.reply.payload as (data: unknown) => string,
              this.#option,
            ),
          },
        },
      };

      if (logging != null || validation != null) {
        (content.body as Record<string, unknown>).additional = await getPayload(
          { logging, validation },
          action.other,
          handler?.other,
          this.#option,
        );
      }

      if (reply.statusCode >= 400) {
        this.#logger.$(content);
      }

      const logger = this.#logger[this.#option.level] as
        | ((content: Partial<ILogFormat & { err: Error }>) => void)
        | undefined;

      if (logger == null) {
        this.#logger.info(content);
      } else {
        logger(content);
      }

      return CE_REQUEST_LOGGING_RESULT_CODE.SUCCESS;
    } catch {
      return CE_REQUEST_LOGGING_RESULT_CODE.RAISE_EXCEPTION_LOGGING;
    }
  }

  plugin = fastifyPlugin(
    function loggingHandle(
      fastify: FastifyInstance<
        RawServerDefault,
        RawRequestDefaultExpression<RawServerDefault>,
        RawReplyDefaultExpression<RawServerDefault>
      >,
      options: RequestLogger,
      pluginDone: (err?: Error) => void,
    ) {
      const isPayloadLogging = options.#option.isReplyPayloadLogging;

      fastify.register(requestFlagsPlugin);

      fastify.addHook('onSend', (req, reply, payload, done) => {
        if (isPayloadLogging) {
          reply.setReplyPayload(payload);
        }

        reply.header('tid', req.id);

        done(null, payload);
      });

      fastify.addHook('onResponse', (req, reply) => {
        options.logging(req, reply).catch((caught) => {
          const err = isError(caught, new Error('unknown error raised from onResponse Hook'));
          options.#logger.$(err.message);
          options.#logger.$(err.stack);
        });
      });

      pluginDone();
    },
    {
      fastify: '4.x',
      name: 'maeum-logging-plugin',
    },
  );
}
