/* eslint-disable @typescript-eslint/naming-convention */
import type { FastifyInstance } from 'fastify';
import fastifyPlugin, { type PluginMetadata } from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    $isLogged?: boolean | undefined;
    $error?: Error | undefined;

    setRequestLogging: () => void;
    getRequestLogging: () => boolean;

    setRequestError: (error: Error) => void;
    getRequestError: () => Error | undefined;
  }

  interface FastifyReply {
    $payload?: unknown;

    setReplyPayload: (payload: unknown) => void;
    getReplyPayload: () => unknown;
  }
}

export const requestFlagsPlugin = fastifyPlugin(
  function errorFlag(
    fastify: FastifyInstance,
    _options: PluginMetadata,
    done: (err?: Error) => void,
  ) {
    fastify.decorateRequest('setRequestError', function setRequestError(error: Error) {
      // this.$error = new WeakRef<Error>(error);
      this.$error = error;
    });

    fastify.decorateRequest('getRequestError', function getRequestError(): Error | undefined {
      return this.$error;
    });

    fastify.decorateReply('setReplyPayload', function setRequestPayload(payload: unknown) {
      this.$payload = payload;
    });

    fastify.decorateReply('getReplyPayload', function getRequestPayload(): unknown {
      return this.$payload;
    });

    fastify.decorateRequest('setRequestLogging', function setRequestLogging() {
      this.$isLogged = true;
    });

    fastify.decorateRequest('getRequestLogging', function getRequestLogging(): boolean {
      if (this.$isLogged == null) {
        this.$isLogged = true;
        return false;
      }

      return this.$isLogged;
    });

    done();
  },
  {
    fastify: '4.x',
    name: 'maeum-request-flag',
  },
);
