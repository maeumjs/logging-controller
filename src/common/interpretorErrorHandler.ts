import { MAEUM_LOGGERS_SYMBOL_KEY } from '#/common/symbols/MAEUM_LOGGERS_SYMBOL_KEY';
import type { AwilixContainer } from 'awilix';

export function interpretorErrorHandler(container: AwilixContainer) {
  const logger = container.resolve(MAEUM_LOGGERS_SYMBOL_KEY).l('unhandle-exception');

  process.on('uncaughtException', (err) => {
    logger.$('uncaughtException: ', err.message);
    logger.$('uncaughtException: ', err.stack);

    logger.error({
      id: 'uncaught-exception',
      status: 500,
      err,
    });
  });

  process.on('unhandledRejection', (reason) => {
    logger.$('unhandledRejection: ', reason);

    const message =
      reason == null ? 'unknown error by [unhandledRejection]' : JSON.stringify(reason);

    logger.error({
      id: 'unhandled-rejection',
      status: 500,
      err: new Error(message),
    });
  });
}
