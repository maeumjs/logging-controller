import type { ILogFormat } from '#/common/interfaces/ILogFormat';
import { getError } from '#/common/modules/getError';
import { CE_LOGGING_ACTION_CODE } from '#/http/const-enum/CE_LOGGING_ACTION_CODE';
import { CE_REQUEST_LOGGING_RESULT_CODE } from '#/http/const-enum/CE_REQUEST_LOGGING_RESULT_CODE';
import type { IRequestLoggerOption } from '#/http/interfaces/IRequestLoggerOption';
import { getHttpMethod } from '#/http/modules/getHttpMethod';
import { getRequestLoggerOption } from '#/http/modules/getRequestLoggerOption';
import { getRoutePathKey } from '#/http/modules/getRoutePathKey';
import { requestFlagsPlugin } from '#/http/plugin/requestFlagsPlugin';
import { RequestCurlCreator } from '#/http/request/RequestCurlCreator';
import { getValidationErrorSummary } from '@maeum/tools';
import type { ErrorObject } from 'ajv';
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
import { isPromise } from 'node:util/types';

export class RequestLogger {
  static #it: RequestLogger;

  static #isBootstrap: boolean = false;

  static get it() {
    return RequestLogger.#it;
  }

  static get isBootstrap() {
    return RequestLogger.#isBootstrap;
  }

  static getErrorLog(err: Error & { validation?: ErrorObject[]; option?: { logging?: unknown } }) {
    const validation =
      err.validation != null ? getValidationErrorSummary(err.validation) : undefined;
    const logging = err?.option?.logging;
    return { validation, logging };
  }

  static async getPayload(
    data: unknown,
    action: CE_LOGGING_ACTION_CODE | undefined,
    handler: ((data: unknown) => string) | undefined,
    option: IRequestLoggerOption,
  ): Promise<unknown> {
    if (handler != null) {
      return handler(data);
    }

    switch (action) {
      case CE_LOGGING_ACTION_CODE.STRINGIFY:
        if (option.stringify != null && data != null) {
          const promise = option.stringify(data);
          const stringified = isPromise(promise) ? await promise : promise;
          return stringified;
        }

        return data;
      case CE_LOGGING_ACTION_CODE.COMPRESS:
        if (option.compress != null && data != null) {
          const promise = option.compress(data);
          const compressed = isPromise(promise) ? await promise : promise;
          return compressed;
        }

        return data;
      case CE_LOGGING_ACTION_CODE.OBJECTIFY:
        if (option.objectify != null && data != null) {
          const promise = option.objectify(data);
          const objectified = isPromise(promise) ? await promise : promise;
          return objectified;
        }

        return data;
      case CE_LOGGING_ACTION_CODE.NOT_LOGGING:
        return undefined;
      default:
        return data;
    }
  }

  static bootstrap(nullableOption?: Parameters<typeof getRequestLoggerOption>[0]) {
    const option = getRequestLoggerOption(nullableOption);
    RequestLogger.#it = new RequestLogger(option);
    RequestLogger.#isBootstrap = true;

    return nullableOption;
  }

  #option: IRequestLoggerOption;

  constructor(option: IRequestLoggerOption) {
    this.#option = option;
  }

  async logging(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (req.getRequestLogging()) {
        this.#option.logger.$('Already logging http logging');
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

      const action =
        this.#option.contents.actions.get(getRoutePathKey(route)) ?? this.#option.contents.default;

      const handler = this.#option.contents.handlers.get(getRoutePathKey(route));
      const { validation, logging } =
        err != null
          ? RequestLogger.getErrorLog(err)
          : { validation: undefined, logging: undefined };

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
          curl: this.#option.isCurl ? RequestCurlCreator.it.create(req, route) : undefined,
          request: {
            queries: await RequestLogger.getPayload(
              req.query,
              action.request?.querystring,
              handler?.request.querystring,
              this.#option,
            ),
            headers: await RequestLogger.getPayload(
              req.headers,
              action.request?.headers,
              handler?.request.headers as (data: unknown) => string,
              this.#option,
            ),
            params: await RequestLogger.getPayload(
              req.params,
              action.request?.params,
              handler?.request.params as (data: unknown) => string,
              this.#option,
            ),
            body: await RequestLogger.getPayload(
              req.body,
              action.request?.body,
              handler?.request.body as (data: unknown) => string,
              this.#option,
            ),
          },
          reply: {
            headers: await RequestLogger.getPayload(
              reply.getHeaders(),
              action.reply?.headers,
              handler?.reply.headers as (data: unknown) => string,
              this.#option,
            ),
            payload: await RequestLogger.getPayload(
              reply.getReplyPayload(),
              action.reply?.payload,
              handler?.reply.payload as (data: unknown) => string,
              this.#option,
            ),
          },
        },
      };

      if (logging != null || validation != null) {
        (content.body as Record<string, unknown>).additional = await RequestLogger.getPayload(
          { logging, validation },
          action.other,
          handler?.other,
          this.#option,
        );
      }

      if (reply.statusCode >= 400) {
        this.#option.logger.$(content);
      }

      const logger = this.#option.logger[this.#option.level] as
        | ((content: Partial<ILogFormat & { err: Error }>) => void)
        | undefined;

      if (logger == null) {
        this.#option.logger.info(content);
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
          options.#option.logger.$(err.message);
          options.#option.logger.$(err.stack);
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
