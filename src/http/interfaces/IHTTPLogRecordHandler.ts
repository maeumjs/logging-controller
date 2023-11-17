import type { FastifyReply, FastifyRequest } from 'fastify';

export interface IHTTPLogRecordHandler {
  request: {
    querystring: (querystring: FastifyRequest['query']) => string;
    params: (params: FastifyRequest['params']) => string;
    headers: (headers: FastifyRequest['headers']) => string;
    body: (body: FastifyRequest['body']) => string;
  };

  reply: {
    headers: (headers: ReturnType<FastifyReply['getHeaders']>) => string;
    payload: (payload: unknown) => string;
  };

  other: (payload: unknown) => string;
}
