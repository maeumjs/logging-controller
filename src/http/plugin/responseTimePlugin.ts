import type { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

/**
 * Add response time in header
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
 */
export const responseTimePlugin = fastifyPlugin(
  function responseTimeHandle(
    fastify: FastifyInstance,
    options: {
      headerKey?: string;
      includeTime?: () => boolean;
    },
    pluginDone: (err?: Error) => void,
  ) {
    const headerKey = options.headerKey ?? 'Server-Timing';

    fastify.addHook('onSend', (_req, reply, data, done) => {
      if (options.includeTime?.() === true) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        reply.header(headerKey, `total;dur=${reply.getResponseTime()}`);
      }

      done(null, data);
    });

    pluginDone();
  },
  {
    fastify: '4.x',
    name: 'maeum-response-time',
  },
);
